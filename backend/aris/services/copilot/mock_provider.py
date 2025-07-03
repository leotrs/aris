"""Mock LLM provider for testing."""

from typing import List, Optional

from .interface import ChatContext, ChatMessage, LLMProvider


class MockLLMProvider(LLMProvider):
    """Mock LLM provider for testing purposes."""
    
    def __init__(self, available: bool = True, responses: Optional[List[str]] = None):
        """Initialize mock provider.
        
        Args:
            available: Whether the provider should report as available
            responses: Predefined responses to return (cycles through list)
        """
        self._available = available
        self._responses = responses or [
            "This is a mock response from the LLM provider.",
            "Here's another helpful response for testing.",
            "I can help you with scientific writing and research."
        ]
        self._response_index = 0
        self.call_count = 0
        self.last_messages: Optional[List[ChatMessage]] = None
        self.last_context: Optional[ChatContext] = None
    
    async def chat_completion(
        self,
        messages: List[ChatMessage],
        context: Optional[ChatContext] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7
    ) -> str:
        """Return a mock response."""
        self.call_count += 1
        self.last_messages = messages
        self.last_context = context
        
        if not self._available:
            from .interface import ProviderUnavailableError
            raise ProviderUnavailableError("Mock provider is unavailable", "mock")
        
        # Get the next response in rotation
        response = self._responses[self._response_index % len(self._responses)]
        self._response_index += 1
        
        # Add context awareness to response if context provided
        if context and context.manuscript_content:
            response = f"Based on your manuscript context: {response}"
        
        return response
    
    async def is_available(self) -> bool:
        """Return availability status."""
        return self._available
    
    @property
    def name(self) -> str:
        """Get provider name."""
        return "mock"
    
    def reset(self):
        """Reset mock state for testing."""
        self.call_count = 0
        self.last_messages = None
        self.last_context = None
        self._response_index = 0
    
    def set_available(self, available: bool):
        """Set availability for testing."""
        self._available = available
    
    def set_responses(self, responses: List[str]):
        """Set custom responses for testing."""
        self._responses = responses
        self._response_index = 0