import base64
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .. import crud, current_user, get_db
from ..exceptions import bad_request_exception, not_found_exception
from ..models import ProfilePicture, User


router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(current_user)])


# @router.get("")
# async def get_users(db: AsyncSession = Depends(get_db)):
#     return await crud.get_users(db)


@router.get("/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieve a specific user by ID.

    Parameters
    ----------
    user_id : int
        The unique identifier of the user to retrieve.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    User
        The user object if found.

    Raises
    ------
    HTTPException
        404 error if user is not found or has been deleted.

    Notes
    -----
    Requires authentication. Only returns non-deleted users.
    """
    user = await crud.get_user(user_id, db)
    if not user:
        raise not_found_exception("User", user_id)
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
    """Update user profile information.

    Parameters
    ----------
    user_id : int
        The unique identifier of the user to update.
    update : UserUpdate
        Updated user data including name, initials, and email.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    User
        The updated user object.

    Raises
    ------
    HTTPException
        404 error if user is not found.

    Notes
    -----
    Requires authentication. Updates only the provided fields.
    """
    user = await crud.update_user(user_id, update.name, update.initials, update.email, db)
    if not user:
        raise not_found_exception("User", user_id)
    return user


@router.delete("/{user_id}")
async def soft_delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Soft delete a user account.

    Parameters
    ----------
    user_id : int
        The unique identifier of the user to delete.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    dict
        Success message confirming the deletion.

    Raises
    ------
    HTTPException
        404 error if user is not found.

    Notes
    -----
    Requires authentication. Sets deleted_at timestamp instead of
    permanently removing the record.
    """
    user = await crud.soft_delete_user(user_id, db)
    if not user:
        raise not_found_exception("User", user_id)
    return {"message": f"User {user_id} soft deleted"}


@router.get("/{user_id}/files")
async def get_user_files(
    user_id: int,
    with_tags: bool = True,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve all files owned by a user.

    Parameters
    ----------
    user_id : int
        The unique identifier of the user whose files to retrieve.
    with_tags : bool, optional
        Whether to include tag information for each file (default: True).
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    list of dict
        List of file objects with metadata and optional tags.

    Raises
    ------
    HTTPException
        404 error if user is not found.

    Notes
    -----
    Requires authentication. Returns files ordered by last edited date.
    """
    try:
        return await crud.get_user_files(user_id, with_tags, db)
    except ValueError:
        raise not_found_exception("User", user_id)


@router.get("/{user_id}/files/{file_id}")
async def get_user_file(
    user_id: int,
    file_id: int,
    with_tags: bool = True,
    with_minimap: bool = True,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve a specific file owned by a user.

    Parameters
    ----------
    user_id : int
        The unique identifier of the user who owns the file.
    file_id : int
        The unique identifier of the file to retrieve.
    with_tags : bool, optional
        Whether to include tag information (default: True).
    with_minimap : bool, optional
        Whether to include minimap section content (default: True).
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    dict
        File object with metadata, content, and optional tags/minimap.

    Raises
    ------
    HTTPException
        404 error if user or file is not found.

    Notes
    -----
    Requires authentication. Includes extracted title and optional metadata.
    """
    try:
        return await crud.get_user_file(user_id, file_id, with_tags, with_minimap, db)
    except ValueError as e:
        # The ValueError from CRUD contains specific information about what wasn't found
        if "User" in str(e):
            raise not_found_exception("User", user_id)
        elif "File" in str(e):
            raise not_found_exception("File", file_id)
        else:
            raise bad_request_exception(str(e))


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
    """Upload or update a user's profile picture.

    Parameters
    ----------
    user_id : int
        The unique identifier of the user whose avatar to update.
    avatar : UploadFile
        Image file upload (JPEG, PNG, GIF, or WebP format).
    db : AsyncSession
        SQLAlchemy async database session dependency.
    current_user : User
        Current authenticated user dependency.

    Returns
    -------
    dict
        Success message with new picture ID.

    Raises
    ------
    HTTPException
        403 error if user is not authorized to update this profile.
        400 error if file type is invalid or file is too large.
        404 error if user is not found.
        500 error if upload fails.

    Notes
    -----
    Maximum file size is 5MB. Allowed formats: JPEG, PNG, GIF, WebP.
    Soft deletes existing profile picture before creating new one.
    Stores image as base64-encoded content in database.
    """
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
    """Retrieve a user's profile picture.

    Parameters
    ----------
    user_id : int
        The unique identifier of the user whose avatar to retrieve.
    db : AsyncSession
        SQLAlchemy async database session dependency.
    current_user : User
        Current authenticated user dependency.

    Returns
    -------
    Response
        Image file response with appropriate Content-Type and caching headers.

    Raises
    ------
    HTTPException
        403 error if user is not authorized to retrieve this profile.
        404 error if user or profile picture is not found.
        500 error if image data is corrupted.

    Notes
    -----
    Returns binary image data with appropriate MIME type.
    Includes caching headers for better performance.
    Only allows users to retrieve their own profile pictures.
    """
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
    """Delete a user's profile picture (soft delete).

    Parameters
    ----------
    user_id : int
        The unique identifier of the user whose avatar to delete.
    db : AsyncSession
        SQLAlchemy async database session dependency.
    current_user : User
        Current authenticated user dependency.

    Returns
    -------
    dict
        Success message confirming the deletion.

    Raises
    ------
    HTTPException
        403 error if user is not authorized to delete this profile.
        404 error if user or profile picture is not found.
        500 error if deletion fails.

    Notes
    -----
    Performs soft delete by setting deleted_at timestamp.
    Clears the profile_picture_id reference from the user record.
    Only allows users to delete their own profile pictures.
    """
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
        user.profile_picture_id = None  # type: ignore
        await db.commit()
        return {"message": "Profile picture deleted successfully"}

    except HTTPException:
        raise
    except ValueError:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete profile picture")
