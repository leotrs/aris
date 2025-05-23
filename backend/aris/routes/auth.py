from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from .. import get_db, jwt
from ..models import User
from ..security import verify_password
from ..deps import get_current_user


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


router = APIRouter()


@router.get("/me")
def read_current_user(user: User = Depends(get_current_user)):
    return {"email": user.email, "id": user.id}


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access = jwt.create_access_token(data={"sub": str(user.id)})
    refresh = jwt.create_refresh_token(data={"sub": str(user.id)})
    return {"token_type": "bearer", "access_token": access, "refresh_token": refresh}
