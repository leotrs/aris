from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, current_user, get_db
from ..models import FileAsset
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


@router.get("")
async def get_files(db: AsyncSession = Depends(get_db)):
    """Retrieve all files with extracted titles.

    Parameters
    ----------
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    list of File
        List of all non-deleted files with title attributes populated.

    Notes
    -----
    Requires authentication. Titles are extracted from RSM content.
    """
    return await crud.get_files(db)


@router.post("")
async def create_file(
    doc: FileCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new file with RSM source content.

    Parameters
    ----------
    doc : FileCreate
        File creation data including source, owner_id, title, and abstract.
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

    result = await crud.create_file(doc.source, doc.owner_id, doc.title, doc.abstract, db)
    return {"id": result.id}


@router.get("/{file_id}")
async def get_file(file_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieve a specific file by ID.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to retrieve.
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
    Requires authentication. Returns file with extracted title.
    """
    doc = await crud.get_file(file_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return {
        "id": file_id,
        "title": doc.title,
        "abstract": doc.abstract,
        "last_edited_at": doc.last_edited_at,
        "source": doc.source,
        "owner_id": doc.owner_id,
    }


@router.put("/{file_id}")
async def update_file(
    file_id: int,
    file_data: FileUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing file's content and metadata.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to update.
    file_data : FileUpdate
        Updated file data including title, abstract, and source.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    File
        The updated file object.

    Raises
    ------
    HTTPException
        404 error if file is not found.

    Notes
    -----
    Requires authentication. Updates last_edited_at timestamp.
    """
    doc = await crud.update_file(file_id, file_data.title, file_data.source, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return doc


@router.delete("/{file_id}")
async def soft_delete_file(file_id: int, db: AsyncSession = Depends(get_db)):
    """Soft delete a file by setting deleted_at timestamp.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to delete.
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
    Requires authentication. Preserves data integrity by using soft delete.
    """
    doc = await crud.soft_delete_file(file_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": f"File {file_id} soft deleted"}


@router.post("/{file_id}/duplicate")
async def duplicate_file(file_id: int, db: AsyncSession = Depends(get_db)):
    """Create a duplicate copy of an existing file.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to duplicate.
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
    Requires authentication. Copies all content and associated tags.
    New file title includes '(copy)' suffix.
    """
    new_doc = await crud.duplicate_file(file_id, db)
    return {"id": new_doc.id, "message": "File duplicated successfully"}


@router.get("/{file_id}/content", response_class=HTMLResponse)
async def get_file_html(file_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieve rendered HTML content for a file.

    Parameters
    ----------
    file_id : int
        The unique identifier of the file to render.
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
    Requires authentication. Converts RSM source to HTML using rsm.render().
    """
    doc = await crud.get_file_html(file_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return doc


@router.get("/{file_id}/content/{section_name}", response_class=HTMLResponse)
async def get_file_section(
    file_id: int,
    section_name: str,
    handrails: bool = True,
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
    Requires authentication. Extracts specific sections from RSM content.
    """
    try:
        html = await crud.get_file_section(file_id, section_name, db, handrails)
    except ValueError:
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
