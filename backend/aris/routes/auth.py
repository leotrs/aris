from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, current_user, get_db, jwt
from ..models import User
from ..security import hash_password, verify_password


class UserLogin(BaseModel):
    """User login credentials."""

    email: EmailStr
    password: str

    model_config = {
        "json_schema_extra": {
            "example": {"email": "user@example.com", "password": "securepassword123"}
        }
    }


class UserCreate(BaseModel):
    """User registration data."""

    email: EmailStr
    name: str
    initials: str = ""
    password: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "newuser@example.com",
                "name": "Jane Doe",
                "initials": "JD",
                "password": "securepassword123",
            }
        }
    }


class Token(BaseModel):
    """JWT authentication tokens."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"

    model_config = {
        "json_schema_extra": {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
            }
        }
    }


router = APIRouter()


@router.get(
    "/me",
    summary="Get Current User",
    description="Retrieve the profile information of the currently authenticated user.",
    response_description="User profile information",
)
async def me(user: User = Depends(current_user)):
    """Get current authenticated user information.

    Parameters
    ----------
    user : User
        Current authenticated user from JWT token dependency.

    Returns
    -------
    dict
        User information including email, id, name, initials, created_at, and avatar color.

    Notes
    -----
    Requires valid JWT token in Authorization header.
    Returns a subset of user fields suitable for client display.
    """
    return {
        "email": user.email,
        "id": user.id,
        "name": user.name,
        "initials": user.initials,
        "created_at": user.created_at,
        "color": user.avatar_color,
    }


@router.post(
    "/login",
    response_model=Token,
    summary="User Login",
    description="Authenticate a user with email and password to receive access tokens.",
    response_description="JWT access and refresh tokens",
)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return access tokens.

    Parameters
    ----------
    user_data : UserLogin
        Login credentials containing email and password.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    Token
        Dictionary containing access_token, refresh_token, and token_type.

    Raises
    ------
    HTTPException
        400 error if credentials are invalid or user not found.

    Notes
    -----
    Verifies password using bcrypt and creates both access and refresh tokens.
    Only allows login for non-deleted users.
    """
    result = await db.execute(
        select(User).where(User.email == user_data.email, User.deleted_at.is_(None))
    )
    user = result.scalars().first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access = jwt.create_access_token(data={"sub": str(user.id)})
    refresh = jwt.create_refresh_token(data={"sub": str(user.id)})
    return {"token_type": "bearer", "access_token": access, "refresh_token": refresh}


@router.post(
    "/register",
    summary="User Registration",
    description="Create a new user account and receive authentication tokens.",
    response_description="User account details with authentication tokens",
)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user account.

    Parameters
    ----------
    user_data : UserCreate
        User registration data including email, name, initials, and password.
    db : AsyncSession
        SQLAlchemy async database session dependency.

    Returns
    -------
    dict
        Registration response containing tokens and user information.

    Raises
    ------
    HTTPException
        409 error if email is already registered.

    Notes
    -----
    Creates user with hashed password and default settings.
    Returns both access and refresh tokens for immediate authentication.
    Includes user profile data in response for client initialization.
    """
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
