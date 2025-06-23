"""Tests for signup model functionality."""

from aris.models.models import InterestLevel, Signup, SignupStatus


class TestSignupModel:
    """Test Signup model behavior."""

    def test_signup_model_creation(self):
        """Test basic signup model creation."""
        signup = Signup(
            email="test@example.com",
            name="Test User",
            institution="Test University",
            research_area="Computer Science",
            interest_level=InterestLevel.READY,
            status=SignupStatus.ACTIVE,
            source="website",
            ip_address="192.168.1.1",
            user_agent="Mozilla/5.0",
            consent_given=True,
        )

        assert signup.email == "test@example.com"
        assert signup.name == "Test User"
        assert signup.institution == "Test University"
        assert signup.research_area == "Computer Science"
        assert signup.interest_level == InterestLevel.READY
        assert signup.status == SignupStatus.ACTIVE
        assert signup.source == "website"
        assert signup.ip_address == "192.168.1.1"
        assert signup.user_agent == "Mozilla/5.0"
        assert signup.consent_given is True

    def test_signup_model_defaults(self):
        """Test signup model default values."""
        signup = Signup(
            email="defaults@example.com", 
            name="Defaults User",
            unsubscribe_token="test-token-123"
        )

        # Check that defaults are set correctly
        # Note: SQLAlchemy defaults are only applied when persisted to DB
        assert signup.status is None  # Default only applied on DB insert
        assert signup.consent_given is None  # Default only applied on DB insert
        assert signup.institution is None
        assert signup.research_area is None
        assert signup.interest_level is None
        assert signup.source is None
        assert signup.ip_address is None
        assert signup.user_agent is None

    def test_signup_model_optional_fields(self):
        """Test signup model with optional fields set to None."""
        signup = Signup(
            email="optional@example.com",
            name="Optional User",
            institution=None,
            research_area=None,
            interest_level=None,
            source=None,
            ip_address=None,
            user_agent=None,
        )

        assert signup.email == "optional@example.com"
        assert signup.name == "Optional User"
        assert signup.institution is None
        assert signup.research_area is None
        assert signup.interest_level is None
        assert signup.source is None
        assert signup.ip_address is None
        assert signup.user_agent is None


class TestInterestLevelEnum:
    """Test InterestLevel enum."""

    def test_interest_level_values(self):
        """Test that all interest level values are correct."""
        assert InterestLevel.EXPLORING.value == "exploring"
        assert InterestLevel.PLANNING.value == "planning"
        assert InterestLevel.READY.value == "ready"
        assert InterestLevel.MIGRATING.value == "migrating"

    def test_interest_level_enum_members(self):
        """Test that all expected enum members exist."""
        expected_members = ["EXPLORING", "PLANNING", "READY", "MIGRATING"]
        actual_members = [member.name for member in InterestLevel]

        assert set(actual_members) == set(expected_members)
        assert len(actual_members) == len(expected_members)

    def test_interest_level_string_conversion(self):
        """Test string representation of interest levels."""
        assert str(InterestLevel.EXPLORING) == "InterestLevel.EXPLORING"
        assert InterestLevel.EXPLORING.value == "exploring"


class TestSignupStatusEnum:
    """Test SignupStatus enum."""

    def test_signup_status_values(self):
        """Test that all signup status values are correct."""
        assert SignupStatus.ACTIVE.value == "active"
        assert SignupStatus.UNSUBSCRIBED.value == "unsubscribed"
        assert SignupStatus.CONVERTED.value == "converted"

    def test_signup_status_enum_members(self):
        """Test that all expected enum members exist."""
        expected_members = ["ACTIVE", "UNSUBSCRIBED", "CONVERTED"]
        actual_members = [member.name for member in SignupStatus]

        assert set(actual_members) == set(expected_members)
        assert len(actual_members) == len(expected_members)

    def test_signup_status_string_conversion(self):
        """Test string representation of signup statuses."""
        assert str(SignupStatus.ACTIVE) == "SignupStatus.ACTIVE"
        assert SignupStatus.ACTIVE.value == "active"


class TestSignupModelValidation:
    """Test signup model field validation and constraints."""

    def test_signup_with_all_interest_levels(self):
        """Test signup creation with each interest level."""
        for interest_level in InterestLevel:
            signup = Signup(
                email=f"{interest_level.value}@example.com",
                name=f"{interest_level.value.title()} User",
                interest_level=interest_level,
            )
            assert signup.interest_level == interest_level

    def test_signup_with_all_statuses(self):
        """Test signup creation with each status."""
        for status in SignupStatus:
            signup = Signup(
                email=f"{status.value}@example.com",
                name=f"{status.value.title()} User",
                status=status,
            )
            assert signup.status == status

    def test_signup_boolean_fields(self):
        """Test boolean field behavior."""
        # Test True
        signup_true = Signup(
            email="true@example.com", name="True User", consent_given=True
        )
        assert signup_true.consent_given is True

        # Test False
        signup_false = Signup(
            email="false@example.com", name="False User", consent_given=False
        )
        assert signup_false.consent_given is False

    def test_signup_string_fields_with_special_chars(self):
        """Test string fields with special characters."""
        signup = Signup(
            email="special@münchen.de",
            name="José María O'Connor-Smith",
            institution="École Polytechnique & MIT",
            research_area="AI/ML, NLP & Computer Vision",
            source="website/referral",
            user_agent="Mozilla/5.0 (compatible; special-chars)",
        )

        assert "ü" in signup.email
        assert "José María" in signup.name
        assert "École" in signup.institution
        assert "&" in signup.research_area
        assert "/" in signup.source
        assert ";" in signup.user_agent

    def test_signup_long_string_fields(self):
        """Test signup with very long string values."""
        long_name = "A" * 255
        long_institution = "B" * 500
        long_research_area = "C" * 500
        long_user_agent = "D" * 1000

        signup = Signup(
            email="long@example.com",
            name=long_name,
            institution=long_institution,
            research_area=long_research_area,
            user_agent=long_user_agent,
        )

        assert len(signup.name) == 255
        assert len(signup.institution) == 500
        assert len(signup.research_area) == 500
        assert len(signup.user_agent) == 1000

    def test_signup_empty_string_fields(self):
        """Test signup with empty string values."""
        signup = Signup(
            email="empty@example.com",
            name="",  # Empty name - might be invalid based on validation
            institution="",
            research_area="",
            source="",
            ip_address="",
            user_agent="",
        )

        # Empty strings should be preserved as-is
        assert signup.name == ""
        assert signup.institution == ""
        assert signup.research_area == ""
        assert signup.source == ""
        assert signup.ip_address == ""
        assert signup.user_agent == ""
