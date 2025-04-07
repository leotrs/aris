import asyncio
from datetime import datetime

from sqlalchemy.orm import Session

from ..models import Document, User
from .tag import get_document_tags
from .utils import extract_title


def get_users(db: Session):
    return db.query(User).filter(User.deleted_at.is_(None)).all()


def get_user(user_id: int, db: Session):
    return db.query(User).filter(User.id == user_id, User.deleted_at.is_(None)).first()


def create_user(name: str, email: str, password_hash: str, db: Session):
    user = User(name=name, email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(user_id: int, name: str, email: str, db: Session):
    user = get_user(user_id, db)
    if not user:
        return None
    user.name = name
    user.email = email
    db.commit()
    db.refresh(user)
    return user


def soft_delete_user(user_id: int, db: Session):
    user = get_user(user_id, db)
    if not user:
        return None
    user.deleted_at = datetime.utcnow()
    db.commit()
    return user


async def get_user_documents(user_id: int, with_tags, db: Session):
    user = get_user(user_id, db)
    if not user:
        raise ValueError(f"User {user_id} not found")

    docs = (
        db.query(Document)
        .filter(Document.owner_id == user_id, Document.deleted_at.is_(None))
        .all()
    )
    titles = await asyncio.gather(*(extract_title(d) for d in docs))
    for doc, title in zip(docs, titles):
        doc.title = title

    return [
        {
            "id": doc.id,
            "title": doc.title,
            "source": doc.source,
            "last_edited_at": doc.last_edited_at,
            "tags": get_document_tags(doc.id, db) if with_tags else [],
        }
        for doc in docs
    ]
