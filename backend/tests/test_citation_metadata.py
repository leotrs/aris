"""Tests for citation metadata generation."""

from datetime import datetime
from unittest.mock import Mock

from aris.models import File
from aris.routes.public import generate_citation_info
from aris.services.metadata import (
    AcademicMetaTags,
    DublinCoreMetadata,
    OpenGraphMetadata,
    SchemaOrgMetadata,
    generate_academic_metadata,
)
from aris.services.static_html import detect_user_agent_type, generate_static_html


class TestCitationGeneration:
    """Test citation information generation."""

    def test_generate_citation_info_basic(self):
        """Test basic citation info generation."""
        # Create mock file
        file = Mock(spec=File)
        file.title = "Test Preprint Title"
        file.abstract = "This is a test abstract"
        file.keywords = "test, citation, metadata"
        file.published_at = datetime(2023, 6, 15)
        file.public_uuid = "abc123"
        file.permalink_slug = "test-preprint-title"
        file.version = 1

        # Generate citation info
        citation_info = generate_citation_info(file)

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
        file.published_at = datetime(2023, 6, 15)
        file.public_uuid = "abc123"
        file.permalink_slug = None
        file.version = 1

        citation_info = generate_citation_info(file)

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

        citation_info = generate_citation_info(file)

        # Should use current year
        current_year = datetime.now().year
        assert citation_info["published_year"] == current_year


class TestDublinCoreMetadata:
    """Test Dublin Core metadata generation."""

    def test_dublin_core_all_elements(self):
        """Test that all 15 Dublin Core elements are generated."""
        file = Mock(spec=File)
        file.title = "Test Preprint"
        file.abstract = "Test abstract"
        file.keywords = "test, metadata"
        file.published_at = datetime(2023, 6, 15)
        file.public_uuid = "abc123"

        dc = DublinCoreMetadata(file)
        elements = dc.generate_all_elements()

        # Verify all 15 elements exist
        expected_elements = [
            "title", "creator", "subject", "description", "publisher",
            "date", "type", "format", "identifier", "source", "language",
            "rights", "coverage", "relation", "contributor"
        ]
        
        for element in expected_elements:
            assert element in elements

        # Verify some key values
        assert elements["title"] == "Test Preprint"
        assert elements["description"] == "Test abstract"
        assert elements["subject"] == "test, metadata"
        assert elements["publisher"] == "Aris Preprint"
        assert elements["date"] == "2023-06-15"
        assert elements["type"] == "Preprint"
        assert elements["format"] == "text/html"
        assert elements["identifier"] == "abc123"
        assert elements["language"] == "en"


class TestSchemaOrgMetadata:
    """Test Schema.org metadata generation."""

    def test_schema_org_json_ld(self):
        """Test Schema.org JSON-LD generation."""
        file = Mock(spec=File)
        file.title = "Test Preprint"
        file.abstract = "Test abstract"
        file.keywords = "test, metadata"
        file.published_at = datetime(2023, 6, 15, 12, 30, 45)
        file.public_uuid = "abc123"

        schema = SchemaOrgMetadata(file)
        json_ld = schema.generate_json_ld()

        # Verify structure
        assert json_ld["@context"] == "https://schema.org"
        assert json_ld["@type"] == "ScholarlyArticle"
        assert json_ld["headline"] == "Test Preprint"
        assert json_ld["abstract"] == "Test abstract"
        assert json_ld["keywords"] == "test, metadata"
        assert json_ld["datePublished"] == "2023-06-15T12:30:45"
        assert json_ld["identifier"] == "abc123"
        assert json_ld["url"] == "https://aris.com/ication/abc123"
        assert json_ld["publisher"]["@type"] == "Organization"
        assert json_ld["publisher"]["name"] == "Aris Preprint"
        assert json_ld["genre"] == "preprint"
        assert json_ld["inLanguage"] == "en"


