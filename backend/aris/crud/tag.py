from datetime import datetime, UTC
import itertools

from sqlalchemy import delete, select, insert
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import File, Tag, User, file_tags

# we'd like to import get_user, but alas .user also needs to import from this module, so
# to avoid circular imports we simply rewrite get_user here
# from .user import get_user

COLORS = itertools.cycle(["red", "purple", "green", "orange"])


async def create_tag(user_id: int, name: str, color: str, db: AsyncSession):
    """Create a new tag for the user."""
    result = await db.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None)))
    user = result.scalars().first()

    if not user:
        raise ValueError("User not found")
    if not name:
        raise ValueError("Name not provided")
    if not color:
        color = next(COLORS)

    tag = Tag(name=name, user_id=user_id, color=color)
    db.add(tag)
    try:
        await db.commit()
        await db.refresh(tag)
        return tag
    except SQLAlchemyError:
        await db.rollback()
        return None


async def get_user_tags(user_id: int, db: AsyncSession):
    """Get all tags for a user."""
    result = await db.execute(
        select(Tag)
        .where(Tag.user_id == user_id, Tag.deleted_at.is_(None))
        .order_by(Tag.created_at.asc(), Tag.name.asc())
    )
    tags = result.scalars().all()
    return [{"id": t.id, "user_id": t.user_id, "name": t.name, "color": t.color} for t in tags]


async def update_tag(_id: int, user_id: int, new_name: str, new_color: str, db: AsyncSession):
    """Update the name and/or color of a tag."""
    result = await db.execute(
        select(Tag).where(Tag.id == _id, Tag.user_id == user_id, Tag.deleted_at.is_(None))
    )
    tag_to_update = result.scalars().first()
    if not tag_to_update:
        raise ValueError("Tag not found")

    tag_to_update.name = new_name or tag_to_update.name
    tag_to_update.color = new_color or tag_to_update.color
    await db.commit()
    await db.refresh(tag_to_update)
    return tag_to_update


async def soft_delete_tag(_id: int, user_id: int, db: AsyncSession):
    """Soft delete a tag for a user."""
    result = await db.execute(
        select(Tag).where(Tag.id == _id, Tag.user_id == user_id, Tag.deleted_at.is_(None))
    )
    tag_to_delete = result.scalars().first()
    if not tag_to_delete:
        raise ValueError("Tag not found")

    tag_to_delete.deleted_at = datetime.now(UTC)
    await db.commit()
    return {"message": "Tag deleted successfully"}


async def get_user_file_tags(user_id: int, doc_id: int, db: AsyncSession):
    # First check if the file exists and belongs to the user
    file_result = await db.execute(
        select(File).where(
            File.id == doc_id,
            File.owner_id == user_id,
            File.deleted_at.is_(None),  # Assuming you have soft delete for files too
        )
    )
    file = file_result.scalar_one_or_none()

    if file is None:
        raise ValueError(f"File with id {doc_id} not found or does not belong to user {user_id}")

    # If file exists, get the tags
    result = await db.execute(
        select(Tag)
        .join(file_tags, Tag.id == file_tags.c.tag_id)
        .where(
            Tag.user_id == user_id,
            Tag.deleted_at.is_(None),
            file_tags.c.file_id == doc_id,
        )
        .order_by(Tag.created_at.asc(), Tag.name.asc())
    )
    return result.scalars().all()


async def add_tag_to_file(user_id: int, file_id: int, tag_id: str, db: AsyncSession):
    file = await db.get(File, file_id)
    if not file or file.owner_id != user_id:
        raise ValueError("Unauthorized or file not found")
    tag = await db.get(Tag, tag_id)
    if not tag or tag.user_id != user_id:
        raise ValueError("Unauthorized or tag not found")

    exists_stmt = select(file_tags).where(
        (file_tags.c.file_id == file_id) & (file_tags.c.tag_id == tag_id)
    )
    result = await db.execute(exists_stmt)
    if result.first():
        raise ValueError("Tag already assigned")

    await db.execute(insert(file_tags).values(file_id=file_id, tag_id=tag_id))
    await db.commit()


async def remove_tag_from_file(user_id: int, file_id: int, tag_id: str, db: AsyncSession):
    file = await db.get(File, file_id)
    if not file or file.owner_id != user_id:
        raise ValueError("Unauthorized or file not found")
    tag = await db.get(Tag, tag_id)
    if not tag or tag.user_id != user_id:
        raise ValueError("Unauthorized or tag not found")

    delete_stmt = delete(file_tags).where(
        (file_tags.c.file_id == file_id) & (file_tags.c.tag_id == tag_id)
    )
    result = await db.execute(delete_stmt)
    if result.rowcount == 0:
        raise ValueError("Tag not assigned to this file")

    await db.commit()
