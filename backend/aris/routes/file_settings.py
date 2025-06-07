from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from ..models import FileSettings, File, User
from .. import get_db, current_user

router = APIRouter(prefix="/settings", tags=["file", "settings"])


class FileSettingsBase(BaseModel):
    background: str = "var(--surface-page)"
    font_size: str = "16px"
    line_height: str = "1.5"
    font_family: str = "Source Sans 3"
    margin_width: str = "16px"
    columns: int = 1


class FileSettingsResponse(FileSettingsBase):
    file_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("/{file_id}", response_model=FileSettingsResponse)
async def get_file_settings(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_user),
):
    """Get display settings for a specific file for the current user."""
    query = select(FileSettings).where(
        FileSettings.file_id == file_id,
        FileSettings.user_id == current_user.id,
        FileSettings.deleted_at.is_(None),
    )
    result = await db.execute(query)
    settings = result.scalar_one_or_none()

    if not settings:
        # Fall back to user defaults
        default_query = select(FileSettings).where(
            FileSettings.file_id.is_(None),
            FileSettings.user_id == current_user.id,
            FileSettings.deleted_at.is_(None),
        )
        default_result = await db.execute(default_query)
        default_settings = default_result.scalar_one_or_none()

        if default_settings:
            # Create response using default values
            settings = FileSettingsResponse(
                file_id=file_id,
                user_id=current_user.id,
                background=default_settings.background,
                font_size=default_settings.font_size,
                line_height=default_settings.line_height,
                font_family=default_settings.font_family,
                margin_width=default_settings.margin_width,
                columns=default_settings.columns,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
        else:
            # Use hardcoded defaults
            settings = FileSettingsResponse(
                file_id=file_id,
                user_id=current_user.id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
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
    file_query = select(File).where(
        File.id == file_id, File.owner_id == current_user.id, File.deleted_at.is_(None)
    )
    file_result = await db.execute(file_query)
    if not file_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found or access denied"
        )

    query = select(FileSettings).where(
        FileSettings.file_id == file_id,
        FileSettings.user_id == current_user.id,
        FileSettings.deleted_at.is_(None),
    )
    result = await db.execute(query)
    settings = result.scalar_one_or_none()

    if settings:
        # Update existing
        for field, value in settings_data.model_dump().items():
            setattr(settings, field, value)
    else:
        # Create new
        settings = FileSettings(
            file_id=file_id, user_id=current_user.id, **settings_data.model_dump()
        )
        db.add(settings)

    await db.commit()
    await db.refresh(settings)

    return settings
