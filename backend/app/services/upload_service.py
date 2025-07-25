# backend/app/services/upload_service.py

import hashlib
import os
import uuid
import aiohttp
import pandas as pd
import json
from datetime import datetime
from typing import Tuple, Optional
from app.utils.helpers import get_dataframe_preview, get_file_extension, is_supported_extension
from app.utils.session_cache import SessionCache
from app.core.gpt import summarize_with_gpt
from app.services.analyze_statistics import compute_basic_statistics


async def download_and_validate_file(url: str) -> Tuple[Optional[bytes], dict]:
    """
    Download a file from a URL and validate its extension/content-type.
    Returns (file_bytes, metadata) or (None, error dict).
    """
    ext = get_file_extension(url)
    if not is_supported_extension(ext):
        return None, {"error": f"Unsupported file extension: {ext}"}
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status != 200:
                return None, {"error": f"File not reachable (HTTP {resp.status})"}
            content_type = resp.headers.get("Content-Type", "")
            if not any(
                t in content_type for t in ["csv", "tsv", "excel", "spreadsheet"]
            ):
                return None, {"error": f"Unsupported content-type: {content_type}"}
            data = await resp.read()
            filename = url.split("/")[-1]
            size = len(data)
            meta = {
                "filename": filename,
                "size": size,
                "mime_type": content_type,
            }
            return data, meta


def list_datasets_with_summaries(uploads_dir: str) -> list:
    """
    Return list of datasets in uploads folder with their summary metadata.
    """
    datasets = []
    for fname in os.listdir(uploads_dir):
        if fname.endswith((".csv", ".tsv", ".xlsx")):
            base = os.path.splitext(fname)[0]
            summary_path = os.path.join(uploads_dir, f"{base}.summary.json")
            meta = {"filename": fname}
            if os.path.exists(summary_path):
                try:
                    with open(summary_path, "r") as f:
                        meta.update(json.load(f))
                except Exception:
                    pass
            meta["size"] = os.path.getsize(os.path.join(uploads_dir, fname))
            meta["created_at"] = datetime.fromtimestamp(
                os.path.getctime(os.path.join(uploads_dir, fname))
            ).isoformat()
            datasets.append(meta)
    return datasets


def get_df_hash(df):
    """Generate a SHA256 hash of the DataFrame's CSV content."""
    csv_bytes = df.to_csv(index=False).encode("utf-8")
    return hashlib.sha256(csv_bytes).hexdigest()


def save_session_df_to_uploads(
    session_id: str, uploads_dir: str, title: str = None
) -> dict:
    """
    Persist the DataFrame in the session cache to uploads folder, generate GPT summary, and save metadata JSON.
    Prevents duplicates by content (hash) or title.
    """
    df = SessionCache.get_df(session_id)
    if df is None:
        raise Exception("No DataFrame in session cache.")

    df_hash = get_df_hash(df)

    # Duplicate check (by hash or title)
    for fname in os.listdir(uploads_dir):
        if fname.endswith(".summary.json"):
            try:
                with open(os.path.join(uploads_dir, fname), "r") as f:
                    meta = json.load(f)
                if meta.get("hash") == df_hash:
                    raise Exception("A dataset with the same content already exists.")
                if title and meta.get("title") == title:
                    raise Exception("A dataset with the same title already exists.")
            except json.JSONDecodeError:
                continue

    dataset_id = str(uuid.uuid4())
    filename = f"{dataset_id}.csv"
    file_path = os.path.join(uploads_dir, filename)
    df.to_csv(file_path, index=False)
    summary = None
    try:
        stats = compute_basic_statistics(df)
        summary = summarize_with_gpt(stats)
    except Exception as e:
        summary = f"Failed to generate summary: {e}"
    meta = {
        "id": dataset_id,
        "filename": filename,
        "title": title or filename,
        "summary": summary,
        "columns": list(df.columns),
        "num_rows": len(df), 
        "preview": get_dataframe_preview(df),
        "size": os.path.getsize(file_path),
        "created_at": datetime.now().isoformat(),
        "hash": df_hash,
    }
    summary_path = os.path.join(
        uploads_dir, f"{os.path.splitext(filename)[0]}.summary.json"
    )
    with open(summary_path, "w") as f:
        json.dump(meta, f)
    return meta

# --- New: Helper to create DatasetMeta for session cache ---
def create_session_dataset_meta(dataset_id: str, title: str, filename: str, df: pd.DataFrame, summary: str, created_at: str, size: int, df_hash: str) -> dict:
    return {
        "id": dataset_id,
        "title": title or filename,
        "filename": filename,
        "columns": list(df.columns),
        "preview": get_dataframe_preview(df),
        "created_at": created_at,
        "summary": summary,
        "num_rows": len(df),
        "size": size,
        "hash": df_hash,
    }

# --- New: Add dataset to session cache (enforce max 3) ---
def add_dataset_to_session(session_id: str, meta: dict):
    SessionCache.add_dataset_meta(session_id, meta)
