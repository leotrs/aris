"""Integration tests for citation architecture refactoring.

This module tests the complete citation workflow from database to service layers
to ensure proper separation of concerns and dependency injection.
"""

from datetime import datetime, timezone
from unittest.mock import Mock

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from aris.models import File, FileStatus
from aris.services.citation import CitationService
from aris.services.preprint import PreprintCRUD
from aris.services.static_html import generate_static_html_with_services


class TestCitationArchitectureIntegration:
    """Integration tests for citation architecture."""

    @pytest.fixture
    def sample_file(self):
        """Create a sample file for testing."""
        file = Mock(spec=File)
        file.id = 1
        file.title = "Integration Test Paper"
        file.abstract = "This is a test abstract for integration testing."
        file.keywords = "integration, testing, architecture"
        file.published_at = datetime(2023, 6, 15, 14, 30, 0, tzinfo=timezone.utc)
        file.public_uuid = "int123"
        file.permalink_slug = "integration-test-paper"
        file.version = 1
        file.status = FileStatus.PUBLISHED
        file.deleted_at = None
        return file

    def test_citation_service_independence(self, sample_file):
        """Test that citation service works independently."""
        # Create citation service
        citation_service = CitationService(base_url="https://test.com")
        
        # Generate citation info
        citation_info = citation_service.generate_citation_info(sample_file)
        
        # Verify structure
        assert citation_info["title"] == "Integration Test Paper"
        assert citation_info["published_year"] == 2023
        assert citation_info["url"] == "https://test.com/ication/int123"
        assert "formats" in citation_info
        assert all(fmt in citation_info["formats"] for fmt in ["apa", "bibtex", "chicago", "mla"])
        
        # Verify citation formats contain expected content
        assert "Integration Test Paper" in citation_info["formats"]["apa"]
        assert "2023" in citation_info["formats"]["apa"]
        assert "https://test.com/ication/int123" in citation_info["formats"]["apa"]

    def test_crud_service_independence(self, sample_file):
        """Test that CRUD service works independently."""
        # Create mock database session
        mock_db = Mock(spec=AsyncSession)
        
        # Create CRUD service
        crud_service = PreprintCRUD(mock_db)
        
        # Test query building
        uuid_query = crud_service._build_published_preprint_query_uuid("int123")
        slug_query = crud_service._build_published_preprint_query_slug("integration-test-paper")
        
        # Verify queries are built correctly
        assert uuid_query is not None
        assert slug_query is not None

    def test_static_html_service_integration(self, sample_file):
        """Test that static HTML service integrates with citation service."""
        # Create citation service
        citation_service = CitationService(base_url="https://test.com")
        
        # Generate static HTML with dependency injection
        html_content = generate_static_html_with_services(sample_file, citation_service=citation_service)
        
        # Verify HTML structure
        assert "<!DOCTYPE html>" in html_content
        assert "Integration Test Paper" in html_content
        assert "This is a test abstract for integration testing." in html_content
        assert "integration, testing, architecture" in html_content
        
        # Verify citation is included
        assert "Unknown Author (2023). Integration Test Paper. Aris Preprint." in html_content
        
        # Verify metadata tags
        assert 'meta name="DC.title"' in html_content
        assert 'meta name="citation_title"' in html_content
        assert 'meta property="og:title"' in html_content
        assert 'Schema.org Structured Data' in html_content

    def test_service_layer_dependency_injection(self, sample_file):
        """Test that services can be injected and configured."""
        # Create services with custom configuration
        citation_service = CitationService(base_url="https://custom.domain.com")
        
        # Test citation service configuration
        citation_info = citation_service.generate_citation_info(sample_file)
        assert citation_info["url"] == "https://custom.domain.com/ication/int123"
        
        # Test static HTML service with injected citation service
        html_content = generate_static_html_with_services(sample_file, citation_service=citation_service)
        assert "https://custom.domain.com/ication/int123" in html_content

    def test_backwards_compatibility(self, sample_file):
        """Test that backwards compatibility is maintained."""
        # Test that original functions still work
        from aris.routes.public import generate_citation_info
        from aris.services.static_html import generate_static_html
        
        # Test original citation function
        citation_info = generate_citation_info(sample_file)
        assert citation_info["title"] == "Integration Test Paper"
        assert "formats" in citation_info
        
        # Test original static HTML function
        html_content = generate_static_html(sample_file)
        assert "<!DOCTYPE html>" in html_content
        assert "Integration Test Paper" in html_content

    def test_error_handling_propagation(self):
        """Test that errors propagate correctly through the service layers."""
        # Create citation service
        citation_service = CitationService(base_url="https://test.com")
        
        # Create file with None values to test error handling
        file_with_none = Mock(spec=File)
        file_with_none.title = None
        file_with_none.abstract = None
        file_with_none.keywords = None
        file_with_none.published_at = None
        file_with_none.public_uuid = "none123"
        file_with_none.permalink_slug = None
        file_with_none.version = 1
        
        # Should handle None values gracefully
        citation_info = citation_service.generate_citation_info(file_with_none)
        assert citation_info["title"] == "Untitled"
        assert citation_info["published_year"] == datetime.now().year
        
        # Static HTML should also handle None values
        html_content = generate_static_html_with_services(file_with_none, citation_service=citation_service)
        assert "Untitled" in html_content

    def test_service_isolation(self, sample_file):
        """Test that services are properly isolated and don't share state."""
        # Create two citation services with different configurations
        service1 = CitationService(base_url="https://service1.com")
        service2 = CitationService(base_url="https://service2.com")
        
        # Generate citations with both services
        citation1 = service1.generate_citation_info(sample_file)
        citation2 = service2.generate_citation_info(sample_file)
        
        # Verify they have different URLs
        assert citation1["url"] == "https://service1.com/ication/int123"
        assert citation2["url"] == "https://service2.com/ication/int123"
        
        # Verify they don't affect each other
        assert citation1["title"] == citation2["title"]
        assert citation1["published_year"] == citation2["published_year"]

    def test_complete_workflow_integration(self, sample_file):
        """Test complete workflow from CRUD to citation to static HTML."""
        # Create services
        citation_service = CitationService(base_url="https://workflow.test")
        
        # Mock database session (CRUD service would be used here in real workflow)
        mock_db = Mock(spec=AsyncSession)
        PreprintCRUD(mock_db)  # This would be used in real workflow
        
        # Test the complete workflow
        # 1. CRUD service would retrieve file from database
        # 2. Citation service generates citation info
        citation_info = citation_service.generate_citation_info(sample_file)
        
        # 3. Static HTML service uses citation service for HTML generation
        html_content = generate_static_html_with_services(sample_file, citation_service=citation_service)
        
        # Verify the complete workflow
        assert citation_info["title"] == "Integration Test Paper"
        assert citation_info["url"] == "https://workflow.test/ication/int123"
        assert "Integration Test Paper" in html_content
        assert "https://workflow.test/ication/int123" in html_content
        
        # Verify proper separation of concerns
        assert "formats" in citation_info  # Citation service responsibility
        assert "<!DOCTYPE html>" in html_content  # Static HTML service responsibility