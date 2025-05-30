from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .. import crud, get_db, current_user
from ..models import File, User

router = APIRouter(
    prefix="/users", tags=["users"], dependencies=[Depends(current_user)]
)


# @router.get("")
# async def get_users(db: Session = Depends(get_db)):
#     return await crud.get_users(db)


@router.post("")
async def create_user(
    full_name: str, email: str, password_hash: str, db: Session = Depends(get_db)
):
    return await crud.create_user(full_name, email, password_hash, db)


@router.get("/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = await crud.get_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


class UserUpdate(BaseModel):
    name: str
    initials: str
    email: str


@router.put("/{user_id}")
async def update_user(
    user_id: int,
    update: UserUpdate,
    db: Session = Depends(get_db),
):
    user = await crud.update_user(
        user_id, update.name, update.initials, update.email, db
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def soft_delete_user(user_id: int, db: Session = Depends(get_db)):
    user = await crud.soft_delete_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {user_id} soft deleted"}


@router.get("/{user_id}/files")
async def get_user_files(
    user_id: int,
    with_tags: bool = True,
    with_minimap: bool = True,
    db: Session = Depends(get_db),
):
    return await crud.get_user_files(user_id, with_tags, with_minimap, db)


@router.get("/{user_id}/files/{doc_id}")
async def get_user_file(
    user_id: int,
    doc_id: int,
    with_tags: bool = True,
    with_minimap: bool = True,
    db: Session = Depends(get_db),
):
    return await crud.get_user_file(user_id, doc_id, with_tags, with_minimap, db)
