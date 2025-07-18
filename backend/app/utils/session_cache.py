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
