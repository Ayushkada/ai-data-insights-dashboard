from fastapi import FastAPI, Request
from app.routers import analyze_routes, upload_routes, dataset_routes
from app.utils.session_middleware import SessionMiddleware
from app.middleware.error_handler import ErrorHandlerMiddleware
from app.middleware.upload_limiter import UploadLimiterMiddleware
import redis
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="AI Data Insights Dashboard",
    description="Upload datasets, run analyses, and get AI-powered summaries.",
    version="0.1.0"
)

# Register middlewares in order
app.add_middleware(ErrorHandlerMiddleware)  # First to catch all errors
app.add_middleware(UploadLimiterMiddleware)  # Then check upload limits
app.add_middleware(SessionMiddleware)  # Finally handle session

# Register routers
app.include_router(analyze_routes.router, prefix="/analyze", tags=["Analysis"])
app.include_router(dataset_routes.router, prefix="/dataset", tags=["Dataset"])
app.include_router(upload_routes.router, prefix="/upload", tags=["File Uploads"])

@app.get("/health", tags=["Health"])
async def health_check():
    """Check service health including Redis connection."""
    try:
        r = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            db=int(os.getenv("REDIS_DB", 0)),
            socket_timeout=2  # Short timeout for health check
        )
        r.ping()
        redis_status = "ok"
    except Exception as e:
        redis_status = f"error: {str(e)}"
    
    return {
        "status": "ok",
        "services": {
            "api": "ok",
            "redis": redis_status
        }
    }

@app.get("/session-debug", tags=["Debug"])
async def session_debug(request: Request):
    """Debug endpoint to check session state and Redis keys."""
    session_id = getattr(request.state, "session_id", None)
    r = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        db=int(os.getenv("REDIS_DB", 0))
    )
    keys = r.keys(f"session:{session_id}:*") if session_id else []
    return {
        "session_id": session_id,
        "redis_keys": [k.decode() for k in keys]
    } 