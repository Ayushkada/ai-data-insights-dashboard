from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from .shared import PaginatedResponse, PaginatedData

class FilePreview(BaseModel):
    """Preview of dataset contents."""
    columns: List[str] = Field(..., description="List of column names")
    sample_rows: List[Dict[str, Any]] = Field(
        ...,
        description="Sample rows from dataset",
        max_items=10  # Limit sample size
    )

class DatasetMetaBase(BaseModel):
    """Base metadata shared by all dataset responses."""
    filename: str = Field(..., description="Original filename")
    title: Optional[str] = Field(None, description="User-provided title")
    created_at: datetime = Field(..., description="Upload timestamp")
    size: int = Field(..., description="File size in bytes")
    num_rows: Optional[int] = Field(None, description="Total number of rows")
    columns: Optional[List[str]] = Field(None, description="List of column names")
    preview: Optional[FilePreview] = Field(None, description="Data preview")
    summary: Optional[str] = Field(None, description="GPT-generated summary")

class DatasetSummary(DatasetMetaBase):
    """Summary of a saved dataset."""
    id: str = Field(..., description="Unique dataset identifier (S3 object name)")

class DatasetSummaryList(PaginatedResponse):
    """Paginated list of dataset summaries."""
    data: List[DatasetSummary]

class DatasetData(BaseModel):
    """Full dataset contents with pagination."""
    columns: List[str] = Field(..., description="Column names")
    rows: List[Dict[str, Any]] = Field(..., description="Data rows")
    pagination: PaginatedData

class DatasetFullResponse(BaseModel):
    """Complete dataset response with metadata and data."""
    meta: DatasetMetaBase
    data: DatasetData
    analysis: Optional[Dict[str, Any]] = Field(None, description="Analysis results")