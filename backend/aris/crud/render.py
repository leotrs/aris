import asyncio
from datetime import datetime

import rsm
from sqlalchemy.orm import Session

from ..models import File, FileStatus, Tag, file_tags
from .utils import extract_section, extract_title


async def render(src: str, db: Session):
    return rsm.render(src, handrails=True)
