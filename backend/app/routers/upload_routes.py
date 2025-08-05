from app.services.dataset_service import DatasetProcessingError, parse_and_process_file, process_dataframe, validate_and_cache_dataset
from fastapi import APIRouter, HTTPException, UploadFile, File, Request, Form, status
from fastapi.responses import JSONResponse
from app.schemas.upload import UrlUploadResponse
from app.schemas.dataset import DatasetSummary, DatasetSummaryList
from app.schemas.shared import ErrorResponse
from app.utils.helpers import get_file_extension, is_approved_domain, is_supported_extension
from app.utils.parsers import parse_dataframe_from_path
from app.utils.session_cache import RedisCacheError
import os
import aiohttp
from typing import Optional
from app.services.upload_service import save_session_dataset_to_uploads
import uuid

UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../uploads'))

router = APIRouter()

@router.get(
    "/summary",
    response_model=DatasetSummaryList,
    responses={
        500: {"model": ErrorResponse},
        503: {"model": ErrorResponse}
    }
)
async def get_uploads_summary(
    page: int = 1,
    page_size: int = 50
):
    """Get paginated list of uploaded datasets."""
    try:
        # List all dataset files
        datasets = []
        for fname in os.listdir(UPLOADS_DIR):
            if fname.endswith((".csv", ".tsv", ".xlsx")):
                base = os.path.splitext(fname)[0]
                summary_path = os.path.join(UPLOADS_DIR, f"{base}.summary.json")
                
                # Get file stats
                file_path = os.path.join(UPLOADS_DIR, fname)
                stats = os.stat(file_path)
                
                # Create basic metadata
                meta = {
                    "filename": fname,
                    "size": stats.st_size,
                    "created_at": stats.st_ctime
                }
                
                # Add summary if exists
                if os.path.exists(summary_path):
                    import json
                    try:
                        with open(summary_path, "r") as f:
                            meta.update(json.load(f))
                    except json.JSONDecodeError:
                        pass
                
                datasets.append(DatasetSummary(**meta))
        
        # Paginate results
        total = len(datasets)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        return DatasetSummaryList(
            data=datasets[start_idx:end_idx],
            pagination={
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": (total + page_size - 1) // page_size
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorResponse(
                message="Failed to list datasets",
                code="LIST_DATASETS_ERROR",
                details={"error": str(e)}
            ).dict()
        )

@router.post(
    "/session-file",
    response_model=UrlUploadResponse,
    responses={
        400: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
        413: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        503: {"model": ErrorResponse}
    }
)
async def session_file(
    request: Request,
    mode: str = Form(...),
    title: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None)
):
    """
    Upload dataset to session via file upload, URL, or selection from uploads.
    Supports CSV, TSV, and Excel files.
    """
    session_id = request.state.session_id
    
    try:
        if mode == "upload":
            if not file:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=ErrorResponse(
                        message="No file uploaded",
                        code="NO_FILE"
                    ).dict()
                )
            
            # Validate file type
            ext = get_file_extension(file.filename)
            if not is_supported_extension(ext):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=ErrorResponse(
                        message=f"Unsupported file type: {ext}",
                        code="INVALID_FILE_TYPE",
                        details={"supported_types": list(is_supported_extension.SUPPORTED_EXTENSIONS)}
                    ).dict()
                )
            
            # Read and process file
            data = await file.read()
            df_clean, meta = parse_and_process_file(
                data,
                file.filename,
                title=title,
                size=len(data)
            )
            
            # Cache dataset
            meta = validate_and_cache_dataset(session_id, df_clean, meta, meta["hash"])
            
            return UrlUploadResponse(
                filename=meta["filename"],
                title=meta.get("title"),
                created_at=meta["created_at"],
                size=meta["size"],
                num_rows=meta.get("num_rows"),
                columns=meta.get("columns"),
                preview=meta.get("preview"),
                summary=meta.get("summary"),
                mime_type=file.content_type,
                message="File uploaded to session and cached"
            )
        elif mode == "link":
            if not url:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=ErrorResponse(
                        message="No URL provided",
                        code="NO_URL"
                    ).dict()
                )
            
            if not is_approved_domain(url):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=ErrorResponse(
                        message="URL domain not approved",
                        code="INVALID_DOMAIN",
                        details={"approved_domains": list(is_approved_domain.APPROVED_DOMAINS)}
                    ).dict()
                )
            
            # Download file
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=ErrorResponse(
                                message=f"Failed to download file (HTTP {response.status})",
                                code="DOWNLOAD_ERROR"
                            ).dict()
                        )
                    
                    data = await response.read()
                    filename = url.split("/")[-1]
                    
                    # Process downloaded file
                    df_clean, meta = parse_and_process_file(
                        data,
                        filename,
                        title=title,
                        size=len(data)
                    )
                    
                    # Cache dataset
                    meta = validate_and_cache_dataset(session_id, df_clean, meta, meta["hash"])
                    
                    return UrlUploadResponse(
                        filename=meta["filename"],
                        title=meta.get("title"),
                        created_at=meta["created_at"],
                        size=meta["size"],
                        num_rows=meta.get("num_rows"),
                        columns=meta.get("columns"),
                        preview=meta.get("preview"),
                        summary=meta.get("summary"),
                        mime_type=response.headers.get("content-type", "application/octet-stream"),
                        message="File from URL uploaded to session and cached"
                    )
        elif mode == "select":
            # This is the only place where id (S3 object name) should be used in meta
            if not title:  # Use title field for filename in select mode
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=ErrorResponse(
                        message="No filename provided",
                        code="NO_FILENAME"
                    ).dict()
                )
            
            file_path = os.path.join(UPLOADS_DIR, title)
            if not os.path.exists(file_path):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=ErrorResponse(
                        message="File not found in uploads folder",
                        code="FILE_NOT_FOUND"
                    ).dict()
                )
            
            # Parse file from disk
            ext = get_file_extension(title)
            df = parse_dataframe_from_path(file_path, ext)
            
            # Process DataFrame
            df_clean, meta, df_hash = process_dataframe(
                df,
                title,
                title=title,
                size=os.path.getsize(file_path)
            )
            # Add id for select/S3 dataset
            meta["id"] = title
            
            # Cache dataset
            meta = validate_and_cache_dataset(session_id, df_clean, meta, df_hash)
            
            return UrlUploadResponse(
                filename=meta["filename"],
                title=meta.get("title"),
                created_at=meta["created_at"],
                size=meta["size"],
                num_rows=meta.get("num_rows"),
                columns=meta.get("columns"),
                preview=meta.get("preview"),
                summary=meta.get("summary"),
                mime_type="application/octet-stream",
                message="File from uploads folder loaded to session"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ErrorResponse(
                    message="Invalid mode",
                    code="INVALID_MODE",
                    details={"supported_modes": ["upload", "link", "select"]}
                ).dict()
            )
    except DatasetProcessingError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=ErrorResponse(
                message=str(e),
                code="DATASET_PROCESSING_ERROR",
                details=e.details
            ).dict()
        )
    except RedisCacheError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=ErrorResponse(
                message="Cache service unavailable",
                code="CACHE_ERROR",
                details={"error": str(e)}
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorResponse(
                message="Unexpected error processing dataset",
                code="INTERNAL_ERROR",
                details={"error": str(e)}
            ).dict()
        )

# @router.post("/save-session-dataset-to-uploads", response_model=dict, responses={503: {"model": ErrorResponse}})
# async def save_session_dataset_to_uploads_route(request: Request):
    """Save the current session's dataset to the uploads folder as CSV and JSON summary."""
    try:
        session_id = request.state.session_id
        # Fetch meta and df from session
        from app.utils.session_cache import SessionCache
        meta = SessionCache.get_dataset_meta(session_id)
        df = SessionCache.get_dataset_data(session_id)
        if meta is None or df is None:
            raise HTTPException(status_code=404, detail={"message": "No dataset in session"})
        # Ensure meta has an id
        if not meta.get("id"):
            meta["id"] = str(uuid.uuid4())
        # Save to uploads
        uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../uploads'))
        result = save_session_dataset_to_uploads(session_id, uploads_dir, title=meta.get("title"))
        return {"status": "success", "meta": result}
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=ErrorResponse(
                message="Failed to save session dataset to uploads",
                code="UPLOAD_SAVE_ERROR",
                details={"error": str(e)}
            ).dict()
        )