# backend/tests/test_routes/test_tags.py
import pytest
from httpx import AsyncClient


@pytest.fixture
async def authenticated_user(client: AsyncClient):
    """Create a user and return auth token."""
    response = await client.post(
        "/register",
        json={
            "email": "testuser@example.com",
            "name": "Test User",
            "initials": "TU",
            "password": "testpass123",
        },
    )
    token = response.json()["access_token"]
    user_id = response.json()["user"]["id"]
    return {"token": token, "user_id": user_id}


@pytest.fixture
def auth_headers(authenticated_user):
    """Return authorization headers."""
    return {"Authorization": f"Bearer {authenticated_user['token']}"}


@pytest.fixture
async def sample_tag(client: AsyncClient, authenticated_user):
    """Create a sample tag for testing."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.post(
        f"/users/{authenticated_user['user_id']}/tags",
        headers=headers,
        json={
            "name": "Test Tag",
            "color": "#FF0000",
        },
    )
    return {"tag": response.json(), "user_id": authenticated_user["user_id"]}


@pytest.fixture
async def sample_file(client: AsyncClient, authenticated_user):
    """Create a sample file for testing tag assignments."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )
    return response.json()


# Tag CRUD Tests


@pytest.mark.asyncio
async def test_create_tag_without_auth(client: AsyncClient):
    """Test that create tag endpoint requires authentication."""
    response = await client.post(
        "/users/1/tags",
        json={
            "name": "Test Tag",
            "color": "#FF0000",
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_tag_with_auth(client: AsyncClient, authenticated_user):
    """Test creating a tag with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.post(
        f"/users/{authenticated_user['user_id']}/tags",
        headers=headers,
        json={
            "name": "Test Tag",
            "color": "#FF0000",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Tag"
    assert data["color"] == "#FF0000"
    assert data["user_id"] == authenticated_user["user_id"]
    assert "id" in data


@pytest.mark.asyncio
async def test_create_tag_nonexistent_user(client: AsyncClient, authenticated_user):
    """Test creating a tag for a nonexistent user."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.post(
        "/users/99999/tags",
        headers=headers,
        json={
            "name": "Test Tag",
            "color": "#FF0000",
        },
    )
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]


