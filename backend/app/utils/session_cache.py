import redis
import pandas as pd
import pickle
import os
from typing import Optional, Dict, Any
from datetime import datetime

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_TTL = 60 * 60 * 24  # 24 hours default TTL

class RedisCacheError(Exception):
    """Custom exception for Redis cache operations."""
    pass

class SessionCache:
    """Thread-safe Redis cache manager for session data."""
    
    _redis = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=REDIS_DB,
        decode_responses=False,  # Keep binary for pickle
        socket_timeout=5,  # Add timeouts
        socket_connect_timeout=5
    )

    @classmethod
    def _get_key(cls, session_id: str, key_type: str, subtype: Optional[str] = None) -> str:
        """Generate Redis key with consistent format."""
        base = f"session:{session_id}:{key_type}"
        return f"{base}:{subtype}" if subtype else base

    @classmethod
    def _safe_redis_op(cls, operation: str, *args, **kwargs) -> Any:
        """Execute Redis operation with error handling."""
        try:
            return getattr(cls._redis, operation)(*args, **kwargs)
        except redis.RedisError as e:
            raise RedisCacheError(f"Redis {operation} failed: {str(e)}")
        except Exception as e:
            raise RedisCacheError(f"Unexpected error in Redis {operation}: {str(e)}")

    @classmethod
    def get_dataset_meta(cls, session_id: str) -> Optional[Dict]:
        """Get dataset metadata from cache."""
        key = cls._get_key(session_id, "dataset", "meta")
        try:
            meta = cls._safe_redis_op("hgetall", key)
            if not meta:
                return None
            return {k.decode(): pickle.loads(v) for k, v in meta.items()}
        except pickle.UnpicklingError:
            cls._safe_redis_op("delete", key)  # Clean up corrupted data
            return None

    @classmethod
    def set_dataset_meta(cls, session_id: str, meta: Dict, ttl: int = REDIS_TTL):
        """Set dataset metadata with TTL."""
        key = cls._get_key(session_id, "dataset", "meta")
        pickled = {k: pickle.dumps(v) for k, v in meta.items()}
        cls._safe_redis_op("hset", key, mapping=pickled)
        cls._safe_redis_op("expire", key, ttl)

    @classmethod
    def update_dataset_meta(cls, session_id: str, updates: Dict):
        """Update specific metadata fields."""
        key = cls._get_key(session_id, "dataset", "meta")
        pickled = {k: pickle.dumps(v) for k, v in updates.items()}
        cls._safe_redis_op("hset", key, mapping=pickled)
        cls._safe_redis_op("expire", key, REDIS_TTL)

    @classmethod
    def set_dataset_data(cls, session_id: str, df: pd.DataFrame, ttl: int = REDIS_TTL):
        """Cache DataFrame with compression."""
        key = cls._get_key(session_id, "dataset", "data")
        try:
            data = pickle.dumps(df)
            cls._safe_redis_op("setex", key, ttl, data)
        except pickle.PicklingError as e:
            raise RedisCacheError(f"Failed to serialize DataFrame: {str(e)}")

    @classmethod
    def get_dataset_data(cls, session_id: str) -> Optional[pd.DataFrame]:
        """Get DataFrame from cache."""
        key = cls._get_key(session_id, "dataset", "data")
        try:
            data = cls._safe_redis_op("get", key)
            if data is None:
                return None
            cls._safe_redis_op("expire", key, REDIS_TTL)  # Refresh TTL
            return pickle.loads(data)
        except pickle.UnpicklingError:
            cls._safe_redis_op("delete", key)  # Clean up corrupted data
            return None

    @classmethod
    def add_dataset(cls, session_id: str, meta: Dict, df: pd.DataFrame):
        """Atomic operation to cache both metadata and data."""
        try:
            # Use pipeline for atomic operation
            pipe = cls._redis.pipeline()
            
            # Remove existing data first
            cls.remove_dataset(session_id)
            
            # Set new data
            meta_key = cls._get_key(session_id, "dataset", "meta")
            data_key = cls._get_key(session_id, "dataset", "data")
            
            # Prepare metadata
            pickled_meta = {k: pickle.dumps(v) for k, v in meta.items()}
            pipe.hset(meta_key, mapping=pickled_meta)
            pipe.expire(meta_key, REDIS_TTL)
            
            # Prepare DataFrame
            pickled_df = pickle.dumps(df)
            pipe.setex(data_key, REDIS_TTL, pickled_df)
            
            # Execute atomic operation
            pipe.execute()
            
        except (redis.RedisError, pickle.PicklingError) as e:
            raise RedisCacheError(f"Failed to cache dataset: {str(e)}")

    @classmethod
    def remove_dataset(cls, session_id: str):
        """Remove all dataset-related keys."""
        try:
            # Get all keys for this session
            pattern = f"session:{session_id}:*"
            keys = cls._safe_redis_op("keys", pattern)
            if keys:
                cls._safe_redis_op("delete", *keys)
        except RedisCacheError:
            pass  # Best effort cleanup

    @classmethod
    def set_analysis_result(
        cls,
        session_id: str,
        analysis_type: str,
        result: Dict,
        ttl: int = REDIS_TTL
    ):
        """Cache analysis result with type-specific key."""
        key = cls._get_key(session_id, "analysis", analysis_type)
        try:
            data = pickle.dumps(result)
            cls._safe_redis_op("setex", key, ttl, data)
        except pickle.PicklingError as e:
            raise RedisCacheError(f"Failed to cache analysis result: {str(e)}")

    @classmethod
    def get_analysis_result(cls, session_id: str, analysis_type: str) -> Optional[Dict]:
        """Get cached analysis result."""
        key = cls._get_key(session_id, "analysis", analysis_type)
        try:
            data = cls._safe_redis_op("get", key)
            if data is None:
                return None
            cls._safe_redis_op("expire", key, REDIS_TTL)  # Refresh TTL
            return pickle.loads(data)
        except pickle.UnpicklingError:
            cls._safe_redis_op("delete", key)
            return None

    @classmethod
    def has_dataset(cls, session_id: str) -> bool:
        """Check if session has an active dataset."""
        key = cls._get_key(session_id, "dataset", "meta")
        return bool(cls._safe_redis_op("exists", key))

    @classmethod
    def has_duplicate_dataset(
        cls,
        session_id: str,
        df_hash: str,
        title: Optional[str] = None
    ) -> Optional[str]:
        """Check for duplicate dataset by hash or title."""
        meta = cls.get_dataset_meta(session_id)
        if not meta:
            return None
        if meta.get("hash") == df_hash:
            return "hash"
        if title and meta.get("title") == title:
            return "title"
        return None
