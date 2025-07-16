from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import current_user, get_db, get_file_service
from ..crud.utils import assign_public_uuid_with_retry_async
from ..exceptions import bad_request_exception, forbidden_exception, not_found_exception
from ..models import FileAsset
from ..models.models import File as DbFile
from ..models.models import FileStatus
from ..services.file_service import FileCreateData, FileUpdateData, InMemoryFileService
from .file_assets import FileAssetOut


router = APIRouter(prefix="/files", tags=["files"], dependencies=[Depends(current_user)])


def _validate_source(model):
    """Validate RSM source format.

    Parameters
    ----------
    model : BaseModel
        Model containing source attribute to validate.

    Returns
    -------
    BaseModel
        The validated model object.

    Raises
    ------
    ValueError
        If source format is invalid (must start with ':rsm:' and end with '::').

    Notes
    -----
    RSM (Research Source Markup) requires specific formatting markers.
    Empty or None source values are allowed and skip validation.
    """
    if not model.source:
        return model
    if not model.source.strip().startswith(":rsm:"):
        raise ValueError("Malformed RSM source.")
    if not model.source.strip().endswith("::"):
        raise ValueError("Malformed RSM source.")
    return model


class FileCreate(BaseModel):
    title: str = ""
    abstract: str = ""
    owner_id: int
    source: str

    def validate_source(self):
        return _validate_source(self)


class FileUpdate(BaseModel):
    title: str = ""
    abstract: str = ""
    owner_id: int | None = None
    source: str = ""

    def validate_source(self):
        if self.source:
            _validate_source(self)
        return self


class FileStatusUpdate(BaseModel):
    status: str

    def validate_status(self):
        valid_statuses = {"draft", "under_review", "published", "withdrawn"}
        if self.status.lower() not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
        return self


class PublicationInfoResponse(BaseModel):
    id: int
    status: str
    is_published: bool
    can_publish: bool
    published_at: str | None
    public_uuid: str | None
    permalink_slug: str | None
    version: int
    can_withdraw: bool

    model_config = {"from_attributes": True}


class PublicationResponse(BaseModel):
    id: int
    status: str
    published_at: str | None
    public_uuid: str | None
    message: str

    model_config = {"from_attributes": True}


