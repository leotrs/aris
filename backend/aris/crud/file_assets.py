import base64
import binascii
from datetime import UTC, datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import FileAsset


class FileAssetCreate(BaseModel):
    filename: str
    mime_type: str
    content: str
    file_id: int

    @field_validator("content")
    @classmethod
    def validate_content(cls, v, info):
        mime = info.data.get("mime_type", "") if info.data else ""
        if mime.startswith("image/"):
            try:
                base64.b64decode(v)
            except (TypeError, binascii.Error):
                raise ValueError("Invalid base64-encoded string")
        return v


class FileAssetUpdate(BaseModel):
    filename: str | None = None
    content: str | None = None
    deleted_at: datetime | None = None

    @classmethod
    def validate_optional_content(cls, v):
        if v is None:
            return v
        try:
            base64.b64decode(v)
        except (TypeError, binascii.Error):
            print("Content is not base64 decodable")
        return v

    @field_validator("content")
    @classmethod
    def validate_content_strict(cls, v):
        if v is None:
            return v
        try:
            base64.b64decode(v)
        except (TypeError, binascii.Error):
            raise ValueError("Invalid base64-encoded string")
        return v


class FileAssetOut(BaseModel):
    id: int
    filename: str
    mime_type: str
    content: str
    uploaded_at: datetime
    deleted_at: datetime | None
    file_id: int


class FileAssetDB:
    @staticmethod
    async def get_user_asset(asset_id: int, user_id: int, db: AsyncSession) -> Optional[FileAsset]:
        """Get a user's asset by ID, excluding soft-deleted assets"""
        asset = await db.get(FileAsset, asset_id)
        if not asset or asset.owner_id != user_id or asset.deleted_at is not None:
            return None
        return asset

    @staticmethod
    async def create_asset(payload: FileAssetCreate, user_id: int, db: AsyncSession) -> FileAsset:
        """Create a new file asset"""
        new_asset = FileAsset(
            filename=payload.filename,
            mime_type=payload.mime_type,
            content=payload.content,
            file_id=payload.file_id,
            owner_id=user_id,
        )
        db.add(new_asset)
        await db.commit()
        await db.refresh(new_asset)
        return new_asset

    @staticmethod
    async def list_user_assets(user_id: int, db: AsyncSession) -> List[FileAsset]:
        """List all non-deleted assets for a user"""
        result = await db.execute(
            select(FileAsset).where(FileAsset.owner_id == user_id, FileAsset.deleted_at.is_(None))
        )
        return result.scalars().all()

    @staticmethod
    async def update_asset(
        asset: FileAsset, payload: FileAssetUpdate, db: AsyncSession
    ) -> FileAsset:
        """Update an existing asset"""
        if payload.filename is not None:
            asset.filename = payload.filename
        if payload.content is not None:
            asset.content = payload.content
        if payload.deleted_at is not None:
            asset.deleted_at = payload.deleted_at
        await db.commit()
        await db.refresh(asset)
        return asset

    @staticmethod
    async def soft_delete_asset(asset: FileAsset, db: AsyncSession) -> None:
        """Soft delete an asset by setting deleted_at timestamp"""
        asset.deleted_at = datetime.now(UTC)
        await db.commit()
