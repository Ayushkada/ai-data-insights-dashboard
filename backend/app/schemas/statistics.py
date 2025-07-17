# backend/app/schemas/statistics.py

from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class BasicStatsRequest(BaseModel):
    file_path: str = Field(..., description="Path to the uploaded CSV file in /uploads.")
    include_gpt_summary: Optional[bool] = Field(False, description="Whether to include a GPT-generated summary.")

class BasicStatsResponse(BaseModel):
    stats: Dict[str, Any]
    gpt_summary: Optional[str] = None 