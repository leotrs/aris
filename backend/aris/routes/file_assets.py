"""Routes to manage file assets (pictures, extra rsm files, etc)."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from .. import get_db, current_user
from ..crud import FileAssetCreate, FileAssetUpdate, FileAssetOut, FileAssetDB


router = APIRouter(prefix="/assets", tags=["files", "assets"], dependencies=[Depends(current_user)])


async def get_user_asset_or_404(asset_id: int, user_id: int, db: AsyncSession):
    asset = await FileAssetDB.get_user_asset(asset_id, user_id, db)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("", response_model=FileAssetOut)
async def upload_asset(
    payload: FileAssetCreate, db: AsyncSession = Depends(get_db), user=Depends(current_user)
):
    new_asset = await FileAssetDB.create_asset(payload, user.id, db)
    return new_asset


@router.get("", response_model=List[FileAssetOut])
async def list_assets(db: AsyncSession = Depends(get_db), user=Depends(current_user)):
    assets = await FileAssetDB.list_user_assets(user.id, db)
    return assets


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
    updated_asset = await FileAssetDB.update_asset(asset, payload, db)
    return updated_asset


@router.delete("/{asset_id}")
async def soft_delete_asset(
    asset_id: int, db: AsyncSession = Depends(get_db), user=Depends(current_user)
):
    asset = await get_user_asset_or_404(asset_id, user.id, db)
    await FileAssetDB.soft_delete_asset(asset, db)
    return {"message": f"Asset {asset_id} soft deleted"}
