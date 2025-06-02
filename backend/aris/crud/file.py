import asyncio
from datetime import datetime

import rsm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import File, FileStatus, file_tags
from .utils import extract_section, extract_title


async def get_files(db: AsyncSession):
    result = await db.execute(select(File).where(File.deleted_at.is_(None)))
    files = result.scalars().all()
    titles = await asyncio.gather(*(extract_title(f) for f in files))
    for file, title in zip(files, titles):
        file.title = title
    return files


async def get_file(file_id: int, db: AsyncSession):
    result = await db.execute(select(File).where(File.id == file_id, File.deleted_at.is_(None)))
    file = result.scalars().first()
    if file:
        file.title = await extract_title(file)
    return file


async def get_file_html(file_id: int, db: AsyncSession):
    result = await db.execute(
        select(File.source).where(File.id == file_id, File.deleted_at.is_(None))
    )
    src = result.scalars().first()
    if not src:
        return None

    return rsm.render(src, handrails=True)


async def create_file(
    source: str,
    owner_id: int,
    title: str = "",
    abstract: str = "",
    db: AsyncSession = None,
):
    file = File(
        title=title,
        abstract=abstract,
        owner_id=owner_id,
        source=source,
        status=FileStatus.DRAFT,
    )
    file.last_edited_at = datetime.utcnow()
    db.add(file)
    await db.commit()
    await db.refresh(file)
    return file


async def update_file(
    file_id: int,
    title: str,
    source: str,
    db: AsyncSession,
):
    file = await get_file(file_id, db)
    if not file:
        return None

    file.title = title
    file.source = source
    file.last_edited_at = datetime.utcnow()
    await db.commit()
    await db.refresh(file)
    return file


async def soft_delete_file(file_id: int, db: AsyncSession):
    file = await get_file(file_id, db)
    if not file:
        return None
    file.deleted_at = datetime.utcnow()
    await db.commit()
    return {"message": f"File {file_id} soft deleted"}


async def duplicate_file(file_id: int, db: AsyncSession):
    original = await get_file(file_id, db)
    if not original or original.deleted_at:
        raise ValueError("File not found")

    new_file = File(
        title=f"{original.title} (copy)",
        source=original.source,
        owner_id=original.owner_id,
        last_edited_at=datetime.utcnow(),
    )
    db.add(new_file)
    await db.flush()

    tag_ids = await db.execute(file_tags.select().where(file_tags.c.file_id == file_id)).fetchall()
    await db.execute(
        file_tags.insert(),
        [{"file_id": new_file.id, "tag_id": tag.tag_id} for tag in tag_ids],
    )
    await db.commit()

    return new_file


async def get_file_section(
    file_id: int, section_name: str, db: AsyncSession, handrails: bool = True
):
    result = await db.execute(select(File).where(File.id == file_id))
    file = result.scalars().first()
    if not file:
        raise ValueError(f"File {file_id} not found")
    html = await extract_section(file, section_name, handrails)
    return html or ""
