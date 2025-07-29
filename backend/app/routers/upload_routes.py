from fastapi import APIRouter, HTTPException, UploadFile, File, Request, Form, status
from app.schemas.upload import DatasetMetaList, UrlUploadResponse, FilePreview, DatasetSummaryList, DatasetSummary, RemoveDatasetRequest
from app.utils.helpers import get_dataframe_preview, get_file_extension, is_approved_domain, is_supported_extension
from app.services.upload_service import (
    download_and_validate_file, list_datasets_with_summaries, create_session_dataset_meta, add_dataset_to_session, save_session_dataset_to_uploads
)
from app.utils.session_cache import SessionCache
from app.utils.parsers import parse_dataframe_from_bytes, parse_dataframe_from_path, DataFrameParseError
import os
from typing import Optional
import uuid
from datetime import datetime
import hashlib

UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../uploads'))
os.makedirs(UPLOADS_DIR, exist_ok=True)

router = APIRouter()

@router.get("/summary", response_model=DatasetSummaryList)
async def get_uploads_summary():
    datasets = list_datasets_with_summaries(UPLOADS_DIR)
    return DatasetSummaryList(datasets=[DatasetSummary(**d) for d in datasets])

@router.post("/session-file", response_model=UrlUploadResponse)
async def session_file(
    request: Request,
    mode: str = Form(...),
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    filename: Optional[str] = Form(None),
    title: Optional[str] = Form(None)
):
    session_id = request.state.session_id
    try:
        # All logic is now "per dataset"
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
            preview = get_dataframe_preview(df)
            dataset_id = str(uuid.uuid4())
            created_at = datetime.now().isoformat()
            df_hash = hashlib.sha256(df.to_csv(index=False).encode("utf-8")).hexdigest()
            # Duplicate check
            duplicate_type = SessionCache.has_duplicate_dataset(session_id, df_hash, title or file.filename)
            if duplicate_type == "hash" or duplicate_type == "title":
                # Find the existing dataset id
                ids = SessionCache.get_dataset_ids(session_id)
                existing_id = None
                for dataset_id in ids:
                    meta = SessionCache.get_dataset_meta(session_id, dataset_id)
                    if meta.get("hash") == df_hash or (title and meta.get("title") == title):
                        existing_id = dataset_id
                        break
                raise HTTPException(status_code=409, detail={
                    "message": f"A dataset with the same {duplicate_type} already exists in your session.",
                    "existing_id": existing_id
                })
            meta = create_session_dataset_meta(
                dataset_id=dataset_id,
                title=title or file.filename,
                filename=file.filename,
                df=df,
                summary=None,
                created_at=created_at,
                size=len(data),
                df_hash=df_hash
            )
            add_dataset_to_session(session_id, dataset_id, meta, df)
            return UrlUploadResponse(
                id=dataset_id,
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
            preview = get_dataframe_preview(df)
            dataset_id = str(uuid.uuid4())
            created_at = datetime.now().isoformat()
            df_hash = hashlib.sha256(df.to_csv(index=False).encode("utf-8")).hexdigest()
            duplicate_type = SessionCache.has_duplicate_dataset(session_id, df_hash, meta["filename"])
            if duplicate_type == "hash" or duplicate_type == "title":
                ids = SessionCache.get_dataset_ids(session_id)
                existing_id = None
                for dataset_id in ids:
                    meta_obj = SessionCache.get_dataset_meta(session_id, dataset_id)
                    if meta_obj.get("hash") == df_hash or meta_obj.get("title") == meta["filename"]:
                        existing_id = dataset_id
                        break
                raise HTTPException(status_code=409, detail={
                    "message": f"A dataset with the same {duplicate_type} already exists in your session.",
                    "existing_id": existing_id
                })
            meta_obj = create_session_dataset_meta(
                dataset_id=dataset_id,
                title=meta["filename"],
                filename=meta["filename"],
                df=df,
                summary=None,
                created_at=created_at,
                size=meta["size"],
                df_hash=df_hash
            )
            add_dataset_to_session(session_id, dataset_id, meta_obj, df)
            return UrlUploadResponse(
                id=dataset_id,
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
            summary_path = os.path.splitext(file_path)[0] + ".summary.json"
            summary_meta = {}
            if os.path.exists(summary_path):
                import json
                try:
                    with open(summary_path, "r") as f:
                        summary_meta = json.load(f)
                except Exception:
                    summary_meta = {}
            try:
                df = parse_dataframe_from_path(file_path, ext)
            except DataFrameParseError as e:
                raise HTTPException(status_code=400, detail=str(e))
            preview = get_dataframe_preview(df)
            dataset_id = str(uuid.uuid4())
            # Always compute hash from DataFrame for duplicate check
            df_hash = hashlib.sha256(df.to_csv(index=False).encode("utf-8")).hexdigest()
            duplicate_type = SessionCache.has_duplicate_dataset(session_id, df_hash, summary_meta.get("title") or title or filename)
            if duplicate_type == "hash" or duplicate_type == "title":
                ids = SessionCache.get_dataset_ids(session_id)
                existing_id = None
                for did in ids:
                    meta_obj = SessionCache.get_dataset_meta(session_id, did)
                    if meta_obj.get("hash") == df_hash or (summary_meta.get("title") or title) and meta_obj.get("title") == (summary_meta.get("title") or title or filename):
                        existing_id = did
                        break
                raise HTTPException(status_code=409, detail={
                    "message": f"A dataset with the same {duplicate_type} already exists in your session.",
                    "existing_id": existing_id
                })
            # Use summary_meta fields if available, else fallback
            meta_obj = create_session_dataset_meta(
                dataset_id=dataset_id,
                title=summary_meta.get("title") or title or filename,
                filename=filename,
                df=df,
                summary=summary_meta.get("summary"),
                created_at=summary_meta.get("created_at"),
                size=summary_meta.get("size") or os.path.getsize(file_path),
                df_hash=df_hash
            )
            add_dataset_to_session(session_id, dataset_id, meta_obj, df)
            return UrlUploadResponse(
                id=dataset_id,
                filename=filename,
                size=meta_obj["size"],
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

@router.post("/remove-session-dataset")
async def remove_session_dataset(request: Request, payload: RemoveDatasetRequest):
    session_id = request.state.session_id
    removed = SessionCache.remove_dataset(session_id, payload.id)
    if not removed:
        raise HTTPException(status_code=404, detail="Dataset not found in session.")
    return {"status": "success"}

@router.get("/session-datasets", response_model=DatasetMetaList)
async def get_session_datasets(request: Request):
    session_id = request.state.session_id
    dataset_ids = SessionCache.get_dataset_ids(session_id)
    metas = [SessionCache.get_dataset_meta(session_id, did) for did in dataset_ids]
    return DatasetMetaList(datasets=metas)

@router.get("/session-dataset/{dataset_id}/full")
async def get_session_dataset_full(request: Request, dataset_id: str):
    session_id = request.state.session_id
    meta = SessionCache.get_dataset_meta(session_id, dataset_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Dataset not found in session.")

    df = SessionCache.get_dataset_data(session_id, dataset_id)
    if df is None:
        raise HTTPException(status_code=404, detail="No DataFrame found in session for this dataset.")

    # Get all analyses for this dataset
    analysis_pattern = f"session:{session_id}:dataset:{dataset_id}:analysis:*"
    analyses = {}
    for key in SessionCache._redis.scan_iter(analysis_pattern):
        analysis_type = key.decode().split(":")[-1]
        value = SessionCache.get_analysis_result(session_id, dataset_id, analysis_type)
        analyses[analysis_type] = value

    # Optionally: Limit the number of rows returned for huge data
    rows = df.head(500).to_dict(orient="records") if len(df) > 500 else df.to_dict(orient="records")

    return {
        "meta": meta,
        "data": {"columns": list(df.columns), "rows": rows},
        "analyses": analyses,
    }



@router.post("/session-to-uploads", response_model=DatasetSummary)
async def session_to_uploads(
    request: Request,
    dataset_id: str = Form(...),
    title: Optional[str] = Form(None)
):
    session_id = request.state.session_id
    try:
        meta = save_session_dataset_to_uploads(session_id, dataset_id, UPLOADS_DIR, title=title)
        return DatasetSummary(**meta)
    except Exception as e:
        if "already exists" in str(e):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
        raise HTTPException(status_code=400, detail=f"Failed to save session dataset to uploads: {e}")