# app/services/profiling.py

import pandas as pd


# services/profiling.py
def generate_profile(file_path: str) -> dict:
    df = (
        pd.read_csv(file_path)
        if file_path.endswith(".csv")
        else pd.read_parquet(file_path)
    )
    return {
        "shape": df.shape,
        "columns": df.columns.tolist(),
        "missing": df.isnull().sum().to_dict(),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "summary": df.describe(include="all").fillna("").to_dict(),
        "skewness": df.skew(numeric_only=True).to_dict(),
    }
