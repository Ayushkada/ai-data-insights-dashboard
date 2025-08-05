from fastapi import APIRouter, HTTPException, Request, status
from app.schemas.dataset import DatasetData, DatasetMetaBase
from app.schemas.shared import ErrorResponse
from app.utils.session_cache import SessionCache, RedisCacheError
from app.services.dataset_service import get_session_dataset as get_session_dataset_service, DatasetProcessingError
from app.schemas.shared import PaginatedData
import numpy as np
import pandas as pd

router = APIRouter()

@router.get(
    "/session-dataset",
    response_model=DatasetData,
    responses={
        404: {"model": ErrorResponse},
        503: {"model": ErrorResponse}
    }
)
async def get_session_dataset(
    request: Request,
    page: int = 1,
    page_size: int = 50
):
    """Get paginated dataset data from session."""
    try:
        meta, df = get_session_dataset_service(request.state.session_id)
        df_clean = df.replace([np.inf, -np.inf], np.nan).where(pd.notnull(df), None)
        total_rows = len(df_clean)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        return DatasetData(
            columns=df_clean.columns.tolist(),
            rows=df_clean.iloc[start_idx:end_idx].to_dict(orient="records"),
            pagination=PaginatedData(
                total=total_rows,
                page=page,
                page_size=page_size,
                total_pages=(total_rows + page_size - 1) // page_size
            )
        )
    except DatasetProcessingError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=ErrorResponse(
                message=str(e),
                code="DATASET_ACCESS_ERROR",
                details=e.details
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorResponse(
                message="Failed to retrieve dataset",
                code="INTERNAL_ERROR",
                details={"error": str(e)}
            ).dict()
        )

@router.post(
    "/remove-session-dataset",
    response_model=dict,
    responses={503: {"model": ErrorResponse}}
)
async def remove_session_dataset(request: Request):
    """Remove dataset from session cache."""
    try:
        SessionCache.remove_dataset(request.state.session_id)
        return {"status": "success"}
    except RedisCacheError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=ErrorResponse(
                message="Failed to remove dataset from cache",
                code="CACHE_ERROR",
                details={"error": str(e)}
            ).dict()
        )

@router.get(
    "/session-dataset-active",
    response_model=dict,
    responses={503: {"model": ErrorResponse}}
)
async def get_session_dataset_active(request: Request):
    """Check if session has an active dataset."""
    try:
        has_dataset = SessionCache.has_dataset(request.state.session_id)
        return {"has_dataset": has_dataset}
    except RedisCacheError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=ErrorResponse(
                message="Failed to check dataset status",
                code="CACHE_ERROR",
                details={"error": str(e)}
            ).dict()
        )

@router.get(
    "/session-meta",
    response_model=DatasetMetaBase,
    responses={
        404: {"model": ErrorResponse},
        503: {"model": ErrorResponse}
    }
)
async def get_session_dataset_meta(request: Request):
    """Get only the meta for the current session's dataset."""
    try:
        meta, _ = get_session_dataset_service(request.state.session_id)
        return meta
    except DatasetProcessingError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=ErrorResponse(
                message=str(e),
                code="DATASET_ACCESS_ERROR",
                details=e.details
            ).dict()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorResponse(
                message="Failed to retrieve dataset meta",
                code="INTERNAL_ERROR",
                details={"error": str(e)}
            ).dict()
        )
