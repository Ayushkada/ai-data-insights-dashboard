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

def save_session_dataset_to_uploads(
    session_id: str,
    dataset_id: str,
    uploads_dir: str,
    title: str = None
) -> dict:
    """
    Save the dataset with dataset_id from session to uploads folder and generate summary JSON.
    Prevents duplicates by content (hash) or title in uploads.
    """
    # Fetch DataFrame and meta
    df = SessionCache.get_dataset_data(session_id, dataset_id)
    meta = SessionCache.get_dataset_meta(session_id, dataset_id)
    if df is None or meta is None:
        raise Exception("Dataset not found in session.")

    df_hash = meta.get("hash") or hashlib.sha256(df.to_csv(index=False).encode("utf-8")).hexdigest()
    # Check for duplicate in uploads dir
    for fname in os.listdir(uploads_dir):
        if fname.endswith(".summary.json"):
            try:
                with open(os.path.join(uploads_dir, fname), "r") as f:
                    exist_meta = json.load(f)
                if exist_meta.get("hash") == df_hash:
                    raise Exception("A dataset with the same content already exists in uploads.")
                if title and exist_meta.get("title") == title:
                    raise Exception("A dataset with the same title already exists in uploads.")
            except Exception:
                continue

    # Use the provided title if given, else keep old
    filename = f"{dataset_id}.csv"
    file_path = os.path.join(uploads_dir, filename)
    df.to_csv(file_path, index=False)
    try:
        stats = compute_basic_statistics(df)
        summary = summarize_with_gpt(stats)
    except Exception as e:
        summary = f"Failed to generate summary: {e}"

    new_meta = {
        "id": dataset_id,
        "filename": filename,
        "title": title or meta.get("title") or filename,
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
        json.dump(new_meta, f)
    return new_meta


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
    csv_bytes = df.to_csv(index=False).encode("utf-8")
    return hashlib.sha256(csv_bytes).hexdigest()

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

def add_dataset_to_session(session_id: str, dataset_id: str, meta: dict, df: pd.DataFrame):
    SessionCache.add_dataset(session_id, dataset_id, meta, df)