"""Database session and auth management dependencies for the Aris backend API.

This module provides:
- SQLAlchemy database engine and session setup.
- Dependency for injecting a database session into FastAPI routes.
- OAuth2 token-based authentication utilities.
- A Pydantic model for representing the current authenticated user.
- A dependency to retrieve the current authenticated user from a JWT token.

Environment variables:
- DB_URL_LOCAL: Local database connection URL.
- DB_URL_PROD: Production database connection URL.
- ENV: Environment indicator, "PROD" selects production DB URL.

"""

from typing import AsyncGenerator
from uuid import UUID

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, ConfigDict, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from . import crud
from .config import settings


load_dotenv()


ENGINE = create_async_engine(
    settings.DB_URL_PROD if settings.ENV == "PROD" else settings.DB_URL_LOCAL,
    future=True,
    connect_args={"statement_cache_size": 0},
)
ArisSession = async_sessionmaker(ENGINE, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Provide a SQLAlchemy database session as a FastAPI dependency.

    Yields:
        async_session: A SQLAlchemy async session connected to the configured database.

    Ensures the session is properly closed after use.

    """
    async with ArisSession() as async_session:
        yield async_session


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


class UserRead(BaseModel):
    """The current authenticated user.

    Attributes:
        id (UUID): The unique identifier of the user.
        email (EmailStr): The user's email address.
        full_name (str): The user's full name.
    """

    id: UUID
    email: EmailStr
    full_name: str
    model_config = ConfigDict(from_attributes=True)


async def current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
) -> UserRead:
    """Dependency that retrieves and validates the current authenticated user based on
    the provided OAuth2 Bearer token.

    Args:
        token (str): OAuth2 Bearer token extracted from the Authorization header.
        db (AsyncSession): SQLAlchemy database async session.

    Raises:
        HTTPException: If the token is invalid, missing, or the user does not exist.

    Returns:
        UserRead: The authenticated user's data.

    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    try:
        user_id: int = int(user_id_str)
    except ValueError:
        raise credentials_exception

    user = await crud.get_user(user_id, db)
    if user is None:
        raise credentials_exception
    return user
