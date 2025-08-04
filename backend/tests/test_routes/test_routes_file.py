"""Test file routes."""

from httpx import AsyncClient


async def test_get_files_without_auth(client: AsyncClient):
    """Test that files endpoint requires authentication."""
    response = await client.get("/files")
    assert response.status_code == 401


async def test_get_files_with_auth(client: AsyncClient, authenticated_user):
    """Test getting files list with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get("/files", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


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
            "source": "test content without proper prefix",
        },
    )

    assert response.status_code == 422
    assert "Malformed RSM source" in response.json()["detail"][0]["msg"]


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
            "source": ":rsm:test content without suffix",
        },
    )

    assert response.status_code == 422
    assert "Malformed RSM source" in response.json()["detail"][0]["msg"]


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

    # Get the file
    response = await client.get(f"/files/{file_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == file_id
    assert data["title"] == "Test Document"


async def test_get_nonexistent_file(client: AsyncClient, authenticated_user):
    """Test getting a file that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get("/files/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"


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

    # Update the file
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
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["abstract"] == "Updated abstract"


async def test_update_file_invalid_rsm(client: AsyncClient, authenticated_user):
    """Test updating a file with invalid RSM source."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "Test abstract",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )
    file_id = create_response.json()["id"]

    # Try to update with invalid RSM
    response = await client.put(
        f"/files/{file_id}",
        headers=headers,
        json={
            "source": "invalid rsm content",
        },
    )

    assert response.status_code == 422
    assert "Malformed RSM source" in response.json()["detail"][0]["msg"]


async def test_delete_file(client: AsyncClient, authenticated_user):
    """Test deleting a file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "To Be Deleted",
            "abstract": "This will be deleted",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:delete me::",
        },
    )
    file_id = create_response.json()["id"]

    # Delete the file
    response = await client.delete(f"/files/{file_id}", headers=headers)
    assert response.status_code == 200

    # Verify it's deleted (should get 404)
    get_response = await client.get(f"/files/{file_id}", headers=headers)
    assert get_response.status_code == 404


async def test_duplicate_file(client: AsyncClient, authenticated_user):
    """Test duplicating a file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Original File",
            "abstract": "Original abstract",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:original content::",
        },
    )
    file_id = create_response.json()["id"]

    # Duplicate the file
    response = await client.post(f"/files/{file_id}/duplicate", headers=headers)
    assert response.status_code == 200
    
    duplicate_data = response.json()
    assert "id" in duplicate_data
    assert duplicate_data["id"] != file_id
    assert duplicate_data["message"] == "File duplicated successfully"


async def test_get_file_content(client: AsyncClient, authenticated_user):
    """Test getting file content as HTML."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:# Heading\n\nSome content::",
        },
    )
    file_id = create_response.json()["id"]

    # Get the content
    response = await client.get(f"/files/{file_id}/content", headers=headers)
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/html; charset=utf-8"
    assert "<h1>Heading</h1>" in response.text


async def test_get_file_content_section(client: AsyncClient, authenticated_user):
    """Test getting a specific section of file content."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file with sections
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:# Main Title\n\n## Section One\n\nContent::",
        },
    )
    file_id = create_response.json()["id"]

    # Get a specific section (level-2 refers to ## Section One)
    response = await client.get(f"/files/{file_id}/content/level-2", headers=headers)
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/html; charset=utf-8"


async def test_get_file_assets(client: AsyncClient, authenticated_user):
    """Test getting file assets."""
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

    # Get assets (should be empty for new file)
    response = await client.get(f"/files/{file_id}/assets", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) == 0


async def test_file_permissions(client: AsyncClient, authenticated_user, second_authenticated_user):
    """Test that users can only access their own files."""
    headers_primary = {"Authorization": f"Bearer {authenticated_user['token']}"}
    headers_secondary = {"Authorization": f"Bearer {second_authenticated_user['token']}"}

    # Create a file with primary user
    create_response = await client.post(
        "/files",
        headers=headers_primary,
        json={
            "title": "Private File",
            "abstract": "Should not be accessible by others",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:private content::",
        },
    )
    file_id = create_response.json()["id"]

    # Try to access with secondary user
    response = await client.get(f"/files/{file_id}", headers=headers_secondary)
    assert response.status_code == 403
    assert response.json()["detail"] == "Access denied"

    # Try to update with secondary user
    update_response = await client.put(
        f"/files/{file_id}",
        headers=headers_secondary,
        json={"title": "Hacked Title"},
    )
    assert update_response.status_code == 403

    # Try to delete with secondary user
    delete_response = await client.delete(f"/files/{file_id}", headers=headers_secondary)
    assert delete_response.status_code == 403


async def test_create_file_missing_required_fields(client: AsyncClient, authenticated_user):
    """Test creating a file without required fields."""
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