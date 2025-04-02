from datetime import datetime

import rsm
from sqlalchemy.orm import Session

from ..models import Document, DocumentStatus


def _extract_title(doc: Document) -> str:
    if doc is None:
        return ""
    if doc.title:
        return doc.title
    app = rsm.app.ParserApp(plain=doc.source)
    app.run()
    return app.transformer.tree.title


def get_documents(db: Session):
    docs = db.query(Document).filter(Document.deleted_at.is_(None)).all()
    for doc in docs:
        if not doc:
            continue
        doc.title = _extract_title(doc)
    return docs


def get_document(document_id: int, db: Session):
    doc = (
        db.query(Document)
        .filter(Document.id == document_id, Document.deleted_at.is_(None))
        .first()
    )
    if doc:
        doc.title = _extract_title(doc)
    return doc


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
