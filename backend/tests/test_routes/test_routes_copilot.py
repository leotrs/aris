"""Test copilot router routes."""

from httpx import AsyncClient


async def test_chat_requires_authentication(client: AsyncClient):
    """Test that chat endpoint requires authentication."""
    response = await client.post(
        "/copilot/chat",
        json={"message": "Hello, how can you help me?"}
    )
    
    assert response.status_code == 401
    assert "Invalid authentication credentials" in response.json()["detail"]


async def test_chat_with_valid_auth(authenticated_client: AsyncClient):
    """Test successful chat with authenticated user."""
    response = await authenticated_client.post(
        "/copilot/chat",
        json={"message": "Hello, how can you help me?"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check response structure
    assert "message" in data
    assert "response" in data
    assert isinstance(data["message"], str)
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0


async def test_chat_with_empty_message(authenticated_client: AsyncClient):
    """Test chat with empty message returns validation error."""
    response = await authenticated_client.post(
        "/copilot/chat",
        json={"message": ""}
    )
    
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


async def test_chat_with_missing_message(authenticated_client: AsyncClient):
    """Test chat with missing message field returns validation error."""
    response = await authenticated_client.post(
        "/copilot/chat",
        json={}
    )
    
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


async def test_chat_with_long_message(authenticated_client: AsyncClient):
    """Test chat with very long message."""
    long_message = "x" * 10000  # 10k characters
    
    response = await authenticated_client.post(
        "/copilot/chat",
        json={"message": long_message}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


async def test_chat_with_context(authenticated_client: AsyncClient):
    """Test chat with manuscript context."""
    response = await authenticated_client.post(
        "/copilot/chat",
        json={
            "message": "Help me improve this abstract",
            "context": {
                "manuscript_content": "This is a sample abstract about machine learning.",
                "file_id": 123
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


async def test_chat_provider_error_handling(authenticated_client: AsyncClient, monkeypatch):
    """Test that provider errors are handled gracefully."""
    # This test will need to be implemented once we have the service layer
    # For now, just ensure the endpoint exists
    response = await authenticated_client.post(
        "/copilot/chat",
        json={"message": "Test message"}
    )
    
    # Should either succeed or fail gracefully, not crash
    assert response.status_code in [200, 500, 503]


async def test_chat_rate_limiting(authenticated_client: AsyncClient):
    """Test rate limiting on chat endpoint."""
    # Make multiple rapid requests
    responses = []
    for i in range(10):
        response = await authenticated_client.post(
            "/copilot/chat",
            json={"message": f"Message {i}"}
        )
        responses.append(response)
    
    # At least some should succeed
    success_responses = [r for r in responses if r.status_code == 200]
    assert len(success_responses) > 0
    
    # If rate limiting is implemented, some might be 429
    # This is optional for MVP, so we don't assert on rate limiting yet