from fastapi import APIRouter, HTTPException
from app.schemas.shared import GPTFunctionCall, GPTSummaryResponse
from app.core.gpt import route_gpt_function, summarize_insights

router = APIRouter()

@router.post("/function", response_model=GPTSummaryResponse)
async def gpt_function_call(payload: GPTFunctionCall):
    """
    Route GPT function calls to the appropriate analysis service.
    """
    try:
        result = await route_gpt_function(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize", response_model=GPTSummaryResponse)
async def gpt_summarize(payload: dict):
    """
    Generate a natural language summary of analysis results.
    """
    try:
        summary = await summarize_insights(payload)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 