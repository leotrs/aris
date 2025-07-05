"""Main copilot service for handling chat requests."""

from typing import List, Optional, Protocol

from ...models.copilot import ChatContext, ChatMessage, ChatRequest, ChatResponse
from .interface import LLMProvider


class FileService(Protocol):
    """Protocol for file service dependency."""

    async def get_file(self, file_id: int) -> Optional[object]: ...


class User(Protocol):
    """Protocol for user dependency."""

    id: int


class CopilotService:
    """Service for handling copilot chat requests."""

    def __init__(
        self, provider: LLMProvider, file_service: Optional[FileService] = None
    ):
        """Initialize with an LLM provider and optional file service.

        Args:
            provider: The LLM provider to use for chat completions
            file_service: Optional file service for retrieving manuscript content
        """
        self.provider = provider
        self.file_service = file_service

    async def chat(
        self, request: ChatRequest, user: Optional[User] = None
    ) -> ChatResponse:
        """Process a chat request and return a response.

        Args:
            request: The chat request with message and optional context
            user: Optional user object for file access permissions

        Returns:
            ChatResponse with the AI's response

        Raises:
            ProviderError: If the LLM provider encounters an error
        """
        # Check if provider is available
        if not await self.provider.is_available():
            from .interface import ProviderUnavailableError

            raise ProviderUnavailableError(
                "LLM provider is not available", self.provider.name
            )

        # Build conversation history with potential manuscript content fetching
        messages, actual_context = await self._build_messages(request, user)

        # Get response from provider
        response_text = await self.provider.chat_completion(
            messages=messages,
            context=actual_context,
            max_tokens=4000,  # Reasonable default for chat responses
            temperature=0.7,  # Good balance of creativity and consistency
        )

        # Determine if context was actually used (has manuscript content)
        context_used = (
            actual_context is not None
            and getattr(actual_context, "manuscript_content", None) is not None
        )

        return ChatResponse(
            message=request.message, response=response_text, context_used=context_used
        )

    async def _build_messages(
        self, request: ChatRequest, user: Optional[User] = None
    ) -> tuple[List[ChatMessage], Optional[ChatContext]]:
        """Build the message list for the LLM provider.

        Args:
            request: The chat request
            user: Optional user object for file access permissions

        Returns:
            Tuple of (messages, actual_context_used)
        """
        messages = []

        # Add system message with context if provided
        if request.context:
            # Fetch manuscript content if file_id is provided but manuscript_content is not
            context = request.context
            if (
                context.file_id
                and not context.manuscript_content
                and self.file_service
                and user
            ):
                try:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.info(f"Fetching file {context.file_id} for user {user.id}")
                    
                    file_data = await self.file_service.get_file(context.file_id)
                    logger.info(f"File data retrieved: {file_data is not None}")
                    
                    if file_data and hasattr(file_data, 'source'):
                        source_content = getattr(file_data, 'source', '')
                        logger.info(f"File source length: {len(source_content) if source_content else 'no source content'}")
                        # Create new context with fetched manuscript content
                        context = ChatContext(
                            manuscript_content=source_content,
                            file_id=context.file_id,
                            selection=context.selection,
                            metadata=context.metadata,
                        )
                        logger.info(f"Context updated with manuscript content length: {len(context.manuscript_content) if context.manuscript_content else 0}")
                except Exception as e:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Failed to fetch file data: {e}")
                    # If file fetching fails, continue with original context
                    pass

            system_content = self._build_system_message(context)
            messages.append(ChatMessage(role="system", content=system_content))

            # Add user message
            messages.append(ChatMessage(role="user", content=request.message))

            return messages, context
        else:
            # Default system message for scientific writing assistance with RSM awareness
            system_content = (
                "You are an AI assistant specialized in scientific writing and research. "
                "You are familiar with RSM (Readable Science Markup) format. "
                "Help users improve their manuscripts, provide writing suggestions, "
                "and offer guidance on scientific communication best practices."
            )
            messages.append(ChatMessage(role="system", content=system_content))

            # Add user message
            messages.append(ChatMessage(role="user", content=request.message))

            return messages, None

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
