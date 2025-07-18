"""Tests for citation service."""

from datetime import datetime, timezone
from unittest.mock import Mock

from aris.models import File
from aris.services.citation import CitationService


class TestCitationService:
    """Test citation service functionality."""

    def test_generate_citation_info_basic(self):
        """Test basic citation info generation."""
        # Create mock file
        file = Mock(spec=File)
        file.title = "Test Preprint Title"
        file.abstract = "This is a test abstract"
        file.keywords = "test, citation, metadata"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"
        file.permalink_slug = "test-preprint-title"
        file.version = 1

        # Create service
        service = CitationService(base_url="https://aris.com")
        
        # Generate citation info
        citation_info = service.generate_citation_info(file)

        # Verify basic fields
        assert citation_info["title"] == "Test Preprint Title"
        assert citation_info["abstract"] == "This is a test abstract"
        assert citation_info["keywords"] == "test, citation, metadata"
        assert citation_info["published_year"] == 2023
        assert citation_info["public_uuid"] == "abc123"
        assert citation_info["version"] == 1

        # Verify citation formats exist
        assert "formats" in citation_info
        assert "apa" in citation_info["formats"]
        assert "bibtex" in citation_info["formats"]
        assert "chicago" in citation_info["formats"]
        assert "mla" in citation_info["formats"]

        # Verify URL is included
        assert citation_info["url"] == "https://aris.com/ication/abc123"

    def test_generate_citation_info_no_title(self):
        """Test citation generation with missing title."""
        file = Mock(spec=File)
        file.title = None
        file.abstract = None
        file.keywords = None
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"
        file.permalink_slug = None
        file.version = 1

        service = CitationService(base_url="https://aris.com")
        citation_info = service.generate_citation_info(file)

        assert citation_info["title"] == "Untitled"
        assert "Untitled" in citation_info["formats"]["apa"]
        assert "Untitled" in citation_info["formats"]["bibtex"]

    def test_generate_citation_info_no_date(self):
        """Test citation generation with missing publication date."""
        file = Mock(spec=File)
        file.title = "Test Title"
        file.abstract = None
        file.keywords = None
        file.published_at = None
        file.public_uuid = "abc123"
        file.permalink_slug = None
        file.version = 1

        service = CitationService(base_url="https://aris.com")
        citation_info = service.generate_citation_info(file)

        # Should use current year
        current_year = datetime.now().year
        assert citation_info["published_year"] == current_year

    def test_generate_apa_citation(self):
        """Test APA citation format generation."""
        file = Mock(spec=File)
        file.title = "Test Title"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"

        service = CitationService(base_url="https://aris.com")
        apa_citation = service._generate_apa_citation(file, "Unknown Author", 2023, "https://aris.com/ication/abc123")

        expected = "Unknown Author (2023). Test Title. Aris Preprint. https://aris.com/ication/abc123"
        assert apa_citation == expected

    def test_generate_bibtex_citation(self):
        """Test BibTeX citation format generation."""
        file = Mock(spec=File)
        file.title = "Test Title"
        file.abstract = "Test abstract"
        file.keywords = "test, keywords"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"

        service = CitationService(base_url="https://aris.com")
        bibtex_citation = service._generate_bibtex_citation(file, "Unknown Author", 2023, "https://aris.com/ication/abc123")

        expected = """@article{abc123,
  title={Test Title},
  author={Unknown Author},
  year={2023},
  journal={Aris Preprint},
  url={https://aris.com/ication/abc123},
  abstract={Test abstract},
  keywords={test, keywords},
  note={Preprint abc123}
}"""
        assert bibtex_citation == expected

    def test_generate_chicago_citation(self):
        """Test Chicago citation format generation."""
        file = Mock(spec=File)
        file.title = "Test Title"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"

        service = CitationService(base_url="https://aris.com")
        chicago_citation = service._generate_chicago_citation(file, "Unknown Author", 2023, "https://aris.com/ication/abc123")

        expected = 'Unknown Author. "Test Title." Aris Preprint abc123 (2023). https://aris.com/ication/abc123.'
        assert chicago_citation == expected

    def test_generate_mla_citation(self):
        """Test MLA citation format generation."""
        file = Mock(spec=File)
        file.title = "Test Title"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"

        service = CitationService(base_url="https://aris.com")
        mla_citation = service._generate_mla_citation(file, "Unknown Author", "2023-06-15", "https://aris.com/ication/abc123")

        expected = 'Unknown Author. "Test Title." Aris Preprint, 2023-06-15, https://aris.com/ication/abc123.'
        assert mla_citation == expected

    def test_configurable_base_url(self):
        """Test that base URL is configurable."""
        file = Mock(spec=File)
        file.title = "Test Title"
        file.published_at = datetime(2023, 6, 15, tzinfo=timezone.utc)
        file.public_uuid = "abc123"
        file.version = 1

        service = CitationService(base_url="https://custom.domain.com")
        citation_info = service.generate_citation_info(file)

        assert citation_info["url"] == "https://custom.domain.com/ication/abc123"

    def test_extract_authors_placeholder(self):
        """Test author extraction placeholder."""
        file = Mock(spec=File)
        
        service = CitationService(base_url="https://aris.com")
        authors = service._extract_authors(file)

        # Should return placeholder until proper author extraction is implemented
        assert authors == "Unknown Author"