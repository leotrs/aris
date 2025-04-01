from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, get_db
from ..models import Document, User

router = APIRouter()


@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return crud.get_users(db)


@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/users")
def create_user(
    full_name: str, email: str, password_hash: str, db: Session = Depends(get_db)
):
    return crud.create_user(full_name, email, password_hash, db)


@router.put("/users/{user_id}")
def update_user(
    user_id: int, full_name: str, email: str, db: Session = Depends(get_db)
):
    user = crud.update_user(user_id, full_name, email, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}")
def soft_delete_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.soft_delete_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {user_id} soft deleted"}


@router.get("/users/{user_id}/documents")
def get_user_documents(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_documents(user_id, db)
