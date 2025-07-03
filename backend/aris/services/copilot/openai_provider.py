"""OpenAI LLM provider implementation."""

import os
from typing import List, Optional

from .interface import (
    ChatContext,
    ChatMessage,
    LLMProvider,
    ProviderError,
    ProviderRateLimitError,
    ProviderUnavailableError,
)


class OpenAIProvider(LLMProvider):
    """OpenAI LLM provider using the OpenAI API."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4"):
        """Initialize OpenAI provider.
        
        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY env var)
            model: Model to use (defaults to gpt-4)
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        self._client = None
    
    async def _get_client(self):
        """Get OpenAI client, initializing if needed."""
        if self._client is None:
            try:
                import openai
                self._client = openai.AsyncOpenAI(api_key=self.api_key)
            except ImportError:
                raise ProviderUnavailableError(
                    "OpenAI library not installed. Install with: pip install openai",
                    "openai"
                )
        return self._client
    
    async def chat_completion(
        self,
        messages: List[ChatMessage],
        context: Optional[ChatContext] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7
    ) -> str:
        """Generate a chat completion using OpenAI API."""
        if not await self.is_available():
            raise ProviderUnavailableError("OpenAI provider is not properly configured", "openai")
        
        try:
            client = await self._get_client()
            
            # Convert our ChatMessage format to OpenAI format
            openai_messages = [
                {"role": msg.role, "content": msg.content}
                for msg in messages
            ]
            
            response = await client.chat.completions.create(
                model=self.model,
                messages=openai_messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            return response.choices[0].message.content or ""
            
        except Exception as e:
            error_msg = str(e)
            
            # Handle specific OpenAI errors
            if "rate_limit" in error_msg.lower():
                raise ProviderRateLimitError(error_msg, "openai")
            elif "authentication" in error_msg.lower() or "api_key" in error_msg.lower():
                raise ProviderUnavailableError(f"Authentication error: {error_msg}", "openai")
            elif "quota" in error_msg.lower():
                raise ProviderUnavailableError(f"Quota exceeded: {error_msg}", "openai")
            else:
                raise ProviderError(f"OpenAI API error: {error_msg}", "openai")
    
    async def is_available(self) -> bool:
        """Check if OpenAI provider is available and configured."""
        if not self.api_key:
            return False
        
        try:
            import openai  # noqa: F401
            # Simple availability check - we could ping the API here if needed
            return True
        except ImportError:
            return False
    
    @property
    def name(self) -> str:
        """Get provider name."""
        return "openai"