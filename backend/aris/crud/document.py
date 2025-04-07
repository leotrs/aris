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


async def get_document(document_id: int, db: Session):
    doc = (
        db.query(Document)
        .filter(Document.id == document_id, Document.deleted_at.is_(None))
        .first()
    )
    if doc:
        doc.title = await extract_title(doc)
    return doc


async def get_document_html(document_id: int, db: Session):
    result = (
        db.query(Document.source)
        .filter(Document.id == document_id, Document.deleted_at.is_(None))
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
    document_id: int,
    title: str,
    abstract: str,
    status: str,
    db: Session,
):
    doc = get_document(document_id, db)
    if not doc:
        return None
    doc.title = title
    doc.abstract = abstract
    doc.status = status
    db.commit()
    db.refresh(doc)
    return doc


async def soft_delete_document(document_id: int, db: Session):
    doc = get_document(document_id, db)
    if not doc:
        return None
    doc.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": f"Document {document_id} soft deleted"}


async def get_document_section(doc_id: int, section_name: str, db: Session):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise ValueError("Document not found")
    html = await extract_section(doc, section_name)
    if html is None:
        raise ValueError("Section not found in document")
    return html
