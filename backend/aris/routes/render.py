"""Routes for rendering RSM into HTML."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, get_db

router = APIRouter(prefix="/render", tags=["files"])


class RenderObject(BaseModel):
    source: str = ""


@router.post("")
async def render(data: RenderObject, db: AsyncSession = Depends(get_db)):
    return await crud.render(data.source, db)
