"""File service package for managing files in memory and persistence."""

from typing import Optional

from .interface import FileServiceInterface
from .memory_service import InMemoryFileService
from .models import FileCreateData, FileData, FileUpdateData


# Global singleton instance (will be initialized by deps.py)
file_service_instance: Optional[InMemoryFileService] = None

# Auto-sync functionality flag (for future implementation)
auto_sync_enabled: bool = False


__all__ = [
    "FileServiceInterface",
    "FileData", 
    "FileCreateData",
    "FileUpdateData",
    "InMemoryFileService",
    "file_service_instance",
    "auto_sync_enabled",
]