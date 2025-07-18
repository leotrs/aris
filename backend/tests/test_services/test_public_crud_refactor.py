"""Tests for refactored public routes with CRUD service."""

from unittest.mock import AsyncMock, Mock

import pytest

from aris.models import File
from aris.routes.public import get_preprint_with_crud
from aris.services.preprint import PreprintCRUD


class TestPublicCRUDRefactor:
    """Test refactored public route functions with CRUD service."""

    @pytest.mark.asyncio
    async def test_get_preprint_with_crud_by_uuid(self):
        """Test that public route uses CRUD service for UUID lookup."""
        # Create mock file
        mock_file = Mock(spec=File)
        mock_file.public_uuid = "abc123"
        mock_file.title = "Test Preprint"

        # Mock CRUD service
        mock_crud = Mock(spec=PreprintCRUD)
        mock_crud.get_published_preprint_by_identifier = AsyncMock(return_value=mock_file)

        # Call the function
        result = await get_preprint_with_crud("abc123", mock_crud)

        # Verify service was called and result returned
        mock_crud.get_published_preprint_by_identifier.assert_called_once_with("abc123")
        assert result == mock_file

    @pytest.mark.asyncio
    async def test_get_preprint_with_crud_by_identifier(self):
        """Test that public route uses CRUD service for identifier lookup."""
        # Create mock file
        mock_file = Mock(spec=File)
        mock_file.public_uuid = "abc123"
        mock_file.title = "Test Preprint"

        # Mock CRUD service
        mock_crud = Mock(spec=PreprintCRUD)
        mock_crud.get_published_preprint_by_identifier = AsyncMock(return_value=mock_file)

        # Call the function
        result = await get_preprint_with_crud("abc123", mock_crud)

        # Verify service was called and result returned
        mock_crud.get_published_preprint_by_identifier.assert_called_once_with("abc123")
        assert result == mock_file

    @pytest.mark.asyncio
    async def test_get_preprint_with_crud_by_slug(self):
        """Test that public route uses CRUD service for slug lookup."""
        # Create mock file
        mock_file = Mock(spec=File)
        mock_file.permalink_slug = "test-slug"
        mock_file.title = "Test Preprint"

        # Mock CRUD service
        mock_crud = Mock(spec=PreprintCRUD)
        mock_crud.get_published_preprint_by_identifier = AsyncMock(return_value=mock_file)

        # Call the function
        result = await get_preprint_with_crud("test-slug", mock_crud)

        # Verify service was called and result returned
        mock_crud.get_published_preprint_by_identifier.assert_called_once_with("test-slug")
        assert result == mock_file