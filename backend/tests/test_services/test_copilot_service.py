"""Test copilot service."""

import pytest
from unittest.mock import AsyncMock, Mock

from datetime import datetime

from aris.models.copilot import ChatContext, ChatRequest
from aris.models.models import FileStatus
from aris.services.copilot.interface import ProviderUnavailableError
from aris.services.copilot.mock_provider import MockLLMProvider
from aris.services.copilot.service import CopilotService
from aris.services.file_service.models import FileData


@pytest.fixture
def mock_provider():
    """Create a mock provider for testing."""
    return MockLLMProvider()


@pytest.fixture
def mock_file_service():
    """Create a mock file service for testing."""
    return AsyncMock()


@pytest.fixture
def copilot_service(mock_provider):
    """Create a copilot service with mock provider."""
    return CopilotService(mock_provider)


@pytest.fixture
def copilot_service_with_file_service(mock_provider, mock_file_service):
    """Create a copilot service with mock provider and file service."""
    return CopilotService(mock_provider, file_service=mock_file_service)


async def test_simple_chat(copilot_service, mock_provider):
    """Test basic chat functionality."""
    request = ChatRequest(message="Hello, how are you?")
    
    response = await copilot_service.chat(request)
    
    assert response.message == "Hello, how are you?"
    assert len(response.response) > 0
    assert response.context_used is False
    assert mock_provider.call_count == 1


async def test_chat_with_context(copilot_service, mock_provider):
    """Test chat with manuscript context."""
    context = ChatContext(
        manuscript_content="This is a research paper about machine learning.",
        file_id=123,
        selection="machine learning"
    )
    request = ChatRequest(message="Improve this section", context=context)
    
    response = await copilot_service.chat(request)
    
    assert response.context_used is True
    assert "Based on your manuscript context" in response.response
    assert mock_provider.call_count == 1
    assert mock_provider.last_context == context


async def test_chat_system_message_generation(copilot_service, mock_provider):
    """Test that appropriate system messages are generated."""
    request = ChatRequest(message="Help me write")
    
    await copilot_service.chat(request)
    
    messages = mock_provider.last_messages
    assert len(messages) == 2
    assert messages[0].role == "system"
    assert "scientific writing" in messages[0].content.lower()
    assert messages[1].role == "user"
    assert messages[1].content == "Help me write"


async def test_chat_system_message_with_context(copilot_service, mock_provider):
    """Test system message includes context when provided."""
    context = ChatContext(
        manuscript_content="Research about neural networks.",
        file_id=456
    )
    request = ChatRequest(message="Help improve this", context=context)
    
    await copilot_service.chat(request)
    
    messages = mock_provider.last_messages
    system_message = messages[0].content
    assert "neural networks" in system_message
    assert "file ID: 456" in system_message


async def test_chat_with_unavailable_provider():
    """Test chat when provider is unavailable."""
    unavailable_provider = MockLLMProvider(available=False)
    service = CopilotService(unavailable_provider)
    
    request = ChatRequest(message="Hello")
    
    with pytest.raises(ProviderUnavailableError):
        await service.chat(request)


async def test_chat_with_long_context(copilot_service, mock_provider):
    """Test chat with very long manuscript content."""
    long_content = "x" * 2000  # Very long content
    context = ChatContext(manuscript_content=long_content)
    request = ChatRequest(message="Summarize this", context=context)
    
    await copilot_service.chat(request)
    
    messages = mock_provider.last_messages
    system_content = messages[0].content
    # Should be truncated
    assert "..." in system_content
    assert len(system_content) < len(long_content) + 500  # Much shorter than original


async def test_message_building_without_context(copilot_service):
    """Test message building without context."""
    request = ChatRequest(message="Test message")
    
    messages, actual_context = await copilot_service._build_messages(request)
    
    assert len(messages) == 2
    assert messages[0].role == "system"
    assert messages[1].role == "user"
    assert messages[1].content == "Test message"
    assert actual_context is None


async def test_message_building_with_context(copilot_service):
    """Test message building with context."""
    context = ChatContext(
        manuscript_content="Sample content",
        selection="important part",
        file_id=789
    )
    request = ChatRequest(message="Help with this", context=context)
    
    messages, actual_context = await copilot_service._build_messages(request)
    
    assert len(messages) == 2
    system_content = messages[0].content
    assert "Sample content" in system_content
    assert "important part" in system_content
    assert "789" in system_content
    assert actual_context is context


# New tests for file service integration
async def test_copilot_service_accepts_file_service_dependency(mock_provider, mock_file_service):
    """Test that copilot service can be constructed with file service."""
    service = CopilotService(mock_provider, file_service=mock_file_service)
    assert service.file_service is mock_file_service


async def test_chat_fetches_manuscript_by_file_id(copilot_service_with_file_service, mock_provider, mock_file_service):
    """Test that copilot automatically fetches manuscript content when file_id is provided."""
    # Setup mock file data
    file_data = FileData(
        id=123,
        title="Test Paper",
        abstract="Test abstract",
        source="# Introduction\n\nThis is a test manuscript in RSM format.",
        owner_id=456,
        status=FileStatus.DRAFT,
        created_at=datetime.now(),
        last_edited_at=datetime.now()
    )
    mock_file_service.get_file.return_value = file_data
    
    # Create request with only file_id (no manuscript_content)
    context = ChatContext(file_id=123)
    request = ChatRequest(message="Help improve this paper", context=context)
    
    # Mock user for authentication
    user = Mock()
    user.id = 456
    
    response = await copilot_service_with_file_service.chat(request, user=user)
    
    # Verify file service was called with correct file_id
    mock_file_service.get_file.assert_called_once_with(123)
    
    # Verify manuscript content was included in system message
    messages = mock_provider.last_messages
    system_content = messages[0].content
    assert "This is a test manuscript in RSM format" in system_content
    assert response.context_used is True


async def test_chat_handles_file_not_found(copilot_service_with_file_service, mock_provider, mock_file_service):
    """Test that copilot handles case when file is not found or user has no permission."""
    # Setup mock to return None (file not found or no permission)
    mock_file_service.get_file.return_value = None
    
    context = ChatContext(file_id=999)  # Non-existent file
    request = ChatRequest(message="Help with this", context=context)
    
    user = Mock()
    user.id = 456
    
    response = await copilot_service_with_file_service.chat(request, user=user)
    
    # Should fall back to default behavior without manuscript content
    assert response.context_used is False
    messages = mock_provider.last_messages
    system_content = messages[0].content
    assert "scientific writing" in system_content.lower()


async def test_chat_prefers_explicit_manuscript_content_over_file_id(copilot_service_with_file_service, mock_provider, mock_file_service):
    """Test that explicit manuscript_content takes precedence over file_id."""
    # Setup context with both manuscript_content and file_id
    context = ChatContext(
        manuscript_content="Explicit content provided",
        file_id=123
    )
    request = ChatRequest(message="Help improve this", context=context)
    
    user = Mock()
    user.id = 456
    
    await copilot_service_with_file_service.chat(request, user=user)
    
    # File service should NOT be called when explicit content is provided
    mock_file_service.get_file.assert_not_called()
    
    # Should use the explicit content
    messages = mock_provider.last_messages
    system_content = messages[0].content
    assert "Explicit content provided" in system_content


async def test_system_prompt_includes_rsm_awareness(copilot_service):
    """Test that default system prompt mentions RSM format."""
    request = ChatRequest(message="Help me write")
    
    await copilot_service.chat(request)
    
    messages = copilot_service.provider.last_messages
    system_content = messages[0].content
    assert "RSM" in system_content or "Readable Research Markup" in system_content