"""Preprint CRUD service for database operations.

This module provides CRUD operations for preprint database access,
abstracting database queries from the route handlers.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..exceptions import not_found_exception
from ..models import File, FileStatus


class PreprintCRUD:
    """Service for preprint database operations."""

    def __init__(self, db: AsyncSession):
        """Initialize CRUD service with database session.
        
        Parameters
        ----------
        db : AsyncSession
            SQLAlchemy async database session.
        """
        self.db = db

    async def get_published_preprint_by_uuid(self, uuid: str) -> File:
        """Retrieve a published preprint by UUID.
        
        Parameters
        ----------
        uuid : str
            The public UUID of the preprint.
            
        Returns
        -------
        File
            The published preprint file.
            
        Raises
        ------
        HTTPException
            404 error if preprint is not found or not published.
        """
        query = self._build_published_preprint_query_uuid(uuid)
        result = await self.db.execute(query)
        file = result.scalars().first()
        
        if not file:
            raise not_found_exception("Published preprint", None)
        
        return file  # type: ignore[no-any-return]

    async def get_published_preprint_by_slug(self, slug: str) -> File:
        """Retrieve a published preprint by permalink slug.
        
        Parameters
        ----------
        slug : str
            The permalink slug of the preprint.
            
        Returns
        -------
        File
            The published preprint file.
            
        Raises
        ------
        HTTPException
            404 error if preprint is not found or not published.
        """
        query = self._build_published_preprint_query_slug(slug)
        result = await self.db.execute(query)
        file = result.scalars().first()
        
        if not file:
            raise not_found_exception("Published preprint", None)
        
        return file  # type: ignore[no-any-return]

    async def get_published_preprint_by_identifier(self, identifier: str) -> File:
        """Retrieve a published preprint by UUID or permalink slug.
        
        This method tries to find the preprint by UUID first, then
        by permalink slug if the UUID lookup fails.
        
        Parameters
        ----------
        identifier : str
            The 6-character public UUID or permalink slug of the preprint.
            
        Returns
        -------
        File
            The published preprint file.
            
        Raises
        ------
        HTTPException
            404 error if preprint is not found, not published, or deleted.
        """
        # Try UUID first
        uuid_query = self._build_published_preprint_query_uuid(identifier)
        result = await self.db.execute(uuid_query)
        file = result.scalars().first()
        
        if file:
            return file  # type: ignore[no-any-return]
        
        # If UUID lookup fails, try permalink slug
        slug_query = self._build_published_preprint_query_slug(identifier)
        result = await self.db.execute(slug_query)
        file = result.scalars().first()
        
        if not file:
            raise not_found_exception("Published preprint", None)
        
        return file  # type: ignore[no-any-return]

    def _build_published_preprint_query_uuid(self, uuid: str):
        """Build query for published preprint by UUID.
        
        Parameters
        ----------
        uuid : str
            The public UUID of the preprint.
            
        Returns
        -------
        Query
            SQLAlchemy query for published preprint by UUID.
        """
        return select(File).where(
            File.public_uuid == uuid,
            File.status == FileStatus.PUBLISHED,
            File.deleted_at.is_(None)
        )

    def _build_published_preprint_query_slug(self, slug: str):
        """Build query for published preprint by slug.
        
        Parameters
        ----------
        slug : str
            The permalink slug of the preprint.
            
        Returns
        -------
        Query
            SQLAlchemy query for published preprint by slug.
        """
        return select(File).where(
            File.permalink_slug == slug,
            File.status == FileStatus.PUBLISHED,
            File.deleted_at.is_(None)
        )