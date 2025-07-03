"""Anthropic LLM provider implementation."""

import os
from typing import Any, List, Optional

from .interface import (
    ChatContext,
    ChatMessage,
    LLMProvider,
    ProviderError,
    ProviderRateLimitError,
    ProviderUnavailableError,
)


class AnthropicProvider(LLMProvider):
    """Anthropic LLM provider using the Claude API."""

    def __init__(
        self, api_key: Optional[str] = None, model: str = "claude-3-5-sonnet-20241022"
    ):
        """Initialize Anthropic provider.

        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
            model: Model to use (defaults to claude-3-5-sonnet)
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model = model
        self._client: Optional[Any] = None

    async def _get_client(self):
        """Get Anthropic client, initializing if needed."""
        if self._client is None:
            try:
                import anthropic

                self._client = anthropic.AsyncAnthropic(api_key=self.api_key)
            except ImportError:
                raise ProviderUnavailableError(
                    "Anthropic library not installed. Install with: pip install anthropic",
                    "anthropic",
                )
        return self._client

    async def chat_completion(
        self,
        messages: List[ChatMessage],
        context: Optional[ChatContext] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7,
    ) -> str:
        """Generate a chat completion using Anthropic API."""
        if not await self.is_available():
            raise ProviderUnavailableError(
                "Anthropic provider is not properly configured", "anthropic"
            )

        try:
            client = await self._get_client()

            # Separate system message from user/assistant messages for Claude
            system_message = None
            conversation_messages = []

            for msg in messages:
                if msg.role == "system":
                    system_message = msg.content
                else:
                    conversation_messages.append(
                        {"role": msg.role, "content": msg.content}
                    )

            # Ensure we have at least one user message
            if not conversation_messages or conversation_messages[0]["role"] != "user":
                raise ProviderError("First message must be from user", "anthropic")

            response = await client.messages.create(
                model=self.model,
                max_tokens=max_tokens or 4000,
                temperature=temperature,
                system=system_message,
                messages=conversation_messages,
            )

            return response.content[0].text if response.content else ""

        except Exception as e:
            error_msg = str(e)

            # Handle specific Anthropic errors
            if "rate_limit" in error_msg.lower():
                raise ProviderRateLimitError(error_msg, "anthropic")
            elif (
                "authentication" in error_msg.lower() or "api_key" in error_msg.lower()
            ):
                raise ProviderUnavailableError(
                    f"Authentication error: {error_msg}", "anthropic"
                )
            elif "quota" in error_msg.lower() or "credit" in error_msg.lower():
                raise ProviderUnavailableError(
                    f"Quota exceeded: {error_msg}", "anthropic"
                )
            else:
                raise ProviderError(f"Anthropic API error: {error_msg}", "anthropic")

    async def is_available(self) -> bool:
        """Check if Anthropic provider is available and configured."""
        # Always return False in CI environment to prevent costly API calls
        if os.getenv("ENV") == "CI" or os.getenv("CI"):
            return False
            
        if not self.api_key:
            return False

        try:
            import anthropic  # noqa: F401

            return True
        except ImportError:
            return False

    @property
    def name(self) -> str:
        """Get provider name."""
        return "anthropic"
