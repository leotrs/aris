"""Unit tests for public preprint access endpoints."""

from datetime import datetime, timezone

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from aris.models.models import File, FileStatus, User


class TestPublicPreprintEndpoints:
    """Test public preprint access endpoints."""

    @pytest.fixture
    async def published_file(self, db_session: AsyncSession, test_user: User) -> File:
        """Create a published file for testing."""
        file = File(
            owner_id=test_user.id,
            source=":rsm:# Test Publication\n\nThis is a test publication.::",
            title="Test Publication",
            abstract="This is a test abstract for the publication.",
            keywords="test, publication, preprint",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="test01",
            permalink_slug="test-publication",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        return file

    @pytest.fixture
    async def draft_file(self, db_session: AsyncSession, test_user: User) -> File:
        """Create a draft file for testing."""
        file = File(
            owner_id=test_user.id,
            source=":rsm:# Draft Publication\n\nThis is a draft.::",
            title="Draft Publication",
            abstract="This is a draft abstract.",
            keywords="draft, test",
            status=FileStatus.DRAFT,
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        return file

    async def test_get_public_preprint_by_uuid_success(self, client: AsyncClient, published_file: File):
        """Test successful retrieval of published preprint by UUID."""
        response = await client.get(f"/ication/{published_file.public_uuid}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == published_file.id
        assert data["title"] == published_file.title
        assert data["abstract"] == published_file.abstract
        assert data["keywords"] == published_file.keywords
        assert data["source"] == published_file.source
        assert data["public_uuid"] == published_file.public_uuid
        assert data["permalink_slug"] == published_file.permalink_slug
        assert data["version"] == published_file.version
        assert "published_at" in data

    async def test_get_public_preprint_by_uuid_not_found(self, client: AsyncClient):
        """Test 404 error for non-existent UUID."""
        response = await client.get("/ication/nonexist")
        
        assert response.status_code == 404
        assert "Published preprint not found" in response.json()["detail"]

    async def test_get_public_preprint_by_uuid_draft_not_accessible(self, client: AsyncClient, draft_file: File):
        """Test that draft files are not accessible via public endpoints."""
        # Try to access draft file by setting a public_uuid
        draft_file.public_uuid = "draft1"
        # Note: This test verifies that only PUBLISHED files are accessible
        
        response = await client.get("/ication/draft1")
        
        assert response.status_code == 404
        assert "Published preprint not found" in response.json()["detail"]

    async def test_get_public_preprint_by_slug_success(self, client: AsyncClient, published_file: File):
        """Test successful retrieval of published preprint by permalink slug."""
        response = await client.get(f"/ication/{published_file.permalink_slug}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == published_file.id
        assert data["title"] == published_file.title
        assert data["abstract"] == published_file.abstract
        assert data["keywords"] == published_file.keywords
        assert data["source"] == published_file.source
        assert data["public_uuid"] == published_file.public_uuid
        assert data["permalink_slug"] == published_file.permalink_slug
        assert data["version"] == published_file.version

    async def test_get_public_preprint_by_slug_not_found(self, client: AsyncClient):
        """Test 404 error for non-existent permalink slug."""
        response = await client.get("/ication/non-existent-slug")
        
        assert response.status_code == 404
        assert "Published preprint not found" in response.json()["detail"]

    async def test_get_public_preprint_by_slug_without_slug(self, client: AsyncClient, test_user: User, db_session: AsyncSession):
        """Test retrieval of published preprint without permalink slug."""
        # Create published file without permalink slug
        file = File(
            owner_id=test_user.id,
            source=":rsm:# No Slug Publication\n\nThis has no slug.::",
            title="No Slug Publication",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="noslu1",
            permalink_slug=None,
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        
        # Should be accessible by UUID
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        
        # Should not be accessible by any slug
        response = await client.get("/ication/anything")
        assert response.status_code == 404

    async def test_get_public_preprint_metadata_success(self, client: AsyncClient, published_file: File):
        """Test successful retrieval of preprint metadata."""
        response = await client.get(f"/ication/{published_file.public_uuid}/metadata")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == published_file.id
        assert data["title"] == published_file.title
        assert data["abstract"] == published_file.abstract
        assert data["keywords"] == published_file.keywords
        assert data["public_uuid"] == published_file.public_uuid
        assert data["permalink_slug"] == published_file.permalink_slug
        assert data["version"] == published_file.version
        assert "published_at" in data
        assert "citation_info" in data
        
        # Check citation formats
        citation_info = data["citation_info"]
        assert "title" in citation_info
        assert "published_year" in citation_info
        assert "formats" in citation_info
        
        formats = citation_info["formats"]
        assert "apa" in formats
        assert "bibtex" in formats
        assert "chicago" in formats
        assert "mla" in formats
        
        # Verify citation contains the title
        assert published_file.title in formats["apa"]
        assert published_file.title in formats["bibtex"]
        assert published_file.title in formats["chicago"]
        assert published_file.title in formats["mla"]

    async def test_get_public_preprint_metadata_not_found(self, client: AsyncClient):
        """Test 404 error for metadata of non-existent preprint."""
        response = await client.get("/ication/nonexist/metadata")
        
        assert response.status_code == 404
        assert "Published preprint not found" in response.json()["detail"]

    async def test_get_public_preprint_metadata_by_slug_success(self, client: AsyncClient, published_file: File):
        """Test successful retrieval of preprint metadata by permalink slug."""
        response = await client.get(f"/ication/{published_file.permalink_slug}/metadata")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == published_file.id
        assert data["title"] == published_file.title
        assert data["public_uuid"] == published_file.public_uuid
        assert data["permalink_slug"] == published_file.permalink_slug
        assert "citation_info" in data

    async def test_get_public_preprint_metadata_by_slug_not_found(self, client: AsyncClient):
        """Test 404 error for metadata of non-existent permalink slug."""
        response = await client.get("/ication/non-existent-slug/metadata")
        
        assert response.status_code == 404
        assert "Published preprint not found" in response.json()["detail"]

    async def test_citation_info_generation(self, client: AsyncClient, test_user: User, db_session: AsyncSession):
        """Test citation information generation for different scenarios."""
        # Create file with minimal information
        file = File(
            owner_id=test_user.id,
            source=":rsm:# Minimal Publication::",
            title=None,  # No title
            abstract=None,  # No abstract
            keywords=None,  # No keywords
            status=FileStatus.PUBLISHED,
            published_at=datetime(2023, 5, 15, tzinfo=timezone.utc),
            public_uuid="min001",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        
        assert response.status_code == 200
        data = response.json()
        
        citation_info = data["citation_info"]
        assert citation_info["title"] == "Untitled"
        assert citation_info["published_year"] == 2023
        assert citation_info["abstract"] is None
        assert citation_info["keywords"] is None
        
        # Check that citation formats handle missing title gracefully
        formats = citation_info["formats"]
        assert "Untitled" in formats["apa"]
        assert "Untitled" in formats["bibtex"]
        assert "Untitled" in formats["chicago"]
        assert "Untitled" in formats["mla"]

    async def test_deleted_preprint_not_accessible(self, client: AsyncClient, published_file: File, db_session: AsyncSession):
        """Test that deleted preprints are not accessible."""
        # Mark file as deleted
        published_file.deleted_at = datetime.now(timezone.utc)
        await db_session.commit()
        
        # Should not be accessible by UUID
        response = await client.get(f"/ication/{published_file.public_uuid}")
        assert response.status_code == 404
        
        # Should not be accessible by slug
        response = await client.get(f"/ication/{published_file.permalink_slug}")
        assert response.status_code == 404
        
        # Metadata should not be accessible
        response = await client.get(f"/ication/{published_file.public_uuid}/metadata")
        assert response.status_code == 404

    async def test_version_information_in_response(self, client: AsyncClient, test_user: User, db_session: AsyncSession):
        """Test that version information is correctly included in responses."""
        # Create version 2 of a preprint
        file = File(
            owner_id=test_user.id,
            source=":rsm:# Version 2 Publication\n\nThis is version 2.::",
            title="Version 2 Publication",
            abstract="Version 2 abstract.",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="ver002",
            version=2
        )
        db_session.add(file)
        await db_session.commit()
        
        response = await client.get(f"/ication/{file.public_uuid}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == 2
        
        # Check version in metadata
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == 2

    async def test_public_endpoints_no_auth_required(self, client: AsyncClient, published_file: File):
        """Test that public endpoints work without authentication."""
        # These requests should work without any authentication headers
        # The client fixture doesn't include auth by default for public endpoints
        
        response = await client.get(f"/ication/{published_file.public_uuid}")
        assert response.status_code == 200
        
        response = await client.get(f"/ication/{published_file.permalink_slug}")
        assert response.status_code == 200
        
        response = await client.get(f"/ication/{published_file.public_uuid}/metadata")
        assert response.status_code == 200
        
        response = await client.get(f"/ication/{published_file.permalink_slug}/metadata")
        assert response.status_code == 200

    async def test_uuid_case_sensitivity(self, client: AsyncClient, published_file: File):
        """Test that UUID matching is case-sensitive."""
        # UUIDs should be case-sensitive
        response = await client.get(f"/ication/{published_file.public_uuid.upper()}")
        assert response.status_code == 404

    async def test_slug_case_sensitivity(self, client: AsyncClient, published_file: File):
        """Test that permalink slug matching is case-sensitive."""
        # Slugs should be case-sensitive
        response = await client.get(f"/ication/{published_file.permalink_slug.upper()}")
        assert response.status_code == 404

    async def test_get_dublin_core_metadata_success(self, client: AsyncClient, published_file: File):
        """Test successful retrieval of Dublin Core metadata."""
        response = await client.get(f"/ication/{published_file.public_uuid}/dublin-core")
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/json; charset=utf-8"
        assert "cache-control" in response.headers
        
        data = response.json()
        
        # Verify all 15 Dublin Core elements are present
        expected_elements = [
            "title", "creator", "subject", "description", "publisher",
            "date", "type", "format", "identifier", "source",
            "language", "rights", "coverage", "relation", "contributor"
        ]
        
        for element in expected_elements:
            assert element in data, f"Dublin Core element '{element}' missing from response"
        
        # Verify content matches the file
        assert data["title"] == published_file.title
        assert data["subject"] == published_file.keywords
        assert data["description"] == published_file.abstract
        assert data["identifier"] == published_file.public_uuid
        assert data["type"] == "Preprint"
        assert data["publisher"] == "Aris Preprint"
        assert data["format"] == "text/html"
        assert data["language"] == "en"

    async def test_get_dublin_core_metadata_by_slug_success(self, client: AsyncClient, published_file: File):
        """Test successful retrieval of Dublin Core metadata by permalink slug."""
        response = await client.get(f"/ication/{published_file.permalink_slug}/dublin-core")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify key elements match
        assert data["title"] == published_file.title
        assert data["identifier"] == published_file.public_uuid

    async def test_get_dublin_core_metadata_not_found(self, client: AsyncClient):
        """Test 404 error for Dublin Core metadata of non-existent preprint."""
        response = await client.get("/ication/nonexist/dublin-core")
        
        assert response.status_code == 404
        assert "Published preprint not found" in response.json()["detail"]

    async def test_get_dublin_core_metadata_with_missing_fields(self, client: AsyncClient, test_user: User, db_session: AsyncSession):
        """Test Dublin Core metadata generation with missing optional fields."""
        # Create file with minimal information
        file = File(
            owner_id=test_user.id,
            source=":rsm:# Minimal Publication::",
            title=None,
            abstract=None,
            keywords=None,
            status=FileStatus.PUBLISHED,
            published_at=datetime(2023, 5, 15, tzinfo=timezone.utc),
            public_uuid="min002",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        
        response = await client.get(f"/ication/{file.public_uuid}/dublin-core")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify defaults for missing fields
        assert data["title"] == "Untitled"
        assert data["description"] == ""
        assert data["subject"] == ""
        assert data["creator"] == "Unknown Author"

    async def test_get_schema_org_metadata_success(self, client: AsyncClient, published_file: File):
        """Test successful retrieval of Schema.org metadata."""
        response = await client.get(f"/ication/{published_file.public_uuid}/schema-org")
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/ld+json; charset=utf-8"
        assert "cache-control" in response.headers
        
        data = response.json()
        
        # Verify Schema.org JSON-LD structure
        assert data["@context"] == "https://schema.org"
        assert data["@type"] == "ScholarlyArticle"
        assert data["headline"] == published_file.title
        assert "author" in data
        assert "datePublished" in data
        assert "publisher" in data
        assert "url" in data
        assert "identifier" in data
        
        # Verify author structure
        authors = data["author"]
        assert isinstance(authors, list)
        assert len(authors) > 0
        assert authors[0]["@type"] == "Person"
        assert "name" in authors[0]
        
        # Verify publisher structure
        publisher = data["publisher"]
        assert publisher["@type"] == "Organization"
        assert publisher["name"] == "Aris Preprint"
        
        # Verify URL and identifier
        assert published_file.public_uuid in data["url"]
        assert data["identifier"] == published_file.public_uuid

    async def test_get_schema_org_metadata_by_slug_success(self, client: AsyncClient, published_file: File):
        """Test successful retrieval of Schema.org metadata by permalink slug."""
        response = await client.get(f"/ication/{published_file.permalink_slug}/schema-org")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify key Schema.org fields
        assert data["@type"] == "ScholarlyArticle"
        assert data["headline"] == published_file.title
        assert data["identifier"] == published_file.public_uuid

    async def test_get_schema_org_metadata_not_found(self, client: AsyncClient):
        """Test 404 error for Schema.org metadata of non-existent preprint."""
        response = await client.get("/ication/nonexist/schema-org")
        
        assert response.status_code == 404
        assert "Published preprint not found" in response.json()["detail"]

    async def test_get_schema_org_metadata_with_missing_fields(self, client: AsyncClient, test_user: User, db_session: AsyncSession):
        """Test Schema.org metadata generation with missing optional fields."""
        # Create file with minimal information
        file = File(
            owner_id=test_user.id,
            source=":rsm:# Minimal Publication::",
            title=None,
            abstract=None,
            keywords=None,
            status=FileStatus.PUBLISHED,
            published_at=datetime(2023, 5, 15, tzinfo=timezone.utc),
            public_uuid="min003",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        
        response = await client.get(f"/ication/{file.public_uuid}/schema-org")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify defaults for missing fields
        assert data["headline"] == "Untitled"
        assert data["author"][0]["name"] == "Unknown Author"
        assert data["@type"] == "ScholarlyArticle"
        assert data["@context"] == "https://schema.org"

    async def test_metadata_endpoints_cache_headers(self, client: AsyncClient, published_file: File):
        """Test that metadata endpoints return proper cache headers."""
        # Test Dublin Core cache headers
        response = await client.get(f"/ication/{published_file.public_uuid}/dublin-core")
        assert response.status_code == 200
        assert response.headers["cache-control"] == "public, max-age=3600"
        
        # Test Schema.org cache headers
        response = await client.get(f"/ication/{published_file.public_uuid}/schema-org")
        assert response.status_code == 200
        assert response.headers["cache-control"] == "public, max-age=3600"

    async def test_metadata_endpoints_with_deleted_preprint(self, client: AsyncClient, published_file: File, db_session: AsyncSession):
        """Test that metadata endpoints return 404 for deleted preprints."""
        # Mark file as deleted
        published_file.deleted_at = datetime.now(timezone.utc)
        await db_session.commit()
        
        # Dublin Core should not be accessible
        response = await client.get(f"/ication/{published_file.public_uuid}/dublin-core")
        assert response.status_code == 404
        
        # Schema.org should not be accessible
        response = await client.get(f"/ication/{published_file.public_uuid}/schema-org")
        assert response.status_code == 404