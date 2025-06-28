"""Abstract interface for LLM providers."""

from abc import ABC, abstractmethod
from typing import List, Optional

from ...models.copilot import ChatContext, ChatMessage


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    @abstractmethod
    async def chat_completion(
        self,
        messages: List[ChatMessage],
        context: Optional[ChatContext] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7
    ) -> str:
        """Generate a chat completion response.
        
        Args:
            messages: List of chat messages in the conversation
            context: Optional manuscript context
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0.0 to 1.0)
            
        Returns:
            Generated response text
            
        Raises:
            ProviderError: If the provider encounters an error
        """
        pass
    
    @abstractmethod
    async def is_available(self) -> bool:
        """Check if the provider is available and configured.
        
        Returns:
            True if provider is available, False otherwise
        """
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Get the provider name."""
        pass


class ProviderError(Exception):
    """Exception raised when an LLM provider encounters an error."""
    
    def __init__(self, message: str, provider_name: str, status_code: Optional[int] = None):
        self.message = message
        self.provider_name = provider_name
        self.status_code = status_code
        super().__init__(f"{provider_name}: {message}")


class ProviderUnavailableError(ProviderError):
    """Exception raised when a provider is not available or configured."""
    pass


class ProviderRateLimitError(ProviderError):
    """Exception raised when a provider rate limit is exceeded."""
    pass