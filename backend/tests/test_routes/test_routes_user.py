import pytest
import base64
import io
from httpx import AsyncClient
from PIL import Image
from unittest.mock import AsyncMock
from aris.deps import current_user
from main import app


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
async def second_user(client: AsyncClient):
    """Create a second user for authorization testing."""
    response = await client.post(
        "/register",
        json={
            "email": "testuser2@example.com",
            "name": "Test User 2",
            "initials": "TU2",
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


def create_test_image(format="PNG"):
    """Create a test image in memory."""
    img = Image.new("RGB", (100, 100), color="red")
    img_bytes = io.BytesIO()
    img.save(img_bytes, format=format)
    img_bytes.seek(0)
    return img_bytes


async def test_get_user_without_auth(client: AsyncClient):
    """Test that user endpoint requires authentication."""
    response = await client.get("/users/1")
    assert response.status_code == 401


async def test_get_user_success(client: AsyncClient, authenticated_user):
    """Test getting user details with authentication."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(f"/users/{authenticated_user['user_id']}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == authenticated_user["user_id"]
    assert data["email"] == "testuser@example.com"
    assert data["name"] == "Test User"
    assert data["initials"] == "TU"


async def test_get_user_not_found(client: AsyncClient, authenticated_user):
    """Test getting non-existent user."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get("/users/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


async def test_delete_user_not_found(client: AsyncClient, authenticated_user):
    """Test GET /users/{user_id} returns 404 when crud.get_user returns None."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.delete("/users/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


async def test_update_user_success(client: AsyncClient, authenticated_user):
    """Test updating user details."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    update_data = {"name": "Updated Name", "initials": "UN", "email": "updated@example.com"}
    response = await client.put(
        f"/users/{authenticated_user['user_id']}", headers=headers, json=update_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["initials"] == "UN"
    assert data["email"] == "updated@example.com"


async def test_update_user_not_found(client: AsyncClient, authenticated_user):
    """Test updating non-existent user."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    update_data = {"name": "Updated Name", "initials": "UN", "email": "updated@example.com"}
    response = await client.put("/users/99999", headers=headers, json=update_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


async def test_soft_delete_user_success(client: AsyncClient, authenticated_user):
    """Test soft deleting user."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.delete(f"/users/{authenticated_user['user_id']}", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == f"User {authenticated_user['user_id']} soft deleted"


async def test_soft_delete_user_not_found(client: AsyncClient, authenticated_user):
    """Test soft deleting non-existent user."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.delete("/users/99999", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


async def test_get_user_files_success(client: AsyncClient, authenticated_user):
    """Test getting user files."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(f"/users/{authenticated_user['user_id']}/files", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_get_user_files_with_params(client: AsyncClient, authenticated_user):
    """Test getting user files with query parameters."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(
        f"/users/{authenticated_user['user_id']}/files?with_tags=false", headers=headers
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_get_user_file_success(client: AsyncClient, authenticated_user):
    """Test getting specific user file."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    file_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )
    file_id = file_response.json()["id"]

    # Then get the file
    response = await client.get(
        f"/users/{authenticated_user['user_id']}/files/{file_id}", headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == file_id


async def test_get_user_file_with_params(client: AsyncClient, authenticated_user):
    """Test getting user file with query parameters."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First create a file
    file_response = await client.post(
        "/files",
        headers=headers,
        json={
            "title": "Test Document",
            "abstract": "A test document",
            "owner_id": authenticated_user["user_id"],
            "source": ":rsm:test content::",
        },
    )
    file_id = file_response.json()["id"]

    # Then get the file with parameters
    response = await client.get(
        f"/users/{authenticated_user['user_id']}/files/{file_id}?with_tags=false&with_minimap=false",
        headers=headers,
    )
    assert response.status_code == 200


async def test_upload_profile_picture_success(client: AsyncClient, authenticated_user):
    """Test uploading profile picture successfully."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    test_image = create_test_image("PNG")

    files = {"avatar": ("test.png", test_image, "image/png")}
    response = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Profile picture uploaded successfully"
    assert "picture_id" in data


async def test_upload_profile_picture_unauthorized(
    client: AsyncClient, authenticated_user, second_user
):
    """Test uploading profile picture for another user (unauthorized)."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    test_image = create_test_image("PNG")

    files = {"avatar": ("test.png", test_image, "image/png")}
    response = await client.post(
        f"/users/{second_user['user_id']}/avatar", headers=headers, files=files
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to update this profile"


async def test_upload_profile_picture_invalid_type(client: AsyncClient, authenticated_user):
    """Test uploading profile picture with invalid file type."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a text file instead of image
    text_content = io.BytesIO(b"This is not an image")
    files = {"avatar": ("test.txt", text_content, "text/plain")}

    response = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]


async def test_upload_profile_picture_too_large(client: AsyncClient, authenticated_user):
    """Test uploading profile picture that's too large."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Create a large image (6MB > 5MB limit)
    large_content = b"x" * (6 * 1024 * 1024)
    files = {"avatar": ("large.png", io.BytesIO(large_content), "image/png")}

    response = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert response.status_code == 400
    assert "File size too large" in response.json()["detail"]


async def test_get_profile_picture_success(client: AsyncClient, authenticated_user):
    """Test getting profile picture successfully."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First upload a profile picture
    test_image = create_test_image("PNG")
    files = {"avatar": ("test.png", test_image, "image/png")}
    upload_response = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert upload_response.status_code == 200

    # Then get the profile picture
    response = await client.get(f"/users/{authenticated_user['user_id']}/avatar", headers=headers)
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert "Content-Disposition" in response.headers
    assert "Cache-Control" in response.headers


async def test_get_profile_picture_unauthorized(
    client: AsyncClient, authenticated_user, second_user
):
    """Test getting profile picture for another user (unauthorized)."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.get(f"/users/{second_user['user_id']}/avatar", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to retrieve this profile"


async def test_get_profile_picture_not_found(client: AsyncClient, authenticated_user):
    """Test getting non-existent profile picture."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.get(f"/users/{authenticated_user['user_id']}/avatar", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Profile picture not found"


async def test_get_profile_picture_wrong_user(client: AsyncClient, authenticated_user):
    """Test getting profile picture for non-existent user."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.get("/users/99999/avatar", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to retrieve this profile"


async def test_delete_profile_picture_success(client: AsyncClient, authenticated_user):
    """Test deleting profile picture successfully."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # First upload a profile picture
    test_image = create_test_image("PNG")
    files = {"avatar": ("test.png", test_image, "image/png")}
    upload_response = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert upload_response.status_code == 200

    # Then delete the profile picture
    response = await client.delete(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Profile picture deleted successfully"


async def test_delete_profile_picture_unauthorized(
    client: AsyncClient, authenticated_user, second_user
):
    """Test deleting profile picture for another user (unauthorized)."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.delete(f"/users/{second_user['user_id']}/avatar", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to delete this profile"


async def test_delete_profile_picture_not_found(client: AsyncClient, authenticated_user):
    """Test deleting non-existent profile picture."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.delete(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Profile picture not found"


async def test_delete_profile_picture_wrong_user(client: AsyncClient, authenticated_user):
    """Test deleting profile picture for non-existent user."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    response = await client.delete("/users/99999/avatar", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to delete this profile"


async def test_upload_profile_picture_replace_existing(client: AsyncClient, authenticated_user):
    """Test uploading profile picture when one already exists (should replace)."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    # Upload first profile picture
    test_image1 = create_test_image("PNG")
    files1 = {"avatar": ("test1.png", test_image1, "image/png")}
    response1 = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files1
    )
    assert response1.status_code == 200
    first_picture_id = response1.json()["picture_id"]

    # Upload second profile picture (should replace first)
    test_image2 = create_test_image("JPEG")
    files2 = {"avatar": ("test2.jpg", test_image2, "image/jpeg")}
    response2 = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files2
    )
    assert response2.status_code == 200
    second_picture_id = response2.json()["picture_id"]

    # Should be different IDs
    assert first_picture_id != second_picture_id

    # Getting avatar should return the new one
    get_response = await client.get(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers
    )
    assert get_response.status_code == 200
    assert get_response.headers["content-type"] == "image/jpeg"


async def test_multiple_file_formats(client: AsyncClient, authenticated_user):
    """Test uploading different valid image formats."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    formats = [
        ("PNG", "image/png"),
        ("JPEG", "image/jpeg"),
        ("GIF", "image/gif"),
        ("WEBP", "image/webp"),
    ]

    for format_name, mime_type in formats:
        test_image = create_test_image(format_name)
        files = {"avatar": (f"test.{format_name.lower()}", test_image, mime_type)}

        response = await client.post(
            f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
        )
        assert response.status_code == 200
        assert response.json()["message"] == "Profile picture uploaded successfully"


async def test_update_user_without_auth(client: AsyncClient):
    response = await client.put(
        "/users/1",
        json={"name": "Name", "initials": "NN", "email": "email@example.com"},
    )
    assert response.status_code == 401


async def test_soft_delete_user_without_auth(client: AsyncClient):
    response = await client.delete("/users/1")
    assert response.status_code == 401


async def test_get_user_files_without_auth(client: AsyncClient):
    response = await client.get("/users/1/files")
    assert response.status_code == 401


async def test_get_user_file_without_auth(client: AsyncClient):
    response = await client.get("/users/1/files/1")
    assert response.status_code == 401


async def test_get_user_files_user_not_found(client: AsyncClient, authenticated_user):
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(f"/users/99999/files", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "User 99999 not found"


async def test_get_user_file_user_not_found(client: AsyncClient, authenticated_user):
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(f"/users/99999/files/1", headers=headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "User 99999 not found"


async def test_get_user_file_file_not_found(client: AsyncClient, authenticated_user):
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    response = await client.get(
        f"/users/{authenticated_user['user_id']}/files/99999", headers=headers
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "File 99999 not found"


async def test_get_profile_picture_invalid_data(
    client: AsyncClient, authenticated_user, db_session
):
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    # Upload a valid profile picture
    test_image = create_test_image("PNG")
    files = {"avatar": ("test.png", test_image, "image/png")}
    upload_response = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert upload_response.status_code == 200
    # Corrupt the stored content to be invalid base64
    from aris.models import ProfilePicture

    pic_id = upload_response.json()["picture_id"]
    pp = await db_session.get(ProfilePicture, pic_id)
    pp.content = "not_base64!"
    await db_session.commit()
    # Attempt to retrieve the corrupted profile picture
    response = await client.get(f"/users/{authenticated_user['user_id']}/avatar", headers=headers)
    assert response.status_code == 500
    assert response.json()["detail"] == "Invalid image data"


async def test_upload_profile_picture_user_not_found(
    client: AsyncClient, authenticated_user, db_session
):
    """Test uploading profile picture for a user that was deleted."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    from aris.models import User

    user = await db_session.get(User, authenticated_user["user_id"])
    await db_session.delete(user)
    await db_session.commit()

    test_image = create_test_image("PNG")
    files = {"avatar": ("test.png", test_image, "image/png")}
    response = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert response.status_code == 401


async def test_upload_profile_picture_db_error(
    client: AsyncClient, authenticated_user, db_session, monkeypatch
):
    """Test uploading profile picture when a database error occurs."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    test_image = create_test_image("PNG")
    files = {"avatar": ("test.png", test_image, "image/png")}

    async def bad_flush(*args, **kwargs):
        raise TypeError("boom")

    monkeypatch.setattr(db_session, "flush", bad_flush)

    response = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert response.status_code == 500
    assert response.json()["detail"] == "Failed to upload profile picture"


async def test_get_profile_picture_user_not_found_after_deletion(
    client: AsyncClient, authenticated_user, db_session
):
    """Test retrieving profile picture for a user that was deleted."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    from aris.models import User

    user = await db_session.get(User, authenticated_user["user_id"])
    await db_session.delete(user)
    await db_session.commit()

    response = await client.get(f"/users/{authenticated_user['user_id']}/avatar", headers=headers)
    assert response.status_code == 401


async def test_delete_profile_picture_user_not_found_after_deletion(
    client: AsyncClient, authenticated_user, db_session
):
    """Test deleting profile picture when the user was deleted."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
    from aris.models import User

    user = await db_session.get(User, authenticated_user["user_id"])
    await db_session.delete(user)
    await db_session.commit()

    response = await client.delete(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers
    )
    assert response.status_code == 401


async def test_delete_profile_picture_db_error(
    client: AsyncClient, authenticated_user, db_session, monkeypatch
):
    """Test deleting profile picture when a database error occurs."""
    headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

    test_image = create_test_image("PNG")
    files = {"avatar": ("test.png", test_image, "image/png")}
    upload_resp = await client.post(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers, files=files
    )
    assert upload_resp.status_code == 200

    monkeypatch.setattr(
        db_session, "commit", lambda *args, **kwargs: (_ for _ in ()).throw(ValueError("fail"))
    )

    response = await client.delete(
        f"/users/{authenticated_user['user_id']}/avatar", headers=headers
    )
    assert response.status_code == 500
    assert response.json()["detail"] == "Failed to delete profile picture"
