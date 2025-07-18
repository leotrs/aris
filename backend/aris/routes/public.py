"""Public preprint access endpoints.

This module provides public API endpoints for accessing published preprints
without authentication. Supports both UUID and permalink slug access patterns.
"""

from datetime import datetime
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, PlainTextResponse
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession

from .. import get_db
from ..models import File
from ..services.citation import CitationService
from ..services.metadata import generate_academic_metadata
from ..services.preprint import PreprintCRUD
from ..services.static_html import generate_static_html


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
    academic_metadata: Dict[str, Any]
    
    model_config = ConfigDict(from_attributes=True)


async def get_published_preprint_by_uuid(uuid: str, db: AsyncSession) -> File:
    """Retrieve a published preprint by UUID.
    
    This function is kept for backwards compatibility but delegates to the CRUD service.
    
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
    crud = PreprintCRUD(db)
    return await crud.get_published_preprint_by_uuid(uuid)


async def get_published_preprint_by_slug(slug: str, db: AsyncSession) -> File:
    """Retrieve a published preprint by permalink slug.
    
    This function is kept for backwards compatibility but delegates to the CRUD service.
    
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
    crud = PreprintCRUD(db)
    return await crud.get_published_preprint_by_slug(slug)


async def get_preprint_with_crud(identifier: str, crud: PreprintCRUD) -> File:
    """Retrieve a published preprint using CRUD service.
    
    This function provides a clean interface for getting preprints with
    dependency injection of the CRUD service.
    
    Parameters
    ----------
    identifier : str
        The 6-character public UUID or permalink slug of the preprint.
    crud : PreprintCRUD
        The CRUD service instance.
        
    Returns
    -------
    File
        The published preprint file.
        
    Raises
    ------
    HTTPException
        404 error if preprint is not found, not published, or deleted.
    """
    return await crud.get_published_preprint_by_identifier(identifier)


def generate_citation_info(file: File) -> Dict[str, Any]:
    """Generate citation information for a published preprint.
    
    This function is kept for backwards compatibility but delegates to the citation service.
    
    Parameters
    ----------
    file : File
        The published preprint file.
        
    Returns
    -------
    Dict[str, Any]
        Citation information including various formats.
    """
    return generate_citation_info_with_service(file)


def generate_citation_info_with_service(file: File, service: Optional[CitationService] = None) -> Dict[str, Any]:
    """Generate citation information using citation service.
    
    Parameters
    ----------
    file : File
        The published preprint file.
    service : CitationService, optional
        Citation service instance. If None, creates a new one.
        
    Returns
    -------
    Dict[str, Any]
        Citation information including various formats.
    """
    if service is None:
        service = CitationService(base_url="https://aris.com")  # TODO: Make configurable
    
    return service.generate_citation_info(file)


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
    crud = PreprintCRUD(db)
    file = await get_preprint_with_crud(identifier, crud)
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
    crud = PreprintCRUD(db)
    file = await get_preprint_with_crud(identifier, crud)
    
    citation_info = generate_citation_info(file)
    academic_metadata = generate_academic_metadata(file)
    
    return PublicPreprintMetadata(
        id=file.id,
        title=file.title or "Untitled",
        abstract=file.abstract,
        keywords=file.keywords,
        published_at=file.published_at,
        public_uuid=file.public_uuid,
        permalink_slug=file.permalink_slug,
        version=file.version,
        citation_info=citation_info,
        academic_metadata=academic_metadata
    )


@router.get(
    "/{identifier}/export/bibtex",
    response_class=PlainTextResponse,
    summary="Export BibTeX Citation",
    description="Download BibTeX citation format for a published preprint.",
    response_description="BibTeX citation in plain text format",
)
async def export_bibtex_citation(
    identifier: str,
    db: AsyncSession = Depends(get_db)
) -> PlainTextResponse:
    """Export BibTeX citation for a published preprint by UUID or permalink slug.
    
    This endpoint generates a BibTeX citation format suitable for
    LaTeX documents and reference managers like Zotero and Mendeley.
    
    Parameters
    ----------
    identifier : str
        The 6-character public UUID or permalink slug of the preprint.
    db : AsyncSession
        SQLAlchemy async database session dependency.
        
    Returns
    -------
    PlainTextResponse
        BibTeX citation in plain text format with proper content-type header.
        
    Raises
    ------
    HTTPException
        404 error if preprint is not found, not published, or deleted.
        
    Examples
    --------
    GET /ication/abc123/export/bibtex (UUID)
    GET /ication/my-awesome-research-paper/export/bibtex (permalink slug)
    """
    crud = PreprintCRUD(db)
    file = await get_preprint_with_crud(identifier, crud)
    
    citation_info = generate_citation_info(file)
    bibtex_content = citation_info["formats"]["bibtex"]
    
    return PlainTextResponse(
        content=bibtex_content,
        media_type="application/x-bibtex",
        headers={
            "Content-Disposition": f"attachment; filename=\"{file.public_uuid}.bib\""
        }
    )


@router.get(
    "/{identifier}/static-html",
    response_class=HTMLResponse,
    summary="Get Static HTML with Academic Metadata",
    description="Generate static HTML page with complete academic metadata for search engines.",
    response_description="Static HTML page with academic meta tags and redirect logic",
)
async def get_static_html_page(
    identifier: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> HTMLResponse:
    """Generate static HTML page with academic metadata and user redirect.
    
    This endpoint generates a static HTML page that serves two purposes:
    1. Provides complete academic metadata for search engines and crawlers
    2. Redirects human users to the interactive SPA version
    
    The page includes:
    - Dublin Core metadata (all 15 elements)
    - Schema.org ScholarlyArticle JSON-LD
    - Academic citation meta tags (Highwire Press format)
    - Open Graph tags for social sharing
    - User-agent detection and redirect logic
    
    Parameters
    ----------
    identifier : str
        The 6-character public UUID or permalink slug of the preprint.
    request : Request
        FastAPI request object for user-agent detection.
    db : AsyncSession
        SQLAlchemy async database session dependency.
        
    Returns
    -------
    HTMLResponse
        Complete HTML page with academic metadata and redirect logic.
        
    Raises
    ------
    HTTPException
        404 error if preprint is not found, not published, or deleted.
        
    Examples
    --------
    GET /ication/abc123/static-html (UUID)
    GET /ication/my-awesome-research-paper/static-html (permalink slug)
    """
    crud = PreprintCRUD(db)
    file = await get_preprint_with_crud(identifier, crud)
    
    # Generate static HTML content
    html_content = generate_static_html(file)
    
    # Set appropriate cache headers for static content
    headers = {
        "Cache-Control": "public, max-age=3600",  # Cache for 1 hour
        "Vary": "User-Agent",  # Vary on user agent for proper caching
    }
    
    # TODO: Log access for analytics
    # user_agent = request.headers.get("user-agent", "")
    # agent_type = detect_user_agent_type(user_agent)
    # logger.info(f"Static HTML access: {identifier}, agent_type: {agent_type}")
    
    return HTMLResponse(
        content=html_content,
        headers=headers
    )