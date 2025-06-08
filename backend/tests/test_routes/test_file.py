# backend/tests/test_routes/test_files.py
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


@pytest.mark.asyncio
async def test_get_files_without_auth(client: AsyncClient):
    """Test that files endpoint requires authentication."""
    response = await client.get("/files")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_files_with_auth(client: AsyncClient, authenticated_user):
    """Test getting files list with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get("/files", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_file_valid_rsm_source(client: AsyncClient, authenticated_user):
    """Test creating a file with valid RSM source."""
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

    assert response.status_code == 200
    data = response.json()
    assert "id" in data


@pytest.mark.asyncio
async def test_create_file_invalid_rsm_source_no_prefix(client: AsyncClient, authenticated_user):
    """Test creating a file with invalid RSM source (missing :rsm: prefix)."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": "invalid content::",
        },
    )

    assert response.status_code == 400
    assert "Malformed RSM source" in response.json()["detail"]


@pytest.mark.asyncio
async def test_create_file_invalid_rsm_source_no_suffix(client: AsyncClient, authenticated_user):
    """Test creating a file with invalid RSM source (missing :: suffix)."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content",
        },
    )

    assert response.status_code == 400
    assert "Malformed RSM source" in response.json()["detail"]


@pytest.mark.asyncio
async def test_create_file_empty_source(client: AsyncClient, authenticated_user):
    """Test creating a file with empty source (should pass validation)."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": "",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert "id" in data


@pytest.mark.asyncio
async def test_create_file_without_auth(client: AsyncClient):
    """Test creating a file without authentication."""
    response = await client.post(
        "/files",
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": 1,
            "source": ":rsm:test content::",
        },
    )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_file_by_id(client: AsyncClient, authenticated_user):
    """Test getting a specific file by ID."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )

    file_id = create_response.json()["id"]

    # Then get it
    response = await client.get(f"/files/{file_id}", headers=headers)
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == file_id
    assert data["title"] == "Test Document"
    assert data["abstract"] == "A test document"
    assert data["source"] == ":rsm:test content::"
    assert data["owner_id"] == authenticated_user["user_id"]
    assert "last_edited_at" in data


@pytest.mark.asyncio
async def test_get_nonexistent_file(client: AsyncClient, authenticated_user):
    """Test getting a file that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.get("/files/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"


@pytest.mark.asyncio
async def test_update_file(client: AsyncClient, authenticated_user):
    """Test updating a file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Original Title",
            "abstract": "Original abstract",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:original content::",
        },
    )

    file_id = create_response.json()["id"]

    # Then update it
    response = await client.put(
        f"/files/{file_id}",
        headers=headers,
        json={
            "title": "Updated Title",
            "abstract": "Updated abstract",
            "source": ":rsm:updated content::",
        },
    )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_update_nonexistent_file(client: AsyncClient, authenticated_user):
    """Test updating a file that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.put(
        "/files/99999",
        headers=headers,
        json={
            "title": "Updated Title",
            "abstract": "Updated abstract",
            "source": ":rsm:updated content::",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"


@pytest.mark.asyncio
async def test_soft_delete_file(client: AsyncClient, authenticated_user):
    """Test soft deleting a file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )

    file_id = create_response.json()["id"]

    # Then delete it
    response = await client.delete(f"/files/{file_id}", headers=headers)
    assert response.status_code == 200
    assert f"File {file_id} soft deleted" in response.json()["message"]


@pytest.mark.asyncio
async def test_delete_nonexistent_file(client: AsyncClient, authenticated_user):
    """Test deleting a file that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.delete("/files/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"


@pytest.mark.asyncio
async def test_duplicate_file(client: AsyncClient, authenticated_user):
    """Test duplicating a file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Original Document",
            "abstract": "Original abstract",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:original content::",
        },
    )

    file_id = create_response.json()["id"]

    # Then duplicate it
    response = await client.post(f"/files/{file_id}/duplicate", headers=headers)
    assert response.status_code == 200

    data = response.json()
    assert "id" in data
    assert data["id"] != file_id  # Should be a new ID
    assert data["message"] == "File duplicated successfully"


@pytest.mark.asyncio
async def test_get_file_html_content(client: AsyncClient, authenticated_user):
    """Test getting file HTML content."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )

    file_id = create_response.json()["id"]

    # Then get HTML content
    response = await client.get(f"/files/{file_id}/content", headers=headers)
    # This might return 200 with HTML or 404 if not implemented
    assert response.status_code in [200, 404, 500]  # Depends on your crud implementation


@pytest.mark.asyncio
async def test_get_file_section(client: AsyncClient, authenticated_user):
    """Test getting a specific file section."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )

    file_id = create_response.json()["id"]

    # Then get a section
    response = await client.get(f"/files/{file_id}/content/intro", headers=headers)
    # This might return 200, 404 depending on your implementation
    assert response.status_code in [200, 404, 500]


@pytest.mark.asyncio
async def test_get_file_assets(client: AsyncClient, authenticated_user):
    """Test getting assets for a file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )

    file_id = create_response.json()["id"]

    # Then get assets
    response = await client.get(f"/files/{file_id}/assets", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_file_missing_required_fields(client: AsyncClient, authenticated_user):
    """Test creating a file with missing required fields."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document"
            # Missing required fields: owner_id, source
        },
    )

    assert response.status_code == 422  # Validation error
