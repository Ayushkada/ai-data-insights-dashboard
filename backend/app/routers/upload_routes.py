# backend/app/routers/upload_routes.py

from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas.upload import UrlUploadRequest, UrlUploadResponse, FilePreview
from app.utils.helpers import get_file_extension, is_approved_domain, is_supported_extension
from app.services.upload_service import download_and_validate_file, save_and_preview_file
import os



UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploads'))
os.makedirs(UPLOADS_DIR, exist_ok=True)

router = APIRouter()
 
# Upload from URL endpoint
@router.post("/url", response_model=UrlUploadResponse)
async def upload_from_url(payload: UrlUploadRequest):
    url = str(payload.url)
    if not is_approved_domain(url):
        raise HTTPException(status_code=400, detail="URL domain is not approved.")

    file_bytes, meta = await download_and_validate_file(url)
    if file_bytes is None:
        raise HTTPException(status_code=400, detail=meta.get("error", "Download failed."))

    try:
        filename, preview = await save_and_preview_file(file_bytes, meta["filename"], UPLOADS_DIR)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return UrlUploadResponse(
        filename=filename,
        size=meta["size"],
        mime_type=meta["mime_type"],
        preview=FilePreview(**preview),
        message="File uploaded, validated, and saved successfully."
    )

# Upload from local file endpoint
@router.post("/file", response_model=UrlUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename
    ext = get_file_extension(filename)
    if not is_supported_extension(ext):
        raise HTTPException(status_code=400, detail="Unsupported file extension.")

    data = await file.read()
    size = len(data)
    mime_type = file.content_type

    try:
        unique_name, preview = await save_and_preview_file(data, filename, UPLOADS_DIR)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return UrlUploadResponse(
        filename=unique_name,
        size=size,
        mime_type=mime_type,
        preview=FilePreview(**preview),
        message="File uploaded, validated, and saved successfully."
    )