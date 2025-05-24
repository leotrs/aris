from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from uuid import UUID

from .config import settings
from . import crud


DB_URL = "postgresql://leo.torres@localhost:5432/aris"
ENGINE = create_engine(DB_URL)
ArisSession = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)


def get_db():
    db = ArisSession()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str

    class Config:
        orm_mode = True


async def current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> UserRead:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await crud.get_user(user_id, db)
    if user is None:
        raise credentials_exception
    return user
