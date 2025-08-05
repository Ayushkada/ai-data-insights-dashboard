from pydantic import BaseModel, HttpUrl, Field, constr
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from .shared import PaginatedResponse, PaginatedData

class UrlUploadRequest(BaseModel):
    """Request to upload dataset from URL."""
    url: HttpUrl = Field(..., description="Publicly accessible file URL")
    title: Optional[str] = Field(None, description="User-provided title")

class UrlUploadResponse(BaseModel):
    """Response after successful URL upload."""
    filename: str = Field(..., description="Original filename")
    title: Optional[str] = Field(None, description="User-provided title")
    created_at: datetime = Field(..., description="Upload timestamp")
    size: int = Field(..., description="File size in bytes")
    num_rows: Optional[int] = Field(None, description="Total number of rows")
    columns: Optional[List[str]] = Field(None, description="List of column names")
    preview: Optional[Any] = Field(None, description="Data preview")
    summary: Optional[str] = Field(None, description="GPT-generated summary")
    mime_type: str = Field(..., description="File MIME type")
    message: Optional[str] = Field(None, description="Processing message")

class RemoveDatasetRequest(BaseModel):
    """Request to remove dataset from session."""
    # id: str = Field(..., description="Dataset ID to remove")
    pass

class SessionUploadMode(BaseModel):
    """Upload mode configuration."""
    mode: Literal["upload", "link", "select"] = Field(
        ...,
        description="Upload mode: direct upload, URL, or select existing"
    )
    title: Optional[constr(min_length=1, max_length=100)] = Field(
        None,
        description="Optional dataset title"
    ) 