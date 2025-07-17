from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Dict, Any

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
