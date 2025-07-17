"""Public preprint access endpoints.

This module provides public API endpoints for accessing published preprints
without authentication. Supports both UUID and permalink slug access patterns.
"""

from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import get_db
from ..exceptions import not_found_exception
from ..models import File, FileStatus


router = APIRouter(prefix="/ication", tags=["public"])


class PublicPreprintResponse(BaseModel):
    """Response model for public preprint access."""
    
    id: int
    title: str | None
    abstract: str | None
    keywords: str | None
    source: str
    published_at: datetime
    public_uuid: str
    permalink_slug: str | None
    version: int
    
    model_config = ConfigDict(from_attributes=True)


class PublicPreprintMetadata(BaseModel):
    """Response model for public preprint metadata (citation info)."""
    
    id: int
    title: str
    abstract: str | None
    keywords: str | None
    published_at: datetime
    public_uuid: str
    permalink_slug: str | None
    version: int
    citation_info: Dict[str, Any]
    
    model_config = ConfigDict(from_attributes=True)


async def get_published_preprint_by_uuid(uuid: str, db: AsyncSession) -> File:
    """Retrieve a published preprint by UUID.
    
    Parameters
    ----------
    uuid : str
        The public UUID of the preprint.
    db : AsyncSession
        SQLAlchemy async database session.
        
    Returns
    -------
    File
        The published preprint file.
        
    Raises
    ------
    HTTPException
        404 error if preprint is not found or not published.
    """
    result = await db.execute(
        select(File).where(
            File.public_uuid == uuid,
            File.status == FileStatus.PUBLISHED,
            File.deleted_at.is_(None)
        )
    )
    file = result.scalars().first()
    
    if not file:
        raise not_found_exception("Published preprint", None)
    
    return file


async def get_published_preprint_by_slug(slug: str, db: AsyncSession) -> File:
    """Retrieve a published preprint by permalink slug.
    
    Parameters
    ----------
    slug : str
        The permalink slug of the preprint.
    db : AsyncSession
        SQLAlchemy async database session.
        
    Returns
    -------
    File
        The published preprint file.
        
    Raises
    ------
    HTTPException
        404 error if preprint is not found or not published.
    """
    result = await db.execute(
        select(File).where(
            File.permalink_slug == slug,
            File.status == FileStatus.PUBLISHED,
            File.deleted_at.is_(None)
        )
    )
    file = result.scalars().first()
    
    if not file:
        raise not_found_exception("Published preprint", None)
    
    return file


def generate_citation_info(file: File) -> Dict[str, Any]:
    """Generate citation information for a published preprint.
    
    Parameters
    ----------
    file : File
        The published preprint file.
        
    Returns
    -------
    Dict[str, Any]
        Citation information including various formats.
    """
    # Extract publication year from published_at
    pub_year = file.published_at.year if file.published_at else datetime.now().year
    
    # Generate different citation formats
    citation_info = {
        "title": file.title or "Untitled",
        "abstract": file.abstract,
        "keywords": file.keywords,
        "published_year": pub_year,
        "public_uuid": file.public_uuid,
        "permalink_slug": file.permalink_slug,
        "version": file.version,
        "formats": {
            "apa": f"({pub_year}). {file.title or 'Untitled'}. Aris Preprint. {file.public_uuid}",
            "bibtex": f"""@article{{{file.public_uuid},
  title={{{file.title or 'Untitled'}}},
  year={{{pub_year}}},
  note={{Aris Preprint {file.public_uuid}}},
  abstract={{{file.abstract or ''}}},
  keywords={{{file.keywords or ''}}}
}}""",
            "chicago": f"\"{file.title or 'Untitled'}.\" Aris Preprint {file.public_uuid} ({pub_year}).",
            "mla": f"\"{file.title or 'Untitled'}.\" Aris Preprint, {pub_year}, {file.public_uuid}."
        }
    }
    
    return citation_info


@router.get(
    "/{identifier}",
    response_model=PublicPreprintResponse,
    summary="Get Published Preprint",
    description="Retrieve a published preprint by UUID or permalink slug without authentication.",
    response_description="Published preprint content and metadata",
)
async def get_public_preprint_by_identifier(
    identifier: str,
    db: AsyncSession = Depends(get_db)
) -> PublicPreprintResponse:
    """Retrieve a published preprint by UUID or permalink slug.
    
    This endpoint provides public access to published preprints without
    authentication. It tries to find the preprint by UUID first, then
    by permalink slug. The preprint must be published and not deleted.
    
    Parameters
    ----------
    identifier : str
        The 6-character public UUID or permalink slug of the preprint.
    db : AsyncSession
        SQLAlchemy async database session dependency.
        
    Returns
    -------
    PublicPreprintResponse
        The published preprint data including content and metadata.
        
    Raises
    ------
    HTTPException
        404 error if preprint is not found, not published, or deleted.
        
    Examples
    --------
    GET /ication/abc123 (UUID)
    GET /ication/my-awesome-research-paper (permalink slug)
    """
    # Try UUID first
    try:
        file = await get_published_preprint_by_uuid(identifier, db)
        return PublicPreprintResponse.model_validate(file)
    except Exception:
        # If UUID lookup fails, try permalink slug
        file = await get_published_preprint_by_slug(identifier, db)
        return PublicPreprintResponse.model_validate(file)


@router.get(
    "/{identifier}/metadata",
    response_model=PublicPreprintMetadata,
    summary="Get Preprint Citation Metadata",
    description="Retrieve citation metadata and academic reference information for a published preprint.",
    response_description="Preprint metadata with citation information in multiple formats",
)
async def get_public_preprint_metadata_by_identifier(
    identifier: str,
    db: AsyncSession = Depends(get_db)
) -> PublicPreprintMetadata:
    """Retrieve citation metadata for a published preprint by UUID or permalink slug.
    
    This endpoint provides structured metadata and citation information
    for a published preprint, useful for academic reference managers
    and citation systems. It tries to find the preprint by UUID first,
    then by permalink slug.
    
    Parameters
    ----------
    identifier : str
        The 6-character public UUID or permalink slug of the preprint.
    db : AsyncSession
        SQLAlchemy async database session dependency.
        
    Returns
    -------
    PublicPreprintMetadata
        The preprint metadata including citation information in multiple formats.
        
    Raises
    ------
    HTTPException
        404 error if preprint is not found, not published, or deleted.
        
    Examples
    --------
    GET /ication/abc123/metadata (UUID)
    GET /ication/my-awesome-research-paper/metadata (permalink slug)
    """
    # Try UUID first
    try:
        file = await get_published_preprint_by_uuid(identifier, db)
    except Exception:
        # If UUID lookup fails, try permalink slug
        file = await get_published_preprint_by_slug(identifier, db)
    
    citation_info = generate_citation_info(file)
    
    return PublicPreprintMetadata(
        id=file.id,
        title=file.title or "Untitled",
        abstract=file.abstract,
        keywords=file.keywords,
        published_at=file.published_at,
        public_uuid=file.public_uuid,
        permalink_slug=file.permalink_slug,
        version=file.version,
        citation_info=citation_info
    )