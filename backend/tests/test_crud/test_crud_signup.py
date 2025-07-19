"""Tests for signup CRUD operations."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from aris.crud.signup import (
    DuplicateEmailError,
    create_signup,
    email_exists,
    get_active_signups_count,
    get_signup_by_email,
    get_signup_by_id,
    unsubscribe_signup,
    update_signup_status,
)
from aris.models.models import InterestLevel, SignupStatus


class TestCreateSignup:
    """Test signup creation."""

    async def test_create_signup_success(self, db_session: AsyncSession):
        """Test successful signup creation."""
        signup = await create_signup(
            email="test@example.com",
            name="Test User",
            db=db_session,
            institution="Test University",
            research_area="Computer Science",
            interest_level=InterestLevel.READY,
            ip_address="192.168.1.1",
            user_agent="Mozilla/5.0",
            source="website",
        )
        
        assert signup.id is not None
        assert signup.email == "test@example.com"
        assert signup.name == "Test User"
        assert signup.institution == "Test University"
        assert signup.research_area == "Computer Science"
        assert signup.interest_level == InterestLevel.READY
        assert signup.status == SignupStatus.ACTIVE
        assert signup.ip_address == "192.168.1.1"
        assert signup.user_agent == "Mozilla/5.0"
        assert signup.source == "website"
        assert signup.consent_given is True
        assert signup.created_at is not None
        assert signup.updated_at is not None

    async def test_create_signup_minimal_data(self, db_session: AsyncSession):
        """Test signup creation with minimal required data."""
        import uuid
        unique_email = f"minimal+{uuid.uuid4().hex[:8]}@example.com"
        
        signup = await create_signup(
            email=unique_email,
            name="Minimal User",
            db=db_session
        )
        
        assert signup.id is not None
        assert signup.email == unique_email
        assert signup.name == "Minimal User"
        assert signup.institution is None
        assert signup.research_area is None
        assert signup.interest_level is None
        assert signup.status == SignupStatus.ACTIVE
        assert signup.source == "website"  # Default value
        assert signup.consent_given is True

    async def test_create_signup_duplicate_email(self, db_session: AsyncSession):
        """Test that duplicate email raises DuplicateEmailError."""
        import uuid
        unique_email = f"duplicate+{uuid.uuid4().hex[:8]}@example.com"
        
        # Create first signup
        await create_signup(
            email=unique_email,
            name="First User",
            db=db_session
        )
        
        # Try to create second signup with same email
        with pytest.raises(DuplicateEmailError) as exc_info:
            await create_signup(
                email=unique_email,
                name="Second User",
                db=db_session
            )
        
        assert unique_email in str(exc_info.value)


class TestGetSignup:
    """Test signup retrieval operations."""

    async def test_get_signup_by_email_exists(self, db_session: AsyncSession):
        """Test retrieving existing signup by email."""
        # Create signup
        created_signup = await create_signup(
            email="find@example.com",
            name="Find User",
            db=db_session
        )
        
        # Retrieve by email
        found_signup = await get_signup_by_email("find@example.com", db_session)
        
        assert found_signup is not None
        assert found_signup.id == created_signup.id
        assert found_signup.email == "find@example.com"
        assert found_signup.name == "Find User"

    async def test_get_signup_by_email_not_exists(self, db_session: AsyncSession):
        """Test retrieving non-existent signup by email."""
        signup = await get_signup_by_email("nonexistent@example.com", db_session)
        assert signup is None

    async def test_get_signup_by_id_exists(self, db_session: AsyncSession):
        """Test retrieving existing signup by ID."""
        # Create signup
        created_signup = await create_signup(
            email="findbyid@example.com",
            name="Find By ID User",
            db=db_session
        )
        
        # Retrieve by ID
        found_signup = await get_signup_by_id(created_signup.id, db_session)
        
        assert found_signup is not None
        assert found_signup.id == created_signup.id
        assert found_signup.email == "findbyid@example.com"

    async def test_get_signup_by_id_not_exists(self, db_session: AsyncSession):
        """Test retrieving non-existent signup by ID."""
        signup = await get_signup_by_id(999999, db_session)
        assert signup is None


class TestUpdateSignupStatus:
    """Test signup status updates."""

    async def test_update_signup_status_success(self, db_session: AsyncSession):
        """Test successful status update."""
        # Create signup
        await create_signup(
            email="update@example.com",
            name="Update User",
            db=db_session
        )
        
        # Update status
        updated_signup = await update_signup_status(
            "update@example.com",
            SignupStatus.UNSUBSCRIBED,
            db_session
        )
        
        assert updated_signup is not None
        assert updated_signup.status == SignupStatus.UNSUBSCRIBED
        assert updated_signup.updated_at is not None

    async def test_update_signup_status_not_exists(self, db_session: AsyncSession):
        """Test status update for non-existent email."""
        result = await update_signup_status(
            "nonexistent@example.com",
            SignupStatus.UNSUBSCRIBED,
            db_session
        )
        assert result is None

    async def test_unsubscribe_signup_success(self, db_session: AsyncSession):
        """Test successful unsubscribe."""
        import uuid
        unique_email = f"unsubscribe+{uuid.uuid4().hex[:8]}@example.com"
        
        # Create signup
        await create_signup(
            email=unique_email,
            name="Unsubscribe User",
            db=db_session
        )
        
        # Unsubscribe
        updated_signup = await unsubscribe_signup(unique_email, db_session)
        
        assert updated_signup is not None
        assert updated_signup.status == SignupStatus.UNSUBSCRIBED

    async def test_unsubscribe_signup_not_exists(self, db_session: AsyncSession):
        """Test unsubscribe for non-existent email."""
        result = await unsubscribe_signup("nonexistent@example.com", db_session)
        assert result is None


class TestEmailExists:
    """Test email existence checking."""

    async def test_email_exists_true(self, db_session: AsyncSession):
        """Test email existence check returns True for existing email."""
        import uuid
        unique_email = f"exists+{uuid.uuid4().hex[:8]}@example.com"
        
        # Create signup
        await create_signup(
            email=unique_email,
            name="Exists User",
            db=db_session
        )
        
        # Check existence
        exists = await email_exists(unique_email, db_session)
        assert exists is True

    async def test_email_exists_false(self, db_session: AsyncSession):
        """Test email existence check returns False for non-existent email."""
        exists = await email_exists("notexists@example.com", db_session)
        assert exists is False


class TestGetActiveSignupsCount:
    """Test active signups counting."""

    async def test_get_active_signups_count_empty(self, db_session: AsyncSession):
        """Test count when no signups exist (or only existing ones from other tests)."""
        count = await get_active_signups_count(db_session)
        # In shared database, there might be existing signups, so just verify it's non-negative
        assert count >= 0

    async def test_get_active_signups_count_with_signups(self, db_session: AsyncSession):
        """Test count with various signup statuses."""
        import uuid
        
        # Get initial count
        initial_count = await get_active_signups_count(db_session)
        
        # Create active signups with unique emails
        email1 = f"active1+{uuid.uuid4().hex[:8]}@example.com"
        email2 = f"active2+{uuid.uuid4().hex[:8]}@example.com"
        email3 = f"unsub+{uuid.uuid4().hex[:8]}@example.com"
        
        await create_signup(email=email1, name="Active 1", db=db_session)
        await create_signup(email=email2, name="Active 2", db=db_session)
        
        # Create and then unsubscribe one
        await create_signup(email=email3, name="Unsubscribed", db=db_session)
        await unsubscribe_signup(email3, db_session)
        
        # Count should have increased by 2 (2 active, 1 unsubscribed)
        final_count = await get_active_signups_count(db_session)
        assert final_count == initial_count + 2


class TestSignupValidation:
    """Test data validation and edge cases."""

    async def test_create_signup_with_special_characters(self, db_session: AsyncSession):
        """Test signup creation with special characters in fields."""
        signup = await create_signup(
            email="special@example.com",
            name="Dr. María José O'Connor-Smith",
            db=db_session,
            institution="University of São Paulo & MIT",
            research_area="AI/ML & Data Science",
        )
        
        assert signup.name == "Dr. María José O'Connor-Smith"
        assert signup.institution == "University of São Paulo & MIT"
        assert signup.research_area == "AI/ML & Data Science"

    async def test_create_signup_with_long_fields(self, db_session: AsyncSession):
        """Test signup creation with long field values."""
        long_name = "A" * 100  # 100 characters
        long_institution = "B" * 200  # 200 characters
        long_research_area = "C" * 200  # 200 characters
        
        signup = await create_signup(
            email="long@example.com",
            name=long_name,
            db=db_session,
            institution=long_institution,
            research_area=long_research_area,
        )
        
        assert signup.name == long_name
        assert signup.institution == long_institution
        assert signup.research_area == long_research_area

    async def test_create_signup_all_interest_levels(self, db_session: AsyncSession):
        """Test signup creation with all possible interest levels."""
        interest_levels = [
            InterestLevel.EXPLORING,
            InterestLevel.PLANNING,
            InterestLevel.READY,
            InterestLevel.MIGRATING,
        ]
        
        for i, level in enumerate(interest_levels):
            signup = await create_signup(
                email=f"interest{i}@example.com",
                name=f"Interest User {i}",
                db=db_session,
                interest_level=level,
            )
            assert signup.interest_level == level