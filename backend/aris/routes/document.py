from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .. import crud, get_db

router = APIRouter(prefix="/documents", tags=["documents"])


class DocumentCreate(BaseModel):
    title: str
    abstract: str
    owner_id: int
    source: str

    def validate_source(self):
        if not self.source or not self.source.strip().startswith(":manuscript:"):
            raise ValueError("Malformed RSM source.")
        return self


@router.get("")
async def get_documents(db: Session = Depends(get_db)):
    return await crud.get_documents(db)


@router.post("")
async def create_document(
    doc: DocumentCreate,
    db: Session = Depends(get_db),
):
    try:
        doc.validate_source()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = await crud.create_document(
        doc.source, doc.owner_id, doc.title, doc.abstract, db
    )
    return {"message": "Manuscript created", "id": result.id}


@router.get("/{doc_id}")
async def get_document(doc_id: int, db: Session = Depends(get_db)):
    doc = await crud.get_document(doc_id, db)
    tags = await crud.get_document_tags(doc_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc_id,
        "title": doc.title,
        "abstract": doc.abstract,
        "last_edited_at": doc.last_edited_at,
        "source": doc.source,
        "owner_id": doc.owner_id,
        "tags": [{"name": t.name, "id": t.id} for t in tags],
    }


@router.put("/{doc_id}")
async def update_document(
    doc_id: int,
    title: str,
    abstract: str,
    status: str,
    db: Session = Depends(get_db),
):
    doc = await crud.update_document(doc_id, title, abstract, status, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.delete("/{doc_id}")
async def soft_delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = await crud.soft_delete_document(doc_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": f"Document {doc_id} soft deleted"}


@router.post("/{doc_id}/duplicate")
async def duplicate_document(doc_id: int, db: Session = Depends(get_db)):
    new_doc = await crud.duplicate_document(doc_id, db)
    return {"id": new_doc.id, "message": "Document duplicated successfully"}


@router.get("/{doc_id}/content", response_class=HTMLResponse)
async def get_document_html(doc_id: int, db: Session = Depends(get_db)):
    doc = await crud.get_document_html(doc_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.get("/{doc_id}/content/{section_name}", response_class=HTMLResponse)
async def get_document_section(
        doc_id: int, section_name: str, handrails: bool = True, db: Session = Depends(get_db)
):
    try:
        html = await crud.get_document_section(doc_id, section_name, db, handrails)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Section {section_name} not found")
    return HTMLResponse(content=html)
