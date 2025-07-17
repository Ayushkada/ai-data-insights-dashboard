# backend/app/services/statistics/analyze_statistics.py

import pandas as pd
import numpy as np
from scipy import stats

def compute_basic_statistics(df: pd.DataFrame) -> dict:
    """
    Compute basic descriptive statistics for a DataFrame.
    Includes describe, mode, range, variance, median, IQR, missing values, dtypes, and cardinality.
    """
    desc = df.describe(include='all').to_dict()
    mode = df.mode().iloc[0].to_dict() if not df.mode().empty else {}
    data_range = (df.max(numeric_only=True) - df.min(numeric_only=True)).to_dict()
    variance = df.var(numeric_only=True).to_dict()
    median = df.median(numeric_only=True).to_dict()
    iqr = {
        col: float(df[col].quantile(0.75) - df[col].quantile(0.25))
        for col in df.select_dtypes(include=np.number)
    }
    missing_values = {
        col: {
            "count": int(df[col].isnull().sum()),
            "percent": float(df[col].isnull().mean() * 100)
        }
        for col in df.columns
    }
    dtypes = df.dtypes.apply(lambda x: str(x)).to_dict()
    cardinality = {
        col: int(df[col].nunique())
        for col in df.select_dtypes(include=["object", "category"])
    }
    return {
        "describe": desc,
        "mode": mode,
        "range": data_range,
        "variance": variance,
        "median": median,
        "iqr": iqr,
        "missing_values": missing_values,
        "dtypes": dtypes,
        "cardinality": cardinality
    } 