@pytest.mark.asyncio
async def test_create_tag_invalid_data(client: AsyncClient, authenticated_user):
    """Test creating a tag with invalid data."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.post(
        f"/users/{authenticated_user['user_id']}/tags",
        headers=headers,
        json={
            "name": "",  # Empty name
            "color": "#FF0000",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_user_tags_without_auth(client: AsyncClient):
    """Test that get user tags endpoint requires authentication."""
    response = await client.get("/users/1/tags")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_user_tags_with_auth(client: AsyncClient, authenticated_user):
    """Test getting user tags with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(f"/users/{authenticated_user['user_id']}/tags", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_user_tags_with_existing_tag(client: AsyncClient, sample_tag):
    """Test getting user tags when tags exist."""
    headers = {"Authorization": f"Bearer {sample_tag['user_id']}"}
    response = await client.get(f"/users/{sample_tag['user_id']}/tags", headers=headers)
    assert response.status_code == 200
    tags = response.json()
    assert len(tags) >= 1
    tag_names = [tag["name"] for tag in tags]
    assert "Test Tag" in tag_names


@pytest.mark.asyncio
async def test_update_tag_without_auth(client: AsyncClient):
    """Test that update tag endpoint requires authentication."""
    response = await client.put(
        "/users/1/tags/1",
        json={
            "id": 1,
            "user_id": 1,
            "name": "Updated Tag",
            "color": "#00FF00",
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_tag_with_auth(client: AsyncClient, sample_tag, authenticated_user):
    """Test updating a tag with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    tag_data = sample_tag["tag"]
    response = await client.put(
        f"/users/{authenticated_user['user_id']}/tags/{tag_data['id']}",
        headers=headers,
        json={
            "id": tag_data["id"],
            "user_id": authenticated_user["user_id"],
            "name": "Updated Tag",
            "color": "#00FF00",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Tag"
    assert data["color"] == "#00FF00"
    assert data["id"] == tag_data["id"]


@pytest.mark.asyncio
async def test_update_nonexistent_tag(client: AsyncClient, authenticated_user):
    """Test updating a tag that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.put(
        f"/users/{authenticated_user['user_id']}/tags/99999",
        headers=headers,
        json={
            "id": 99999,
            "user_id": authenticated_user["user_id"],
            "name": "Updated Tag",
            "color": "#00FF00",
        },
    )
    assert response.status_code == 404
    assert "Tag not found" in response.json()["detail"]


@pytest.mark.asyncio
async def test_delete_tag_without_auth(client: AsyncClient):
    """Test that delete tag endpoint requires authentication."""
    response = await client.delete("/users/1/tags/1")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_delete_tag_with_auth(client: AsyncClient, sample_tag, authenticated_user):
    """Test deleting a tag with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    tag_data = sample_tag["tag"]
    response = await client.delete(
        f"/users/{authenticated_user['user_id']}/tags/{tag_data['id']}",
        headers=headers,
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_nonexistent_tag(client: AsyncClient, authenticated_user):
    """Test deleting a tag that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.delete(
        f"/users/{authenticated_user['user_id']}/tags/99999",
        headers=headers,
    )
    assert response.status_code == 404
    assert "Tag not found" in response.json()["detail"]


# File-Tag Association Tests


@pytest.mark.asyncio
async def test_get_user_file_tags_without_auth(client: AsyncClient):
    """Test that get user file tags endpoint requires authentication."""
    response = await client.get("/users/1/files/1/tags")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_user_file_tags_with_auth(client: AsyncClient, authenticated_user, sample_file):
    """Test getting user file tags with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(
        f"/users/{authenticated_user['user_id']}/files/{sample_file['id']}/tags",
        headers=headers,
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_user_file_tags_invalid_file(client: AsyncClient, authenticated_user):
    """Test getting tags for a nonexistent file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(
        f"/users/{authenticated_user['user_id']}/files/99999/tags",
        headers=headers,
    )
    assert response.status_code == 400
    assert "Error fetching tags for file" in response.json()["detail"]


@pytest.mark.asyncio
async def test_add_tag_to_file_without_auth(client: AsyncClient):
    """Test that add tag to file endpoint requires authentication."""
    response = await client.post("/users/1/files/1/tags/1")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_add_tag_to_file_with_auth(
    client: AsyncClient, authenticated_user, sample_file, sample_tag
):
    """Test adding a tag to a file with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    tag_data = sample_tag["tag"]
    response = await client.post(
        f"/users/{authenticated_user['user_id']}/files/{sample_file['id']}/tags/{tag_data['id']}",
        headers=headers,
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Tag added successfully"


@pytest.mark.asyncio
async def test_add_tag_to_file_invalid_data(client: AsyncClient, authenticated_user):
    """Test adding a tag to a file with invalid data."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.post(
        f"/users/{authenticated_user['user_id']}/files/99999/tags/99999",
        headers=headers,
    )
    assert response.status_code == 400
    assert "Error adding tag" in response.json()["detail"]


@pytest.mark.asyncio
async def test_remove_tag_from_file_without_auth(client: AsyncClient):
    """Test that remove tag from file endpoint requires authentication."""
    response = await client.delete("/users/1/files/1/tags/1")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_remove_tag_from_file_with_auth(
    client: AsyncClient, authenticated_user, sample_file, sample_tag
):
    """Test removing a tag from a file with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    tag_data = sample_tag["tag"]

    # First add the tag
    await client.post(
        f"/users/{authenticated_user['user_id']}/files/{sample_file['id']}/tags/{tag_data['id']}",
        headers=headers,
    )

    # Then remove it
    response = await client.delete(
        f"/users/{authenticated_user['user_id']}/files/{sample_file['id']}/tags/{tag_data['id']}",
        headers=headers,
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Tag removed successfully"


@pytest.mark.asyncio
async def test_remove_tag_from_file_invalid_data(client: AsyncClient, authenticated_user):
    """Test removing a tag from a file with invalid data."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.delete(
        f"/users/{authenticated_user['user_id']}/files/99999/tags/99999",
        headers=headers,
    )
    assert response.status_code == 400
    assert "Error removing tag" in response.json()["detail"]
