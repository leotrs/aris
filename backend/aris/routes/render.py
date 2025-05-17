from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .. import crud, get_db

router = APIRouter(prefix="/render", tags=["files"])


class RenderObject(BaseModel):
    source: str = ""


@router.post("")
async def render(data: RenderObject, db: Session = Depends(get_db)):
    return await crud.render(data.source, db)
