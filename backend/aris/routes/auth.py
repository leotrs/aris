from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr

from .. import get_db, current_user, jwt, crud
from ..models import User
from ..security import verify_password, hash_password


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    initials: str = ""
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


router = APIRouter()


@router.get("/me")
async def me(user: User = Depends(current_user)):
    return {
        "email": user.email,
        "id": user.id,
        "name": user.name,
        "initials": user.initials,
        "created_at": user.created_at,
    }


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(User.email == user_data.email, User.deleted_at.is_(None))
    )
    user = result.scalars().first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access = jwt.create_access_token(data={"sub": str(user.id)})
    refresh = jwt.create_refresh_token(data={"sub": str(user.id)})
    return {"token_type": "bearer", "access_token": access, "refresh_token": refresh}


@router.post("/register")
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered.")

    password_hash = hash_password(user_data.password)
    new_user = await crud.create_user(
        user_data.name, user_data.initials, user_data.email, password_hash, db
    )

    access_token = jwt.create_access_token(data={"sub": str(new_user.id)})
    refresh_token = jwt.create_refresh_token(data={"sub": str(new_user.id)})

    return {
        "token_type": "bearer",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "initials": new_user.initials,
            "created_at": new_user.created_at,
        },
    }
