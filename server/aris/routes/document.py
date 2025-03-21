from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/documents/{document_id}/html")
def get_document_html(document_id: int, db: Session = Depends(get_db)):
    doc = crud.get_document_html(document_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.post("/documents")
def create_document(
    title: str,
    abstract: str,
    owner_id: int,
    db: Session = Depends(get_db),
):
    return crud.create_document(title, abstract, owner_id, db)


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
