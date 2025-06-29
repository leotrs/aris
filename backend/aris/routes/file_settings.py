"""Routes for file settings."""

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from .. import current_user, get_db
from ..crud import (
    DefaultSettingsResponse,
    FileSettingsBase,
    FileSettingsDB,
    FileSettingsResponse,
)
from ..models import User


router = APIRouter(prefix="/settings", tags=["file", "settings"])


@router.post("/defaults", response_model=DefaultSettingsResponse)
async def upsert_default_settings(
    settings_data: FileSettingsBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_user),
):
    """Create or update default settings for the current user."""
    settings = await FileSettingsDB.upsert_default_settings(settings_data, current_user.id, db)
    return settings


@router.get("/defaults", response_model=DefaultSettingsResponse)
async def get_default_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_user),
):
    """Get default display settings for the current user."""
    settings = await FileSettingsDB.get_default_settings(current_user.id, db)

    if not settings:
        # Return default values without persisting
        return DefaultSettingsResponse(
            user_id=current_user.id,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

    return settings


@router.get("/{file_id}", response_model=FileSettingsResponse)
async def get_file_settings(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_user),
):
    """Get display settings for a specific file for the current user."""
    settings = await FileSettingsDB.get_file_settings(file_id, current_user.id, db)

    if not settings:
        settings = FileSettingsResponse(  # type: ignore
            file_id=file_id,
            user_id=current_user.id,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

    return settings


@router.post("/{file_id}", response_model=FileSettingsResponse)
async def upsert_file_settings(
    file_id: int,
    settings_data: FileSettingsBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_user),
):
    """Create or update file settings in a single operation."""
    # Verify file access
    has_access = await FileSettingsDB.verify_file_access(file_id, current_user.id, db)
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found or access denied"
        )

    settings = await FileSettingsDB.upsert_file_settings(
        file_id, settings_data, current_user.id, db
    )
    return settings
