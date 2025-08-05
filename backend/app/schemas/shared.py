from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class ErrorResponse(BaseModel):
    """Standard error response format."""
    message: str = Field(..., description="Human-readable error message")
    code: str = Field(..., description="Machine-readable error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error context")

class PaginatedData(BaseModel):
    """Standard pagination metadata."""
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total number of pages")

class PaginatedResponse(BaseModel):
    """Base class for paginated responses."""
    pagination: PaginatedData
    data: Any  # Will be overridden by implementing classes

class CacheInfo(BaseModel):
    """Cache metadata for responses."""
    cached: bool = Field(..., description="Whether this response was served from cache")
    cache_key: Optional[str] = Field(None, description="Redis cache key used")
    ttl: Optional[int] = Field(None, description="Remaining TTL in seconds") 