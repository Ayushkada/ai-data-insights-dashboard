from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.schemas.shared import ErrorResponse
from app.services.dataset_service import DatasetProcessingError
from app.utils.session_cache import RedisCacheError
import traceback
import logging

logger = logging.getLogger(__name__)

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
            
        except DatasetProcessingError as e:
            logger.error(f"Dataset processing error: {str(e)}")
            return JSONResponse(
                status_code=e.status_code,
                content=ErrorResponse(
                    message=str(e),
                    code="DATASET_PROCESSING_ERROR",
                    details=e.details
                ).dict()
            )
            
        except RedisCacheError as e:
            logger.error(f"Redis cache error: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content=ErrorResponse(
                    message="Cache service unavailable",
                    code="CACHE_ERROR",
                    details={"error": str(e)}
                ).dict()
            )
            
        except Exception as e:
            # Log the full traceback for unexpected errors
            logger.error(f"Unexpected error: {str(e)}\n{traceback.format_exc()}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content=ErrorResponse(
                    message="An unexpected error occurred",
                    code="INTERNAL_ERROR",
                    details={"error": str(e)} if not isinstance(e, AssertionError) else None
                ).dict()
            ) 