from fastapi import FastAPI
from app.routers import analyze_routes, gpt_routes, upload_routes, profile_routes

app = FastAPI(
    title="AI Data Insights Dashboard",
    description="Upload datasets, run analyses, and get AI-powered summaries.",
    version="0.1.0"
)

# Register routers
app.include_router(analyze_routes.router, prefix="/analyze", tags=["Analysis"])
app.include_router(gpt_routes.router, prefix="/gpt", tags=["GPT Orchestration"])
app.include_router(upload_routes.router, prefix="/upload", tags=["File Uploads"])
app.include_router(profile_routes.router, prefix="/profile", tags=["Profile"])

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"} 