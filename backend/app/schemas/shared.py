# backend/app/schemas/shared.py
# Common types, enums, and payloads for the backend

from pydantic import BaseModel
from typing import Any, Optional

class GPTFunctionCall(BaseModel):
    tool_name: str
    parameters: dict

class GPTSummaryResponse(BaseModel):
    summary: str
    result: Optional[Any] = None 