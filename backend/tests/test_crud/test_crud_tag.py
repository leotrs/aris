import pytest
from sqlalchemy import select
from aris.models import Tag, File, file_tags
from aris.crud.tag import (
    create_tag,
    get_user_tags,
    update_tag,
    soft_delete_tag,
    get_user_file_tags,
    add_tag_to_file,
    remove_tag_from_file,
)


@pytest.mark.asyncio
async def test_create_tag_success(db_session, test_user):
    tag = await create_tag(test_user.id, "TestTag", "blue", db_session)
    assert tag.name == "TestTag"
    assert tag.color == "blue"
    assert tag.user_id == test_user.id


@pytest.mark.asyncio
async def test_create_tag_user_not_found(db_session):
    with pytest.raises(ValueError, match="User not found"):
        await create_tag(9999, "Name", "color", db_session)


@pytest.mark.asyncio
async def test_get_user_tags(db_session, test_user):
    await create_tag(test_user.id, "A", "red", db_session)
    await create_tag(test_user.id, "B", "green", db_session)

    tags = await get_user_tags(test_user.id, db_session)
    assert len(tags) == 2
    assert tags[0]["name"] == "A"
    assert tags[1]["name"] == "B"


@pytest.mark.asyncio
async def test_update_tag(db_session, test_user):
    tag = Tag(name="Old", color="gray", user_id=test_user.id)
    db_session.add(tag)
    await db_session.commit()
    await db_session.refresh(tag)

    updated = await update_tag(tag.id, test_user.id, "New", "blue", db_session)
    assert updated.name == "New"
    assert updated.color == "blue"


@pytest.mark.asyncio
async def test_soft_delete_tag(db_session, test_user):
    tag = Tag(name="Softie", color="orange", user_id=test_user.id)
    db_session.add(tag)
    await db_session.commit()
    await db_session.refresh(tag)

    resp = await soft_delete_tag(tag.id, test_user.id, db_session)
    assert resp == {"message": "Tag deleted successfully"}

    result = await db_session.execute(select(Tag).where(Tag.id == tag.id))
    deleted = result.scalar_one()
    assert deleted.deleted_at is not None


@pytest.mark.asyncio
async def test_add_and_remove_tag_from_file(db_session, test_user):
    file = File(owner_id=test_user.id)
    tag = Tag(name="linked", color="purple", user_id=test_user.id)
    db_session.add_all([file, tag])
    await db_session.commit()

    await add_tag_to_file(test_user.id, file.id, tag.id, db_session)

    link_result = await db_session.execute(
        select(file_tags).where(file_tags.c.file_id == file.id, file_tags.c.tag_id == tag.id)
    )
    assert link_result.first()

    await remove_tag_from_file(test_user.id, file.id, tag.id, db_session)

    post = await db_session.execute(
        select(file_tags).where(file_tags.c.file_id == file.id, file_tags.c.tag_id == tag.id)
    )
    assert post.first() is None


@pytest.mark.asyncio
async def test_get_user_file_tags(db_session, test_user):
    file = File(owner_id=test_user.id)
    tag1 = Tag(name="T1", color="red", user_id=test_user.id)
    tag2 = Tag(name="T2", color="green", user_id=test_user.id)
    db_session.add_all([file, tag1, tag2])
    await db_session.commit()

    await add_tag_to_file(test_user.id, file.id, tag1.id, db_session)
    await add_tag_to_file(test_user.id, file.id, tag2.id, db_session)

    tags = await get_user_file_tags(test_user.id, file.id, db_session)
    tag_names = {t.name for t in tags}
    assert tag_names == {"T1", "T2"}
