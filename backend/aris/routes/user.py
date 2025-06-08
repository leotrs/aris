import base64
from datetime import datetime, UTC
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from .. import crud, get_db, current_user
from ..models import File, User, ProfilePicture


router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(current_user)])


# @router.get("")
# async def get_users(db: AsyncSession = Depends(get_db)):
#     return await crud.get_users(db)


@router.get("/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


class UserUpdate(BaseModel):
    name: str
    initials: str
    email: str


@router.put("/{user_id}")
async def update_user(
    user_id: int,
    update: UserUpdate,
    db: AsyncSession = Depends(get_db),
):
    user = await crud.update_user(user_id, update.name, update.initials, update.email, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def soft_delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await crud.soft_delete_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {user_id} soft deleted"}


@router.get("/{user_id}/files")
async def get_user_files(
    user_id: int,
    with_tags: bool = True,
    db: AsyncSession = Depends(get_db),
):
    return await crud.get_user_files(user_id, with_tags, db)


@router.get("/{user_id}/files/{doc_id}")
async def get_user_file(
    user_id: int,
    doc_id: int,
    with_tags: bool = True,
    with_minimap: bool = True,
    db: AsyncSession = Depends(get_db),
):
    return await crud.get_user_file(user_id, doc_id, with_tags, with_minimap, db)


# Maximum file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024
# Allowed MIME types
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}


@router.post("/{user_id}/avatar")
async def upload_profile_picture(
    user_id: int,
    avatar: UploadFile = File(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_user),
):
    """Upload or update a user's profile picture."""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    if avatar.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}",
        )

    # Read file content
    content = await avatar.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size too large. Maximum allowed: {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )
    base64_content = base64.b64encode(content).decode("utf-8")

    try:
        # Get the user
        query = (
            select(User)
            .options(selectinload(User.profile_picture))
            .where(User.id == user_id, User.deleted_at.is_(None))
        )
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Soft delete existing profile picture if it exists
        if user.profile_picture and not user.profile_picture.deleted_at:
            user.profile_picture.deleted_at = datetime.now(UTC)

        # Create new profile picture
        new_picture = ProfilePicture(
            filename=avatar.filename, mime_type=avatar.content_type, content=base64_content
        )
        db.add(new_picture)
        await db.flush()  # Get the ID without committing
        user.profile_picture_id = new_picture.id
        await db.commit()
        await db.refresh(new_picture)

        return {
            "message": "Profile picture uploaded successfully",
            "picture_id": new_picture.id,
        }

    except TypeError:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to upload profile picture")


@router.get("/{user_id}/avatar")
async def get_profile_picture(
    user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(current_user)
):
    """Retrieve a user's profile picture."""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to retrieve this profile")

    query = (
        select(User)
        .options(selectinload(User.profile_picture))
        .where(User.id == user_id, User.deleted_at.is_(None))
    )
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.profile_picture or user.profile_picture.deleted_at:
        raise HTTPException(status_code=404, detail="Profile picture not found")
    profile_picture = user.profile_picture

    try:
        image_data = base64.b64decode(profile_picture.content)
    except ValueError:
        raise HTTPException(status_code=500, detail="Invalid image data")

    return Response(
        content=image_data,
        media_type=profile_picture.mime_type,
        headers={
            "Content-Disposition": f"inline; filename={profile_picture.filename}",
            "Cache-Control": "public, max-age=3600",
        },
    )


@router.delete("/{user_id}/avatar")
async def delete_profile_picture(
    user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(current_user)
):
    """Delete a user's profile picture (soft delete)."""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this profile")

    try:
        query = select(User).options(selectinload(User.profile_picture)).where(User.id == user_id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not user.profile_picture or user.profile_picture.deleted_at:
            raise HTTPException(status_code=404, detail="Profile picture not found")

        # Soft delete the profile picture
        user.profile_picture.deleted_at = datetime.now(UTC)
        user.profile_picture_id = None
        await db.commit()
        return {"message": "Profile picture deleted successfully"}

    except HTTPException:
        raise
    except ValueError:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete profile picture")
