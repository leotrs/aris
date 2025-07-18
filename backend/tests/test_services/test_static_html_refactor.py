"""Tests for refactored static HTML service with dependency injection."""

from datetime import datetime, timezone
from unittest.mock import Mock, patch

from aris.models import File
from aris.services.citation import CitationService
from aris.services.static_html import generate_static_html, generate_static_html_with_services


class TestStaticHTMLRefactor:
    """Test refactored static HTML service with dependency injection."""

    def test_generate_static_html_with_services(self):
        """Test static HTML generation with injected services."""
        # Create mock file
        file = Mock(spec=File)
        file.title = "Test Title"
        file.abstract = "Test abstract"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"

        # Mock citation service
        mock_citation_service = Mock(spec=CitationService)
        expected_citation = {
            "formats": {
                "apa": "Test Author (2023). Test Title. Aris Preprint. https://aris.com/ication/abc123"
            }
        }
        mock_citation_service.generate_citation_info.return_value = expected_citation

        # Call function with services
        result = generate_static_html_with_services(file, citation_service=mock_citation_service)

        # Verify service was called
        mock_citation_service.generate_citation_info.assert_called_once_with(file)

        # Verify HTML contains citation
        assert "Test Author (2023). Test Title. Aris Preprint." in result
        assert "<!DOCTYPE html>" in result
        assert "Test Title" in result

    @patch('aris.services.static_html.CitationService')
    def test_generate_static_html_with_services_creates_citation_service(self, mock_citation_service_class):
        """Test that function creates citation service when none provided."""
        # Create mock file
        file = Mock(spec=File)
        file.title = "Test Title"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"

        # Mock service instance
        mock_service = Mock()
        mock_citation_service_class.return_value = mock_service
        mock_service.generate_citation_info.return_value = {
            "formats": {"apa": "Test citation"}
        }

        # Call function without services
        generate_static_html_with_services(file)

        # Verify service was created
        mock_citation_service_class.assert_called_once_with(base_url="https://aris.com")
        mock_service.generate_citation_info.assert_called_once_with(file)

    def test_generate_static_html_backwards_compatibility(self):
        """Test that original function still works."""
        # Create mock file
        file = Mock(spec=File)
        file.title = "Test Title"
        file.abstract = "Test abstract"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"

        # Call original function
        result = generate_static_html(file)

        # Verify HTML structure
        assert "<!DOCTYPE html>" in result
        assert "Test Title" in result
        assert "Test abstract" in result