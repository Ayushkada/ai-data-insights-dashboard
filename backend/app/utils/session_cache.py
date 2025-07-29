import redis
import pandas as pd
import pickle
import os

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_TTL = 60 * 30  # 30 minutes

_redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)

class SessionCache:
    @staticmethod
    def _datasets_set_key(session_id: str) -> str:
        return f"session:{session_id}:datasets"

    @staticmethod
    def _dataset_meta_key(session_id: str, dataset_id: str) -> str:
        return f"session:{session_id}:dataset:{dataset_id}:meta"

    @staticmethod
    def _dataset_data_key(session_id: str, dataset_id: str) -> str:
        return f"session:{session_id}:dataset:{dataset_id}:data"

    @staticmethod
    def _analysis_key(session_id: str, dataset_id: str, analysis_type: str) -> str:
        return f"session:{session_id}:dataset:{dataset_id}:analysis:{analysis_type}"

    @classmethod
    def get_dataset_ids(cls, session_id: str):
        """
        Returns set of dataset_ids in the session.
        """
        key = cls._datasets_set_key(session_id)
        return [dsid.decode() for dsid in _redis.smembers(key)]

    @classmethod
    def get_dataset_meta(cls, session_id: str, dataset_id: str) -> dict:
        """
        Returns meta dict for dataset_id (fields: id, filename, title, summary, etc).
        """
        key = cls._dataset_meta_key(session_id, dataset_id)
        meta = _redis.hgetall(key)
        # Redis hash returns {b'key': b'value'}, so decode
        return {k.decode(): pickle.loads(v) for k, v in meta.items()}

    @classmethod
    def set_dataset_meta(cls, session_id: str, dataset_id: str, meta: dict):
        """
        Set meta fields (dict) for a dataset.
        """
        key = cls._dataset_meta_key(session_id, dataset_id)
        # Save all fields as pickled values for type safety
        _redis.hset(key, mapping={k: pickle.dumps(v) for k, v in meta.items()})
        _redis.expire(key, REDIS_TTL)

    @classmethod
    def update_dataset_meta(cls, session_id: str, dataset_id: str, updates: dict):
        """
        Update only specific meta fields.
        """
        key = cls._dataset_meta_key(session_id, dataset_id)
        _redis.hset(key, mapping={k: pickle.dumps(v) for k, v in updates.items()})
        _redis.expire(key, REDIS_TTL)

    @classmethod
    def add_dataset(cls, session_id: str, dataset_id: str, meta: dict, df: pd.DataFrame):
        """
        Add new dataset. Enforce max 3 datasets by removing oldest if needed.
        """
        set_key = cls._datasets_set_key(session_id)
        # If already 3 datasets, remove oldest
        ids = cls.get_dataset_ids(session_id)
        if len(ids) >= 3:
            # Remove oldest by created_at or just first in set (simpler)
            to_remove = ids[0]
            cls.remove_dataset(session_id, to_remove)

        # Add new dataset id to set and save meta/data
        _redis.sadd(set_key, dataset_id)
        _redis.expire(set_key, REDIS_TTL)
        cls.set_dataset_meta(session_id, dataset_id, meta)
        cls.set_dataset_data(session_id, dataset_id, df)

    @classmethod
    def remove_dataset(cls, session_id: str, dataset_id: str):
        """
        Remove all info/analyses for one dataset.
        """
        set_key = cls._datasets_set_key(session_id)
        meta_key = cls._dataset_meta_key(session_id, dataset_id)
        data_key = cls._dataset_data_key(session_id, dataset_id)

        _redis.srem(set_key, dataset_id)
        _redis.delete(meta_key)
        _redis.delete(data_key)
        # Delete all analyses
        analysis_pattern = f"session:{session_id}:dataset:{dataset_id}:analysis:*"
        for key in _redis.scan_iter(analysis_pattern):
            _redis.delete(key)

    @classmethod
    def set_dataset_data(cls, session_id: str, dataset_id: str, df: pd.DataFrame):
        key = cls._dataset_data_key(session_id, dataset_id)
        _redis.setex(key, REDIS_TTL, pickle.dumps(df))

    @classmethod
    def get_dataset_data(cls, session_id: str, dataset_id: str) -> pd.DataFrame:
        key = cls._dataset_data_key(session_id, dataset_id)
        data = _redis.get(key)
        if data is None:
            return None
        _redis.expire(key, REDIS_TTL)
        return pickle.loads(data)

    @classmethod
    def set_analysis_result(cls, session_id: str, dataset_id: str, analysis_type: str, result: dict):
        key = cls._analysis_key(session_id, dataset_id, analysis_type)
        _redis.setex(key, REDIS_TTL, pickle.dumps(result))

    @classmethod
    def get_analysis_result(cls, session_id: str, dataset_id: str, analysis_type: str):
        key = cls._analysis_key(session_id, dataset_id, analysis_type)
        data = _redis.get(key)
        if data is None:
            return None
        _redis.expire(key, REDIS_TTL)
        return pickle.loads(data)

    @classmethod
    def delete_all_analyses_for_dataset(cls, session_id: str, dataset_id: str):
        pattern = f"session:{session_id}:dataset:{dataset_id}:analysis:*"
        for key in _redis.scan_iter(pattern):
            _redis.delete(key)

    @classmethod
    def has_duplicate_dataset(cls, session_id: str, df_hash: str, title: str = None):
        """
        Check if a dataset with the same hash or title already exists in the session cache.
        """
        ids = cls.get_dataset_ids(session_id)
        for dataset_id in ids:
            meta = cls.get_dataset_meta(session_id, dataset_id)
            if meta.get("hash") == df_hash:
                return "hash"
            if title and meta.get("title") == title:
                return "title"
        return None
