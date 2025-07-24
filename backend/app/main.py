from fastapi import FastAPI, Request
from app.routers import analyze_routes, gpt_routes, upload_routes
from app.utils.session_middleware import SessionMiddleware
import redis
import os

app = FastAPI(
    title="AI Data Insights Dashboard",
    description="Upload datasets, run analyses, and get AI-powered summaries.",
    version="0.1.0"
)

# Register session middleware
app.add_middleware(SessionMiddleware)

# Register routers
app.include_router(analyze_routes.router, prefix="/analyze", tags=["Analysis"])
app.include_router(gpt_routes.router, prefix="/gpt", tags=["GPT Orchestration"])
app.include_router(upload_routes.router, prefix="/upload", tags=["File Uploads"])

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

@app.get("/session-debug", tags=["Debug"])
async def session_debug(request: Request):
    session_id = getattr(request.state, "session_id", None)
    r = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=int(os.getenv("REDIS_PORT", 6379)), db=int(os.getenv("REDIS_DB", 0)))
    keys = r.keys(f"session:{session_id}:*") if session_id else []
    return {"session_id": session_id, "redis_keys": [k.decode() for k in keys]} 