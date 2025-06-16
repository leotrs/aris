"""Unit tests for model-level logic in aris.models.models."""

import random
from aris.models.models import (
    AvatarColor,
    FileStatus,
    FileSettings,
    File,
    User,
    Annotation,
    AnnotationType,
    AnnotationMessage,
    Note,
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


def test_annotation_creation(db_session):
    """Test basic creation of an Annotation."""
    file = File()
    db_session.add(file)
    db_session.commit()

    annotation = Annotation(file_id=file.id)
    db_session.add(annotation)
    db_session.commit()

    assert annotation.id is not None
    assert annotation.file_id == file.id
    assert annotation.created_at is not None


def test_annotation_message_creation(db_session):
    """Test creating an AnnotationMessage and linking it to Annotation and User."""
    file = File()
    user = User()
    db_session.add_all([file, user])
    db_session.commit()

    annotation = Annotation(file_id=file.id)
    db_session.add(annotation)
    db_session.commit()

    msg = AnnotationMessage(
        annotation_id=annotation.id,
        owner_id=user.id,
        type=AnnotationType.NOTE,
        content="Sample note",
    )
    db_session.add(msg)
    db_session.commit()

    assert msg.id is not None
    assert msg.content == "Sample note"
    assert msg.annotation_id == annotation.id
    assert msg.owner_id == user.id


def test_note_creation(db_session):
    """Test that a Note can be created and linked to an AnnotationMessage."""
    file = File()
    user = User()
    db_session.add_all([file, user])
    db_session.commit()

    annotation = Annotation(file_id=file.id)
    db_session.add(annotation)
    db_session.commit()

    msg = AnnotationMessage(
        annotation_id=annotation.id,
        owner_id=user.id,
        type=AnnotationType.NOTE,
        content="Top-level note",
    )
    db_session.add(msg)
    db_session.commit()

    note = Note(message_id=msg.id)
    db_session.add(note)
    db_session.commit()

    assert note.message_id == msg.id
    assert note.message.id == msg.id
    assert note.message.content == "Top-level note"
