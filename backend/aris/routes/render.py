"""Routes for rendering RSM into HTML."""

from fastapi import APIRouter
from pydantic import BaseModel

from .. import crud


router = APIRouter(prefix="/render", tags=["files"])


class RenderObject(BaseModel):
    source: str = ""


@router.post("")
async def render(data: RenderObject):
    return await crud.render(data.source)