class TestAcademicMetaTags:
    """Test academic citation meta tags generation."""

    def test_academic_meta_tags(self):
        """Test academic meta tags generation."""
        file = Mock(spec=File)
        file.title = "Test Preprint"
        file.published_at = datetime(2023, 6, 15)
        file.public_uuid = "abc123"

        tags = AcademicMetaTags(file)
        meta_tags = tags.generate_meta_tags()

        # Verify required tags
        assert meta_tags["citation_title"] == "Test Preprint"
        assert meta_tags["citation_publication_date"] == "2023/06/15"
        assert meta_tags["citation_journal_title"] == "Aris Preprint"
        assert meta_tags["citation_abstract_html_url"] == "https://aris.com/ication/abc123"


class TestOpenGraphMetadata:
    """Test Open Graph metadata generation."""

    def test_open_graph_tags(self):
        """Test Open Graph tags generation."""
        file = Mock(spec=File)
        file.title = "Test Preprint"
        file.abstract = "This is a test abstract that is long enough to test truncation functionality"
        file.published_at = datetime(2023, 6, 15, 12, 30, 45)
        file.public_uuid = "abc123"

        og = OpenGraphMetadata(file)
        og_tags = og.generate_og_tags()

        # Verify required tags
        assert og_tags["og:title"] == "Test Preprint"
        assert og_tags["og:type"] == "article"
        assert og_tags["og:url"] == "https://aris.com/ication/abc123"
        assert og_tags["og:site_name"] == "Aris Preprint"
        assert og_tags["article:published_time"] == "2023-06-15T12:30:45"
        assert "og:description" in og_tags


class TestStaticHTMLGeneration:
    """Test static HTML generation."""

    def test_generate_static_html_basic(self):
        """Test basic static HTML generation."""
        file = Mock(spec=File)
        file.title = "Test Preprint"
        file.abstract = "Test abstract"
        file.keywords = "test, metadata"
        file.published_at = datetime(2023, 6, 15)
        file.public_uuid = "abc123"
        file.version = 1

        html = generate_static_html(file)

        # Verify HTML structure
        assert "<!DOCTYPE html>" in html
        assert "<html lang=\"en\">" in html
        assert "<title>Test Preprint" in html
        assert "DC.title" in html
        assert "citation_title" in html
        assert "og:title" in html
        assert "Schema.org Structured Data" in html
        assert "User Redirect Logic" in html
        assert "Test Preprint" in html
        assert "Test abstract" in html

    def test_detect_user_agent_type(self):
        """Test user agent detection."""
        # Test bot detection
        assert detect_user_agent_type("Googlebot/2.1") == "bot"
        assert detect_user_agent_type("Mozilla/5.0 (compatible; bingbot/2.0)") == "bot"
        assert detect_user_agent_type("facebookexternalhit/1.1") == "bot"
        assert detect_user_agent_type("") == "human"
        assert detect_user_agent_type(None) == "human"

        # Test human detection
        assert detect_user_agent_type("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36") == "human"
        assert detect_user_agent_type("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36") == "human"


class TestAcademicMetadataIntegration:
    """Test integrated academic metadata generation."""

    def test_generate_academic_metadata_complete(self):
        """Test complete academic metadata generation."""
        file = Mock(spec=File)
        file.title = "Test Preprint"
        file.abstract = "Test abstract"
        file.keywords = "test, metadata"
        file.published_at = datetime(2023, 6, 15)
        file.public_uuid = "abc123"
        file.version = 1

        metadata = generate_academic_metadata(file)

        # Verify all metadata types are present
        assert "dublin_core" in metadata
        assert "schema_org" in metadata
        assert "citation_meta" in metadata
        assert "open_graph" in metadata

        # Verify dublin_core has all elements
        assert len(metadata["dublin_core"]) == 15

        # Verify schema_org structure
        assert metadata["schema_org"]["@type"] == "ScholarlyArticle"

        # Verify citation_meta has required fields
        assert "citation_title" in metadata["citation_meta"]
        assert "citation_publication_date" in metadata["citation_meta"]

        # Verify open_graph has required fields
        assert "og:title" in metadata["open_graph"]
        assert "og:type" in metadata["open_graph"]