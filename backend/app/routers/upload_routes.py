# backend/app/routers/upload_routes.py

from fastapi import APIRouter, HTTPException, UploadFile, File, Request, Form, status
from app.schemas.upload import UrlUploadResponse, FilePreview, DatasetSummaryList, DatasetSummary
from app.utils.helpers import get_file_extension, is_approved_domain, is_supported_extension
from app.services.upload_service import (
    download_and_validate_file, list_datasets_with_summaries, save_session_df_to_uploads, get_dataframe_preview
)
from app.utils.session_cache import SessionCache
from app.utils.parsers import parse_dataframe_from_bytes, parse_dataframe_from_path, DataFrameParseError
import os
from typing import Optional

UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../uploads'))
os.makedirs(UPLOADS_DIR, exist_ok=True)

router = APIRouter()

@router.get("/uploads/summary", response_model=DatasetSummaryList)
async def get_uploads_summary():
    datasets = list_datasets_with_summaries(UPLOADS_DIR)
    return DatasetSummaryList(datasets=[DatasetSummary(**d) for d in datasets])

@router.post("/session-file", response_model=UrlUploadResponse)
async def session_file(
    request: Request,
    mode: str = Form(...),
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    filename: Optional[str] = Form(None)
):
    session_id = request.state.session_id
    try:
        if mode == "upload":
            if not file:
                raise HTTPException(status_code=400, detail="No file uploaded.")
            ext = get_file_extension(file.filename)
            if not is_supported_extension(ext):
                raise HTTPException(status_code=400, detail="Unsupported file extension.")
            data = await file.read()
            try:
                df = parse_dataframe_from_bytes(data, ext)
            except DataFrameParseError as e:
                raise HTTPException(status_code=400, detail=str(e))
            SessionCache.set_df(session_id, df)
            preview = get_dataframe_preview(df)
            return UrlUploadResponse(
                filename=file.filename,
                size=len(data),
                mime_type=file.content_type,
                preview=FilePreview(**preview),
                message="File uploaded to session and cached (not saved to disk)."
            )
        elif mode == "link":
            if not url:
                raise HTTPException(status_code=400, detail="No URL provided.")
            if not is_approved_domain(url):
                raise HTTPException(status_code=400, detail="URL domain is not approved.")
            file_bytes, meta = await download_and_validate_file(url)
            if file_bytes is None:
                raise HTTPException(status_code=400, detail=meta.get("error", "Download failed."))
            ext = get_file_extension(meta["filename"])
            try:
                df = parse_dataframe_from_bytes(file_bytes, ext)
            except DataFrameParseError as e:
                raise HTTPException(status_code=400, detail=str(e))
            SessionCache.set_df(session_id, df)
            preview = get_dataframe_preview(df)
            return UrlUploadResponse(
                filename=meta["filename"],
                size=meta["size"],
                mime_type=meta["mime_type"],
                preview=FilePreview(**preview),
                message="File from link uploaded to session and cached (not saved to disk)."
            )
        elif mode == "select":
            if not filename:
                raise HTTPException(status_code=400, detail="No filename provided.")
            file_path = os.path.join(UPLOADS_DIR, filename)
            if not os.path.exists(file_path):
                raise HTTPException(status_code=404, detail="File not found in uploads folder.")
            ext = get_file_extension(filename)
            try:
                df = parse_dataframe_from_path(file_path, ext)
            except DataFrameParseError as e:
                raise HTTPException(status_code=400, detail=str(e))
            SessionCache.set_df(session_id, df)
            preview = get_dataframe_preview(df)
            return UrlUploadResponse(
                filename=filename,
                size=os.path.getsize(file_path),
                mime_type="application/octet-stream",
                preview=FilePreview(**preview),
                message="File from uploads folder loaded to session."
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid mode. Use 'upload', 'link', or 'select'.")
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

@router.post("/session-to-uploads", response_model=DatasetSummary)
async def session_to_uploads(request: Request, title: Optional[str] = Form(None)):
    session_id = request.state.session_id
    try:
        meta = save_session_df_to_uploads(session_id, UPLOADS_DIR, title=title)
        return DatasetSummary(**meta)
    except Exception as e:
        if "already exists" in str(e):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
        raise HTTPException(status_code=400, detail=f"Failed to save session DataFrame to uploads: {e}")
