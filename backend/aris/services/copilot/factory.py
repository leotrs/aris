"""Factory for creating LLM providers based on configuration."""

import os
from typing import Optional

from .anthropic_provider import AnthropicProvider
from .interface import LLMProvider, ProviderUnavailableError
from .mock_provider import MockLLMProvider
from .openai_provider import OpenAIProvider


class ProviderFactory:
    """Factory for creating LLM providers."""
    
    @staticmethod
    def create_provider(
        provider_name: Optional[str] = None,
        **kwargs
    ) -> LLMProvider:
        """Create an LLM provider instance.
        
        Args:
            provider_name: Provider to create (openai, anthropic, mock)
                          Defaults to COPILOT_PROVIDER env var or "mock"
            **kwargs: Additional arguments passed to provider constructor
            
        Returns:
            Configured LLM provider instance
            
        Raises:
            ProviderUnavailableError: If provider is not available or unknown
        """
        if provider_name is None:
            provider_name = os.getenv("COPILOT_PROVIDER", "mock")
        
        provider_name = provider_name.lower()
        
        if provider_name == "openai":
            return OpenAIProvider(**kwargs)
        elif provider_name == "anthropic":
            return AnthropicProvider(**kwargs)
        elif provider_name == "mock":
            return MockLLMProvider(**kwargs)
        else:
            raise ProviderUnavailableError(
                f"Unknown provider: {provider_name}. "
                f"Available providers: openai, anthropic, mock",
                provider_name
            )
    
    @staticmethod
    async def create_available_provider(
        preferred_providers: Optional[list] = None,
        **kwargs
    ) -> LLMProvider:
        """Create the first available provider from a list.
        
        Args:
            preferred_providers: List of provider names to try in order
                                Defaults to ["openai", "anthropic", "mock"]
            **kwargs: Additional arguments passed to provider constructors
            
        Returns:
            First available provider instance
            
        Raises:
            ProviderUnavailableError: If no providers are available
        """
        if preferred_providers is None:
            # Default order: try real providers first, then mock
            preferred_providers = ["openai", "anthropic", "mock"]
        
        for provider_name in preferred_providers:
            try:
                provider = ProviderFactory.create_provider(provider_name, **kwargs)
                if await provider.is_available():
                    return provider
            except ProviderUnavailableError:
                continue
        
        raise ProviderUnavailableError(
            f"No available providers found. Tried: {preferred_providers}",
            "factory"
        )