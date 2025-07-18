"""Unit tests for model-level logic in aris.models.models."""

import random
import uuid

from aris.models.models import (
    Annotation,
    AnnotationMessage,
    AnnotationType,
    AvatarColor,
    File,
    FileSettings,
    FileStatus,
    User,
)


def test_avatar_color_values():
    """Ensure AvatarColor enum members have the expected hex codes."""
    expected = {
        "BLUE": "#0E9AE9",
        "RED": "#EF4B4C",
        "GREEN": "#1FB5A2",
        "PURPLE": "#AD71F2",
        "ORANGE": "#F5862B",
        "PINK": "#EC4899",
        "YELLOW": "#F5AB00",
    }
    for name, hexcode in expected.items():
        assert getattr(AvatarColor, name).value == hexcode


def test_avatar_color_random(monkeypatch):
    """random() should return a valid AvatarColor member."""
    # Force random.choice to return first element
    monkeypatch.setattr(random, "choice", lambda seq: seq[0])
    assert AvatarColor.random() == list(AvatarColor)[0]


def test_file_status_values():
    """Ensure FileStatus enum members have the correct labels."""
    assert FileStatus.DRAFT.value == "Draft"
    assert FileStatus.UNDER_REVIEW.value == "Under Review"
    assert FileStatus.PUBLISHED.value == "Published"


def test_file_settings_column_defaults():
    """Ensure FileSettings columns are configured with the expected defaults."""
    table = FileSettings.__table__
    # background default
    assert table.columns["background"].default.arg == "var(--surface-page)"
    # font size
    assert table.columns["font_size"].default.arg == "16px"
    # line height
    assert table.columns["line_height"].default.arg == "1.5"
    # font family
    assert table.columns["font_family"].default.arg == "Source Sans 3"
    # margin width
    assert table.columns["margin_width"].default.arg == "16px"
    # columns count
    assert table.columns["columns"].default.arg == 1


async def test_annotation_creation(db_session):
    """Test basic creation of an Annotation."""
    # Create a user first
    unique_email = f"test_annotation_{uuid.uuid4().hex[:8]}@example.com"
    user = User(name="Test User", email=unique_email, password_hash="test_hash")
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    file = File(owner_id=user.id, source=":rsm: Test content ::")
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    annotation = Annotation(file_id=file.id, type=AnnotationType.NOTE)
    db_session.add(annotation)
    await db_session.commit()
    await db_session.refresh(annotation)

    assert annotation.id is not None
    assert annotation.file_id == file.id
    assert annotation.type == AnnotationType.NOTE
    assert annotation.created_at is not None


async def test_annotation_message_creation(db_session):
    """Test creating an AnnotationMessage and linking it to Annotation and User."""
    unique_email = f"test_annot_msg_{uuid.uuid4().hex[:8]}@example.com"
    user = User(name="Test User", email=unique_email, password_hash="test_hash")
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    file = File(owner_id=user.id, source=":rsm: Test content ::")
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    annotation = Annotation(file_id=file.id, type=AnnotationType.NOTE)
    db_session.add(annotation)
    await db_session.commit()
    await db_session.refresh(annotation)

    msg = AnnotationMessage(
        annotation_id=annotation.id,
        owner_id=user.id,
        content="Sample note",
    )
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    assert msg.id is not None
    assert msg.content == "Sample note"
    assert msg.annotation_id == annotation.id
    assert msg.owner_id == user.id


def test_user_model_has_affiliation_field():
    """Test that User model has affiliation field."""
    user = User(name="Test User", email="test@example.com", password_hash="test_hash", affiliation="MIT")
    assert user.affiliation == "MIT"


def test_user_affiliation_can_be_null():
    """Test that affiliation field can be null."""
    user = User(name="Test User", email="test@example.com", password_hash="test_hash")
    assert user.affiliation is None


def test_user_has_email_verification_fields():
    """Test that User model has email verification fields."""
    user = User(name="Test User", email="test@example.com", password_hash="test_hash")
    assert hasattr(user, 'email_verified')
    assert hasattr(user, 'email_verification_token')
    assert hasattr(user, 'email_verification_sent_at')
    assert user.email_verified is False


def test_user_generate_verification_token():
    """Test email verification token generation."""
    user = User(name="Test User", email="test@example.com", password_hash="test_hash")
    token = user.generate_verification_token()
    assert len(token) == 32
    assert user.email_verification_token == token
    assert isinstance(token, str)


def test_user_verify_token_method():
    """Test token verification method."""
    user = User(name="Test User", email="test@example.com", password_hash="test_hash")
    token = user.generate_verification_token()
    
    # Valid token should return True
    assert user.verify_token(token) is True
    
    # Invalid token should return False
    assert user.verify_token("invalid_token") is False
    
    # None token should return False
    assert user.verify_token(None) is False


def test_new_user_email_unverified():
    """Test that new users start with unverified email."""
    user = User(name="Test User", email="test@example.com", password_hash="test_hash")
    assert user.email_verified is False
    assert user.email_verification_token is None


def test_file_publication_fields_defaults():
    """Test that File model has publication fields with correct defaults."""
    file = File(owner_id=1, source=":rsm: Test content ::")
    assert file.published_at is None
    assert file.public_uuid is None
    assert file.permalink_slug is None


def test_file_is_published_property():
    """Test that File model has is_published computed property."""
    file = File(owner_id=1, source=":rsm: Test content ::")
    
    # Draft file should not be published
    file.status = FileStatus.DRAFT
    assert file.is_published is False
    
    # Published file should be published
    file.status = FileStatus.PUBLISHED
    assert file.is_published is True
    
    # Under review file should not be published
    file.status = FileStatus.UNDER_REVIEW
    assert file.is_published is False


