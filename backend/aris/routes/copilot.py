"""Copilot chat routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from ..deps import UserRead, current_user, get_file_service
from ..logging_config import get_logger
from ..models.copilot import ChatRequest, ChatResponse
from ..services.copilot.factory import ProviderFactory
from ..services.copilot.interface import (
    ProviderError,
    ProviderRateLimitError,
    ProviderUnavailableError,
)
from ..services.copilot.service import CopilotService


logger = get_logger(__name__)

router = APIRouter(prefix="/copilot", tags=["copilot"])

# Global service instance - will be initialized on first request
_copilot_service: Optional[CopilotService] = None


async def get_copilot_service(file_service=Depends(get_file_service)) -> CopilotService:
    """Get or create the copilot service instance."""
    global _copilot_service
    
    if _copilot_service is None:
        try:
            # Use specific provider from environment variable
            provider = ProviderFactory.create_provider()
            
            # Check if provider is available and log details
            if await provider.is_available():
                _copilot_service = CopilotService(provider, file_service=file_service)
                logger.info(f"Initialized copilot service with provider: {provider.name}")
            else:
                raise ProviderUnavailableError(f"Provider {provider.name} is not available", provider.name)
                
        except ProviderUnavailableError as e:
            logger.error(f"Failed to initialize copilot service: {e}")
            # Fall back to mock provider for development
            from ..services.copilot.mock_provider import MockLLMProvider
            provider = MockLLMProvider()
            _copilot_service = CopilotService(provider, file_service=file_service)
            logger.warning("Falling back to mock provider for copilot service")
    
    return _copilot_service


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user: UserRead = Depends(current_user),
    copilot_service: CopilotService = Depends(get_copilot_service)
) -> ChatResponse:
    """Handle chat requests with the AI copilot.
    
    Args:
        request: The chat request with message and optional context
        user: The authenticated user making the request
        
    Returns:
        ChatResponse with the AI's response
        
    Raises:
        HTTPException: If the request is invalid or the service is unavailable
    """
    try:
        logger.info(f"Chat request from user {user.id}: {request.message[:100]}...")
        
        response = await copilot_service.chat(request, user=user)
        
        logger.info(f"Chat response generated for user {user.id}")
        return response
        
    except ProviderUnavailableError as e:
        logger.error(f"Provider unavailable for user {user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service is temporarily unavailable: {e.message}"
        )
    
    except ProviderRateLimitError as e:
        logger.warning(f"Rate limit exceeded for user {user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded: {e.message}"
        )
    
    except ProviderError as e:
        logger.error(f"Provider error for user {user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {e.message}"
        )
    
    except Exception as e:
        logger.error(f"Unexpected error in chat for user {user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )