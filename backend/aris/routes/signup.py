"""HTTP endpoints for signup management.

This module provides REST API endpoints for early access signup functionality,
including creation, status checking, and unsubscription.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from ..crud.signup import (
    create_signup,
    email_exists,
    get_signup_by_email,
    unsubscribe_signup,
    DuplicateEmailError,
    SignupError,
)
from ..deps import get_db
from ..schemas import (
    SignupCreate,
    SignupResponse,
    SignupStatusCheck,
    SignupUnsubscribe,
    MessageResponse,
    ErrorResponse,
)

router = APIRouter(prefix="/signup", tags=["signup"])


@router.post(
    "/",
    response_model=SignupResponse,
    responses={
        201: {"description": "Successfully created signup"},
        400: {"model": ErrorResponse, "description": "Invalid input data"},
        409: {"model": ErrorResponse, "description": "Email already exists"},
        422: {"model": ErrorResponse, "description": "Validation error"},
    },
    summary="Create a new signup",
    description="Register a new user for early access to Aris platform",
)
async def create_signup_endpoint(
    signup_data: SignupCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Create a new early access signup.
    
    Validates input data and creates a new signup record. Returns the created
    signup information with sanitized data.
    """
    try:
        # Extract client information for compliance
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        
        signup = await create_signup(
            email=signup_data.email,
            name=signup_data.name,
            institution=signup_data.institution,
            research_area=signup_data.research_area,
            interest_level=signup_data.interest_level,
            ip_address=ip_address,
            user_agent=user_agent,
            source="website",
            db=db,
        )
        
        # Convert datetime to ISO format string for response
        response_data = SignupResponse(
            id=signup.id,
            email=signup.email,
            name=signup.name,
            institution=signup.institution,
            research_area=signup.research_area,
            interest_level=signup.interest_level,
            status=signup.status,
            created_at=signup.created_at.isoformat(),
        )
        
        return response_data
        
    except DuplicateEmailError:
        raise HTTPException(
            status_code=409,
            detail={
                "error": "duplicate_email",
                "message": "This email address is already registered for early access",
                "details": {"field": "email"}
            }
        )
    except SignupError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "signup_error",
                "message": str(e),
                "details": None
            }
        )
    except Exception as e:
        # Log the error in production
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "An unexpected error occurred. Please try again later.",
                "details": None
            }
        )


@router.get(
    "/status",
    response_model=SignupStatusCheck,
    responses={
        200: {"description": "Email status check result"},
        400: {"model": ErrorResponse, "description": "Invalid email format"},
    },
    summary="Check if email is registered",
    description="Check whether an email address is already registered for early access",
)
async def check_signup_status(
    email: str = Query(..., description="Email address to check"),
    db: AsyncSession = Depends(get_db),
):
    """Check if an email address is already registered.
    
    Returns whether the email exists in the signup database without
    exposing any other user information.
    """
    try:
        exists = await email_exists(email, db)
        return SignupStatusCheck(exists=exists)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error", 
                "message": "Unable to check email status",
                "details": None
            }
        )


@router.delete(
    "/unsubscribe",
    response_model=MessageResponse,
    responses={
        200: {"description": "Successfully unsubscribed"},
        400: {"model": ErrorResponse, "description": "Invalid request data"},
        404: {"model": ErrorResponse, "description": "Email not found"},
    },
    summary="Unsubscribe from early access",
    description="Remove an email address from the early access signup list",
)
async def unsubscribe_endpoint(
    unsubscribe_data: SignupUnsubscribe,
    db: AsyncSession = Depends(get_db),
):
    """Unsubscribe an email from the early access list.
    
    Marks the signup as unsubscribed rather than deleting it completely
    for compliance and analytics purposes.
    
    Note: In a production environment, you would validate the unsubscribe
    token to prevent unauthorized unsubscriptions.
    """
    try:
        # TODO: Implement token validation in production
        # For now, we'll accept any token for simplicity
        
        signup = await get_signup_by_email(unsubscribe_data.email, db)
        if not signup:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "email_not_found",
                    "message": "This email address is not registered for early access",
                    "details": {"field": "email"}
                }
            )
        
        await unsubscribe_signup(unsubscribe_data.email, db)
        
        return MessageResponse(
            message="Successfully unsubscribed from early access notifications"
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "internal_error",
                "message": "Unable to process unsubscribe request",
                "details": None
            }
        )