from datetime import datetime

import rsm
from sqlalchemy.orm import Session

from ..models import Document, DocumentStatus


def get_documents(db: Session):
    return db.query(Document).filter(Document.deleted_at.is_(None)).all()


def get_document(document_id: int, db: Session):
    return (
        db.query(Document)
        .filter(Document.id == document_id, Document.deleted_at.is_(None))
        .first()
    )


def get_document_html(document_id: int, db: Session):
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


def create_document(
    title: str,
    abstract: str,
    owner_id: int,
    db: Session,
):
    doc = Document(
        title=title,
        abstract=abstract,
        owner_id=owner_id,
        status=DocumentStatus.DRAFT,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def update_document(
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


def soft_delete_document(document_id: int, db: Session):
    doc = get_document(document_id, db)
    if not doc:
        return None
    doc.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": f"Document {document_id} soft deleted"}
