from fastapi import APIRouter, HTTPException
from app.schemas.statistics import BasicStatsRequest, BasicStatsResponse
from app.services.statistics.analyze_statistics import compute_basic_statistics
from app.core.gpt import summarize_with_gpt
from app.utils.helpers import get_file_extension
import pandas as pd
import os

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
async def analyze_basic_stats(request: BasicStatsRequest):
    """
    Compute basic descriptive statistics for a dataset. Optionally include a GPT summary.
    Supports .csv, .tsv, and .xlsx files.
    """
    file_path = request.file_path
    abs_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../uploads', file_path))
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="File not found.")
    ext = get_file_extension(abs_path)
    try:
        if ext == ".csv":
            df = pd.read_csv(abs_path)
        elif ext == ".tsv":
            df = pd.read_csv(abs_path, sep='\t')
        elif ext == ".xlsx":
            df = pd.read_excel(abs_path)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file extension: {ext}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to load file: {e}")

    stats = compute_basic_statistics(df)
    return BasicStatsResponse(stats=stats) 