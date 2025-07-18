# backend/app/services/statistics/analyze_statistics.py

import pandas as pd
import numpy as np
from scipy import stats
from scipy.stats import entropy as scipy_entropy

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
        for col in df.columns
    }
    # Sum
    sum_ = df.sum(numeric_only=True).to_dict()
    # Min/Max index
    idxmin = df.idxmin(numeric_only=True).to_dict()
    idxmax = df.idxmax(numeric_only=True).to_dict()
    # Zero count/percent
    zero_count = {col: int(df[col].eq(0).sum()) for col in df.select_dtypes(include=np.number)}
    zero_percent = {col: float(df[col].eq(0).mean() * 100) for col in df.select_dtypes(include=np.number)}
    # Constant columns
    constant_columns = [col for col in df.columns if df[col].nunique() == 1]
    # Outlier count (1.5*IQR rule)
    outlier_count = {}
    for col in df.select_dtypes(include=np.number):
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr_val = q3 - q1
        lower = q1 - 1.5 * iqr_val
        upper = q3 + 1.5 * iqr_val
        outlier_count[col] = int(((df[col] < lower) | (df[col] > upper)).sum())
    # Entropy (categorical)
    entropy = {}
    for col in df.select_dtypes(include=["object", "category"]):
        counts = df[col].value_counts(normalize=True)
        entropy[col] = float(scipy_entropy(counts)) if not counts.empty else None
    # Top N frequent values (categorical)
    top_n = {}
    for col in df.select_dtypes(include=["object", "category"]):
        vc = df[col].value_counts().head(5)
        top_n[col] = [{"value": idx, "count": int(cnt)} for idx, cnt in vc.items()]
    return {
        "describe": desc,
        "mode": mode,
        "range": data_range,
        "variance": variance,
        "median": median,
        "iqr": iqr,
        "missing_values": missing_values,
        "dtypes": dtypes,
        "cardinality": cardinality,
        "sum": sum_,
        "idxmin": idxmin,
        "idxmax": idxmax,
        "zero_count": zero_count,
        "zero_percent": zero_percent,
        "constant_columns": constant_columns,
        "outlier_count": outlier_count,
        "entropy": entropy,
        "top_frequent": top_n
    }

def compute_skewness_kurtosis(df: pd.DataFrame) -> dict:
    numeric_cols = df.select_dtypes(include=np.number)
    skewness = numeric_cols.apply(lambda x: float(stats.skew(x.dropna())), axis=0).to_dict()
    kurtosis = numeric_cols.apply(lambda x: float(stats.kurtosis(x.dropna())), axis=0).to_dict()
    return {"skewness": skewness, "kurtosis": kurtosis}

def compute_correlation_matrices(df: pd.DataFrame) -> dict:
    numeric_cols = df.select_dtypes(include=np.number)
    pearson = numeric_cols.corr(method="pearson").to_dict()
    spearman = numeric_cols.corr(method="spearman").to_dict()
    # Cramér’s V for categorical columns
    def cramers_v(x, y):
        confusion_matrix = pd.crosstab(x, y)
        chi2 = stats.chi2_contingency(confusion_matrix)[0]
        n = confusion_matrix.sum().sum()
        phi2 = chi2 / n
        r, k = confusion_matrix.shape
        phi2corr = max(0, phi2 - ((k-1)*(r-1))/(n-1))
        rcorr = r - ((r-1)**2)/(n-1)
        kcorr = k - ((k-1)**2)/(n-1)
        return np.sqrt(phi2corr / min((kcorr-1), (rcorr-1))) if min((kcorr-1), (rcorr-1)) > 0 else np.nan
    cat_cols = df.select_dtypes(include=["object", "category"])
    cramers = {}
    for col1 in cat_cols:
        for col2 in cat_cols:
            if col1 != col2:
                key = f"{col1}|{col2}"
                try:
                    cramers[key] = float(cramers_v(df[col1], df[col2]))
                except Exception:
                    cramers[key] = None
    # Top correlated pairs (Pearson)
    pearson_flat = []
    for col1 in pearson:
        for col2 in pearson[col1]:
            if col1 != col2:
                pearson_flat.append((col1, col2, abs(pearson[col1][col2])))
    pearson_flat = sorted(pearson_flat, key=lambda x: x[2], reverse=True)
    top_pearson = pearson_flat[:10]
    return {
        "pearson": pearson,
        "spearman": spearman,
        "cramers_v": cramers,
        "top_pearson_pairs": top_pearson
    } 