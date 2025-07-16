"""Integration tests for public preprint access without authentication.

Tests the complete public access workflow including database interactions,
endpoint behavior, and cross-system integration without authentication.
"""

from datetime import datetime, timezone

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from aris.models.models import File, FileStatus, User


class TestPublicAccessIntegration:
    """Integration tests for public preprint access system."""

    async def test_complete_publication_to_public_access_workflow(self, client: AsyncClient, db_session: AsyncSession):
        """Test complete workflow from file creation to public access."""
        # Create user
        user = User(
            name="Publication User",
            email="publisher@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create and publish file
        file = File(
            owner_id=user.id,
            source=":rsm:# Integration Test Publication\n\nThis is a comprehensive integration test.::",
            title="Integration Test Publication",
            abstract="Testing the complete publication to public access workflow.",
            keywords="integration, test, publication, workflow",
            status=FileStatus.DRAFT,
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Publish the file
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify publication status
        assert file.status == FileStatus.PUBLISHED
        assert file.published_at is not None
        assert file.public_uuid is not None
        assert len(file.public_uuid) == 6
        
        # Test public access via UUID
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
        
        # Test metadata access
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        assert response.status_code == 200
        
        metadata = response.json()
        assert metadata["id"] == file.id
        assert metadata["title"] == file.title
        assert "citation_info" in metadata
        
        # Verify citation formats
        citation_info = metadata["citation_info"]
        assert "formats" in citation_info
        assert "apa" in citation_info["formats"]
        assert "bibtex" in citation_info["formats"]
        assert file.title in citation_info["formats"]["apa"]

    async def test_public_access_with_custom_permalink_workflow(self, client: AsyncClient, db_session: AsyncSession):
        """Test public access workflow with custom permalink slugs."""
        # Create user
        user = User(
            name="Permalink User",
            email="permalink@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create file with custom permalink
        file = File(
            owner_id=user.id,
            source=":rsm:# Custom Permalink Test\n\nThis tests custom permalinks.::",
            title="Custom Permalink Test",
            abstract="Testing custom permalink functionality in public access.",
            keywords="permalink, custom, test",
            status=FileStatus.DRAFT,
            permalink_slug="custom-permalink-integration-test",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Publish the file
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Test access via UUID
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["permalink_slug"] == "custom-permalink-integration-test"
        
        # Test access via permalink slug
        response = await client.get(f"/ication/{file.permalink_slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == file.id
        assert data["public_uuid"] == file.public_uuid
        assert data["permalink_slug"] == file.permalink_slug
        
        # Test metadata access via slug
        response = await client.get(f"/ication/{file.permalink_slug}/metadata")
        assert response.status_code == 200
        metadata = response.json()
        assert metadata["id"] == file.id
        assert metadata["permalink_slug"] == file.permalink_slug

    async def test_public_access_security_isolation(self, client: AsyncClient, db_session: AsyncSession):
        """Test that public access is properly isolated from authentication."""
        # Create user
        user = User(
            name="Security User",
            email="security@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create published file
        published_file = File(
            owner_id=user.id,
            source=":rsm:# Published File\n\nThis is published.::",
            title="Published File",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="pub001",
            version=1
        )
        db_session.add(published_file)
        
        # Create draft file  
        draft_file = File(
            owner_id=user.id,
            source=":rsm:# Draft File\n\nThis is a draft.::",
            title="Draft File",
            status=FileStatus.DRAFT,
            public_uuid="drft01",  # Even with UUID, should not be accessible
            version=1
        )
        db_session.add(draft_file)
        
        await db_session.commit()
        
        # Published file should be accessible
        response = await client.get(f"/ication/{published_file.public_uuid}")
        assert response.status_code == 200
        
        # Draft file should not be accessible even with UUID
        response = await client.get(f"/ication/{draft_file.public_uuid}")
        assert response.status_code == 404
        
        # Non-existent file should return 404
        response = await client.get("/ication/nonexist")
        assert response.status_code == 404

    @pytest.mark.skip(reason="Skipping due to client fixture issue")
    async def test_public_access_database_constraint_integration(self, client: AsyncClient, db_session: AsyncSession):
        """Test public access with database constraints and edge cases."""
        # Create user
        user = User(
            name="Constraint User",
            email="constraints@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create file with minimal data
        file = File(
            owner_id=user.id,
            source=":rsm:# Minimal Data Test::",
            title=None,  # No title
            abstract=None,  # No abstract
            keywords=None,  # No keywords
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="min001",
            permalink_slug=None,  # No permalink
            version=0  # Version 0
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Should still be accessible
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == file.id
        assert data["title"] is None
        assert data["abstract"] is None
        assert data["keywords"] is None
        assert data["permalink_slug"] is None
        assert data["version"] == 0
        
        # Metadata should handle nulls gracefully
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        assert response.status_code == 200
        
        metadata = response.json()
        assert metadata["title"] == "Untitled"  # Should default to "Untitled"
        assert metadata["abstract"] is None
        assert metadata["keywords"] is None
        
        # Citation info should handle nulls
        citation_info = metadata["citation_info"]
        assert citation_info["title"] == "Untitled"
        assert citation_info["abstract"] is None
        assert citation_info["keywords"] is None

    async def test_public_access_version_chain_integration(self, client: AsyncClient, db_session: AsyncSession):
        """Test public access with versioned preprints."""
        # Create user
        user = User(
            name="Version User",
            email="version@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create original version
        v1 = File(
            owner_id=user.id,
            source=":rsm:# Version 1\n\nThis is version 1.::",
            title="Version Test Paper",
            abstract="Version 1 abstract.",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="ver001",
            version=1
        )
        db_session.add(v1)
        await db_session.commit()
        await db_session.refresh(v1)
        
        # Create version 2
        v2 = File(
            owner_id=user.id,
            source=":rsm:# Version 2\n\nThis is version 2 with updates.::",
            title="Version Test Paper V2",
            abstract="Version 2 abstract with improvements.",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="ver002",
            version=2,
            prev_version_id=v1.id
        )
        db_session.add(v2)
        await db_session.commit()
        
        # Both versions should be accessible independently
        response = await client.get(f"/ication/{v1.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == 1
        assert data["title"] == "Version Test Paper"
        
        response = await client.get(f"/ication/{v2.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == 2
        assert data["title"] == "Version Test Paper V2"
        
        # Metadata should reflect version information
        response = await client.get(f"/ication/{v2.public_uuid}/metadata")
        assert response.status_code == 200
        metadata = response.json()
        assert metadata["version"] == 2

    async def test_public_access_concurrent_requests(self, client: AsyncClient, db_session: AsyncSession):
        """Test public access under concurrent requests."""
        # Create user
        user = User(
            name="Concurrent User",
            email="concurrent@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create published file
        file = File(
            owner_id=user.id,
            source=":rsm:# Concurrent Test\n\nThis tests concurrent access.::",
            title="Concurrent Access Test",
            abstract="Testing concurrent access to public preprints.",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="conc01",
            permalink_slug="concurrent-access-test",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        
        # Make multiple concurrent requests
        import asyncio
        
        async def make_request(endpoint):
            response = await client.get(endpoint)
            return response.status_code, response.json()
        
        # Test concurrent access to the same file
        tasks = [
            make_request(f"/ication/{file.public_uuid}"),
            make_request(f"/ication/{file.permalink_slug}"),
            make_request(f"/ication/{file.public_uuid}/metadata"),
            make_request(f"/ication/{file.permalink_slug}/metadata"),
        ]
        
        results = await asyncio.gather(*tasks)
        
        # All requests should succeed
        for status_code, data in results:
            assert status_code == 200
            assert data["id"] == file.id

    async def test_public_access_with_deleted_preprints(self, client: AsyncClient, db_session: AsyncSession):
        """Test that deleted preprints are not accessible via public endpoints."""
        # Create user
        user = User(
            name="Delete User",
            email="delete@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create published file
        file = File(
            owner_id=user.id,
            source=":rsm:# Delete Test\n\nThis will be deleted.::",
            title="Delete Test",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="del001",
            permalink_slug="delete-test",
            version=1
        )
        db_session.add(file)
        await db_session.commit()
        
        # File should be accessible initially
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 200
        
        # Soft delete the file
        file.deleted_at = datetime.now(timezone.utc)
        await db_session.commit()
        
        # File should no longer be accessible
        response = await client.get(f"/ication/{file.public_uuid}")
        assert response.status_code == 404
        
        response = await client.get(f"/ication/{file.permalink_slug}")
        assert response.status_code == 404
        
        response = await client.get(f"/ication/{file.public_uuid}/metadata")
        assert response.status_code == 404

    async def test_public_access_uuid_uniqueness_enforcement(self, client: AsyncClient, db_session: AsyncSession):
        """Test that UUID uniqueness is enforced in public access."""
        # Create user
        user = User(
            name="UUID User",
            email="uuid@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create first file
        file1 = File(
            owner_id=user.id,
            source=":rsm:# UUID Test 1::",
            title="UUID Test 1",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="uuid01",
            version=1
        )
        db_session.add(file1)
        await db_session.commit()
        
        # Access should work for first file
        response = await client.get(f"/ication/{file1.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "UUID Test 1"
        
        # Try to create second file with same UUID (should fail at DB level)
        file2 = File(
            owner_id=user.id,
            source=":rsm:# UUID Test 2::",
            title="UUID Test 2",
            status=FileStatus.PUBLISHED,
            published_at=datetime.now(timezone.utc),
            public_uuid="uuid01",  # Same UUID
            version=1
        )
        db_session.add(file2)
        
        # This should fail due to unique constraint
        with pytest.raises(Exception):  # IntegrityError or similar
            await db_session.commit()
        
        await db_session.rollback()
        
        # Original file should still be accessible
        # Re-fetch the file to avoid session issues after rollback
        await db_session.refresh(file1)
        response = await client.get(f"/ication/{file1.public_uuid}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "UUID Test 1"

    async def test_public_access_performance_with_large_datasets(self, client: AsyncClient, db_session: AsyncSession):
        """Test public access performance with multiple preprints."""
        # Create user
        user = User(
            name="Performance User",
            email="performance@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create multiple published files
        files = []
        for i in range(50):  # Create 50 files
            file = File(
                owner_id=user.id,
                source=f":rsm:# Performance Test {i}\n\nThis is performance test {i}.::",
                title=f"Performance Test {i}",
                abstract=f"Abstract for performance test {i}.",
                status=FileStatus.PUBLISHED,
                published_at=datetime.now(timezone.utc),
                public_uuid=f"perf{i:02d}",
                version=1
            )
            files.append(file)
            db_session.add(file)
        
        await db_session.commit()
        
        # Test access to various files
        import time
        
        start_time = time.time()
        
        # Access multiple files
        for i in [0, 10, 25, 40, 49]:
            response = await client.get(f"/ication/{files[i].public_uuid}")
            assert response.status_code == 200
            data = response.json()
            assert data["title"] == f"Performance Test {i}"
        
        end_time = time.time()
        access_time = end_time - start_time
        
        # Should complete within reasonable time
        assert access_time < 2.0, f"Public access took {access_time:.2f}s"
        
        # Test metadata access performance
        start_time = time.time()
        
        response = await client.get(f"/ication/{files[25].public_uuid}/metadata")
        assert response.status_code == 200
        
        end_time = time.time()
        metadata_time = end_time - start_time
        
        # Metadata access should be fast
        assert metadata_time < 1.0, f"Metadata access took {metadata_time:.2f}s"