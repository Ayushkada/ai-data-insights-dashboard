from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.schemas.shared import ErrorResponse
import os

# Default limits
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 100 * 1024 * 1024))  # 100MB default
MAX_MEMORY_USAGE = int(os.getenv("MAX_MEMORY_USAGE", 500 * 1024 * 1024))  # 500MB default

class UploadLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_file_size: int = MAX_FILE_SIZE):
        super().__init__(app)
        self.max_file_size = max_file_size
        
    async def dispatch(self, request: Request, call_next):
        if request.method == "POST" and "/upload/" in request.url.path:
            # Check content length header
            content_length = request.headers.get("content-length")
            if content_length and int(content_length) > self.max_file_size:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content=ErrorResponse(
                        message="File size exceeds maximum allowed size",
                        code="FILE_TOO_LARGE",
                        details={
                            "max_size": self.max_file_size,
                            "content_length": content_length
                        }
                    ).dict()
                )
            
            # For multipart form data, we need to check the body
            if request.headers.get("content-type", "").startswith("multipart/form-data"):
                body = await request.body()
                if len(body) > self.max_file_size:
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content=ErrorResponse(
                            message="File size exceeds maximum allowed size",
                            code="FILE_TOO_LARGE",
                            details={
                                "max_size": self.max_file_size,
                                "body_size": len(body)
                            }
                        ).dict()
                    )
        
        return await call_next(request) 