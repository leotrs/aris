"""Tests for user CRUD operations."""

import pytest
from unittest.mock import patch
from datetime import datetime
from sqlalchemy import select, func

from aris.models import FileSettings
from aris.crud.user import (
    get_user,
    create_user,
    update_user,
    soft_delete_user,
    get_user_files,
    get_user_file,
)


@pytest.mark.asyncio
async def test_get_user_returns_correct_user(db_session, test_user):
    fetched = await get_user(test_user.id, db_session)
    assert fetched.id == test_user.id
    assert fetched.email == test_user.email


@pytest.mark.asyncio
async def test_create_user_sets_defaults(db_session):
    user = await create_user("Alice Example", "", "alice@example.com", "hashed", db_session)
    assert user.initials == "AE"
    assert user.email == "alice@example.com"

    query = select(func.count()).where(
        FileSettings.user_id == user.id, FileSettings.file_id.is_(None)
    )
    result = await db_session.execute(query)
    count = result.scalar_one()
    assert count == 1


@pytest.mark.asyncio
async def test_update_user_fields(db_session, test_user):
    updated = await update_user(test_user.id, "New Name", "NN", "new@example.com", db_session)
    assert updated.name == "New Name"
    assert updated.initials == "NN"
    assert updated.email == "new@example.com"


@pytest.mark.asyncio
async def test_soft_delete_user_sets_deleted_at(db_session, test_user):
    deleted = await soft_delete_user(test_user.id, db_session)
    assert isinstance(deleted.deleted_at, datetime)


@pytest.mark.asyncio
async def test_get_user_files_returns_sorted_file_list(db_session, test_user):
    from aris.crud.file import create_file

    await create_file("a", test_user.id, "Z", db=db_session)
    await create_file("b", test_user.id, "A", db=db_session)

    with patch("aris.crud.user.extract_title", side_effect=lambda f: f.title):
        result = await get_user_files(test_user.id, with_tags=False, db=db_session)

    assert [f["title"] for f in result] == ["A", "Z"]  # last_edited_at same, so source is used


@pytest.mark.asyncio
async def test_get_user_file_full_bundle(db_session, test_user):
    from aris.crud.file import create_file

    file = await create_file("source content", test_user.id, "Doc", db=db_session)

    with (
        patch("aris.crud.user.extract_title", return_value="Mocked Title"),
        patch("aris.crud.user.get_user_file_tags", return_value=["physics", "ML"]),
        patch("aris.crud.user.get_file_section", return_value="Mocked Minimap"),
    ):
        result = await get_user_file(
            user_id=test_user.id,
            doc_id=file.id,
            with_tags=True,
            with_minimap=True,
            db=db_session,
        )

    assert result["title"] == "Mocked Title"
    assert result["tags"] == ["physics", "ML"]
    assert result["minimap"] == "Mocked Minimap"
