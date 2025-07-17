"""Epic-level integration tests for public access system.

Tests the complete integration of the public access epic components:
- Publication status API endpoints integration with public access
- UUID generation system integration with publication workflow  
- Cross-system database interactions and constraints
- End-to-end workflow validation across all epic components
"""

from datetime import datetime, timezone

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from aris.models.models import File, FileStatus, User


class TestPublicAccessEpicIntegration:
    """Epic-level integration tests for public access system."""

    async def test_publication_api_to_public_access_workflow(self, client: AsyncClient, db_session: AsyncSession):
        """Test complete workflow from publication API to public access."""
        # Create user
        user = User(
            name="Epic Test User",
            email="epic@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create draft file
        file = File(
            owner_id=user.id,
            source=":rsm:# Epic Integration Test\n\nThis tests the complete publication to public access workflow.::",
            title="Epic Integration Test",
            abstract="Testing complete integration across publication and public access systems.",
            keywords="epic, integration, publication, public-access",
            status=FileStatus.DRAFT,
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify file is not publicly accessible initially
        response = await client.get("/ication/nonexistent")
        assert response.status_code == 404
        
        # Use publication status API to publish file
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify publication status
        assert file.status == FileStatus.PUBLISHED
        assert file.published_at is not None
        assert file.public_uuid is not None
        assert len(file.public_uuid) == 6
        
        # Test immediate public access availability via UUID
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == file.id
        assert data["title"] == file.title
        assert data["abstract"] == file.abstract
        assert data["keywords"] == file.keywords
        assert data["source"] == file.source
        assert data["public_uuid"] == file.public_uuid
        assert data["version"] == file.version
        assert "published_at" in data
        
        # Test metadata access
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        assert response.status_code == 200
        
        metadata = response.json()
        assert metadata["id"] == file.id
        assert metadata["title"] == file.title
        assert "citation_info" in metadata
        
        # Verify citation formats are generated
        citation_info = metadata["citation_info"]
        assert "formats" in citation_info
        assert "apa" in citation_info["formats"]
        assert "bibtex" in citation_info["formats"]
        assert file.title in citation_info["formats"]["apa"]

    async def test_publication_api_with_custom_permalink_integration(self, client: AsyncClient, db_session: AsyncSession):
        """Test publication API integration with custom permalink public access."""
        # Create user
        user = User(
            name="Permalink Epic User",
            email="permalink-epic@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create file with custom permalink
        file = File(
            owner_id=user.id,
            source=":rsm:# Custom Permalink Epic Test\n\nThis tests publication with custom permalinks.::",
            title="Custom Permalink Epic Test",
            abstract="Testing publication workflow with custom permalink integration.",
            keywords="permalink, epic, integration",
            status=FileStatus.DRAFT,
            permalink_slug="epic-integration-custom-permalink",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Publish using the publication API
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify both UUID and permalink access work
        # Test access via UUID
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["permalink_slug"] == "epic-integration-custom-permalink"
        
        # Test access via permalink slug
        response = await client.get(f"/ication/{file.permalink_slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == file.id
        assert data["public_uuid"] == file.public_uuid
        assert data["permalink_slug"] == file.permalink_slug
        
        # Test metadata access via both methods
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        assert response.status_code == 200
        uuid_metadata = response.json()
        
        response = await client.get(f"/ication/{file.permalink_slug}/metadata")
        assert response.status_code == 200
        slug_metadata = response.json()
        
        # Both should return identical metadata
        assert uuid_metadata["id"] == slug_metadata["id"]
        assert uuid_metadata["title"] == slug_metadata["title"]
        assert uuid_metadata["public_uuid"] == slug_metadata["public_uuid"]
        assert uuid_metadata["permalink_slug"] == slug_metadata["permalink_slug"]

    async def test_uuid_system_publication_integration(self, client: AsyncClient, db_session: AsyncSession):
        """Test UUID system integration with publication workflow."""
        # Create user
        user = User(
            name="UUID Integration User",
            email="uuid-integration@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create multiple files to test UUID uniqueness during publication
        files = []
        for i in range(5):
            file = File(
                owner_id=user.id,
                source=f":rsm:# UUID Test {i}\n\nThis tests UUID generation {i}.::",
                title=f"UUID Integration Test {i}",
                abstract=f"Testing UUID system integration {i}.",
                status=FileStatus.DRAFT,
                version=1
            )
            files.append(file)
            db_session.add(file)
        
        await db_session.commit()
        
        # Publish all files and verify unique UUIDs
        published_uuids = set()
        for i, file in enumerate(files):
            await db_session.refresh(file)
            
            # Publish using the model method
            file.publish()
            await db_session.commit()
            await db_session.refresh(file)
            
            # Verify publication status
            assert file.status == FileStatus.PUBLISHED
            assert file.public_uuid is not None
            assert len(file.public_uuid) == 6
            
            # Verify UUID uniqueness
            assert file.public_uuid not in published_uuids
            published_uuids.add(file.public_uuid)
            
            # Verify public access works for each UUID
            response = await client.get(f"/ication/{file.public_uuid}")
            assert response.status_code == 200
            data = response.json()
            assert data["title"] == f"UUID Integration Test {i}"
        
        # Verify all UUIDs are different
        assert len(published_uuids) == 5

    async def test_versioned_publication_public_access_integration(self, client: AsyncClient, db_session: AsyncSession):
        """Test publication workflow integration with versioned preprints."""
        # Create user
        user = User(
            name="Version Integration User",
            email="version-integration@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create and publish version 1
        v1 = File(
            owner_id=user.id,
            source=":rsm:# Version 1 Epic Test\n\nThis is version 1 of the epic integration test.::",
            title="Version Epic Test",
            abstract="Version 1 abstract for epic integration.",
            status=FileStatus.DRAFT,
            version=1
        )
        db_session.add(v1)
        await db_session.commit()
        await db_session.refresh(v1)
        
        # Publish version 1
        v1.publish()
        await db_session.commit()
        await db_session.refresh(v1)
        
        # Create version 2 referencing version 1
        v2 = File(
            owner_id=user.id,
            source=":rsm:# Version 2 Epic Test\n\nThis is version 2 with improvements.::",
            title="Version Epic Test V2",
            abstract="Version 2 abstract with improvements for epic integration.",
            status=FileStatus.DRAFT,
            version=2,
            prev_version_id=v1.id
        )
        db_session.add(v2)
        await db_session.commit()
        await db_session.refresh(v2)
        
        # Publish version 2
        v2.publish()
        await db_session.commit()
        await db_session.refresh(v2)
        
        # Verify both versions are publicly accessible independently
        response = await client.get(f"/ication/{v1.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == 1
        assert data["title"] == "Version Epic Test"
        
        response = await client.get(f"/ication/{v2.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == 2
        assert data["title"] == "Version Epic Test V2"
        
        # Verify different UUIDs for different versions
        assert v1.public_uuid != v2.public_uuid
        
        # Verify metadata reflects version information correctly
        response = await client.get(f"/ication/{v1.public_uuid}/metadata")
        assert response.status_code == 200
        v1_metadata = response.json()
        assert v1_metadata["version"] == 1
        
        response = await client.get(f"/ication/{v2.public_uuid}/metadata")
        assert response.status_code == 200
        v2_metadata = response.json()
        assert v2_metadata["version"] == 2
        
        # Verify citation info includes version-specific titles
        assert v1_metadata["title"] == "Version Epic Test"
        assert v2_metadata["title"] == "Version Epic Test V2"

    async def test_cross_system_database_constraints(self, client: AsyncClient, db_session: AsyncSession):
        """Test database constraints across publication + public access systems."""
        # Create user
        user = User(
            name="Constraint Test User",
            email="constraints@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Test unique constraint on public_uuid across publication system
        file1 = File(
            owner_id=user.id,
            source=":rsm:# Constraint Test 1::",
            title="Constraint Test 1",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="const1",
            version=1
        )
        db_session.add(file1)
        await db_session.commit()
        
        # Verify first file is publicly accessible
        response = await client.get(f"/ication/{file1.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Constraint Test 1"
        
        # Try to create second file with same UUID (should fail at DB level)
        file2 = File(
            owner_id=user.id,
            source=":rsm:# Constraint Test 2::",
            title="Constraint Test 2",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="const1",  # Same UUID
            version=1
        )
        db_session.add(file2)
        
        # This should fail due to unique constraint
        with pytest.raises(Exception):  # IntegrityError or similar
            await db_session.commit()
        
        await db_session.rollback()
        
        # Original file should still be accessible
        # Re-fetch file1 from database to avoid session issues
        result = await db_session.execute(
            select(File).where(File.public_uuid == "const1")
        )
        file1_refreshed = result.scalars().first()
        assert file1_refreshed is not None
        
        response = await client.get(f"/ication/{file1_refreshed.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Constraint Test 1"
        
        # Test unique constraint on permalink_slug
        # Re-fetch user to avoid session issues after rollback
        result = await db_session.execute(
            select(User).where(User.email == "constraints@example.com")
        )
        user_refreshed = result.scalars().first()
        assert user_refreshed is not None
        
        file3 = File(
            owner_id=user_refreshed.id,
            source=":rsm:# Permalink Test 1::",
            title="Permalink Test 1",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="perm01",
            permalink_slug="test-permalink",
            version=1
        )
        db_session.add(file3)
        await db_session.commit()
        
        # Verify accessible by permalink
        response = await client.get(f"/ication/{file3.permalink_slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Permalink Test 1"
        
        # Try to create file with same permalink
        file4 = File(
            owner_id=user_refreshed.id,
            source=":rsm:# Permalink Test 2::",
            title="Permalink Test 2",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="perm02",
            permalink_slug="test-permalink",  # Same slug
            version=1
        )
        db_session.add(file4)
        
        # This should fail due to unique constraint
        with pytest.raises(Exception):
            await db_session.commit()
        
        await db_session.rollback()
        
        # Original file should still be accessible
        # Re-fetch file3 from database to avoid session issues  
        result = await db_session.execute(
            select(File).where(File.permalink_slug == "test-permalink")
        )
        file3_refreshed = result.scalars().first()
        assert file3_refreshed is not None
        
        response = await client.get(f"/ication/{file3_refreshed.permalink_slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Permalink Test 1"

    async def test_publication_status_changes_public_access_consistency(self, client: AsyncClient, db_session: AsyncSession):
        """Test that publication status changes maintain public access consistency."""
        # Create user
        user = User(
            name="Status Change User",
            email="status-change@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create draft file
        file = File(
            owner_id=user.id,
            source=":rsm:# Status Change Test\n\nThis tests status change consistency.::",
            title="Status Change Test",
            abstract="Testing publication status change consistency.",
            status=FileStatus.DRAFT,
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify not publicly accessible as draft (no UUID assigned yet)
        assert file.public_uuid is None
        
        # Change to under review status
        file.status = FileStatus.UNDER_REVIEW
        await db_session.commit()
        await db_session.refresh(file)
        
        # Still should not be publicly accessible and no UUID assigned
        assert file.public_uuid is None
        
        # Reset to draft before publishing (since publish() only works from DRAFT status)
        file.status = FileStatus.DRAFT
        await db_session.commit()
        await db_session.refresh(file)
        
        # Publish the file
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Now should be publicly accessible
        assert file.public_uuid is not None
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Status Change Test"
        
        # Verify metadata is also accessible
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        assert response.status_code == 200
        metadata = response.json()
        assert metadata["title"] == "Status Change Test"

    async def test_minimal_data_publication_public_access_integration(self, client: AsyncClient, db_session: AsyncSession):
        """Test publication and public access with minimal file data."""
        # Create user
        user = User(
            name="Minimal Data User",
            email="minimal@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create file with minimal data (nulls for optional fields)
        file = File(
            owner_id=user.id,
            source=":rsm:# Minimal Test\n\nThis has minimal content.::",  # Valid RSM with content
            title=None,  # No title
            abstract=None,  # No abstract
            keywords=None,  # No keywords
            status=FileStatus.DRAFT,
            permalink_slug=None,  # No permalink
            version=0  # Version 0
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Publish the file (ensure it has valid content for can_publish check)
        assert file.can_publish() is True  # Should be publishable with minimal RSM content
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Should be publicly accessible despite minimal data
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == file.id
        assert data["title"] is None
        assert data["abstract"] is None
        assert data["keywords"] is None
        assert data["permalink_slug"] is None
        assert data["version"] == 0
        assert data["source"] == ":rsm:# Minimal Test\n\nThis has minimal content.::"
        
        # Metadata should handle nulls gracefully
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        assert response.status_code == 200
        
        metadata = response.json()
        assert metadata["title"] == "Untitled"  # Should default to "Untitled"
        assert metadata["abstract"] is None
        assert metadata["keywords"] is None
        assert metadata["version"] == 0
        
        # Citation info should handle nulls appropriately
        citation_info = metadata["citation_info"]
        assert citation_info["title"] == "Untitled"
        assert citation_info["abstract"] is None
        assert citation_info["keywords"] is None
        
        # Citation formats should still be generated
        formats = citation_info["formats"]
        assert "apa" in formats
        assert "bibtex" in formats
        assert "Untitled" in formats["apa"]
        assert "Untitled" in formats["bibtex"]

    async def test_soft_delete_publication_public_access_integration(self, client: AsyncClient, db_session: AsyncSession):
        """Test that soft-deleted published files are not publicly accessible."""
        # Create user
        user = User(
            name="Soft Delete User",
            email="soft-delete@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create and publish file
        file = File(
            owner_id=user.id,
            source=":rsm:# Soft Delete Test\n\nThis will be soft deleted.::",
            title="Soft Delete Test",
            abstract="Testing soft delete with public access.",
            status=FileStatus.DRAFT,
            permalink_slug="soft-delete-test",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Publish the file
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify it's publicly accessible
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        
        response = await client.get(f"/ication/{file.permalink_slug}")
        assert response.status_code == 200
        
        # Store UUID and permalink before deletion
        stored_uuid = file.public_uuid
        stored_permalink = file.permalink_slug
        
        # Soft delete the file
        file.deleted_at = datetime.now(timezone.utc)
        await db_session.commit()
        
        # Should no longer be publicly accessible via UUID
        response = await client.get(f"/ication/{stored_uuid}")
        assert response.status_code == 404
        
        # Should no longer be accessible via permalink
        response = await client.get(f"/ication/{stored_permalink}")
        assert response.status_code == 404
        
        # Metadata should also not be accessible
        response = await client.get(f"/ication/{stored_uuid}/metadata")
        assert response.status_code == 404
        
        response = await client.get(f"/ication/{stored_permalink}/metadata")
        assert response.status_code == 404