from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ColumnInfoResponse(BaseModel):
    """Column-level metadata and type info."""
    name: str
    dtype: str
    sample_values: List[str]
    unique_count: int
    is_numeric: bool
    is_categorical: bool
    is_datetime: bool
    is_constant: bool
    has_nulls: bool

class NumericSummaryResponse(BaseModel):
    """Summary statistics for a numeric column."""
    name: str
    mean: float
    std: float
    min: float
    max: float
    median: float
    q1: float
    q3: float
    iqr: float
    skewness: float
    kurtosis: float
    zero_count: int
    zero_percent: float
    outlier_count: int
    outlier_percent: float
    is_normal: Optional[bool] = None

class CategoryValueCount(BaseModel):
    value: str
    count: int

class CategoricalSummaryResponse(BaseModel):
    """Summary statistics for a categorical column."""
    name: str
    unique_count: int
    top_values: List[CategoryValueCount]
    high_cardinality: bool
    entropy: float
    is_uniform: Optional[bool] = None

class MissingDataResponse(BaseModel):
    column: str
    count: int
    percent: float

class CorrelationPair(BaseModel):
    col1: str
    col2: str
    correlation: float

class CorrelationMatrixResponse(BaseModel):
    columns: List[str]
    values: List[List[float]]
    high_correlation_pairs: List[CorrelationPair]

class GPTInsightExplanation(BaseModel):
    """GPT-generated explanation for a statistical insight."""
    highlight: str = Field(..., description="The statistical insight being explained")
    explanation: str = Field(..., description="Natural language explanation of the insight")

class GPTSuggestedAnalysis(BaseModel):
    """GPT-suggested additional analysis."""
    type: str = Field(..., description="Type of analysis suggested")
    description: str = Field(..., description="Description of the suggested analysis")
    reason: str = Field(..., description="Reasoning behind the suggestion")

class GPTInsights(BaseModel):
    """All GPT-generated insights for the dataset."""
    summary: str = Field(..., description="Overall dataset summary")
    column_descriptions: Dict[str, str] = Field(
        ...,
        description="Natural language descriptions for each column"
    )
    insight_explanations: List[GPTInsightExplanation] = Field(
        ...,
        description="Detailed explanations of statistical insights"
    )
    suggested_analyses: List[GPTSuggestedAnalysis] = Field(
        ...,
        description="Suggested additional analyses"
    )

class DatasetAnalysis(BaseModel):
    """Complete analysis results including statistical and GPT insights."""
    column_info: List[ColumnInfoResponse]
    numeric_summary: List[NumericSummaryResponse]
    categorical_summary: List[CategoricalSummaryResponse]
    missing_data: List[MissingDataResponse]
    correlation_matrix: CorrelationMatrixResponse
    target: Optional[str] = None
    highlights: List[str]
    gpt_insights: Optional[GPTInsights] = None
    data_dictionary: Optional[Dict[str, str]] = None

class AnalysisOverviewResponse(BaseModel):
    """Response for the analysis overview endpoint: only analysis and cache info."""
    analysis: DatasetAnalysis
    cache_info: Optional[Dict[str, Any]] = None 