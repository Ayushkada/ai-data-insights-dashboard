# app/core/gpt.py

import os
import openai
import pandas as pd
from dotenv import load_dotenv
from app.schemas.shared import GPTFunctionCall, GPTSummaryResponse

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def gpt_response(message: str, file_path: str) -> str:
    df = (
        pd.read_csv(file_path)
        if file_path.endswith(".csv")
        else pd.read_parquet(file_path)
    )
    prompt = f"""
    The user uploaded a dataset with the following summary:
    Columns: {df.columns.tolist()}
    Shape: {df.shape}
    Null counts: {df.isnull().sum().to_dict()}

    Question: {message}
    Answer in a clear, professional tone.
    """
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You're a data science assistant."},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message["content"]

async def route_gpt_function(payload: GPTFunctionCall) -> GPTSummaryResponse:
    """
    Map GPT function call to backend analysis service.
    """
    # Placeholder: Add routing logic here
    # Example: if payload.tool_name == "analyze_statistics": ...
    return GPTSummaryResponse(summary="Function routing not yet implemented.", result=None)

async def summarize_insights(payload: dict) -> GPTSummaryResponse:
    """
    Generate a GPT-based summary for analysis results.
    """
    # Placeholder: Add GPT summary logic here
    return GPTSummaryResponse(summary="Summary generation not yet implemented.", result=None)

# --- New for basic stats summary ---

def summarize_with_gpt(stats: dict) -> str:
    """
    Call GPT to explain the dataset summary in plain English.
    """
    prompt = f"Explain this dataset summary in plain English: {stats}"
    # Assume call_gpt_api(prompt) is available and returns a string
    from app.core.gpt import call_gpt_api  # If not already imported
    return call_gpt_api(prompt)
