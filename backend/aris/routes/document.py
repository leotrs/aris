import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .. import crud, get_db

router = APIRouter()


@router.get("/documents")
def get_documents(db: Session = Depends(get_db)):
    return crud.get_documents(db)


@router.get("/documents/{document_id}")
def get_document(document_id: int, db: Session = Depends(get_db)):
    doc = crud.get_document(document_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.get("/documents/{document_id}/html", response_class=HTMLResponse)
def get_document_html(document_id: int, db: Session = Depends(get_db)):
    doc = crud.get_document_html(document_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


class DocumentCreate(BaseModel):
    title: str
    abstract: str
    owner_id: int
    source: str

    def validate_source(self):
        if not self.source or not self.source.strip().startswith(":manuscript:"):
            raise ValueError("Malformed RSM source.")
        return self


@router.post("/documents")
def create_document(
    doc: DocumentCreate,
    db: Session = Depends(get_db),
):
    try:
        doc.validate_source()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = crud.create_document(doc.source, doc.owner_id, doc.title, doc.abstract, db)
    return {"message": "Manuscript created", "id": result.id}


@router.put("/documents/{document_id}")
def update_document(
    document_id: int,
    title: str,
    abstract: str,
    status: str,
    db: Session = Depends(get_db),
):
    doc = crud.update_document(document_id, title, abstract, status, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.delete("/documents/{document_id}")
def soft_delete_document(document_id: int, db: Session = Depends(get_db)):
    doc = crud.soft_delete_document(document_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": f"Document {document_id} soft deleted"}
