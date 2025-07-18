"""Tests for refactored public routes with citation service."""

from datetime import datetime, timezone
from unittest.mock import Mock, patch

from aris.models import File
from aris.routes.public import generate_citation_info_with_service
from aris.services.citation import CitationService


class TestPublicRouteRefactor:
    """Test refactored public route functions."""

    def test_generate_citation_info_with_service(self):
        """Test that public route uses citation service."""
        # Create mock file
        file = Mock(spec=File)
        file.title = "Test Title"
        file.abstract = "Test abstract"
        file.keywords = "test, keywords"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"
        file.permalink_slug = "test-slug"
        file.version = 1

        # Mock citation service
        mock_service = Mock(spec=CitationService)
        expected_citation = {
            "title": "Test Title",
            "abstract": "Test abstract",
            "keywords": "test, keywords",
            "published_year": 2023,
            "url": "https://aris.com/ication/abc123",
            "formats": {
                "apa": "Test APA citation",
                "bibtex": "Test BibTeX citation",
                "chicago": "Test Chicago citation",
                "mla": "Test MLA citation"
            }
        }
        mock_service.generate_citation_info.return_value = expected_citation

        # Call the function
        result = generate_citation_info_with_service(file, mock_service)

        # Verify service was called and result returned
        mock_service.generate_citation_info.assert_called_once_with(file)
        assert result == expected_citation

    @patch('aris.routes.public.CitationService')
    def test_generate_citation_info_with_service_creates_service(self, mock_citation_service_class):
        """Test that function creates citation service with correct base URL."""
        # Create mock file
        file = Mock(spec=File)
        
        # Mock service instance
        mock_service = Mock()
        mock_citation_service_class.return_value = mock_service
        mock_service.generate_citation_info.return_value = {"title": "Test"}

        # Call the function
        generate_citation_info_with_service(file)

        # Verify service was created with correct base URL
        mock_citation_service_class.assert_called_once_with(base_url="https://aris.com")
        mock_service.generate_citation_info.assert_called_once_with(file)