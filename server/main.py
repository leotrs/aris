from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from aris import ArisSession
from aris.models import Document, User

app = FastAPI()


def get_db():
    db = ArisSession()
    try:
        yield db
    finally:
        db.close()


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).filter(User.deleted_at.is_(None)).all()


@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.deleted_at.is_(None)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/users")
def create_user(
    full_name: str, email: str, password_hash: str, db: Session = Depends(get_db)
):
    user = User(full_name=full_name, email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.put("/users/{user_id}")
def update_user(
    user_id: int, full_name: str, email: str, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id, User.deleted_at.is_(None)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.full_name = full_name
    user.email = email
    db.commit()
    return user


@app.delete("/users/{user_id}")
def soft_delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.deleted_at.is_(None)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": f"User {user_id} soft deleted"}


@app.get("/documents")
def get_documents(db: Session = Depends(get_db)):
    return db.query(Document).filter(Document.deleted_at.is_(None)).all()


@app.get("/documents/{document_id}")
def get_document(document_id: int, db: Session = Depends(get_db)):
    doc = (
        db.query(Document)
        .filter(Document.id == document_id, Document.deleted_at.is_(None))
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@app.post("/documents")
def create_document(
    title: str,
    abstract: str,
    owner_id: int,
    status: str,
    license_type: str,
    db: Session = Depends(get_db),
):
    doc = Document(
        title=title,
        abstract=abstract,
        owner_id=owner_id,
        status=status,
        license_type=license_type,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@app.put("/documents/{document_id}")
def update_document(
    document_id: int,
    title: str,
    abstract: str,
    status: str,
    db: Session = Depends(get_db),
):
    doc = (
        db.query(Document)
        .filter(Document.id == document_id, Document.deleted_at.is_(None))
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.title = title
    doc.abstract = abstract
    doc.status = status
    db.commit()
    return doc


@app.delete("/documents/{document_id}")
def soft_delete_document(document_id: int, db: Session = Depends(get_db)):
    doc = (
        db.query(Document)
        .filter(Document.id == document_id, Document.deleted_at.is_(None))
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": "Document soft deleted"}
