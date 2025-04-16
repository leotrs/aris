import asyncio
from datetime import datetime

import rsm
from sqlalchemy.orm import Session

from ..models import Document, DocumentStatus, Tag, document_tags
from .utils import extract_section, extract_title


async def get_documents(db: Session):
    docs = db.query(Document).filter(Document.deleted_at.is_(None)).all()
    titles = await asyncio.gather(*(extract_title(d) for d in docs))
    for doc, title in zip(docs, titles):
        doc.title = title
    return docs


async def get_document(doc_id: int, db: Session):
    doc = (
        db.query(Document)
        .filter(Document.id == doc_id, Document.deleted_at.is_(None))
        .first()
    )
    if doc:
        doc.title = await extract_title(doc)
    return doc


async def get_document_html(doc_id: int, db: Session):
    result = (
        db.query(Document.source)
        .filter(Document.id == doc_id, Document.deleted_at.is_(None))
        .first()
    )
    if result:
        src = result[0]
    else:
        return src

    return rsm.render(src, handrails=True)


async def create_document(
    source: str,
    owner_id: int,
    title: str = "",
    abstract: str = "",
    db: Session = None,
):
    doc = Document(
        title=title,
        abstract=abstract,
        owner_id=owner_id,
        source=source,
        status=DocumentStatus.DRAFT,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


async def update_document(
    doc_id: int,
    title: str,
    abstract: str,
    status: str,
    db: Session,
):
    doc = get_document(doc_id, db)
    if not doc:
        return None
    doc.title = title
    doc.abstract = abstract
    doc.status = status
    db.commit()
    db.refresh(doc)
    return doc


async def soft_delete_document(doc_id: int, db: Session):
    doc = await get_document(doc_id, db)
    if not doc:
        return None
    doc.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": f"Document {doc_id} soft deleted"}


async def duplicate_document(doc_id: int, db: Session):
    original = await get_document(doc_id, db)
    if not original or original.deleted_at:
        raise ValueError("Document not found")

    new_doc = Document(
        title=f"{original.title} (copy)",
        source=original.source,
        owner_id=original.owner_id,
        last_edited_at=datetime.utcnow(),
    )
    db.add(new_doc)
    db.flush()

    tag_ids = db.execute(
        document_tags.select().where(document_tags.c.document_id == doc_id)
    ).fetchall()
    db.execute(
        document_tags.insert(),
        [{"document_id": new_doc.id, "tag_id": tag.tag_id} for tag in tag_ids],
    )
    db.commit()

    return new_doc


async def get_document_section(doc_id: int, section_name: str, db: Session, handrails: bool = True):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise ValueError(f"Document {doc_id} not found")
    html = await extract_section(doc, section_name, handrails)
    return html or ''