def test_file_generate_public_uuid():
    """Test that File model can generate 6-character public UUID."""
    file = File(owner_id=1, source=":rsm: Test content ::")
    uuid = file.generate_public_uuid()
    
    assert len(uuid) == 6
    assert isinstance(uuid, str)
    assert uuid.isalnum()  # Should be alphanumeric


def test_file_can_publish_method():
    """Test that File model has can_publish method with correct logic."""
    file = File(owner_id=1, source=":rsm: Test content ::")
    
    # Draft file with source can be published
    file.status = FileStatus.DRAFT
    assert file.can_publish() is True
    
    # Published file cannot be published again
    file.status = FileStatus.PUBLISHED
    assert file.can_publish() is False
    
    # Under review file cannot be published
    file.status = FileStatus.UNDER_REVIEW
    assert file.can_publish() is False
    
    # Draft file without source cannot be published
    file.status = FileStatus.DRAFT
    file.source = None
    assert file.can_publish() is False


def test_file_publish_method():
    """Test that File model has publish method that updates status and fields."""
    file = File(owner_id=1, source=":rsm: Test content ::")
    file.status = FileStatus.DRAFT
    
    # Initially not published
    assert file.published_at is None
    assert file.public_uuid is None
    assert file.status == FileStatus.DRAFT
    
    # Publish the file
    file.publish()
    
    # Should be published now
    assert file.status == FileStatus.PUBLISHED
    assert file.published_at is not None
    assert file.public_uuid is not None
    assert len(file.public_uuid) == 6


def test_file_publish_method_validation():
    """Test that publish method raises error for invalid states."""
    file = File(owner_id=1, source=":rsm: Test content ::")
    
    # Cannot publish file that's already published
    file.status = FileStatus.PUBLISHED
    try:
        file.publish()
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "cannot be published" in str(e)
    
    # Cannot publish file without source
    file.status = FileStatus.DRAFT
    file.source = None
    try:
        file.publish()
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "cannot be published" in str(e)


def test_file_version_field_defaults():
    """Test that File model has version field with correct default."""
    file = File(owner_id=1, source=":rsm: Test content ::")
    assert file.version == 0


def test_file_version_field_validation():
    """Test that File model version field accepts valid integer values."""
    file = File(owner_id=1, source=":rsm: Test content ::", version=2)
    assert file.version == 2
    
    file.version = 3
    assert file.version == 3


def test_file_version_field_constraints():
    """Test that File model version field has proper constraints."""
    # Version should be non-negative integer
    file = File(owner_id=1, source=":rsm: Test content ::", version=0)
    assert file.version == 0
    
    # Version should accept positive integers
    file = File(owner_id=1, source=":rsm: Test content ::", version=1)
    assert file.version == 1
    
    # Version should not be negative (will be validated at DB level)
    file = File(owner_id=1, source=":rsm: Test content ::", version=-1)
    assert file.version == -1  # Model allows it, DB will reject


def test_file_prev_version_id_field_defaults():
    """Test that File model has prev_version_id field with correct default."""
    file = File(owner_id=1, source=":rsm: Test content ::")
    assert file.prev_version_id is None


def test_file_prev_version_id_field_validation():
    """Test that File model prev_version_id field accepts valid integer values."""
    file = File(owner_id=1, source=":rsm: Test content ::", prev_version_id=123)
    assert file.prev_version_id == 123
    
    file.prev_version_id = 456
    assert file.prev_version_id == 456
    
    file.prev_version_id = None
    assert file.prev_version_id is None


async def test_file_prev_version_id_foreign_key_relationship(db_session):
    """Test that prev_version_id creates proper foreign key relationship."""
    # Create a user first
    unique_email = f"test_prev_ver_{uuid.uuid4().hex[:8]}@example.com"
    user = User(name="Test User", email=unique_email, password_hash="test_hash")
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    # Create the original file (version 1)
    original_file = File(owner_id=user.id, source=":rsm: Original content ::", version=1)
    db_session.add(original_file)
    await db_session.commit()
    await db_session.refresh(original_file)
    
    # Create a new version that references the original
    new_version = File(
        owner_id=user.id, 
        source=":rsm: Updated content ::", 
        version=2,
        prev_version_id=original_file.id
    )
    db_session.add(new_version)
    await db_session.commit()
    await db_session.refresh(new_version)
    
    # Verify the relationship
    assert new_version.prev_version_id == original_file.id
    assert new_version.version == 2
    assert original_file.version == 1


async def test_file_prev_version_id_relationship_navigation(db_session):
    """Test that we can navigate the prev_version relationship."""
    # Create a user first
    unique_email = f"test_nav_{uuid.uuid4().hex[:8]}@example.com"
    user = User(name="Test User", email=unique_email, password_hash="test_hash")
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    # Create version 1
    v1 = File(owner_id=user.id, source=":rsm: V1 content ::", version=1)
    db_session.add(v1)
    await db_session.commit()
    await db_session.refresh(v1)
    
    # Create version 2 that references version 1
    v2 = File(
        owner_id=user.id, 
        source=":rsm: V2 content ::", 
        version=2,
        prev_version_id=v1.id
    )
    db_session.add(v2)
    await db_session.commit()
    await db_session.refresh(v2)
    
    # Create version 3 that references version 2
    v3 = File(
        owner_id=user.id, 
        source=":rsm: V3 content ::", 
        version=3,
        prev_version_id=v2.id
    )
    db_session.add(v3)
    await db_session.commit()
    await db_session.refresh(v3)
    
    # Verify the chain
    assert v3.prev_version_id == v2.id
    assert v2.prev_version_id == v1.id
    assert v1.prev_version_id is None
