from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, get_db
from ..models import Document, User

router = APIRouter()


@router.get("/users")
async def get_users(db: Session = Depends(get_db)):
    return await crud.get_users(db)


@router.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = await crud.get_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/users")
async def create_user(
    full_name: str, email: str, password_hash: str, db: Session = Depends(get_db)
):
    return await crud.create_user(full_name, email, password_hash, db)


@router.put("/users/{user_id}")
async def update_user(
    user_id: int, full_name: str, email: str, db: Session = Depends(get_db)
):
    user = await crud.update_user(user_id, full_name, email, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}")
async def soft_delete_user(user_id: int, db: Session = Depends(get_db)):
    user = await crud.soft_delete_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {user_id} soft deleted"}


@router.get("/users/{user_id}/documents")
async def get_user_documents(user_id: int, db: Session = Depends(get_db)):
    return await crud.get_user_documents(user_id, True, db)
