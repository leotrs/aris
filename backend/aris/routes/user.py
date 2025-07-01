import base64
import json
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


@router.get("/export-data")
async def export_user_data(
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(current_user)
):
    """Export all user data in JSON format.

    Returns
    -------
    Response
        JSON file download containing all user data including files, settings, tags, etc.

    Notes
    -----
    Exports complete user data for backup or migration purposes.
    Includes manuscripts, settings, tags, file assets, and account information.
    """
    try:
        # Get user with all related data
        query = (
            select(User)
            .options(
                selectinload(User.files).selectinload_all(),
                selectinload(User.tags),
                selectinload(User.file_settings),
                selectinload(User.user_settings),
                selectinload(User.file_assets),
                selectinload(User.profile_picture)
            )
            .where(User.id == current_user.id, User.deleted_at.is_(None))
        )
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Build export data structure
        export_data = {
            "export_info": {
                "exported_at": datetime.now(UTC).isoformat(),
                "user_id": user.id,
                "format_version": "1.0"
            },
            "user_profile": {
                "name": user.name,
                "email": user.email,
                "initials": user.initials,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "last_login": user.last_login.isoformat() if user.last_login else None,
                "avatar_color": user.avatar_color.value if user.avatar_color else None
            },
            "files": [],
            "tags": [],
            "user_settings": None,
            "file_settings": [],
            "file_assets": []
        }

        # Add files
        for file in user.files:
            if not file.deleted_at:
                export_data["files"].append({
                    "id": file.id,
                    "title": file.title,
                    "source": file.source,
                    "abstract": file.abstract,
                    "keywords": file.keywords,
                    "status": file.status.value if file.status else None,
                    "doi": file.doi,
                    "created_at": file.created_at.isoformat() if file.created_at else None,
                    "last_edited_at": file.last_edited_at.isoformat() if file.last_edited_at else None
                })

        # Add tags
        for tag in user.tags:
            if not tag.deleted_at:
                export_data["tags"].append({
                    "id": tag.id,
                    "name": tag.name,
                    "color": tag.color,
                    "created_at": tag.created_at.isoformat() if tag.created_at else None
                })

        # Add user settings
        if user.user_settings and not user.user_settings.deleted_at:
            settings = user.user_settings
            export_data["user_settings"] = {
                "auto_save_interval": settings.auto_save_interval,
                "focus_mode_auto_hide": settings.focus_mode_auto_hide,
                "sidebar_auto_collapse": settings.sidebar_auto_collapse,
                "drawer_default_annotations": settings.drawer_default_annotations,
                "drawer_default_margins": settings.drawer_default_margins,
                "drawer_default_settings": settings.drawer_default_settings,
                "sound_notifications": settings.sound_notifications,
                "auto_compile_delay": settings.auto_compile_delay,
                "mobile_menu_behavior": settings.mobile_menu_behavior,
                "allow_anonymous_feedback": settings.allow_anonymous_feedback,
                "email_digest_frequency": settings.email_digest_frequency,
                "notification_preference": settings.notification_preference,
                "notification_mentions": settings.notification_mentions,
                "notification_comments": settings.notification_comments,
                "notification_shares": settings.notification_shares,
                "notification_system": settings.notification_system,
                "created_at": settings.created_at.isoformat() if settings.created_at else None,
                "updated_at": settings.updated_at.isoformat() if settings.updated_at else None
            }

        # Add file settings
        for file_setting in user.file_settings:
            if not file_setting.deleted_at:
                export_data["file_settings"].append({
                    "file_id": file_setting.file_id,
                    "background": file_setting.background,
                    "font_size": file_setting.font_size,
                    "line_height": file_setting.line_height,
                    "font_family": file_setting.font_family,
                    "margin_width": file_setting.margin_width,
                    "columns": file_setting.columns,
                    "created_at": file_setting.created_at.isoformat() if file_setting.created_at else None,
                    "updated_at": file_setting.updated_at.isoformat() if file_setting.updated_at else None
                })

        # Add file assets (without binary content for size reasons)
        for asset in user.file_assets:
            if not asset.deleted_at:
                export_data["file_assets"].append({
                    "id": asset.id,
                    "file_id": asset.file_id,
                    "filename": asset.filename,
                    "mime_type": asset.mime_type,
                    "uploaded_at": asset.uploaded_at.isoformat() if asset.uploaded_at else None,
                    "note": "Binary content excluded from export for file size reasons"
                })

        # Create JSON response
        json_data = json.dumps(export_data, indent=2, ensure_ascii=False)
        
        timestamp = datetime.now(UTC).strftime("%Y-%m-%d")
        filename = f"aris-data-export-{timestamp}.json"
        
        return Response(
            content=json_data,
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Type": "application/json; charset=utf-8"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export data: {str(e)}")
