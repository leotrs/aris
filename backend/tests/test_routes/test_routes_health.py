"""Dummy test."""


async def test_health_check(client):
    """Test health endpoint returns ok status."""
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Aris API is running"}
