from typing import Dict, Optional, Tuple
import pandas as pd
import numpy as np
import hashlib
from datetime import datetime
from app.utils.helpers import get_dataframe_preview, sanitize_for_json
from app.utils.parsers import parse_dataframe_from_bytes, parse_dataframe_from_path
from app.utils.session_cache import SessionCache
from fastapi import HTTPException, status

class DatasetProcessingError(Exception):
    """Custom exception for dataset processing errors."""
    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, details: Optional[Dict] = None):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)

def process_dataframe(
    df: pd.DataFrame,
    filename: str,
    title: Optional[str] = None,
    size: Optional[int] = None
) -> Tuple[pd.DataFrame, Dict, str]:
    """
    Process a DataFrame and generate metadata.
    Returns: (cleaned_df, metadata_dict, df_hash)
    """
    try:
        # Clean DataFrame
        df_clean = df.replace([np.inf, -np.inf], np.nan).where(pd.notnull(df), None)
        
        # Generate hash
        df_hash = hashlib.sha256(df_clean.to_csv(index=False).encode("utf-8")).hexdigest()
        
        # Generate preview
        preview = get_dataframe_preview(df_clean)
        
        # Create metadata (no id for session/uploaded datasets)
        meta = {
            "filename": filename,
            "title": title or filename,
            "columns": list(df_clean.columns),
            "preview": preview,
            "created_at": datetime.now().isoformat(),
            "summary": None,  # Will be populated by GPT later
            "num_rows": len(df_clean),
            "size": size or len(df_clean.to_csv(index=False).encode("utf-8")),
            "hash": df_hash
        }
        
        return df_clean, meta, df_hash
        
    except Exception as e:
        raise DatasetProcessingError(
            f"Failed to process DataFrame: {str(e)}",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

def validate_and_cache_dataset(
    session_id: str,
    df_clean: pd.DataFrame,
    meta: Dict,
    df_hash: str
) -> Dict:
    """
    Validate dataset for duplicates and cache it in Redis.
    Returns: metadata
    """
    try:
        # Check for duplicates
        duplicate_type = SessionCache.has_duplicate_dataset(session_id, df_hash, meta["title"])
        if duplicate_type:
            raise DatasetProcessingError(
                f"A dataset with the same {duplicate_type} already exists in your session.",
                status_code=status.HTTP_409_CONFLICT
            )
        
        # Cache dataset
        try:
            SessionCache.add_dataset(session_id, meta, df_clean)
        except Exception as e:
            raise DatasetProcessingError(
                "Failed to cache dataset",
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                details={"cache_error": str(e)}
            )
        
        return meta
        
    except DatasetProcessingError:
        raise
    except Exception as e:
        raise DatasetProcessingError(
            f"Failed to validate/cache dataset: {str(e)}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def get_session_dataset(session_id: str) -> Tuple[Dict, pd.DataFrame]:
    """
    Get dataset and metadata from session cache.
    Returns: (metadata, dataframe)
    """
    try:
        meta = SessionCache.get_dataset_meta(session_id)
        if not meta:
            raise DatasetProcessingError(
                "No dataset found in session",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        df = SessionCache.get_dataset_data(session_id)
        if df is None:
            raise DatasetProcessingError(
                "Dataset data not found in cache",
                status_code=status.HTTP_404_NOT_FOUND
            )
            
        return sanitize_for_json(meta), df
        
    except DatasetProcessingError:
        raise
    except Exception as e:
        raise DatasetProcessingError(
            f"Failed to retrieve dataset: {str(e)}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def parse_and_process_file(
    file_bytes: bytes,
    filename: str,
    title: Optional[str] = None,
    size: Optional[int] = None
) -> Tuple[pd.DataFrame, Dict]:
    """
    Parse file bytes into DataFrame and process it.
    Returns: (cleaned_df, metadata)
    """
    try:
        # Parse DataFrame
        ext = filename.split(".")[-1].lower()
        df = parse_dataframe_from_bytes(file_bytes, f".{ext}")
        
        # Process DataFrame
        df_clean, meta, _ = process_dataframe(df, filename, title, size)
        return df_clean, meta
        
    except Exception as e:
        raise DatasetProcessingError(
            f"Failed to parse file: {str(e)}",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        ) 