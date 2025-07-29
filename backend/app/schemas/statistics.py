# backend/app/schemas/statistics.py

from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class BasicStatsRequest(BaseModel):
    dataset_id: str = Field(..., description="ID of the dataset in session for which to compute stats.")
    include_gpt_summary: Optional[bool] = Field(True, description="Whether to include a GPT-generated summary.")

class BasicStatsResponse(BaseModel):
    stats: Dict[str, Any]
    gpt_summary: Optional[str] = None
