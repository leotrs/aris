from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .. import crud, get_db, current_user

router = APIRouter(
    prefix="/files", tags=["files"], dependencies=[Depends(current_user)]
)


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
async def get_files(db: Session = Depends(get_db)):
    return await crud.get_files(db)


@router.post("")
async def create_file(
    doc: FileCreate,
    db: Session = Depends(get_db),
):
    try:
        doc.validate_source()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = await crud.create_file(
        doc.source, doc.owner_id, doc.title, doc.abstract, db
    )
    return {"id": result.id}


@router.get("/{doc_id}")
async def get_file(doc_id: int, db: Session = Depends(get_db)):
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
    db: Session = Depends(get_db),
):
    doc = await crud.update_file(doc_id, file_data.title, file_data.source, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return doc


@router.delete("/{doc_id}")
async def soft_delete_file(doc_id: int, db: Session = Depends(get_db)):
    doc = await crud.soft_delete_file(doc_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": f"File {doc_id} soft deleted"}


@router.post("/{doc_id}/duplicate")
async def duplicate_file(doc_id: int, db: Session = Depends(get_db)):
    new_doc = await crud.duplicate_file(doc_id, db)
    return {"id": new_doc.id, "message": "File duplicated successfully"}


@router.get("/{doc_id}/content", response_class=HTMLResponse)
async def get_file_html(doc_id: int, db: Session = Depends(get_db)):
    doc = await crud.get_file_html(doc_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return doc


@router.get("/{doc_id}/content/{section_name}", response_class=HTMLResponse)
async def get_file_section(
    doc_id: int,
    section_name: str,
    handrails: bool = True,
    db: Session = Depends(get_db),
):
    try:
        html = await crud.get_file_section(doc_id, section_name, db, handrails)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Section {section_name} not found")
    return HTMLResponse(content=html)
