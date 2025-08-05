import pandas as pd
import numpy as np
from scipy import stats
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass
import logging
from app.utils.session_cache import SessionCache, RedisCacheError

logger = logging.getLogger(__name__)

class AnalysisError(Exception):
    """Custom exception for analysis errors."""
    def __init__(self, message: str, details: Optional[Dict] = None):
        self.message = message
        self.details = details
        super().__init__(self.message)

@dataclass
class AnalysisConfig:
    """Configuration for analysis pipeline."""
    correlation_threshold: float = 0.7
    high_cardinality_threshold: int = 50
    outlier_zscore_threshold: float = 3.0
    max_categories_for_chi2: int = 20
    sample_size_for_tests: int = 10000

class AnalysisService:
    """Service for running dataset analyses."""
    
    def __init__(self, config: Optional[AnalysisConfig] = None):
        self.config = config or AnalysisConfig()
    
    def run_full_analysis(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Run complete analysis pipeline on DataFrame.
        Returns structured analysis results.
        """
        try:
            # Clean data first
            df_clean = self._clean_dataframe(df)
            
            # Run all analyses
            column_info = self._get_column_info(df_clean)
            numeric_summary = self._get_numeric_summary(df_clean)
            categorical_summary = self._get_categorical_summary(df_clean)
            missing_data = self._get_missing_data(df_clean)
            correlation_matrix = self._get_correlation_matrix(df_clean)
            
            # Extract insights
            highlights = self._extract_highlights(
                df_clean,
                column_info,
                numeric_summary,
                categorical_summary,
                missing_data,
                correlation_matrix
            )
            
            return {
                "column_info": column_info,
                "numeric_summary": numeric_summary,
                "categorical_summary": categorical_summary,
                "missing_data": missing_data,
                "correlation_matrix": correlation_matrix,
                "target": None,  # Will be set by ML pipeline
                "highlights": highlights,
                "gpt_summary": None,  # Will be set by GPT service
                "data_dictionary": None  # Optional feature
            }
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            raise AnalysisError("Failed to analyze dataset", details={"error": str(e)})
    
    def _clean_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean DataFrame for analysis."""
        return df.replace([np.inf, -np.inf], np.nan).where(pd.notnull(df), None)
    
    def _get_column_info(self, df: pd.DataFrame) -> List[Dict]:
        """Extract detailed information about each column."""
        info = []
        for col in df.columns:
            series = df[col]
            dtype = str(series.dtype)
            is_numeric = pd.api.types.is_numeric_dtype(series)
            is_categorical = pd.api.types.is_categorical_dtype(series) or (
                pd.api.types.is_object_dtype(series) and 
                series.nunique() < len(series) * 0.5
            )
            is_datetime = pd.api.types.is_datetime64_any_dtype(series)
            
            info.append({
                "name": col,
                "dtype": dtype,
                "sample_values": series.dropna().head(5).astype(str).tolist(),
                "unique_count": int(series.nunique()),
                "is_numeric": is_numeric,
                "is_categorical": is_categorical,
                "is_datetime": is_datetime,
                "is_constant": series.nunique() == 1,
                "has_nulls": series.isnull().any()
            })
        
        return info
    
    def _get_numeric_summary(self, df: pd.DataFrame) -> List[Dict]:
        """Calculate summary statistics for numeric columns."""
        numeric_cols = df.select_dtypes(include=np.number).columns
        summaries = []
        
        for col in numeric_cols:
            series = df[col]
            if series.isnull().all():
                continue
                
            # Basic stats
            stats_dict = {
                "name": col,
                "mean": float(series.mean()),
                "std": float(series.std()),
                "min": float(series.min()),
                "max": float(series.max()),
                "median": float(series.median()),
                "q1": float(series.quantile(0.25)),
                "q3": float(series.quantile(0.75)),
                "iqr": float(series.quantile(0.75) - series.quantile(0.25)),
                "skewness": float(series.skew()),
                "kurtosis": float(series.kurtosis()),
                "zero_count": int((series == 0).sum()),
                "zero_percent": float((series == 0).mean() * 100)
            }
            
            # Outlier detection
            q1, q3 = stats_dict["q1"], stats_dict["q3"]
            iqr = stats_dict["iqr"]
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            outliers = ((series < lower_bound) | (series > upper_bound))
            stats_dict["outlier_count"] = int(outliers.sum())
            stats_dict["outlier_percent"] = float(outliers.mean() * 100)
            
            # Distribution tests
            if len(series) >= 8:  # Minimum sample size for normality test
                _, p_value = stats.normaltest(series.dropna())
                stats_dict["is_normal"] = float(p_value) > 0.05
            
            summaries.append(stats_dict)
        
        return summaries
    
    def _get_categorical_summary(self, df: pd.DataFrame) -> List[Dict]:
        """Analyze categorical columns."""
        categorical_cols = df.select_dtypes(include=["object", "category"]).columns
        categorical_cols = [
            col for col in categorical_cols 
            if df[col].nunique() < len(df) * 0.5
        ]
        
        summaries = []
        for col in categorical_cols:
            series = df[col]
            if series.isnull().all():
                continue
                
            value_counts = series.value_counts()
            top_values = value_counts.head(10)
            
            summary = {
                "name": col,
                "unique_count": int(series.nunique()),
                "top_values": [
                    {"value": str(k), "count": int(v)} 
                    for k, v in top_values.items()
                ],
                "high_cardinality": series.nunique() > self.config.high_cardinality_threshold,
                "entropy": float(stats.entropy(value_counts.values) if len(value_counts) > 1 else 0)
            }
            
            # Chi-square test for uniformity if not too many categories
            if series.nunique() <= self.config.max_categories_for_chi2:
                _, p_value = stats.chisquare(value_counts.values)
                summary["is_uniform"] = float(p_value) > 0.05
            
            summaries.append(summary)
        
        return summaries
    
    def _get_missing_data(self, df: pd.DataFrame) -> List[Dict]:
        """Analyze missing data patterns."""
        missing = []
        total_rows = len(df)
        
        for col in df.columns:
            null_count = df[col].isnull().sum()
            if null_count > 0:
                missing.append({
                    "column": col,
                    "count": int(null_count),
                    "percent": float(null_count / total_rows * 100)
                })
        
        return missing
    
    def _get_correlation_matrix(self, df: pd.DataFrame) -> Dict:
        """Calculate correlation matrix and identify high correlation pairs."""
        numeric_cols = df.select_dtypes(include=np.number).columns
        if len(numeric_cols) < 2:
            return {
                "columns": [],
                "values": [],
                "high_correlation_pairs": []
            }
        
        # Calculate correlation matrix
        corr_matrix = df[numeric_cols].corr()
        
        # Find high correlation pairs
        high_corr_pairs = []
        for i in range(len(numeric_cols)):
            for j in range(i + 1, len(numeric_cols)):
                corr = corr_matrix.iloc[i, j]
                if abs(corr) >= self.config.correlation_threshold:
                    high_corr_pairs.append({
                        "col1": numeric_cols[i],
                        "col2": numeric_cols[j],
                        "correlation": float(corr)
                    })
        
        return {
            "columns": numeric_cols.tolist(),
            "values": corr_matrix.values.tolist(),
            "high_correlation_pairs": sorted(
                high_corr_pairs,
                key=lambda x: abs(x["correlation"]),
                reverse=True
            )
        }
    
    def _extract_highlights(
        self,
        df: pd.DataFrame,
        column_info: List[Dict],
        numeric_summary: List[Dict],
        categorical_summary: List[Dict],
        missing_data: List[Dict],
        correlation_matrix: Dict
    ) -> List[str]:
        """Generate key insights about the dataset."""
        highlights = []
        
        # Dataset overview
        highlights.append(
            f"Dataset contains {len(df.columns)} columns and {len(df)} rows"
        )
        
        # Missing data insights
        if not missing_data:
            highlights.append("No missing data in any columns")
        else:
            high_missing = [m for m in missing_data if m["percent"] > 20]
            if high_missing:
                highlights.append(
                    f"{len(high_missing)} columns have >20% missing values"
                )
        
        # Numeric insights
        for col_stats in numeric_summary:
            # Skewness
            if abs(col_stats["skewness"]) > 1:
                direction = "right" if col_stats["skewness"] > 0 else "left"
                highlights.append(
                    f"{col_stats['name']} is {direction}-skewed"
                )
            
            # Outliers
            if col_stats["outlier_percent"] > 1:
                highlights.append(
                    f"{col_stats['name']} has {col_stats['outlier_percent']:.1f}% outliers"
                )
            
            # Distribution
            if col_stats.get("is_normal"):
                highlights.append(
                    f"{col_stats['name']} appears normally distributed"
                )
        
        # Correlation insights
        if correlation_matrix["high_correlation_pairs"]:
            top_corr = correlation_matrix["high_correlation_pairs"][0]
            highlights.append(
                f"Strongest correlation: {top_corr['col1']} and {top_corr['col2']} "
                f"({top_corr['correlation']:.2f})"
            )
        
        # Categorical insights
        high_card_cols = [
            c["name"] for c in categorical_summary 
            if c["high_cardinality"]
        ]
        if high_card_cols:
            highlights.append(
                f"{len(high_card_cols)} columns have high cardinality"
            )
        
        # Uniform distributions
        uniform_cols = [
            c["name"] for c in categorical_summary 
            if c.get("is_uniform")
        ]
        if uniform_cols:
            highlights.append(
                f"{len(uniform_cols)} categorical columns have uniform distribution"
            )
        
        return highlights

def get_cached_analysis(
    session_id: str,
    df: pd.DataFrame,
    config: Optional[AnalysisConfig] = None
) -> Tuple[Dict[str, Any], bool]:
    """
    Get analysis results from cache or compute new ones.
    Returns (analysis_results, from_cache).
    """
    try:
        # Try to get from cache
        cached = SessionCache.get_analysis_result(session_id, "overview")
        if cached:
            return cached, True
        
        # Compute new analysis
        service = AnalysisService(config)
        results = service.run_full_analysis(df)
        
        # Cache results
        SessionCache.set_analysis_result(session_id, "overview", results)
        
        return results, False
        
    except RedisCacheError as e:
        logger.warning(f"Cache error in analysis: {str(e)}")
        # On cache error, compute but don't cache
        service = AnalysisService(config)
        return service.run_full_analysis(df), False
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise AnalysisError("Failed to get analysis results", details={"error": str(e)}) 