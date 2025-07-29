from fastapi import APIRouter, Request, Body
from app.schemas.statistics import BasicStatsRequest, BasicStatsResponse
from app.services.analyze_statistics import compute_basic_statistics, compute_skewness_kurtosis, compute_correlation_matrices
from app.core.gpt import summarize_with_gpt
from app.utils.helpers import get_session_df
from app.utils.session_cache import SessionCache

router = APIRouter()

# Placeholder endpoints for each analysis phase

@router.post("/statistics")
async def analyze_statistics():
    """Run descriptive statistics analysis."""
    # TODO: Implement logic
    return {"message": "Descriptive statistics not yet implemented."}

@router.post("/hypothesis")
async def analyze_hypothesis():
    """Run hypothesis testing."""
    # TODO: Implement logic
    return {"message": "Hypothesis testing not yet implemented."}

@router.post("/outliers")
async def analyze_outliers():
    """Detect outliers and check distributions."""
    # TODO: Implement logic
    return {"message": "Outlier detection not yet implemented."}

@router.post("/timeseries")
async def analyze_timeseries():
    """Run time series analysis."""
    # TODO: Implement logic
    return {"message": "Time series analysis not yet implemented."}

@router.post("/clustering")
async def analyze_clustering():
    """Run clustering analysis."""
    # TODO: Implement logic
    return {"message": "Clustering not yet implemented."}

@router.post("/sentiment")
async def analyze_sentiment():
    """Run sentiment/text analysis."""
    # TODO: Implement logic
    return {"message": "Sentiment analysis not yet implemented."}

@router.post("/automl")
async def analyze_automl():
    """Run AutoML analysis."""
    # TODO: Implement logic
    return {"message": "AutoML not yet implemented."}

@router.post("/basic", response_model=BasicStatsResponse)
async def analyze_basic_stats(
    fastapi_request: Request,
    request: BasicStatsRequest = Body(...)
):
    session_id = getattr(fastapi_request.state, "session_id", None)
    dataset_id = getattr(request, "dataset_id", None) or getattr(request, "id", None) or None
    if not dataset_id:
        raise Exception("dataset_id is required in the request body.")

    # Try to get from cache
    cached = SessionCache.get_analysis_result(session_id, dataset_id, "basic_stats")
    if cached:
        return BasicStatsResponse(stats=cached["stats"], gpt_summary=cached.get("gpt_summary"))

    df = SessionCache.get_dataset_data(session_id, dataset_id)
    if df is None:
        raise Exception("No DataFrame in session cache for this dataset_id.")

    stats = compute_basic_statistics(df)
    gpt_summary = summarize_with_gpt(stats)  # Optionally add error handling if GPT call fails

    result = {"stats": stats, "gpt_summary": gpt_summary}
    SessionCache.set_analysis_result(session_id, dataset_id, "basic_stats", result)
    return BasicStatsResponse(stats=stats, gpt_summary=gpt_summary)

@router.post("/skewness-kurtosis")
async def analyze_skewness_kurtosis(
    fastapi_request: Request,
    dataset_id: str = Body(...)
):
    session_id = getattr(fastapi_request.state, "session_id", None)
    # Try to get from cache
    cached = SessionCache.get_analysis_result(session_id, dataset_id, "skewness_kurtosis")
    if cached:
        return cached
    df = SessionCache.get_dataset_data(session_id, dataset_id)
    if df is None:
        raise Exception("No DataFrame in session cache for this dataset_id.")
    result = compute_skewness_kurtosis(df)
    SessionCache.set_analysis_result(session_id, dataset_id, "skewness_kurtosis", result)
    return result

@router.post("/correlation")
async def analyze_correlation(
    fastapi_request: Request,
    dataset_id: str = Body(...)
):
    session_id = getattr(fastapi_request.state, "session_id", None)
    # Try to get from cache
    cached = SessionCache.get_analysis_result(session_id, dataset_id, "correlation")
    if cached:
        return cached
    df = SessionCache.get_dataset_data(session_id, dataset_id)
    if df is None:
        raise Exception("No DataFrame in session cache for this dataset_id.")
    result = compute_correlation_matrices(df)
    SessionCache.set_analysis_result(session_id, dataset_id, "correlation", result)
    return result
