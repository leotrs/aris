"""Unit tests for model-level logic in aris.models.models."""

import random

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
    user = User(name="Test User", email="test@example.com", password_hash="test_hash")
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
    user = User(name="Test User", email="test@example.com", password_hash="test_hash")
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
