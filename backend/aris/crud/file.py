import asyncio
from datetime import datetime

import rsm
from sqlalchemy.orm import Session

from ..models import File, FileStatus, Tag, file_tags
from .utils import extract_section, extract_title


async def get_files(db: Session):
    docs = db.query(File).filter(File.deleted_at.is_(None)).all()
    titles = await asyncio.gather(*(extract_title(d) for d in docs))
    for doc, title in zip(docs, titles):
        doc.title = title
    return docs


async def get_file(doc_id: int, db: Session):
    doc = (
        db.query(File)
        .filter(File.id == doc_id, File.deleted_at.is_(None))
        .first()
    )
    if doc:
        doc.title = await extract_title(doc)
    return doc


async def get_file_html(doc_id: int, db: Session):
    result = (
        db.query(File.source)
        .filter(File.id == doc_id, File.deleted_at.is_(None))
        .first()
    )
    if result:
        src = result[0]
    else:
        return src

    return rsm.render(src, handrails=True)


async def create_file(
    source: str,
    owner_id: int,
    title: str = "",
    abstract: str = "",
    db: Session = None,
):
    doc = File(
        title=title,
        abstract=abstract,
        owner_id=owner_id,
        source=source,
        status=FileStatus.DRAFT,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


async def update_file(
    doc_id: int,
    title: str,
    abstract: str,
    status: str,
    db: Session,
):
    doc = get_file(doc_id, db)
    if not doc:
        return None
    doc.title = title
    doc.abstract = abstract
    doc.status = status
    db.commit()
    db.refresh(doc)
    return doc


async def soft_delete_file(doc_id: int, db: Session):
    doc = await get_file(doc_id, db)
    if not doc:
        return None
    doc.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": f"File {doc_id} soft deleted"}


async def duplicate_file(doc_id: int, db: Session):
    original = await get_file(doc_id, db)
    if not original or original.deleted_at:
        raise ValueError("File not found")

    new_doc = File(
        title=f"{original.title} (copy)",
        source=original.source,
        owner_id=original.owner_id,
        last_edited_at=datetime.utcnow(),
    )
    db.add(new_doc)
    db.flush()

    tag_ids = db.execute(
        file_tags.select().where(file_tags.c.file_id == doc_id)
    ).fetchall()
    db.execute(
        file_tags.insert(),
        [{"file_id": new_doc.id, "tag_id": tag.tag_id} for tag in tag_ids],
    )
    db.commit()

    return new_doc


async def get_file_section(doc_id: int, section_name: str, db: Session, handrails: bool = True):
    doc = db.query(File).filter(File.id == doc_id).first()
    if not doc:
        raise ValueError(f"File {doc_id} not found")
    html = await extract_section(doc, section_name, handrails)
    return html or ''
