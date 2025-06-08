from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime
import base64

from .. import models, get_db, current_user
from ..models import FileAsset

router = APIRouter(prefix="/assets", tags=["files", "assets"], dependencies=[Depends(current_user)])


class FileAssetCreate(BaseModel):
    filename: str
    mime_type: str
    content: str
    file_id: int

    @field_validator("content")
    @classmethod
    def validate_content(cls, v, values):
        mime = values.get("mime_type", "")
        if mime.startswith("image/"):
            try:
                base64.b64decode(v)
            except TypeError:
                raise ValueError("Invalid base64 content for image MIME type.")
        return v


class FileAssetUpdate(BaseModel):
    filename: str | None = None
    content: str | None = None
    deleted_at: datetime | None = None

    @field_validator("content")
    @classmethod
    def validate_optional_content(cls, v):
        if v is None:
            return v
        try:
            base64.b64decode(v)
        except TypeError:
            print("Content is not base64 decodable")
        return v


class FileAssetOut(BaseModel):
    id: int
    filename: str
    mime_type: str
    content: str
    uploaded_at: datetime
    deleted_at: datetime | None
    file_id: int


async def get_user_asset_or_404(asset_id: int, user_id: int, db: AsyncSession):
    asset = await db.get(FileAsset, asset_id)
    if not asset or asset.owner_id != user_id or asset.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("", response_model=FileAssetOut)
async def upload_asset(
    payload: FileAssetCreate, db: AsyncSession = Depends(get_db), user=Depends(current_user)
):
    new_asset = FileAsset(
        filename=payload.filename,
        mime_type=payload.mime_type,
        content=payload.content,
        file_id=payload.file_id,
        owner_id=user.id,
    )
    db.add(new_asset)
    await db.commit()
    await db.refresh(new_asset)
    return new_asset


@router.get("", response_model=List[FileAssetOut])
async def list_assets(db: AsyncSession = Depends(get_db), user=Depends(current_user)):
    result = await db.execute(
        models.select(FileAsset).where(
            FileAsset.owner_id == user.id, FileAsset.deleted_at.is_(None)
        )
    )
    return result.scalars().all()


@router.get("/{asset_id}", response_model=FileAssetOut)
async def get_asset(asset_id: int, db: AsyncSession = Depends(get_db), user=Depends(current_user)):
    return await get_user_asset_or_404(asset_id, user.id, db)


@router.put("/{asset_id}", response_model=FileAssetOut)
async def update_asset(
    asset_id: int,
    payload: FileAssetUpdate,
    db: AsyncSession = Depends(get_db),
    user=Depends(current_user),
):
    asset = await get_user_asset_or_404(asset_id, user.id, db)

    if payload.filename is not None:
        asset.filename = payload.filename
    if payload.content is not None:
        asset.content = payload.content
    if payload.deleted_at is not None:
        asset.deleted_at = payload.deleted_at

    await db.commit()
    await db.refresh(asset)
    return asset


@router.delete("/{asset_id}")
async def soft_delete_asset(
    asset_id: int, db: AsyncSession = Depends(get_db), user=Depends(current_user)
):
    asset = await get_user_asset_or_404(asset_id, user.id, db)
    asset.deleted_at = datetime.now(UTC)
    await db.commit()
    return {"message": f"Asset {asset_id} soft deleted"}
