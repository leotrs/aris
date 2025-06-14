from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, get_db, current_user
from ..models import FileAsset
from .file_assets import FileAssetOut

router = APIRouter(prefix="/files", tags=["files"], dependencies=[Depends(current_user)])


def _validate_source(model):
    if not model.source:
        return model
    if not model.source.strip().startswith(":rsm:"):
        raise ValueError("Malformed RSM source.")
    if not model.source.strip().endswith("::"):
        raise ValueError("Malformed RSM source.")
    return model


class FileCreate(BaseModel):
    title: str = ""
    abstract: str = ""
    owner_id: int
    source: str

    def validate_source(self):
        return _validate_source(self)


class FileUpdate(BaseModel):
    title: str = ""
    abstract: str = ""
    owner_id: int | None = None
    source: str = ""

    def validate_source(self):
        if self.source:
            _validate_source(self)
        return self


@router.get("")
async def get_files(db: AsyncSession = Depends(get_db)):
    return await crud.get_files(db)


@router.post("")
async def create_file(
    doc: FileCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        doc.validate_source()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = await crud.create_file(doc.source, doc.owner_id, doc.title, doc.abstract, db)
    return {"id": result.id}


@router.get("/{doc_id}")
async def get_file(doc_id: int, db: AsyncSession = Depends(get_db)):
    doc = await crud.get_file(doc_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return {
        "id": doc_id,
        "title": doc.title,
        "abstract": doc.abstract,
        "last_edited_at": doc.last_edited_at,
        "source": doc.source,
        "owner_id": doc.owner_id,
    }


@router.put("/{doc_id}")
async def update_file(
    doc_id: int,
    file_data: FileUpdate,
    db: AsyncSession = Depends(get_db),
):
    doc = await crud.update_file(doc_id, file_data.title, file_data.source, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return doc


@router.delete("/{doc_id}")
async def soft_delete_file(doc_id: int, db: AsyncSession = Depends(get_db)):
    doc = await crud.soft_delete_file(doc_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": f"File {doc_id} soft deleted"}


@router.post("/{doc_id}/duplicate")
async def duplicate_file(doc_id: int, db: AsyncSession = Depends(get_db)):
    new_doc = await crud.duplicate_file(doc_id, db)
    return {"id": new_doc.id, "message": "File duplicated successfully"}


@router.get("/{doc_id}/content", response_class=HTMLResponse)
async def get_file_html(doc_id: int, db: AsyncSession = Depends(get_db)):
    doc = await crud.get_file_html(doc_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return doc


@router.get("/{doc_id}/content/{section_name}", response_class=HTMLResponse)
async def get_file_section(
    doc_id: int,
    section_name: str,
    handrails: bool = True,
    db: AsyncSession = Depends(get_db),
):
    try:
        html = await crud.get_file_section(doc_id, section_name, db, handrails)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Section {section_name} not found")
    return HTMLResponse(content=html)


@router.get("/{file_id}/assets", response_model=list[FileAssetOut])
async def get_assets_for_file(
    file_id: int,
    db: AsyncSession = Depends(get_db),
    user=Depends(current_user),
):
    result = await db.execute(
        select(FileAsset).where(
            FileAsset.file_id == file_id,
            FileAsset.owner_id == user.id,
            FileAsset.deleted_at.is_(None),
        )
    )
    assets = result.scalars().all()
    return assets