@router.get("")
async def get_files(
    file_service: InMemoryFileService = Depends(get_file_service),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all files with extracted titles.

    Parameters
    ----------
    file_service : InMemoryFileService
        File service dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    list of FileData
        List of all non-deleted files with title attributes populated.

    Notes
    -----
    Requires authentication. Uses file service for in-memory access.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Get files from memory
    files = await file_service.get_all_files()
    
    # Convert to response format with extracted titles
    result = []
    for f in files:
        title = await file_service.get_file_title(f.id)
        result.append({
            "id": f.id,
            "title": title or f.title,  # Use extracted title or fallback to original
            "abstract": f.abstract,
            "last_edited_at": f.last_edited_at,
            "source": f.source,
            "owner_id": f.owner_id,
            "status": f.status.value,
            "created_at": f.created_at,
        })
    return result


@router.post("")
async def create_file(
    doc: FileCreate,
    file_service: InMemoryFileService = Depends(get_file_service),
    db: AsyncSession = Depends(get_db),
):
    """Create a new file with RSM source content.

    Parameters
    ----------
    doc : FileCreate
        File creation data including source, owner_id, title, and abstract.
    file_service : InMemoryFileService
        File service dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    dict
        Dictionary containing the new file's ID.

    Raises
    ------
    HTTPException
        400 error if RSM source format is invalid.

    Notes
    -----
    Requires authentication. Validates RSM source format before creation.
    Sets file status to DRAFT by default.
    """
    try:
        doc.validate_source()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Create file data
    create_data = FileCreateData(
        title=doc.title,
        abstract=doc.abstract,
        source=doc.source,
        owner_id=doc.owner_id
    )
    
    # Create in memory
    result = await file_service.create_file(create_data)
    
    # Save to database
    await file_service.save_file_to_database(result.id, db)
    
    return {"id": result.id}


@router.get("/{file_id}")
async def get_file(
    file_id: int, 
    file_service: InMemoryFileService = Depends(get_file_service),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve a specific file by ID.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to retrieve.
    file_service : InMemoryFileService
        File service dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    dict
        File information including id, title, abstract, source, and metadata.

    Raises
    ------
    HTTPException
        404 error if file is not found or has been deleted.

    Notes
    -----
    Requires authentication. Uses file service for in-memory access.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Get file from memory
    doc = await file_service.get_file(file_id)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Get extracted title
    title = await file_service.get_file_title(file_id)
    
    return {
        "id": file_id,
        "title": title or doc.title,  # Use extracted title or fallback to original
        "abstract": doc.abstract,
        "last_edited_at": doc.last_edited_at,
        "source": doc.source,
        "owner_id": doc.owner_id,
        "status": doc.status.value,
        "created_at": doc.created_at,
    }


@router.put("/{file_id}")
async def update_file(
    file_id: int,
    file_data: FileUpdate,
    file_service: InMemoryFileService = Depends(get_file_service),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing file's content and metadata.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to update.
    file_data : FileUpdate
        Updated file data including title, abstract, and source.
    file_service : InMemoryFileService
        File service dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    FileData
        The updated file object.

    Raises
    ------
    HTTPException
        404 error if file is not found.

    Notes
    -----
    Requires authentication. Uses file service for in-memory updates.
    """
    # Validate source if provided
    if file_data.source:
        try:
            file_data.validate_source()
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Create update data
    update_data = FileUpdateData(
        title=file_data.title if file_data.title else None,
        abstract=file_data.abstract if file_data.abstract else None,
        source=file_data.source if file_data.source else None
    )
    
    # Update in memory
    doc = await file_service.update_file(file_id, update_data)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Save to database
    await file_service.update_file_in_database(file_id, db)
    
    # Get extracted title
    title = await file_service.get_file_title(file_id)
    
    return {
        "id": doc.id,
        "title": title or doc.title,  # Use extracted title or fallback to original
        "abstract": doc.abstract,
        "last_edited_at": doc.last_edited_at,
        "source": doc.source,
        "owner_id": doc.owner_id,
        "status": doc.status.value,
        "created_at": doc.created_at,
    }


@router.delete("/{file_id}")
async def soft_delete_file(
    file_id: int, 
    file_service: InMemoryFileService = Depends(get_file_service),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a file by setting deleted_at timestamp.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to delete.
    file_service : InMemoryFileService
        File service dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    dict
        Success message confirming the deletion.

    Raises
    ------
    HTTPException
        404 error if file is not found.

    Notes
    -----
    Requires authentication. Uses file service for in-memory soft delete.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Delete in memory
    deleted = await file_service.delete_file(file_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Save to database
    await file_service.delete_file_in_database(file_id, db)
    
    return {"message": f"File {file_id} soft deleted"}


@router.post("/{file_id}/duplicate")
async def duplicate_file(
    file_id: int, 
    file_service: InMemoryFileService = Depends(get_file_service),
    db: AsyncSession = Depends(get_db)
):
    """Create a duplicate copy of an existing file.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to duplicate.
    file_service : InMemoryFileService
        File service dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    dict
        Dictionary containing new file ID and success message.

    Raises
    ------
    HTTPException
        404 error if original file is not found.

    Notes
    -----
    Requires authentication. Uses file service for in-memory duplication
    and copies tags from the original file.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Duplicate in memory
    new_doc = await file_service.duplicate_file(file_id)
    if not new_doc:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Save to database
    await file_service.save_file_to_database(new_doc.id, db)
    
    # Copy tags from original file (using original logic)
    from ..models.models import file_tags
    tag_ids = (
        await db.execute(file_tags.select().where(file_tags.c.file_id == file_id))
    ).fetchall()
    if tag_ids:
        await db.execute(
            file_tags.insert(),
            [{"file_id": new_doc.id, "tag_id": tag.tag_id} for tag in tag_ids],
        )
        await db.commit()
    
    return {"id": new_doc.id, "message": "File duplicated successfully"}


@router.get("/{file_id}/content", response_class=HTMLResponse)
async def get_file_html(
    file_id: int, 
    file_service: InMemoryFileService = Depends(get_file_service),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve rendered HTML content for a file.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to render.
    file_service : InMemoryFileService
        File service dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    HTMLResponse
        Rendered HTML content with handrails enabled.

    Raises
    ------
    HTTPException
        404 error if file is not found.

    Notes
    -----
    Requires authentication. Uses file service for cached HTML rendering.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Get HTML from file service (with caching)
    html = await file_service.get_file_html(file_id)
    if not html:
        raise HTTPException(status_code=404, detail="File not found")
    
    return HTMLResponse(content=html)


@router.get("/{file_id}/content/{section_name}", response_class=HTMLResponse)
async def get_file_section(
    file_id: int,
    section_name: str,
    handrails: bool = True,
    file_service: InMemoryFileService = Depends(get_file_service),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve rendered HTML for a specific section of a file.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file.
    section_name : str
        Name of the section to extract (e.g., 'minimap', 'abstract').
    handrails : bool, optional
        Whether to enable handrails in the rendered output (default: True).
    file_service : InMemoryFileService
        File service dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    HTMLResponse
        Rendered HTML content for the specified section.

    Raises
    ------
    HTTPException
        404 error if file or section is not found.

    Notes
    -----
    Requires authentication. Uses file service for cached section rendering.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Get section HTML from file service (with caching)
    html = await file_service.get_file_section(file_id, section_name, handrails)
    if not html:
        raise HTTPException(status_code=404, detail=f"Section {section_name} not found")
    
    return HTMLResponse(content=html)


@router.get("/{file_id}/assets", response_model=list[FileAssetOut])
async def get_assets_for_file(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    user=Depends(current_user),
):
    """Retrieve all assets associated with a file.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file whose assets to retrieve.
    db : AsyncSession
        SQLAlchemy async database session dependency.
    user : User
        Current authenticated user dependency.

    Returns
    -------
    list of FileAssetOut
        List of file assets owned by the user for the specified file.

    Notes
    -----
    Requires authentication. Only returns assets owned by the current user.
    Excludes soft-deleted assets.
    """
    result = await db.execute(
        select(FileAsset).where(
            FileAsset.file_id == file_id,
            FileAsset.owner_id == user.id,
            FileAsset.deleted_at.is_(None),
        )
    )
    assets = result.scalars().all()
    return assets


@router.post("/{file_id}/publish", response_model=PublicationResponse)
async def publish_file(
    file_id: int,
    user=Depends(current_user),
    db: AsyncSession = Depends(get_db),
    file_service: InMemoryFileService = Depends(get_file_service),
):
    """Publish a file as a public preprint.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to publish.
    user : User
        Current authenticated user dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.
    file_service : InMemoryFileService
        File service dependency.

    Returns
    -------
    PublicationResponse
        Publication confirmation with status and UUID.

    Raises
    ------
    HTTPException
        404 error if file is not found.
        403 error if user doesn't own the file.
        400 error if file cannot be published.

    Notes
    -----
    Requires authentication. Publication is permanent - once published,
    a file cannot be unpublished, only withdrawn.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Get file from database to ensure we have the latest version
    result = await db.execute(
        select(DbFile).where(
            DbFile.id == file_id,
            DbFile.deleted_at.is_(None)
        )
    )
    file = result.scalars().first()
    
    if not file:
        raise not_found_exception("File", file_id)
    
    # Check ownership
    if file.owner_id != user.id:
        raise forbidden_exception("You do not have permission to publish this file")
    
    # Check if file can be published
    if not file.can_publish():
        if file.status == FileStatus.PUBLISHED:
            raise bad_request_exception("File is already published")
        elif file.status == FileStatus.UNDER_REVIEW:
            raise bad_request_exception("File is under review and cannot be published")
        elif file.source is None or not file.source.strip():
            raise bad_request_exception("File cannot be published without source content")
        else:
            raise bad_request_exception("File cannot be published in its current state")
    
    # Generate UUID with collision detection if needed
    if not file.public_uuid:
        try:
            assigned_uuid: str = await assign_public_uuid_with_retry_async(db, file)
            file.public_uuid = assigned_uuid
        except RuntimeError as e:
            raise bad_request_exception(f"Failed to generate public UUID: {str(e)}")
    
    # Publish the file
    file.publish()
    
    # Save to database
    await db.commit()
    
    # Update file service cache
    await file_service.sync_from_database(db)
    
    return PublicationResponse(
        id=file.id,
        status=file.status.value,
        published_at=file.published_at.isoformat() if file.published_at else None,
        public_uuid=file.public_uuid,
        message="File published successfully"
    )


@router.put("/{file_id}/status", response_model=PublicationResponse)
async def update_file_status(
    file_id: int,
    status_data: FileStatusUpdate,
    user=Depends(current_user),
    db: AsyncSession = Depends(get_db),
    file_service: InMemoryFileService = Depends(get_file_service),
):
    """Update a file's publication status.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to update.
    status_data : FileStatusUpdate
        The new status data.
    user : User
        Current authenticated user dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.
    file_service : InMemoryFileService
        File service dependency.

    Returns
    -------
    PublicationResponse
        Updated publication status information.

    Raises
    ------
    HTTPException
        404 error if file is not found.
        403 error if user doesn't own the file.
        400 error if status transition is invalid.

    Notes
    -----
    Requires authentication. Some status transitions are restricted:
    - Published files cannot be unpublished, only withdrawn
    - Withdrawn files cannot be changed to other statuses
    """
    # Validate status
    try:
        status_data.validate_status()
    except ValueError as e:
        raise bad_request_exception(str(e))
    
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Get file from database
    result = await db.execute(
        select(DbFile).where(
            DbFile.id == file_id,
            DbFile.deleted_at.is_(None)
        )
    )
    file = result.scalars().first()
    
    if not file:
        raise not_found_exception("File", file_id)
    
    # Check ownership
    if file.owner_id != user.id:
        raise forbidden_exception("You do not have permission to update this file's status")
    
    # Map string status to enum
    status_mapping = {
        "draft": FileStatus.DRAFT,
        "under_review": FileStatus.UNDER_REVIEW,
        "published": FileStatus.PUBLISHED,
        "withdrawn": FileStatus.PUBLISHED  # Withdrawn is handled by a separate field in the future
    }
    
    new_status: FileStatus = status_mapping[status_data.status.lower()]
    
    # Check for invalid transitions
    if file.status == FileStatus.PUBLISHED and new_status != FileStatus.PUBLISHED:
        if status_data.status.lower() == "withdrawn":
            # For now, we'll implement withdrawal as a separate endpoint
            raise bad_request_exception("Use the withdrawal endpoint to withdraw a published file")
        else:
            raise bad_request_exception("Published files cannot be unpublished")
    
    # Handle publication
    if new_status == FileStatus.PUBLISHED:
        if not file.can_publish():
            if file.source is None or not file.source.strip():
                raise bad_request_exception("File cannot be published without source content")
            else:
                raise bad_request_exception("File cannot be published in its current state")
        
        # Generate UUID with collision detection if needed
        if not file.public_uuid:
            try:
                assigned_uuid: str = await assign_public_uuid_with_retry_async(db, file)
                file.public_uuid = assigned_uuid
            except RuntimeError as e:
                raise bad_request_exception(f"Failed to generate public UUID: {str(e)}")
        
        # Use the publish method to ensure proper timestamp setting
        file.publish()
    else:
        # Update status directly for non-publication status changes
        file.status = new_status
    
    # Save to database
    await db.commit()
    
    # Update file service cache
    await file_service.sync_from_database(db)
    
    return PublicationResponse(
        id=file.id,
        status=file.status.value,
        published_at=file.published_at.isoformat() if file.published_at else None,
        public_uuid=file.public_uuid,
        message=f"File status updated to {file.status.value}"
    )


@router.get("/{file_id}/publication-info", response_model=PublicationInfoResponse)
async def get_publication_info(
    file_id: int,
    user=Depends(current_user),
    db: AsyncSession = Depends(get_db),
    file_service: InMemoryFileService = Depends(get_file_service),
):
    """Get publication information for a file.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file.
    user : User
        Current authenticated user dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.
    file_service : InMemoryFileService
        File service dependency.

    Returns
    -------
    PublicationInfoResponse
        Publication information including status and capabilities.

    Raises
    ------
    HTTPException
        404 error if file is not found.
        403 error if user doesn't own the file.

    Notes
    -----
    Requires authentication. Returns comprehensive publication status
    information including what actions are available.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Get file from database
    result = await db.execute(
        select(DbFile).where(
            DbFile.id == file_id,
            DbFile.deleted_at.is_(None)
        )
    )
    file = result.scalars().first()
    
    if not file:
        raise not_found_exception("File", file_id)
    
    # Check ownership
    if file.owner_id != user.id:
        raise forbidden_exception("You do not have permission to view this file's publication info")
    
    # Calculate can_withdraw (published files can be withdrawn)
    can_withdraw = file.status == FileStatus.PUBLISHED
    
    return PublicationInfoResponse(
        id=file.id,
        status=file.status.value,
        is_published=file.is_published,
        can_publish=file.can_publish(),
        published_at=file.published_at.isoformat() if file.published_at else None,
        public_uuid=file.public_uuid,
        permalink_slug=file.permalink_slug,
        version=file.version,
        can_withdraw=can_withdraw
    )


@router.post("/{file_id}/withdraw", response_model=PublicationResponse)
async def withdraw_file(
    file_id: int,
    user=Depends(current_user),
    db: AsyncSession = Depends(get_db),
    file_service: InMemoryFileService = Depends(get_file_service),
):
    """Withdraw a published file following arXiv model.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to withdraw.
    user : User
        Current authenticated user dependency.
    db : AsyncSession
        SQLAlchemy async database session dependency.
    file_service : InMemoryFileService
        File service dependency.

    Returns
    -------
    PublicationResponse
        Withdrawal confirmation with updated status.

    Raises
    ------
    HTTPException
        404 error if file is not found.
        403 error if user doesn't own the file.
        400 error if file is not published.

    Notes
    -----
    Requires authentication. Following arXiv model, withdrawal maintains
    the public record but marks the content as withdrawn. The UUID and
    published timestamp remain unchanged.
    """
    # Sync from database to ensure we have latest data
    await file_service.sync_from_database(db)
    
    # Get file from database
    result = await db.execute(
        select(DbFile).where(
            DbFile.id == file_id,
            DbFile.deleted_at.is_(None)
        )
    )
    file = result.scalars().first()
    
    if not file:
        raise not_found_exception("File", file_id)
    
    # Check ownership
    if file.owner_id != user.id:
        raise forbidden_exception("You do not have permission to withdraw this file")
    
    # Check if file is published
    if file.status != FileStatus.PUBLISHED:
        raise bad_request_exception("Only published files can be withdrawn")
    
    # Note: In a full implementation, we might add a 'withdrawn_at' timestamp
    # and a separate 'withdrawn' field to maintain the publication record
    # but mark it as withdrawn. For now, we'll use a placeholder approach.
    
    # For this implementation, we'll keep the file published but add a note
    # that it's withdrawn. In a future iteration, we might add a separate
    # withdrawn status or field.
    
    # TODO: Implement proper withdrawal following arXiv model
    # This could include:
    # - Adding a withdrawn_at timestamp
    # - Adding a withdrawal reason field
    # - Keeping the file publicly accessible but with withdrawal notice
    
    # For now, return a message indicating withdrawal is not yet fully implemented
    raise bad_request_exception("Withdrawal functionality is not yet fully implemented. Please contact support.")
    
    # Placeholder return (unreachable for now)
    return PublicationResponse(
        id=file.id,
        status=file.status.value,
        published_at=file.published_at.isoformat() if file.published_at else None,
        public_uuid=file.public_uuid,
        message="File withdrawn successfully"
    )
