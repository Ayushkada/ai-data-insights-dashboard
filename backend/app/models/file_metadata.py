# models/file_metadata.py
from pydantic import BaseModel
from datetime import datetime


class FileMetadata(BaseModel):
    id: str
    filename: str
    upload_time: datetime
