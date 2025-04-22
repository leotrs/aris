from datetime import datetime

from sqlalchemy import delete, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..models import Document, Tag, User, document_tags

COLORS = iter(["red", "purple", "green", "orange"])


async def create_tag(user_id: int, name: str, color: str, db: Session):
    """Create a new tag for the user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
    if not name:
        raise ValueError("Name not provided")
    if not color:
        color = next(COLORS)

    tag = Tag(name=name, user_id=user_id, color=color)
    db.add(tag)
    try:
        db.commit()
        db.refresh(tag)
        return tag
    except SQLAlchemyError:
        db.rollback()
        return None


async def get_user_tags(user_id: int, db: Session):
    """Get all tags for a user."""
    tags = (
        db.query(Tag)
        .filter(
            Tag.user_id == user_id,
            Tag.deleted_at.is_(None),
        )
        .all()
    )
    return [
        {"id": t.id, "user_id": t.user_id, "name": t.name, "color": t.color}
        for t in tags
    ]


async def update_tag(
    _id: int, user_id: int, new_name: str, new_color: str, db: Session
):
    """Update the name of a tag."""
    tag_to_update = (
        db.query(Tag)
        .filter(
            Tag.id == _id,
            Tag.user_id == user_id,
            Tag.deleted_at.is_(None),
        )
        .first()
    )
    if not tag_to_update:
        raise ValueError("Tag not found")

    tag_to_update.name = new_name or tag_to_update.name
    tag_to_update.color = new_color or tag_to_update.color
    db.commit()
    db.refresh(tag_to_update)
    return tag_to_update


async def soft_delete_tag(_id: int, user_id: int, db: Session):
    """Delete a tag for a user."""
    tag_to_delete = (
        db.query(Tag)
        .filter(
            Tag.id == _id,
            Tag.user_id == user_id,
            Tag.deleted_at.is_(None),
        )
        .first()
    )
    if not tag_to_delete:
        raise ValueError("Tag not found")

    tag_to_delete.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": "Tag deleted successfully"}


async def get_user_document_tags(user_id: int, doc_id: int, db: Session):
    return (
        db.query(Tag)
        .filter(Tag.user_id == user_id)
        .join(document_tags, Tag.id == document_tags.c.tag_id)
        .filter(document_tags.c.document_id == doc_id)
        .order_by(Tag.name.asc())
        .all()
    )


async def add_tag_to_document(user_id: int, document_id: int, tag_id: str, db: Session):
    with db.begin():
        document = db.get(Document, document_id)
        if not document or document.owner_id != user_id:
            raise ValueError("Unauthorized or document not found")
        tag = db.get(Tag, tag_id)
        if not tag or tag.user_id != user_id:
            raise ValueError("Unauthorized or tag not found")

        exists_stmt = select(document_tags).where(
            (document_tags.c.document_id == document_id)
            & (document_tags.c.tag_id == tag_id)
        )
        if db.execute(exists_stmt).first():
            raise ValueError("Tag already assigned")

        db.execute(
            document_tags.insert().values(document_id=document_id, tag_id=tag_id)
        )


async def remove_tag_from_document(
    user_id: int, document_id: int, tag_id: str, db: Session
):
    with db.begin():
        document = db.get(Document, document_id)
        if not document or document.owner_id != user_id:
            raise ValueError("Unauthorized or document not found")
        tag = db.get(Tag, tag_id)
        if not tag or tag.user_id != user_id:
            raise ValueError("Unauthorized or tag not found")

        delete_stmt = delete(document_tags).where(
            (document_tags.c.document_id == document_id)
            & (document_tags.c.tag_id == tag_id)
        )
        result = db.execute(delete_stmt)
        if result.rowcount == 0:
            raise ValueError("Tag not assigned to this document")
