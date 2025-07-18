from fastapi import APIRouter, Request
from app.schemas.statistics import BasicStatsRequest, BasicStatsResponse
from app.services.analyze_statistics import compute_basic_statistics, compute_skewness_kurtosis, compute_correlation_matrices
from app.core.gpt import summarize_with_gpt
from app.utils.helpers import get_session_df

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
async def analyze_basic_stats(request: BasicStatsRequest, fastapi_request: Request):
    """
    Compute basic descriptive statistics for the current session DataFrame.
    Only works if DataFrame is in session cache.
    """
    df = get_session_df(fastapi_request)
    stats = compute_basic_statistics(df)
    return BasicStatsResponse(stats=stats)

@router.post("/skewness-kurtosis")
async def analyze_skewness_kurtosis(fastapi_request: Request):
    """
    Return skewness and kurtosis for all numeric columns in the session DataFrame.
    """
    df = get_session_df(fastapi_request)
    result = compute_skewness_kurtosis(df)
    return result

@router.post("/correlation")
async def analyze_correlation(fastapi_request: Request):
    """
    Return correlation matrices (Pearson, Spearman, Cramér’s V) and top correlated pairs for the session DataFrame.
    """
    df = get_session_df(fastapi_request)
    result = compute_correlation_matrices(df)
    return result