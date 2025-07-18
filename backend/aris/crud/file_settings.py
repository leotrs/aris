"""CRUD operations for file settings."""

from datetime import UTC, datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import File, FileSettings


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
    model_config = ConfigDict(from_attributes=True)


class DefaultSettingsResponse(FileSettingsBase):
    user_id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class FileSettingsDB:
    @staticmethod
    async def get_default_settings(user_id: int, db: AsyncSession) -> Optional[FileSettings]:
        """Get default settings for a user"""
        query = select(FileSettings).where(
            FileSettings.file_id.is_(None),
            FileSettings.user_id == user_id,
            FileSettings.deleted_at.is_(None),
        )
        result: Result[Any] = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def upsert_default_settings(
        settings_data: FileSettingsBase, user_id: int, db: AsyncSession
    ) -> FileSettings:
        """Create or update default settings for a user"""
        settings = await FileSettingsDB.get_default_settings(user_id, db)

        if settings:
            # Update existing
            for field, value in settings_data.model_dump().items():
                setattr(settings, field, value)
            settings.updated_at = datetime.now(UTC)
            
            # Ensure settings is properly tracked in current session
            db.add(settings)
        else:
            # Create new
            settings = FileSettings(
                file_id=None,  # NULL for default settings
                user_id=user_id,
                **settings_data.model_dump(),
            )
            db.add(settings)

        try:
            await db.commit()
            await db.refresh(settings)
        except Exception as e:
            await db.rollback()
            # Handle case where settings were deleted/modified between read and update
            if "StaleDataError" in str(type(e)) or "expected to update 1 row" in str(e):
                from fastapi import HTTPException
                raise HTTPException(status_code=404, detail="Settings no longer exist or were modified by another operation")
            raise
        return settings

    @staticmethod
    async def get_file_settings(
        file_id: int, user_id: int, db: AsyncSession
    ) -> Optional[FileSettings]:
        """Get settings for a specific file and user"""
        query = select(FileSettings).where(
            FileSettings.file_id == file_id,
            FileSettings.user_id == user_id,
            FileSettings.deleted_at.is_(None),
        )
        result: Result[Any] = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def verify_file_access(file_id: int, user_id: int, db: AsyncSession) -> bool:
        """Verify that a user has access to a specific file"""
        file_query = select(File).where(
            File.id == file_id, File.owner_id == user_id, File.deleted_at.is_(None)
        )
        file_result: Result[Any] = await db.execute(file_query)
        return file_result.scalar_one_or_none() is not None

    @staticmethod
    async def upsert_file_settings(
        file_id: int, settings_data: FileSettingsBase, user_id: int, db: AsyncSession
    ) -> FileSettings:
        """Create or update settings for a specific file"""
        settings = await FileSettingsDB.get_file_settings(file_id, user_id, db)

        if settings:
            # Update existing
            for field, value in settings_data.model_dump().items():
                setattr(settings, field, value)
            settings.updated_at = datetime.now(UTC)
        else:
            # Create new
            settings = FileSettings(file_id=file_id, user_id=user_id, **settings_data.model_dump())
            db.add(settings)

        await db.commit()
        await db.refresh(settings)
        return settings
