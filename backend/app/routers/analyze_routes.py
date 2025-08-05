from fastapi import APIRouter, Request, HTTPException, status, Query
from app.schemas.analysis import AnalysisOverviewResponse, DatasetAnalysis
from app.services.analysis_service import (
    get_cached_analysis,
    AnalysisConfig,
    AnalysisError
)
from app.services.gpt_service import get_cached_gpt_insights, GPTError
from app.services.dataset_service import get_session_dataset, DatasetProcessingError
from app.utils.session_cache import RedisCacheError
from app.schemas.shared import ErrorResponse, CacheInfo
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get(
    "/overview",
    response_model=AnalysisOverviewResponse,
    responses={
        404: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        503: {"model": ErrorResponse}
    }
)
async def get_dataset_overview(
    request: Request,
    page: int = Query(1, ge=1, description="Page number for data pagination"),
    page_size: int = Query(50, ge=10, le=1000, description="Items per page"),
    correlation_threshold: float = Query(0.7, ge=0, le=1, description="Threshold for high correlations"),
    high_cardinality_threshold: int = Query(50, ge=10, description="Threshold for high cardinality"),
    outlier_zscore_threshold: float = Query(3.0, ge=1.0, description="Z-score threshold for outliers"),
    include_gpt: bool = Query(True, description="Whether to include GPT insights")
):
    """
    Get complete dataset analysis (no meta or data).
    """
    try:
        # Get dataset from session
        _, df = get_session_dataset(request.state.session_id)
        # Configure analysis
        config = AnalysisConfig(
            correlation_threshold=correlation_threshold,
            high_cardinality_threshold=high_cardinality_threshold,
            outlier_zscore_threshold=outlier_zscore_threshold
        )
        # Get analysis results (from cache if available)
        analysis_results, from_cache = get_cached_analysis(
            request.state.session_id,
            df,
            config
        )
        # Get GPT insights if requested
        if include_gpt:
            try:
                gpt_insights = get_cached_gpt_insights(
                    request.state.session_id,
                    df,
                    analysis_results
                )
                analysis_results["gpt_insights"] = gpt_insights
            except GPTError as e:
                logger.warning(f"GPT insights failed: {str(e)}")
                # Continue without GPT insights
                pass
        # Only return analysis and cache_info
        response = AnalysisOverviewResponse(
            analysis=DatasetAnalysis(**analysis_results),
            cache_info=CacheInfo(
                cached=from_cache,
                cache_key=f"session:{request.state.session_id}:overview",
                ttl=None  # TODO: Get TTL from Redis
            ).dict()
        )
        return response
    except DatasetProcessingError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=ErrorResponse(
                message=str(e),
                code="DATASET_ACCESS_ERROR",
                details=e.details
            ).dict()
        )
    except AnalysisError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=ErrorResponse(
                message=str(e),
                code="ANALYSIS_ERROR",
                details=e.details
            ).dict()
        )
    except RedisCacheError as e:
        logger.warning(f"Cache error in analysis route: {str(e)}")
        # Continue without cache
        pass
    except Exception as e:
        logger.error(f"Unexpected error in analysis route: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorResponse(
                message="Failed to analyze dataset",
                code="INTERNAL_ERROR",
                details={"error": str(e)}
            ).dict()
        )