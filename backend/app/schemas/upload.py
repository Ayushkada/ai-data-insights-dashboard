from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Dict, Any, Literal

class UrlUploadRequest(BaseModel):
    url: HttpUrl = Field(..., description="Publicly accessible file URL from an approved domain.")

class FilePreview(BaseModel):
    columns: List[str]
    sample_rows: List[Dict[str, Any]]

class UrlUploadResponse(BaseModel):
    filename: str
    size: int
    mime_type: str
    preview: Optional[FilePreview] = None
    message: Optional[str] = None

class DatasetSummary(BaseModel):
    filename: str
    title: Optional[str] = None
    summary: Optional[str] = None
    columns: Optional[List[str]] = None
    size: Optional[int] = None
    created_at: Optional[str] = None

class DatasetSummaryList(BaseModel):
    datasets: List[DatasetSummary]
