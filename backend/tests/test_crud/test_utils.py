from types import SimpleNamespace
from unittest.mock import Mock

import pytest
import rsm
from sqlalchemy.exc import IntegrityError

from aris.crud.utils import (
    assign_public_uuid_with_retry,
    extract_section,
    extract_title,
    generate_public_uuid,
    generate_unique_public_uuid,
    is_valid_public_uuid,
)
from aris.models import File


class DummyParser:
    def __init__(self, plain):
        self.plain = plain
        self.transformer = SimpleNamespace(tree=SimpleNamespace(title="ParsedTitle"))

    def run(self):
        pass


class DummyProcessor:
    def __init__(self, plain, handrails=True):
        self.plain = plain
        self.translator = SimpleNamespace(body="<div class='sec'>Content</div>")

    def run(self):
        pass


async def test_extract_title_none_file():
    assert await extract_title(None) == ""


async def test_extract_title_existing_title():
    file = SimpleNamespace(title="Hello", source="ignored")
    result = await extract_title(file)
    assert result == "Hello"


async def test_extract_title_parsed(monkeypatch):
    file = SimpleNamespace(title=None, source="some source")
    monkeypatch.setattr(rsm.app, "ParserApp", DummyParser)
    result = await extract_title(file)
    assert result == "ParsedTitle"


async def test_extract_section_found(monkeypatch):
    file = SimpleNamespace(source="dummy")
    monkeypatch.setattr(rsm.app, "ProcessorApp", DummyProcessor)
    result = await extract_section(file, "sec", handrails=False)
    assert '<div class="sec">Content</div>' in result
    assert "Content" in result


async def test_extract_section_not_found(monkeypatch):
    class NoSectionProcessor:
        def __init__(self, plain, handrails=True):
            self.translator = SimpleNamespace(body="<div class='other'>Other</div>")

        def run(self):
            pass

    monkeypatch.setattr(rsm.app, "ProcessorApp", NoSectionProcessor)
    file = SimpleNamespace(source="dummy")
    result = await extract_section(file, "sec")
    assert result == ""


# UUID Generation Tests

def test_generate_public_uuid():
    """Test basic UUID generation."""
    uuid = generate_public_uuid()
    assert isinstance(uuid, str)
    assert len(uuid) == 6
    assert is_valid_public_uuid(uuid)


def test_generate_public_uuid_uniqueness():
    """Test that multiple calls generate different UUIDs."""
    uuids = {generate_public_uuid() for _ in range(100)}
    # With 34 billion possibilities, 100 UUIDs should be unique
    assert len(uuids) == 100


def test_is_valid_public_uuid_valid():
    """Test validation of valid UUIDs."""
    valid_uuids = [
        "2345AB",
        "xyz789",
        "ABCDEF",
        "mnpqrs",
        "234567",
        "abcdef",
    ]
    for uuid in valid_uuids:
        assert is_valid_public_uuid(uuid)


def test_is_valid_public_uuid_invalid():
    """Test validation of invalid UUIDs."""
    invalid_uuids = [
        "",              # Empty string
        "12345",         # Too short
        "1234567",       # Too long
        "123456O",       # Contains 'O' (not in alphabet)
        "123456I",       # Contains 'I' (not in alphabet)
        "123456L",       # Contains 'L' (not in alphabet)
        "12345 ",        # Contains space
        "12345-",        # Contains hyphen
        "12345_",        # Contains underscore
        None,            # None value
        123456,          # Integer instead of string
        ["1", "2", "3", "4", "5", "6"],  # List instead of string
    ]
    for uuid in invalid_uuids:
        assert not is_valid_public_uuid(uuid)


def test_generate_unique_public_uuid_no_collisions():
    """Test generating unique UUID when no collisions exist."""
    session = Mock()
    session.execute.return_value.first.return_value = None
    
    uuid = generate_unique_public_uuid(session)
    assert isinstance(uuid, str)
    assert len(uuid) == 6
    assert is_valid_public_uuid(uuid)
    session.execute.assert_called_once()


def test_generate_unique_public_uuid_with_collision():
    """Test generating unique UUID when collision occurs."""
    session = Mock()
    # First call returns a collision, second call returns None (no collision)
    session.execute.return_value.first.side_effect = [Mock(), None]
    
    uuid = generate_unique_public_uuid(session)
    assert isinstance(uuid, str)
    assert len(uuid) == 6
    assert is_valid_public_uuid(uuid)
    assert session.execute.call_count == 2


def test_generate_unique_public_uuid_max_retries():
    """Test that max retries are respected."""
    session = Mock()
    # Always return a collision
    session.execute.return_value.first.return_value = Mock()
    
    with pytest.raises(RuntimeError, match="Failed to generate unique UUID after 3 attempts"):
        generate_unique_public_uuid(session, max_retries=3)
    
    assert session.execute.call_count == 3


def test_assign_public_uuid_with_retry_success():
    """Test successful UUID assignment without collision."""
    session = Mock()
    file = Mock(spec=File)
    
    uuid = assign_public_uuid_with_retry(session, file)
    
    assert isinstance(uuid, str)
    assert len(uuid) == 6
    assert is_valid_public_uuid(uuid)
    assert file.public_uuid == uuid
    session.flush.assert_called_once()


def test_assign_public_uuid_with_retry_collision():
    """Test UUID assignment with collision handling."""
    session = Mock()
    file = Mock(spec=File)
    
    # Mock session to behave like it contains the file
    session.__contains__ = Mock(return_value=True)
    
    # First call raises IntegrityError, second call succeeds
    session.flush.side_effect = [IntegrityError("", "", ""), None]
    
    uuid = assign_public_uuid_with_retry(session, file)
    
    assert isinstance(uuid, str)
    assert len(uuid) == 6
    assert is_valid_public_uuid(uuid)
    assert file.public_uuid == uuid
    assert session.flush.call_count == 2
    assert session.rollback.call_count == 1


def test_assign_public_uuid_with_retry_max_retries():
    """Test that max retries are respected in UUID assignment."""
    session = Mock()
    file = Mock(spec=File)
    
    # Mock session to behave like it contains the file
    session.__contains__ = Mock(return_value=True)
    
    # Always raise IntegrityError
    session.flush.side_effect = IntegrityError("", "", "")
    
    with pytest.raises(RuntimeError, match="Failed to assign unique UUID after 3 attempts"):
        assign_public_uuid_with_retry(session, file, max_retries=3)
    
    assert session.flush.call_count == 3
    assert session.rollback.call_count == 3


def test_assign_public_uuid_with_retry_session_reattachment():
    """Test that file is re-attached to session after rollback."""
    session = Mock()
    file = Mock(spec=File)
    
    # Configure the session to not contain the file after rollback
    session.__contains__ = Mock(return_value=False)
    session.flush.side_effect = [IntegrityError("", "", ""), None]
    
    uuid = assign_public_uuid_with_retry(session, file)
    
    assert isinstance(uuid, str)
    session.add.assert_called_once_with(file)
    session.rollback.assert_called_once()
