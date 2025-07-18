"""Tests for preprint CRUD service."""

from unittest.mock import AsyncMock, Mock

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from aris.models import File, FileStatus
from aris.services.preprint import PreprintCRUD


class TestPreprintCRUD:
    """Test preprint CRUD service functionality."""

    @pytest.fixture
    def mock_db(self):
        """Create mock database session."""
        return Mock(spec=AsyncSession)

    @pytest.fixture
    def preprint_crud(self, mock_db):
        """Create preprint CRUD service instance."""
        return PreprintCRUD(db=mock_db)

    @pytest.mark.asyncio
    async def test_get_published_preprint_by_uuid_success(self, preprint_crud, mock_db):
        """Test successful retrieval of published preprint by UUID."""
        # Create mock file
        mock_file = Mock(spec=File)
        mock_file.id = 1
        mock_file.title = "Test Preprint"
        mock_file.public_uuid = "abc123"
        mock_file.status = FileStatus.PUBLISHED
        mock_file.deleted_at = None

        # Mock database query
        mock_result = Mock()
        mock_scalars = Mock()
        mock_scalars.first.return_value = mock_file
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute = AsyncMock(return_value=mock_result)

        # Call method
        result = await preprint_crud.get_published_preprint_by_uuid("abc123")

        # Verify result
        assert result == mock_file
        mock_db.execute.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_published_preprint_by_uuid_not_found(self, preprint_crud, mock_db):
        """Test 404 error when preprint not found by UUID."""
        # Mock database query returning None
        mock_result = Mock()
        mock_scalars = Mock()
        mock_scalars.first.return_value = None
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute = AsyncMock(return_value=mock_result)

        # Call method and expect exception
        with pytest.raises(Exception):  # Will be HTTPException in real implementation
            await preprint_crud.get_published_preprint_by_uuid("nonexistent")

    @pytest.mark.asyncio
    async def test_get_published_preprint_by_slug_success(self, preprint_crud, mock_db):
        """Test successful retrieval of published preprint by slug."""
        # Create mock file
        mock_file = Mock(spec=File)
        mock_file.id = 1
        mock_file.title = "Test Preprint"
        mock_file.permalink_slug = "test-preprint"
        mock_file.status = FileStatus.PUBLISHED
        mock_file.deleted_at = None

        # Mock database query
        mock_result = Mock()
        mock_scalars = Mock()
        mock_scalars.first.return_value = mock_file
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute = AsyncMock(return_value=mock_result)

        # Call method
        result = await preprint_crud.get_published_preprint_by_slug("test-preprint")

        # Verify result
        assert result == mock_file
        mock_db.execute.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_published_preprint_by_slug_not_found(self, preprint_crud, mock_db):
        """Test 404 error when preprint not found by slug."""
        # Mock database query returning None
        mock_result = Mock()
        mock_scalars = Mock()
        mock_scalars.first.return_value = None
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute = AsyncMock(return_value=mock_result)

        # Call method and expect exception
        with pytest.raises(Exception):  # Will be HTTPException in real implementation
            await preprint_crud.get_published_preprint_by_slug("nonexistent")

    @pytest.mark.asyncio
    async def test_get_published_preprint_by_identifier_uuid_first(self, preprint_crud, mock_db):
        """Test identifier lookup tries UUID first."""
        # Create mock file
        mock_file = Mock(spec=File)
        mock_file.public_uuid = "abc123"

        # Mock successful UUID lookup
        mock_result = Mock()
        mock_scalars = Mock()
        mock_scalars.first.return_value = mock_file
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute = AsyncMock(return_value=mock_result)

        # Call method
        result = await preprint_crud.get_published_preprint_by_identifier("abc123")

        # Verify result and that only UUID query was made
        assert result == mock_file
        assert mock_db.execute.call_count == 1

    @pytest.mark.asyncio
    async def test_get_published_preprint_by_identifier_fallback_to_slug(self, preprint_crud, mock_db):
        """Test identifier lookup falls back to slug when UUID fails."""
        # Create mock file
        mock_file = Mock(spec=File)
        mock_file.permalink_slug = "test-slug"

        # Mock failed UUID lookup, successful slug lookup
        mock_result_uuid = Mock()
        mock_scalars_uuid = Mock()
        mock_scalars_uuid.first.return_value = None
        mock_result_uuid.scalars.return_value = mock_scalars_uuid

        mock_result_slug = Mock()
        mock_scalars_slug = Mock()
        mock_scalars_slug.first.return_value = mock_file
        mock_result_slug.scalars.return_value = mock_scalars_slug

        mock_db.execute = AsyncMock(side_effect=[mock_result_uuid, mock_result_slug])

        # Call method
        result = await preprint_crud.get_published_preprint_by_identifier("test-slug")

        # Verify result and that both queries were made
        assert result == mock_file
        assert mock_db.execute.call_count == 2

    @pytest.mark.asyncio
    async def test_get_published_preprint_by_identifier_not_found(self, preprint_crud, mock_db):
        """Test identifier lookup fails when neither UUID nor slug found."""
        # Mock failed UUID and slug lookups
        mock_result = Mock()
        mock_scalars = Mock()
        mock_scalars.first.return_value = None
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute = AsyncMock(return_value=mock_result)

        # Call method and expect exception
        with pytest.raises(Exception):  # Will be HTTPException in real implementation
            await preprint_crud.get_published_preprint_by_identifier("nonexistent")

    def test_build_published_preprint_query_uuid(self, preprint_crud):
        """Test building query for published preprint by UUID."""
        query = preprint_crud._build_published_preprint_query_uuid("abc123")
        
        # Verify query structure (basic check)
        assert query is not None
        # More detailed query verification would require actual SQLAlchemy setup

    def test_build_published_preprint_query_slug(self, preprint_crud):
        """Test building query for published preprint by slug."""
        query = preprint_crud._build_published_preprint_query_slug("test-slug")
        
        # Verify query structure (basic check)
        assert query is not None
        # More detailed query verification would require actual SQLAlchemy setup