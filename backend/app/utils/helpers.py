# backend/app/utils/helpers.py

from urllib.parse import urlparse
import mimetypes

# Approved domains for secure URL-based uploads
APPROVED_DOMAINS = {
    "kaggle.com",
    "raw.githubusercontent.com",
    "archive.ics.uci.edu",
    "datahub.io",
    "people.sc.fsu.edu",
    "data.gov",
    "openml.org",
    "storage.googleapis.com"
}

# Supported file extensions
SUPPORTED_EXTENSIONS = {".csv", ".tsv", ".xlsx"}


def is_approved_domain(url: str) -> bool:
    """Check if the URL is from an approved domain (exact or subdomain match)."""
    netloc = urlparse(url).netloc.lower()
    domain = netloc.split(":")[0]  
    return any(domain == approved or domain.endswith(f".{approved}") for approved in APPROVED_DOMAINS)


def get_file_extension(url: str) -> str:
    """Extract the file extension from the URL."""
    path = urlparse(url).path
    return path[path.rfind("."):].lower() if "." in path else ""


def is_supported_extension(ext: str) -> bool:
    """Check if the file extension is supported."""
    return ext in SUPPORTED_EXTENSIONS
