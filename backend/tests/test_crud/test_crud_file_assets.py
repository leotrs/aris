import pytest
from datetime import datetime
import base64
from aris.crud.file_assets import (
    FileAssetCreate,
    FileAssetUpdate,
    FileAssetDB,
)
from aris.models import FileAsset


@pytest.mark.asyncio
async def test_create_asset(db_session, test_user):
    """Test creating a new file asset"""
    payload = FileAssetCreate(
        filename="test.txt",
        mime_type="text/plain",
        content="dGVzdCBjb250ZW50",  # base64 encoded "test content"
        file_id=1,
    )

    asset = await FileAssetDB.create_asset(payload, test_user.id, db_session)

    assert asset.id
    assert asset.filename == "test.txt"
    assert asset.mime_type == "text/plain"
    assert asset.content == "dGVzdCBjb250ZW50"
    assert asset.file_id == 1
    assert asset.owner_id == test_user.id
    assert asset.uploaded_at
    assert asset.deleted_at is None


@pytest.mark.asyncio
async def test_get_user_asset(db_session, test_user):
    """Test getting a user's asset"""
    # Create an asset first
    payload = FileAssetCreate(
        filename="test.jpg",
        mime_type="image/jpeg",
        content="dGVzdCBpbWFnZQ==",  # base64 encoded "test image"
        file_id=1,
    )
    created_asset = await FileAssetDB.create_asset(payload, test_user.id, db_session)

    # Test getting the asset
    asset = await FileAssetDB.get_user_asset(created_asset.id, test_user.id, db_session)

    assert asset is not None
    assert asset.id == created_asset.id
    assert asset.filename == "test.jpg"
    assert asset.owner_id == test_user.id


@pytest.mark.asyncio
async def test_get_user_asset_not_found(db_session, test_user):
    """Test getting a non-existent asset returns None"""
    asset = await FileAssetDB.get_user_asset(999, test_user.id, db_session)
    assert asset is None


@pytest.mark.asyncio
async def test_get_user_asset_wrong_owner(db_session, test_user):
    """Test getting an asset owned by another user returns None"""
    # Create an asset
    payload = FileAssetCreate(
        filename="test.txt", mime_type="text/plain", content="dGVzdA==", file_id=1
    )
    created_asset = await FileAssetDB.create_asset(payload, test_user.id, db_session)

    # Try to get it with wrong user_id
    asset = await FileAssetDB.get_user_asset(created_asset.id, 999, db_session)
    assert asset is None


@pytest.mark.asyncio
async def test_get_user_asset_soft_deleted(db_session, test_user):
    """Test getting a soft-deleted asset returns None"""
    # Create and soft delete an asset
    payload = FileAssetCreate(
        filename="test.txt", mime_type="text/plain", content="dGVzdA==", file_id=1
    )
    created_asset = await FileAssetDB.create_asset(payload, test_user.id, db_session)
    await FileAssetDB.soft_delete_asset(created_asset, db_session)

    # Try to get the soft-deleted asset
    asset = await FileAssetDB.get_user_asset(created_asset.id, test_user.id, db_session)
    assert asset is None


@pytest.mark.asyncio
async def test_list_user_assets(db_session, test_user):
    """Test listing all user assets"""
    # Create multiple assets
    payload1 = FileAssetCreate(
        filename="file1.txt",
        mime_type="text/plain",
        content="ZmlsZTE=",  # base64 "file1"
        file_id=1,
    )
    payload2 = FileAssetCreate(
        filename="file2.jpg",
        mime_type="image/jpeg",
        content="ZmlsZTI=",  # base64 "file2"
        file_id=2,
    )

    await FileAssetDB.create_asset(payload1, test_user.id, db_session)
    await FileAssetDB.create_asset(payload2, test_user.id, db_session)

    assets = await FileAssetDB.list_user_assets(test_user.id, db_session)

    assert len(assets) == 2
    filenames = [asset.filename for asset in assets]
    assert "file1.txt" in filenames
    assert "file2.jpg" in filenames


