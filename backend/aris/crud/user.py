import asyncio
from datetime import datetime

from sqlalchemy import select, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import File, User, FileSettings
from .file import get_file, get_file_section
from .tag import get_user_file_tags
from .utils import extract_title


async def get_users(db: AsyncSession):
    result = await db.execute(select(User).where(User.deleted_at.is_(None)))
    return result.scalars().all()


async def get_user(user_id: int, db: AsyncSession):
    result = await db.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None)))
    return result.scalars().first()


async def create_user(name: str, initials: str, email: str, password_hash: str, db: AsyncSession):
    if not initials:
        initials = "".join([w[0].upper() for w in name.split()])

    user = User(name=name, initials=initials, email=email, password_hash=password_hash)
    db.add(user)
    await db.flush()  # Flush to get the user.id without committing

    # Create default settings for the new user
    default_settings = FileSettings(
        file_id=None,  # NULL for default settings
        user_id=user.id,
        background="var(--surface-page)",
        font_size="16px",
        line_height="1.5",
        font_family="Source Sans 3",
        margin_width="16px",
        columns=1,
    )
    db.add(default_settings)

    await db.commit()
    await db.refresh(user)
    return user


async def update_user(user_id: int, name: str, initials: str, email: str, db: AsyncSession):
    user = await get_user(user_id, db)
    if not user:
        return None
    if name != user.name:
        user.name = name
    if initials != user.initials:
        user.initials = initials
    if email != user.email:
        user.email = email
    await db.commit()
    await db.refresh(user)
    return user


async def soft_delete_user(user_id: int, db: AsyncSession):
    user = get_user(user_id, db)
    if not user:
        return None
    user.deleted_at = datetime.utcnow()
    await db.commit()
    return user


async def get_user_files(user_id: int, with_tags: bool, db: AsyncSession):
    user = await get_user(user_id, db)
    if not user:
        raise ValueError(f"User {user_id} not found")

    result = await db.execute(
        select(File)
        .where(File.owner_id == user_id, File.deleted_at.is_(None))
        .order_by(desc(File.last_edited_at), asc(File.source))
    )
    docs = result.scalars().all()

    titles = await asyncio.gather(*(extract_title(d) for d in docs))
    titles = dict(zip(docs, titles))

    tags = None
    if with_tags:
        tags_list = await asyncio.gather(*(get_user_file_tags(user_id, d.id, db) for d in docs))
        tags = dict(zip(docs, tags_list))

    return [
        {
            "id": doc.id,
            "title": titles[doc],
            "source": doc.source,
            "last_edited_at": doc.last_edited_at,
            "tags": tags[doc] if tags else [],
        }
        for doc in docs
    ]


async def get_user_file(
    user_id: int, doc_id: int, with_tags: bool, with_minimap: bool, db: AsyncSession
):
    user = await get_user(user_id, db)
    if not user:
        raise ValueError(f"User {user_id} not found")

    doc = await get_file(doc_id, db)
    if not doc:
        raise ValueError(f"File {user_id} not found")

    title = await extract_title(doc)
    tags = (await get_user_file_tags(user_id, doc_id, db)) if with_tags else []
    minimap = (await get_file_section(doc_id, "minimap", db)) if with_minimap else ""

    return {
        "id": doc.id,
        "title": title,
        "source": doc.source,
        "last_edited_at": doc.last_edited_at,
        "tags": tags,
        "minimap": str(minimap),
    }
