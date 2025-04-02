from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..models import Document, Tag, User


def create_tag(user_id: int, name: str, db: Session):
    """Create a new tag for the user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")

    tag = Tag(name=name, user_id=user_id)
    db.add(tag)
    try:
        db.commit()
        db.refresh(tag)
        return tag
    except SQLAlchemyError:
        db.rollback()
        return None


def get_user_tags(user_id: int, db: Session):
    """Get all tags for a user."""
    tags = db.query(Tag).filter(Tag.user_id == user_id).all()
    return tags or []


def update_tag(tag_id: int, user_id: int, new_name: str, db: Session):
    """Update the name of a tag."""
    db.begin()

    try:
        tag_to_update = (
            db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == user_id).first()
        )
        if not tag_to_update:
            raise ValueError("Tag not found")

        tag_to_update.name = new_name
        db.commit()
        db.refresh(tag_to_update)
        return tag_to_update
    except SQLAlchemyError:
        db.rollback()
        return None


def delete_tag(tag_id: int, user_id: int, db: Session):
    """Delete a tag for a user."""
    db.begin()

    try:
        tag_to_delete = (
            db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == user_id).first()
        )
        if not tag_to_delete:
            raise ValueError("Tag not found")

        db.delete(tag_to_delete)
        db.commit()
        return {"message": "Tag deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        return None