@pytest.mark.asyncio
async def test_list_user_assets_excludes_soft_deleted(db_session, test_user):
    """Test that listing assets excludes soft-deleted ones"""
    # Create two assets
    payload1 = FileAssetCreate(
        filename="keep.txt", mime_type="text/plain", content="a2VlcA==", file_id=1
    )
    payload2 = FileAssetCreate(
        filename="delete.txt", mime_type="text/plain", content="ZGVsZXRl", file_id=2
    )

    asset1 = await FileAssetDB.create_asset(payload1, test_user.id, db_session)
    asset2 = await FileAssetDB.create_asset(payload2, test_user.id, db_session)

    # Soft delete one asset
    await FileAssetDB.soft_delete_asset(asset2, db_session)

    assets = await FileAssetDB.list_user_assets(test_user.id, db_session)

    assert len(assets) == 1
    assert assets[0].filename == "keep.txt"


@pytest.mark.asyncio
async def test_update_asset(db_session, test_user):
    """Test updating an asset"""
    # Create an asset
    payload = FileAssetCreate(
        filename="original.txt", mime_type="text/plain", content="b3JpZ2luYWw=", file_id=1
    )
    asset = await FileAssetDB.create_asset(payload, test_user.id, db_session)

    # Update it
    update_payload = FileAssetUpdate(
        filename="updated.txt",
        content="dXBkYXRlZA==",  # base64 "updated"
    )

    updated_asset = await FileAssetDB.update_asset(asset, update_payload, db_session)

    assert updated_asset.filename == "updated.txt"
    assert updated_asset.content == "dXBkYXRlZA=="
    assert updated_asset.mime_type == "text/plain"  # unchanged
    assert updated_asset.id == asset.id


@pytest.mark.asyncio
async def test_update_asset_partial(db_session, test_user):
    """Test partially updating an asset"""
    # Create an asset
    payload = FileAssetCreate(
        filename="original.txt", mime_type="text/plain", content="b3JpZ2luYWw=", file_id=1
    )
    asset = await FileAssetDB.create_asset(payload, test_user.id, db_session)

    # Update only filename
    update_payload = FileAssetUpdate(filename="new_name.txt")

    updated_asset = await FileAssetDB.update_asset(asset, update_payload, db_session)

    assert updated_asset.filename == "new_name.txt"
    assert updated_asset.content == "b3JpZ2luYWw="  # unchanged


@pytest.mark.asyncio
async def test_soft_delete_asset(db_session, test_user):
    """Test soft deleting an asset"""
    # Create an asset
    payload = FileAssetCreate(
        filename="to_delete.txt", mime_type="text/plain", content="ZGVsZXRl", file_id=1
    )
    asset = await FileAssetDB.create_asset(payload, test_user.id, db_session)

    assert asset.deleted_at is None

    # Soft delete it
    await FileAssetDB.soft_delete_asset(asset, db_session)

    # Refresh to get updated data
    await db_session.refresh(asset)
    assert asset.deleted_at is not None
    assert isinstance(asset.deleted_at, datetime)


@pytest.mark.asyncio
async def test_file_asset_create_validation_image(db_session, test_user):
    """Test FileAssetCreate validation for image content"""
    # Valid base64 image content
    valid_payload = FileAssetCreate(
        filename="test.jpg",
        mime_type="image/jpeg",
        content=base64.b64encode(b"fake image data").decode(),
        file_id=1,
    )

    asset = await FileAssetDB.create_asset(valid_payload, test_user.id, db_session)
    assert asset.mime_type == "image/jpeg"


@pytest.mark.asyncio
async def test_file_asset_create_validation_invalid_base64():
    """Test FileAssetCreate validation fails for invalid base64 image content"""
    with pytest.raises(ValueError, match="Invalid base64 content"):
        FileAssetCreate(
            filename="test.jpg", mime_type="image/jpeg", content="invalid_base64!@#", file_id=1
        )


@pytest.mark.asyncio
async def test_file_asset_update_validation():
    """Test FileAssetUpdate validation for content"""
    # Valid base64
    update = FileAssetUpdate(content=base64.b64encode(b"test").decode())
    assert update.content

    # None content should be allowed
    update_none = FileAssetUpdate(content=None)
    assert update_none.content is None

    # Invalid base64 should not raise error (just prints warning)
    update_invalid = FileAssetUpdate(content="invalid_base64")
    assert update_invalid.content == "invalid_base64"
