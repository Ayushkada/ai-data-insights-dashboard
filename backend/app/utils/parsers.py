# backend/app/utils/parsers.py

import pandas as pd
import io
from typing import Union

class DataFrameParseError(Exception):
    """Custom exception for DataFrame parsing errors."""

def parse_dataframe_from_bytes(data: bytes, ext: str) -> pd.DataFrame:
    """
    Parse bytes into a DataFrame based on file extension.
    """
    try:
        if ext == ".csv":
            return pd.read_csv(io.BytesIO(data))
        elif ext == ".tsv":
            return pd.read_csv(io.BytesIO(data), sep='\t')
        elif ext == ".xlsx":
            return pd.read_excel(io.BytesIO(data))
        else:
            raise DataFrameParseError(f"Unsupported file extension: {ext}")
    except Exception as e:
        raise DataFrameParseError(f"Failed to parse {ext} file: {e}")

def parse_dataframe_from_path(path: str, ext: str) -> pd.DataFrame:
    """
    Parse file at path into a DataFrame based on extension.
    """
    try:
        if ext == ".csv":
            return pd.read_csv(path)
        elif ext == ".tsv":
            return pd.read_csv(path, sep='\t')
        elif ext == ".xlsx":
            return pd.read_excel(path)
        else:
            raise DataFrameParseError(f"Unsupported file extension: {ext}")
    except Exception as e:
        raise DataFrameParseError(f"Failed to parse {ext} file: {e}")
