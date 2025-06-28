"""Test copilot service."""

import pytest

from aris.models.copilot import ChatContext, ChatRequest
from aris.services.copilot.interface import ProviderUnavailableError
from aris.services.copilot.mock_provider import MockLLMProvider
from aris.services.copilot.service import CopilotService


@pytest.fixture
def mock_provider():
    """Create a mock provider for testing."""
    return MockLLMProvider()


@pytest.fixture
def copilot_service(mock_provider):
    """Create a copilot service with mock provider."""
    return CopilotService(mock_provider)


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
    
    messages = copilot_service._build_messages(request)
    
    assert len(messages) == 2
    assert messages[0].role == "system"
    assert messages[1].role == "user"
    assert messages[1].content == "Test message"


async def test_message_building_with_context(copilot_service):
    """Test message building with context."""
    context = ChatContext(
        manuscript_content="Sample content",
        selection="important part",
        file_id=789
    )
    request = ChatRequest(message="Help with this", context=context)
    
    messages = copilot_service._build_messages(request)
    
    assert len(messages) == 2
    system_content = messages[0].content
    assert "Sample content" in system_content
    assert "important part" in system_content
    assert "789" in system_content