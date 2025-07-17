# backend/app/services/upload_service.py

import os
import uuid
import aiofiles
import aiohttp
import pandas as pd
import io

from typing import Tuple, Optional
from app.utils.helpers import get_file_extension, is_supported_extension


async def download_and_validate_file(url: str) -> Tuple[Optional[bytes], dict]:
    """
    Download file from URL, validate content-type and extension, and return file bytes and metadata.
    """
    ext = get_file_extension(url)
    if not is_supported_extension(ext):
        return None, {"error": f"Unsupported file extension: {ext}"}

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status != 200:
                return None, {"error": f"File not reachable (HTTP {resp.status})"}

            content_type = resp.headers.get("Content-Type", "")
            if not any(t in content_type for t in ["csv", "tsv", "excel", "spreadsheet"]):
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


async def preview_file_structure(data: bytes, ext: str) -> dict:
    """
    Extract columns and sample rows from file bytes using pandas.
    """
    try:
        if ext == ".csv":
            df = pd.read_csv(io.BytesIO(data), nrows=5)
        elif ext == ".tsv":
            df = pd.read_csv(io.BytesIO(data), sep="\t", nrows=5)
        elif ext == ".xlsx":
            df = pd.read_excel(io.BytesIO(data), nrows=5)
        else:
            return {"columns": [], "sample_rows": []}

        return {
            "columns": list(df.columns),
            "sample_rows": df.head().to_dict(orient="records")
        }
    except Exception as e:
        return {
            "columns": [],
            "sample_rows": [],
            "error": f"Failed to preview file: {str(e)}"
        }


async def save_and_preview_file(data: bytes, original_filename: str, uploads_dir: str) -> Tuple[str, dict]:
    """
    Generate a UUID filename, save the file, preview its structure, and return filename and preview metadata.
    """
    ext = get_file_extension(original_filename)
    preview = await preview_file_structure(data, ext)

    unique_name = f"{uuid.uuid4()}_{original_filename}"
    file_path = os.path.join(uploads_dir, unique_name)

    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(data)
    except Exception as e:
        raise Exception(f"Failed to save file: {e}")

    return unique_name, preview
