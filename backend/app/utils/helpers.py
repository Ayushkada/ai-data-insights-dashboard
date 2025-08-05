# backend/app/utils/helpers.py

import math
from typing import Any, Dict
from urllib.parse import urlparse

import pandas as pd
from fastapi import Request, HTTPException
from app.utils.session_cache import SessionCache

# Approved domains for secure URL-based uploads
APPROVED_DOMAINS = {
    "kaggle.com",
    "raw.githubusercontent.com",
    "archive.ics.uci.edu",
    "datahub.io",
    "people.sc.fsu.edu",
    "data.gov",
    "openml.org",
    "storage.googleapis.com"
}

# Supported file extensions
SUPPORTED_EXTENSIONS = {".csv", ".tsv", ".xlsx"}


def is_approved_domain(url: str) -> bool:
    """
    Check if the URL is from an approved domain (exact or subdomain match).
    """
    netloc = urlparse(url).netloc.lower()
    domain = netloc.split(":")[0]
    return any(domain == approved or domain.endswith(f".{approved}") for approved in APPROVED_DOMAINS)

def get_file_extension(path_or_url: str) -> str:
    """
    Extract the file extension from a filename or URL.
    """
    path = urlparse(path_or_url).path
    return path[path.rfind("."):].lower() if "." in path else ""

def is_supported_extension(ext: str) -> bool:
    """
    Check if the file extension is supported.
    """
    return ext in SUPPORTED_EXTENSIONS

def get_session_df(request: Request):
    """
    Retrieve the DataFrame from the current user's session.
    Raises HTTP 400 if not found.
    """
    session_id = getattr(request.state, "session_id", None)
    df = SessionCache.get_df(session_id) if session_id else None
    if df is None:
        raise HTTPException(
            status_code=400, 
            detail="No dataset found in session. Please upload or select a dataset first."
        )
    return df


def get_dataframe_preview(df: pd.DataFrame, max_cols: int = 50, sample_rows: int = 10) -> Dict[str, Any]:
    columns = list(df.columns)[:max_cols]
    sample = (
        df[columns]
        .head(sample_rows)
        .where(pd.notnull(df[columns]), None)
        .to_dict(orient="records")
    )
    return {"columns": columns, "sample_rows": sample}



def sanitize_for_json(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_for_json(v) for v in obj]
    return obj