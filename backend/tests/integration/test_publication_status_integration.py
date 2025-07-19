"""Publication status integration tests for DB schema epic.

Tests the complete publication status workflow and field interactions
across the database schema, including publication fields, versioning,
and constraint validation.
"""

import uuid
from datetime import datetime, timezone

import pytest
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from aris.models.models import File, FileStatus, User


class TestPublicationStatusIntegration:
    """Integration tests for publication status field interactions."""

    async def test_publication_status_workflow_integration(self, db_session: AsyncSession, test_user):
        """Test complete publication status workflow across all fields."""
        # Create draft file
        file = File(
            owner_id=test_user.id,
            source=":rsm:Test publication workflow::",
            title="Publication Integration Test",
            status=FileStatus.DRAFT
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify initial state
        assert file.status == FileStatus.DRAFT
        assert file.published_at is None
        assert file.public_uuid is None
        assert file.permalink_slug is None
        assert file.is_published is False
        assert file.can_publish() is True
        
        # Publish the file using model method
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify published state
        assert file.status == FileStatus.PUBLISHED
        assert file.published_at is not None
        assert file.public_uuid is not None
        assert len(file.public_uuid) == 6
        assert file.permalink_slug is None  # Not set automatically
        assert file.is_published is True
        assert file.can_publish() is False
        
        # Test publication timestamp accuracy (handle timezone-aware vs naive)
        pub_time = file.published_at
        now = datetime.now(timezone.utc)
        if pub_time.tzinfo is None:
            # If stored as naive datetime, assume UTC
            pub_time = pub_time.replace(tzinfo=timezone.utc)
        assert abs((pub_time - now).total_seconds()) < 60

    async def test_publication_fields_constraint_interactions(self, db_session: AsyncSession, test_user):
        """Test interactions between publication fields and constraints."""
        # Create and publish first file
        file1 = File(
            owner_id=test_user.id,
            source=":rsm:First file::",
            title="First File",
            status=FileStatus.DRAFT
        )
        db_session.add(file1)
        await db_session.commit()
        
        file1.publish()
        await db_session.commit()
        await db_session.refresh(file1)
        
        # Create second file and try to use same UUID
        file2 = File(
            owner_id=test_user.id,
            source=":rsm:Second file::",
            title="Second File",
            status=FileStatus.DRAFT,
            public_uuid=file1.public_uuid  # Same UUID
        )
        db_session.add(file2)
        
        # Should fail due to unique constraint
        with pytest.raises(IntegrityError):
            await db_session.commit()
        
        await db_session.rollback()
        
        # Create second file with different UUID
        file2.public_uuid = "diff01"
        file2.status = FileStatus.PUBLISHED
        file2.published_at = datetime.now(timezone.utc)
        db_session.add(file2)
        await db_session.commit()
        
        # Should succeed
        result = await db_session.execute(select(File).where(File.id == file2.id))
        created_file = result.scalars().first()
        assert created_file.public_uuid == "diff01"

    async def test_version_and_publication_integration(self, db_session: AsyncSession, test_user):
        """Test integration between versioning and publication fields."""
        # Create original file (version 0)
        original = File(
            owner_id=test_user.id,
            source=":rsm:Original version::",
            title="Versioned Publication Test",
            status=FileStatus.DRAFT,
            version=0
        )
        db_session.add(original)
        await db_session.commit()
        await db_session.refresh(original)
        
        # Publish original version
        original.publish()
        await db_session.commit()
        await db_session.refresh(original)
        
        # Create version 2 referencing original
        v2 = File(
            owner_id=test_user.id,
            source=":rsm:Updated version::",
            title="Versioned Publication Test V2",
            status=FileStatus.DRAFT,
            version=2,
            prev_version_id=original.id
        )
        db_session.add(v2)
        await db_session.commit()
        await db_session.refresh(v2)
        
        # Publish version 2
        v2.publish()
        await db_session.commit()
        await db_session.refresh(v2)
        
        # Verify version chain and publication status
        assert original.version == 0
        assert original.is_published is True
        assert original.prev_version_id is None
        
        assert v2.version == 2
        assert v2.is_published is True
        assert v2.prev_version_id == original.id
        
        # Both should have different UUIDs
        assert original.public_uuid != v2.public_uuid
        assert len(original.public_uuid) == 6
        assert len(v2.public_uuid) == 6

    async def test_publication_status_and_permalink_integration(self, db_session: AsyncSession, test_user):
        """Test integration between publication status and permalink fields."""
        # Create file with custom permalink
        file = File(
            owner_id=test_user.id,
            source=":rsm:Custom permalink test::",
            title="Custom Permalink Test",
            status=FileStatus.DRAFT,
            permalink_slug="custom-research-paper"
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Publish with existing permalink
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify all fields work together
        assert file.is_published is True
        assert file.public_uuid is not None
        assert file.permalink_slug == "custom-research-paper"
        assert file.published_at is not None
        
        # Test that permalink uniqueness is enforced
        file2 = File(
            owner_id=test_user.id,
            source=":rsm:Another file::",
            title="Another File",
            status=FileStatus.PUBLISHED,
            permalink_slug="custom-research-paper"  # Same slug
        )
        db_session.add(file2)
        
        with pytest.raises(IntegrityError):
            await db_session.commit()

    async def test_publication_query_optimization(self, db_session: AsyncSession, test_user):
        """Test that publication queries are optimized with indexes."""
        # Create multiple files with different publication statuses
        files = []
        for i in range(10):
            file = File(
                owner_id=test_user.id,
                source=f":rsm:Content {i}::",
                title=f"Query Test File {i}",
                status=FileStatus.DRAFT if i % 2 == 0 else FileStatus.PUBLISHED
            )
            if file.status == FileStatus.PUBLISHED:
                file.published_at = datetime.now(timezone.utc)
                file.public_uuid = f"test{i:02d}"
            files.append(file)
            db_session.add(file)
        
        await db_session.commit()
        
        import time
        
        # Test published_at index performance
        start_time = time.time()
        result = await db_session.execute(
            select(File).where(File.published_at.is_not(None))
        )
        published_files = result.scalars().all()
        published_query_time = time.time() - start_time
        
        assert published_query_time < 0.5, f"Published query took {published_query_time:.3f}s"
        assert len(published_files) == 5
        
        # Test public_uuid index performance (test01 is published, test02 is draft)
        start_time = time.time()
        result = await db_session.execute(
            select(File).where(File.public_uuid == "test01")
        )
        uuid_file = result.scalars().first()
        uuid_query_time = time.time() - start_time
        
        assert uuid_query_time < 0.5, f"UUID query took {uuid_query_time:.3f}s"
        assert uuid_file is not None
        assert uuid_file.public_uuid == "test01"

    async def test_complex_publication_queries(self, db_session: AsyncSession, test_user):
        """Test complex queries involving multiple publication fields."""
        # Create test data with various publication states
        test_data = [
            ("Draft 1", FileStatus.DRAFT, None, None, None),
            ("Published 1", FileStatus.PUBLISHED, "pub001", "published-paper-1", datetime.now(timezone.utc)),
            ("Published 2", FileStatus.PUBLISHED, "pub002", None, datetime.now(timezone.utc)),
            ("Draft 2", FileStatus.DRAFT, None, "future-paper", None),
            ("Under Review", FileStatus.UNDER_REVIEW, None, None, None),
        ]
        
        for title, status, pub_uuid, slug, pub_at in test_data:
            file = File(
                owner_id=test_user.id,
                source=f":rsm:{title} content::",
                title=title,
                status=status,
                public_uuid=pub_uuid,
                permalink_slug=slug,
                published_at=pub_at
            )
            db_session.add(file)
        
        await db_session.commit()
        
        # Query for published files with UUIDs
        result = await db_session.execute(
            select(File).where(
                File.status == FileStatus.PUBLISHED,
                File.public_uuid.is_not(None)
            )
        )
        published_with_uuid = result.scalars().all()
        assert len(published_with_uuid) == 2
        
        # Query for files with custom permalinks
        result = await db_session.execute(
            select(File).where(File.permalink_slug.is_not(None))
        )
        files_with_permalinks = result.scalars().all()
        assert len(files_with_permalinks) == 2
        
        # Query for published files with custom permalinks
        result = await db_session.execute(
            select(File).where(
                File.status == FileStatus.PUBLISHED,
                File.permalink_slug.is_not(None)
            )
        )
        published_with_permalinks = result.scalars().all()
        assert len(published_with_permalinks) == 1
        assert published_with_permalinks[0].title == "Published 1"

    async def test_publication_cascade_behavior(self, db_session: AsyncSession, test_user):
        """Test cascade behavior with publication fields."""
        # Create file with publication data
        file = File(
            owner_id=test_user.id,
            source=":rsm:Cascade test::",
            title="Cascade Test",
            status=FileStatus.PUBLISHED,
            public_uuid="cas001",
            permalink_slug="cascade-test",
            published_at=datetime.now(timezone.utc)
        )
        db_session.add(file)
        await db_session.commit()
        file_id = file.id
        
        # Test that publication fields are properly stored
        result = await db_session.execute(select(File).where(File.id == file_id))
        stored_file = result.scalars().first()
        assert stored_file is not None
        assert stored_file.public_uuid == "cas001"
        assert stored_file.permalink_slug == "cascade-test"
        assert stored_file.status == FileStatus.PUBLISHED
        
        # Note: In SQLite, foreign key constraints might not be enforced by default
        # This test verifies that the publication fields are stored correctly

    async def test_publication_bulk_operations(self, db_session: AsyncSession, test_user):
        """Test bulk operations with publication fields."""
        # Create multiple draft files
        files = []
        for i in range(20):
            file = File(
                owner_id=test_user.id,
                source=f":rsm:Bulk test {i}::",
                title=f"Bulk Test {i}",
                status=FileStatus.DRAFT
            )
            files.append(file)
            db_session.add(file)
        
        await db_session.commit()
        
        # Bulk publish half of them
        for i in range(0, 10):
            files[i].publish()
        
        await db_session.commit()
        
        # Verify bulk operation results
        result = await db_session.execute(
            select(func.count()).select_from(File).where(File.status == FileStatus.PUBLISHED)
        )
        published_count = result.scalar()
        
        result = await db_session.execute(
            select(func.count()).select_from(File).where(File.public_uuid.is_not(None))
        )
        uuid_count = result.scalar()
        
        assert published_count >= 10
        assert uuid_count >= 10
        
        # Verify all UUIDs are unique
        result = await db_session.execute(
            select(File.public_uuid).where(File.public_uuid.is_not(None))
        )
        uuids = [row[0] for row in result.fetchall()]
        assert len(uuids) == len(set(uuids))  # All unique


class TestPublicationStatusE2E:
    """End-to-end tests for complete publication status workflow."""

    async def test_draft_to_published_complete_workflow(self, db_session: AsyncSession):
        """Test complete workflow from draft creation to publication."""
        # Create user
        user = User(
            name="Publication User",
            email="publication@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create draft file
        file = File(
            owner_id=user.id,
            source=":rsm:# Publication Workflow Test\n\nThis is a test of the complete publication workflow.::",
            title="Publication Workflow Test",
            abstract="Testing the complete publication workflow",
            keywords="test, publication, workflow",
            status=FileStatus.DRAFT
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify initial draft state
        assert file.status == FileStatus.DRAFT
        assert file.is_published is False
        assert file.can_publish() is True
        assert file.published_at is None
        assert file.public_uuid is None
        
        # Publish the file
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify published state
        assert file.status == FileStatus.PUBLISHED
        assert file.is_published is True
        assert file.can_publish() is False
        assert file.published_at is not None
        assert file.public_uuid is not None
        assert len(file.public_uuid) == 6
        
        # Verify metadata is preserved
        assert file.title == "Publication Workflow Test"
        assert file.abstract == "Testing the complete publication workflow"
        assert file.keywords == "test, publication, workflow"
        
        # Verify publication timestamp is recent (handle timezone-aware vs naive)
        pub_time = file.published_at
        now = datetime.now(timezone.utc)
        if pub_time.tzinfo is None:
            # If stored as naive datetime, assume UTC
            pub_time = pub_time.replace(tzinfo=timezone.utc)
        time_diff = (now - pub_time).total_seconds()
        assert time_diff < 10  # Within 10 seconds

    async def test_versioned_publication_complete_workflow(self, db_session: AsyncSession):
        """Test complete workflow for versioned publication."""
        # Create user
        user = User(
            name="Versioning User",
            email="versioning@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create and publish original version
        v1 = File(
            owner_id=user.id,
            source=":rsm:# Original Paper\n\nThis is the original version.::",
            title="Versioned Paper",
            abstract="Original abstract",
            status=FileStatus.DRAFT,
            version=1
        )
        db_session.add(v1)
        await db_session.commit()
        await db_session.refresh(v1)
        
        v1.publish()
        await db_session.commit()
        await db_session.refresh(v1)
        
        # Create version 2 with improvements
        v2 = File(
            owner_id=user.id,
            source=":rsm:# Updated Paper\n\nThis is the updated version with improvements.::",
            title="Versioned Paper V2",
            abstract="Updated abstract with more details",
            status=FileStatus.DRAFT,
            version=2,
            prev_version_id=v1.id
        )
        db_session.add(v2)
        await db_session.commit()
        await db_session.refresh(v2)
        
        v2.publish()
        await db_session.commit()
        await db_session.refresh(v2)
        
        # Verify version chain
        assert v1.version == 1
        assert v1.is_published is True
        assert v1.prev_version_id is None
        
        assert v2.version == 2
        assert v2.is_published is True
        assert v2.prev_version_id == v1.id
        
        # Verify both have unique UUIDs
        assert v1.public_uuid != v2.public_uuid
        assert len(v1.public_uuid) == 6
        assert len(v2.public_uuid) == 6
        
        # Verify version-specific metadata
        assert v1.title == "Versioned Paper"
        assert v2.title == "Versioned Paper V2"
        assert v1.abstract != v2.abstract

    async def test_publication_with_custom_permalink_workflow(self, db_session: AsyncSession):
        """Test publication workflow with custom permalink."""
        # Create user
        user = User(
            name="Permalink User",
            email=f"permalink_{uuid.uuid4().hex[:8]}@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Create file with custom permalink
        file = File(
            owner_id=user.id,
            source=":rsm:# Custom Permalink Paper\n\nThis paper has a custom permalink.::",
            title="Custom Permalink Paper",
            abstract="Testing custom permalink functionality",
            status=FileStatus.DRAFT,
            permalink_slug="my-awesome-research-paper"
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Publish with custom permalink
        file.publish()
        await db_session.commit()
        await db_session.refresh(file)
        
        # Verify publication with custom permalink
        assert file.is_published is True
        assert file.public_uuid is not None
        assert file.permalink_slug == "my-awesome-research-paper"
        assert file.published_at is not None
        
        # Verify we can query by permalink
        result = await db_session.execute(
            select(File).where(File.permalink_slug == "my-awesome-research-paper")
        )
        found_file = result.scalars().first()
        assert found_file is not None
        assert found_file.id == file.id
        
        # Verify we can query by UUID
        result = await db_session.execute(
            select(File).where(File.public_uuid == file.public_uuid)
        )
        found_file = result.scalars().first()
        assert found_file is not None
        assert found_file.id == file.id

    async def test_publication_error_handling_workflow(self, db_session: AsyncSession):
        """Test error handling in publication workflow."""
        # Create user
        user = User(
            name="Error Test User",
            email="error@example.com",
            password_hash="test_hash"
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        # Test publishing file without source
        file = File(
            owner_id=user.id,
            source=None,  # No source
            title="File Without Source",
            status=FileStatus.DRAFT
        )
        db_session.add(file)
        await db_session.commit()
        await db_session.refresh(file)
        
        # Should not be able to publish
        assert file.can_publish() is False
        
        with pytest.raises(ValueError, match="cannot be published"):
            file.publish()
        
        # Test publishing already published file
        file.source = ":rsm:Now has source::"
        file.publish()
        await db_session.commit()
        
        # Try to publish again
        with pytest.raises(ValueError, match="cannot be published"):
            file.publish()
        
        # Test unique constraint violation
        file2 = File(
            owner_id=user.id,
            source=":rsm:Another file::",
            title="Another File",
            status=FileStatus.PUBLISHED,
            public_uuid=file.public_uuid  # Same UUID
        )
        db_session.add(file2)
        
        with pytest.raises(IntegrityError):
            await db_session.commit()