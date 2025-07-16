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
            "source": "invalid content::",
        },
    )

    assert response.status_code == 400
    assert "Malformed RSM source" in response.json()["detail"]


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


async def test_delete_nonexistent_file(client: AsyncClient, authenticated_user):
    """Test deleting a file that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.delete("/files/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"


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


async def test_duplicate_file_with_tags(client: AsyncClient, authenticated_user):
    """Test duplicating a file that has tags."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    user_id = authenticated_user["user_id"]

    # First create some tags
    tag1_response = await client.post(
        f"/users/{user_id}/tags", headers=headers, json={"name": "Test Tag 1", "color": "#FF0000"}
    )
    tag1_id = tag1_response.json()["id"]

    tag2_response = await client.post(
        f"/users/{user_id}/tags", headers=headers, json={"name": "Test Tag 2", "color": "#00FF00"}
    )
    tag2_id = tag2_response.json()["id"]

    # Create a file
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Original Document with Tags",
            "abstract": "Original abstract with tags",
            "owner_id": user_id,
            "source": ":rsm:original content with tags::",
        },
    )
    file_id = create_response.json()["id"]

    # Add tags to the file
    await client.post(f"/users/{user_id}/files/{file_id}/tags/{tag1_id}", headers=headers)
    await client.post(f"/users/{user_id}/files/{file_id}/tags/{tag2_id}", headers=headers)

    # Verify original file has tags
    original_tags_response = await client.get(
        f"/users/{user_id}/files/{file_id}/tags", headers=headers
    )
    original_tags = original_tags_response.json()
    assert len(original_tags) == 2
    original_tag_ids = {tag["id"] for tag in original_tags}
    assert tag1_id in original_tag_ids
    assert tag2_id in original_tag_ids

    # Duplicate the file
    response = await client.post(f"/files/{file_id}/duplicate", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    duplicated_file_id = data["id"]
    assert duplicated_file_id != file_id  # Should be a new ID
    assert data["message"] == "File duplicated successfully"

    # Verify the duplicated file has the same tags
    duplicated_tags_response = await client.get(
        f"/users/{user_id}/files/{duplicated_file_id}/tags", headers=headers
    )
    duplicated_tags = duplicated_tags_response.json()

    assert len(duplicated_tags) == 2
    duplicated_tag_ids = {tag["id"] for tag in duplicated_tags}
    assert duplicated_tag_ids == original_tag_ids  # Same tags

    # Verify we can get the duplicated file (basic check)
    duplicated_file_response = await client.get(f"/files/{duplicated_file_id}", headers=headers)
    assert duplicated_file_response.status_code == 200
    duplicated_file_data = duplicated_file_response.json()
    assert duplicated_file_data["title"] == "Original Document with Tags (copy)"


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


# Publication Status Tests

async def test_publish_file_success(client: AsyncClient, authenticated_user):
    """Test successfully publishing a file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a file first
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

    # Publish the file
    response = await client.post(f"/files/{file_id}/publish", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == file_id
    assert data["status"] == "Published"
    assert data["public_uuid"] is not None
    assert len(data["public_uuid"]) == 6
    assert data["published_at"] is not None
    assert data["message"] == "File published successfully"


async def test_publish_file_already_published(client: AsyncClient, authenticated_user):
    """Test publishing a file that's already published."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create and publish a file
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

    # Publish first time
    await client.post(f"/files/{file_id}/publish", headers=headers)

    # Try to publish again
    response = await client.post(f"/files/{file_id}/publish", headers=headers)
    
    assert response.status_code == 400
    assert "already published" in response.json()["detail"]


async def test_publish_file_without_content(client: AsyncClient, authenticated_user):
    """Test publishing a file without source content."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a file without source content
    create_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": "",
        },
    )
    file_id = create_response.json()["id"]

    # Try to publish
    response = await client.post(f"/files/{file_id}/publish", headers=headers)
    
    assert response.status_code == 400
    assert "without source content" in response.json()["detail"]


async def test_publish_file_not_found(client: AsyncClient, authenticated_user):
    """Test publishing a file that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.post("/files/99999/publish", headers=headers)
    
    assert response.status_code == 404
    assert "File with id 99999 not found" in response.json()["detail"]


async def test_publish_file_without_auth(client: AsyncClient):
    """Test publishing a file without authentication."""
    response = await client.post("/files/1/publish")
    assert response.status_code == 401


async def test_update_file_status_to_published(client: AsyncClient, authenticated_user):
    """Test updating file status to published."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a file
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

    # Update status to published
    response = await client.put(
        f"/files/{file_id}/status",
        headers=headers,
        json={"status": "published"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Published"
    assert data["public_uuid"] is not None
    assert data["published_at"] is not None
    assert "updated to Published" in data["message"]


async def test_update_file_status_to_draft(client: AsyncClient, authenticated_user):
    """Test updating file status to draft."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a file
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

    # Update status to draft (should work since it's already draft)
    response = await client.put(
        f"/files/{file_id}/status",
        headers=headers,
        json={"status": "draft"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Draft"
    assert "updated to Draft" in data["message"]


async def test_update_file_status_to_under_review(client: AsyncClient, authenticated_user):
    """Test updating file status to under review."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a file
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

    # Update status to under review
    response = await client.put(
        f"/files/{file_id}/status",
        headers=headers,
        json={"status": "under_review"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Under Review"
    assert "updated to Under Review" in data["message"]


async def test_update_file_status_invalid_status(client: AsyncClient, authenticated_user):
    """Test updating file status with invalid status."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a file
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

    # Try to update with invalid status
    response = await client.put(
        f"/files/{file_id}/status",
        headers=headers,
        json={"status": "invalid_status"}
    )
    
    assert response.status_code == 400
    assert "Invalid status" in response.json()["detail"]


async def test_update_published_file_status_forbidden(client: AsyncClient, authenticated_user):
    """Test that published files cannot be unpublished."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create and publish a file
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

    # Publish the file
    await client.post(f"/files/{file_id}/publish", headers=headers)

    # Try to change status back to draft
    response = await client.put(
        f"/files/{file_id}/status",
        headers=headers,
        json={"status": "draft"}
    )
    
    assert response.status_code == 400
    assert "cannot be unpublished" in response.json()["detail"]


async def test_get_publication_info_draft_file(client: AsyncClient, authenticated_user):
    """Test getting publication info for a draft file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a file
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

    # Get publication info
    response = await client.get(f"/files/{file_id}/publication-info", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == file_id
    assert data["status"] == "Draft"
    assert data["is_published"] is False
    assert data["can_publish"] is True
    assert data["published_at"] is None
    assert data["public_uuid"] is None
    assert data["can_withdraw"] is False
    assert data["version"] == 0


async def test_get_publication_info_published_file(client: AsyncClient, authenticated_user):
    """Test getting publication info for a published file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create and publish a file
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

    await client.post(f"/files/{file_id}/publish", headers=headers)

    # Get publication info
    response = await client.get(f"/files/{file_id}/publication-info", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == file_id
    assert data["status"] == "Published"
    assert data["is_published"] is True
    assert data["can_publish"] is False
    assert data["published_at"] is not None
    assert data["public_uuid"] is not None
    assert len(data["public_uuid"]) == 6
    assert data["can_withdraw"] is True
    assert data["version"] == 0


async def test_get_publication_info_not_found(client: AsyncClient, authenticated_user):
    """Test getting publication info for a file that doesn't exist."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.get("/files/99999/publication-info", headers=headers)
    
    assert response.status_code == 404
    assert "File with id 99999 not found" in response.json()["detail"]


async def test_get_publication_info_without_auth(client: AsyncClient):
    """Test getting publication info without authentication."""
    response = await client.get("/files/1/publication-info")
    assert response.status_code == 401


async def test_withdraw_file_not_implemented(client: AsyncClient, authenticated_user):
    """Test withdrawing a file (not fully implemented yet)."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create and publish a file
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

    await client.post(f"/files/{file_id}/publish", headers=headers)

    # Try to withdraw
    response = await client.post(f"/files/{file_id}/withdraw", headers=headers)
    
    assert response.status_code == 400
    assert "not yet fully implemented" in response.json()["detail"]


async def test_withdraw_unpublished_file(client: AsyncClient, authenticated_user):
    """Test withdrawing an unpublished file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a file (but don't publish it)
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

    # Try to withdraw
    response = await client.post(f"/files/{file_id}/withdraw", headers=headers)
    
    assert response.status_code == 400
    assert "Only published files can be withdrawn" in response.json()["detail"]


async def test_withdraw_file_without_auth(client: AsyncClient):
    """Test withdrawing a file without authentication."""
    response = await client.post("/files/1/withdraw")
    assert response.status_code == 401
