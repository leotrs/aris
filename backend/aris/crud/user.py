import asyncio
from datetime import datetime

from sqlalchemy.orm import Session

from ..models import Document, User
from .document import get_document, get_document_section
from .tag import get_user_document_tags
from .utils import extract_title


async def get_users(db: Session):
    return db.query(User).filter(User.deleted_at.is_(None)).all()


async def get_user(user_id: int, db: Session):
    return db.query(User).filter(User.id == user_id, User.deleted_at.is_(None)).first()


async def create_user(name: str, email: str, password_hash: str, db: Session):
    user = User(name=name, email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


async def update_user(user_id: int, name: str, email: str, db: Session):
    user = get_user(user_id, db)
    if not user:
        return None
    user.name = name
    user.email = email
    db.commit()
    db.refresh(user)
    return user


async def soft_delete_user(user_id: int, db: Session):
    user = get_user(user_id, db)
    if not user:
        return None
    user.deleted_at = datetime.utcnow()
    db.commit()
    return user


async def get_user_documents(
    user_id: int, with_tags: bool, with_minimap: bool, db: Session
):
    user = await get_user(user_id, db)
    if not user:
        raise ValueError(f"User {user_id} not found")

    docs = (
        db.query(Document)
        .filter(Document.owner_id == user_id, Document.deleted_at.is_(None))
        .all()
    )

    titles = await asyncio.gather(*(extract_title(d) for d in docs))
    titles = dict(zip(docs, titles))

    tags = None
    if with_tags:
        tags = await asyncio.gather(
            *(get_user_document_tags(user_id, d.id, db) for d in docs)
        )
        tags = dict(zip(docs, tags))

    minimaps = None
    if with_minimap:
        minimaps = await asyncio.gather(
            *(get_document_section(d.id, "minimap", db) for d in docs)
        )
        minimaps = dict(zip(docs, minimaps))

    return [
        {
            "id": doc.id,
            "title": titles[doc],
            "source": doc.source,
            "last_edited_at": doc.last_edited_at,
            "tags": tags[doc] if tags else [],
            "minimap": str(minimaps[doc]) if minimaps else "",
        }
        for doc in docs
    ]


async def get_user_document(
    user_id: int, doc_id: int, with_tags: bool, with_minimap: bool, db: Session
):
    user = await get_user(user_id, db)
    if not user:
        raise ValueError(f"User {user_id} not found")

    doc = await get_document(doc_id, db)
    if not doc:
        raise ValueError(f"Document {user_id} not found")

    title = await extract_title(doc)
    tags = (await get_user_document_tags(user_id, doc_id, db)) if with_tags else []
    minimap = (
        (await get_document_section(doc_id, "minimap", db)) if with_minimap else ""
    )

    return {
        "id": doc.id,
        "title": title,
        "source": doc.source,
        "last_edited_at": doc.last_edited_at,
        "tags": tags,
        "minimap": str(minimap),
    }
