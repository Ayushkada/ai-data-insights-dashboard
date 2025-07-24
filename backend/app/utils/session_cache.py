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
    def _df_key(session_id: str) -> str:
        return f"session:{session_id}:df"

    @staticmethod
    def _stats_key(session_id: str) -> str:
        return f"session:{session_id}:stats"

    @staticmethod
    def _dataset_metas_key(session_id: str) -> str:
        return f"session:{session_id}:dataset_metas"

    @classmethod
    def get_df(cls, session_id: str) -> pd.DataFrame:
        key = cls._df_key(session_id)
        data = _redis.get(key)
        if data is None:
            return None
        return pickle.loads(data)

    @classmethod
    def set_df(cls, session_id: str, df: pd.DataFrame):
        key = cls._df_key(session_id)
        data = pickle.dumps(df)
        _redis.setex(key, REDIS_TTL, data)
    @classmethod
    def get_stats(cls, session_id: str):
        key = cls._stats_key(session_id)
        data = _redis.get(key)
        if data is None:
            return None
        return pickle.loads(data)

    @classmethod
    def set_stats(cls, session_id: str, stats: dict):
        key = cls._stats_key(session_id)
        data = pickle.dumps(stats)
        _redis.setex(key, REDIS_TTL, data)

    @classmethod
    def get_dataset_metas(cls, session_id: str):
        """
        Retrieve the list of dataset meta dicts for the session.
        """
        key = cls._dataset_metas_key(session_id)
        items = _redis.lrange(key, 0, -1)
        if not items:
            return []
        return [pickle.loads(item) for item in items]

    @classmethod
    def add_dataset_meta(cls, session_id: str, meta: dict):
        """
        Add a dataset meta dict to the session's dataset list (append to Redis list).
        If there are already 3, remove the oldest before adding. Refresh TTL on the list.
        """
        key = cls._dataset_metas_key(session_id)
        # Remove oldest if already at max (3)
        if _redis.llen(key) >= 3:
            _redis.lpop(key)
        _redis.rpush(key, pickle.dumps(meta))
        _redis.expire(key, REDIS_TTL)

    @classmethod
    def remove_dataset_meta(cls, session_id: str, dataset_id: str):
        """
        Remove a dataset meta by id from the session's dataset list. Also remove associated analysis keys.
        """
        key = cls._dataset_metas_key(session_id)
        items = _redis.lrange(key, 0, -1)
        new_items = []
        removed = False
        for item in items:
            meta = pickle.loads(item)
            if str(meta.get('id')) == str(dataset_id):
                removed = True
                # Remove associated analysis keys
                cls.delete_all_analysis_for_dataset(session_id, dataset_id)
                continue
            new_items.append(item)
        _redis.delete(key)
        if new_items:
            _redis.rpush(key, *new_items)
            _redis.expire(key, REDIS_TTL)
        return removed

    @classmethod
    def has_duplicate_dataset(cls, session_id: str, df_hash: str, title: str = None):
        """
        Check if a dataset with the same hash or title already exists in the session cache.
        Returns 'hash' if duplicate by hash, 'title' if duplicate by title, or None if no duplicate.
        """
        metas = cls.get_dataset_metas(session_id)
        for meta in metas:
            if meta.get("hash") == df_hash:
                return "hash"
            if title and meta.get("title") == title:
                return "title"
        return None

    @staticmethod
    def analysis_key(session_id: str, dataset_id: str, analysis_type: str) -> str:
        """
        Helper to get the Redis key for a specific analysis result for a dataset in a session.
        """
        return f"session:{session_id}:dataset:{dataset_id}:analysis:{analysis_type}"

    @classmethod
    def set_analysis_result(cls, session_id: str, dataset_id: str, analysis_type: str, result: dict):
        key = cls.analysis_key(session_id, dataset_id, analysis_type)
        _redis.setex(key, REDIS_TTL, pickle.dumps(result))

    @classmethod
    def get_analysis_result(cls, session_id: str, dataset_id: str, analysis_type: str):
        key = cls.analysis_key(session_id, dataset_id, analysis_type)
        data = _redis.get(key)
        if data is None:
            return None
        return pickle.loads(data)

    @classmethod
    def delete_all_analysis_for_dataset(cls, session_id: str, dataset_id: str):
        """
        Delete all analysis keys for a given dataset in a session (wildcard delete).
        """
        pattern = f"session:{session_id}:dataset:{dataset_id}:analysis:*"
        for key in _redis.scan_iter(pattern):
            _redis.delete(key) 
