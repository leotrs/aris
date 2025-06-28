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
- DISABLE_AUTH: When set to "true", disables authentication for E2E testing.

"""

import os
from typing import AsyncGenerator, Optional
from uuid import UUID

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, ConfigDict, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from . import crud
from .config import settings
from .services.file_service import InMemoryFileService


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
        name (str): The user's name.
    """

    id: UUID
    email: EmailStr
    name: str
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
    # Check if authentication is disabled for E2E testing
    if os.getenv("DISABLE_AUTH", "").lower() == "true":
        # Return a mock user for E2E testing - use the same user as reset_test_user.py creates
        from datetime import datetime
        
        # Get the test user from database to ensure we have the right ID
        # This MUST succeed - the reset_test_user.py script should have created this user
        from sqlalchemy import text
        try:
            result = await db.execute(
                text("SELECT id, email, name FROM users WHERE email = :email"),
                {"email": "testuser@aris.pub"}
            )
            user_row = result.first()
            
            if not user_row:
                raise ValueError("Test user 'testuser@aris.pub' not found in database. Ensure reset_test_user.py has been run.")
            
            # Create a mock user object with the actual test user data
            class MockUser:
                def __init__(self, user_id, email, name):
                    self.id = user_id
                    self.email = email
                    self.name = name
                    self.initials = "".join(word[0].upper() for word in name.split()[:2])
                    self.created_at = datetime.now()
                    self.avatar_color = "#0E9AE9"  # Default blue color
            
            return MockUser(user_row.id, user_row.email, user_row.name)
            
        except Exception as e:
            # This should never happen in CI - it indicates a setup problem
            raise RuntimeError(f"Failed to fetch test user from database when DISABLE_AUTH=true. This indicates the test environment is not properly set up. Error: {e}")
    
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


# Global singleton file service instance
_file_service_instance: Optional[InMemoryFileService] = None


async def get_file_service() -> InMemoryFileService:
    """Dependency that provides a singleton file service instance.
    
    Returns:
        InMemoryFileService: The singleton file service instance.
    """
    global _file_service_instance
    
    if _file_service_instance is None:
        _file_service_instance = InMemoryFileService()
        await _file_service_instance.initialize()
        
        # Also update the package-level instance for external access
        import aris.services.file_service as fs_module
        fs_module.file_service_instance = _file_service_instance
    
    return _file_service_instance
