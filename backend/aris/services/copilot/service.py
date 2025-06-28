"""Main copilot service for handling chat requests."""

from typing import List

from ...models.copilot import ChatContext, ChatMessage, ChatRequest, ChatResponse
from .interface import LLMProvider


class CopilotService:
    """Service for handling copilot chat requests."""
    
    def __init__(self, provider: LLMProvider):
        """Initialize with an LLM provider.
        
        Args:
            provider: The LLM provider to use for chat completions
        """
        self.provider = provider
    
    async def chat(self, request: ChatRequest) -> ChatResponse:
        """Process a chat request and return a response.
        
        Args:
            request: The chat request with message and optional context
            
        Returns:
            ChatResponse with the AI's response
            
        Raises:
            ProviderError: If the LLM provider encounters an error
        """
        # Check if provider is available
        if not await self.provider.is_available():
            from .interface import ProviderUnavailableError
            raise ProviderUnavailableError("LLM provider is not available", self.provider.name)
        
        # Build conversation history
        messages = self._build_messages(request)
        
        # Get response from provider
        response_text = await self.provider.chat_completion(
            messages=messages,
            context=request.context,
            max_tokens=4000,  # Reasonable default for chat responses
            temperature=0.7   # Good balance of creativity and consistency
        )
        
        return ChatResponse(
            message=request.message,
            response=response_text,
            context_used=request.context is not None
        )
    
    def _build_messages(self, request: ChatRequest) -> List[ChatMessage]:
        """Build the message list for the LLM provider.
        
        Args:
            request: The chat request
            
        Returns:
            List of ChatMessage objects
        """
        messages = []
        
        # Add system message with context if provided
        if request.context:
            system_content = self._build_system_message(request.context)
            messages.append(ChatMessage(role="system", content=system_content))
        else:
            # Default system message for scientific writing assistance
            system_content = (
                "You are an AI assistant specialized in scientific writing and research. "
                "Help users improve their manuscripts, provide writing suggestions, "
                "and offer guidance on scientific communication best practices."
            )
            messages.append(ChatMessage(role="system", content=system_content))
        
        # Add user message
        messages.append(ChatMessage(role="user", content=request.message))
        
        return messages
    
    def _build_system_message(self, context: ChatContext) -> str:
        """Build a system message incorporating manuscript context.
        
        Args:
            context: The chat context
            
        Returns:
            System message string
        """
        system_parts = [
            "You are an AI assistant specialized in scientific writing and research.",
            "You have access to the user's current manuscript context.",
        ]
        
        if context.manuscript_content:
            system_parts.append(
                f"Current manuscript content: {context.manuscript_content[:1000]}..."
                if len(context.manuscript_content) > 1000
                else f"Current manuscript content: {context.manuscript_content}"
            )
        
        if context.selection:
            system_parts.append(f"Selected text: {context.selection}")
        
        if context.file_id:
            system_parts.append(f"Working on file ID: {context.file_id}")
        
        system_parts.append(
            "Use this context to provide relevant, specific advice for improving "
            "the user's scientific writing."
        )
        
        return " ".join(system_parts)