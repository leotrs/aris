from datetime import datetime

from aris.crud.file_settings import (
    FileSettingsBase,
    FileSettingsDB,
)
from aris.models import File, User


async def test_get_default_settings_not_found(db_session, test_user):
    """Test getting non-existent default settings returns None"""
    settings = await FileSettingsDB.get_default_settings(test_user.id, db_session)
    assert settings is None


async def test_upsert_default_settings_create(db_session, test_user):
    """Test creating new default settings"""
    settings_data = FileSettingsBase(
        background="var(--custom-bg)",
        font_size="18px",
        line_height="1.6",
        font_family="Arial",
        margin_width="20px",
        columns=2,
    )

    settings = await FileSettingsDB.upsert_default_settings(settings_data, test_user.id, db_session)

    assert settings.id
    assert settings.file_id is None  # Default settings have NULL file_id
    assert settings.user_id == test_user.id
    assert settings.background == "var(--custom-bg)"
    assert settings.font_size == "18px"
    assert settings.line_height == "1.6"
    assert settings.font_family == "Arial"
    assert settings.margin_width == "20px"
    assert settings.columns == 2
    assert settings.created_at
    assert settings.updated_at
    assert settings.deleted_at is None


async def test_upsert_default_settings_update(db_session, test_user):
    """Test updating existing default settings"""
    # Create initial settings
    initial_data = FileSettingsBase(background="var(--old-bg)", font_size="16px")
    settings = await FileSettingsDB.upsert_default_settings(initial_data, test_user.id, db_session)
    original_id = settings.id
    original_created_at = settings.created_at

    # Update settings
    updated_data = FileSettingsBase(background="var(--new-bg)", font_size="20px", columns=3)
    updated_settings = await FileSettingsDB.upsert_default_settings(
        updated_data, test_user.id, db_session
    )

    assert updated_settings.id == original_id
    assert updated_settings.background == "var(--new-bg)"
    assert updated_settings.font_size == "20px"
    assert updated_settings.columns == 3
    assert updated_settings.created_at == original_created_at
    assert updated_settings.updated_at > original_created_at


async def test_get_default_settings_found(db_session, test_user):
    """Test getting existing default settings"""
    # Create settings first
    settings_data = FileSettingsBase(background="var(--test-bg)", font_size="14px")
    created_settings = await FileSettingsDB.upsert_default_settings(
        settings_data, test_user.id, db_session
    )

    # Get settings
    retrieved_settings = await FileSettingsDB.get_default_settings(test_user.id, db_session)

    assert retrieved_settings is not None
    assert retrieved_settings.id == created_settings.id
    assert retrieved_settings.background == "var(--test-bg)"
    assert retrieved_settings.font_size == "14px"


async def test_get_file_settings_not_found(db_session, test_user):
    """Test getting non-existent file settings returns None"""
    settings = await FileSettingsDB.get_file_settings(1, test_user.id, db_session)
    assert settings is None


async def test_verify_file_access_not_found(db_session, test_user):
    """Test verifying access to non-existent file returns False"""
    has_access = await FileSettingsDB.verify_file_access(999, test_user.id, db_session)
    assert has_access is False


async def test_verify_file_access_wrong_owner(db_session, test_user):
    """Test verifying access to file owned by another user returns False"""
    # Create a file owned by test_user
    file = File(
        title="Test File",
        source="test content",
        owner_id=test_user.id,
    )
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    # Try to access with different user_id
    has_access = await FileSettingsDB.verify_file_access(file.id, 999, db_session)
    assert has_access is False


async def test_verify_file_access_success(db_session, test_user):
    """Test verifying access to owned file returns True"""
    # Create a file owned by test_user
    file = File(
        title="Test File",
        source="test content",
        owner_id=test_user.id,
    )
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    # Verify access
    has_access = await FileSettingsDB.verify_file_access(file.id, test_user.id, db_session)
    assert has_access is True


async def test_verify_file_access_soft_deleted(db_session, test_user):
    """Test verifying access to soft-deleted file returns False"""
    # Create and soft delete a file
    file = File(
        title="Test File", source="test content", owner_id=test_user.id, deleted_at=datetime.now()
    )
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    # Try to access soft-deleted file
    has_access = await FileSettingsDB.verify_file_access(file.id, test_user.id, db_session)
    assert has_access is False


async def test_upsert_file_settings_create(db_session, test_user):
    """Test creating new file settings"""
    # Create a file first
    file = File(
        title="Test File",
        source="test content",
        owner_id=test_user.id,
    )
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    # Create file settings
    settings_data = FileSettingsBase(background="var(--file-bg)", font_size="22px", columns=3)

    settings = await FileSettingsDB.upsert_file_settings(
        file.id, settings_data, test_user.id, db_session
    )

    assert settings.id
    assert settings.file_id == file.id
    assert settings.user_id == test_user.id
    assert settings.background == "var(--file-bg)"
    assert settings.font_size == "22px"
    assert settings.columns == 3
    assert settings.created_at
    assert settings.updated_at
    assert settings.deleted_at is None


async def test_upsert_file_settings_update(db_session, test_user):
    """Test updating existing file settings"""
    # Create a file
    file = File(
        title="Test File",
        source="test content",
        owner_id=test_user.id,
    )
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    # Create initial settings
    initial_data = FileSettingsBase(background="var(--old-file-bg)", font_size="16px")
    settings = await FileSettingsDB.upsert_file_settings(
        file.id, initial_data, test_user.id, db_session
    )
    original_id = settings.id
    original_created_at = settings.created_at

    # Update settings
    updated_data = FileSettingsBase(background="var(--new-file-bg)", font_size="24px", columns=4)
    updated_settings = await FileSettingsDB.upsert_file_settings(
        file.id, updated_data, test_user.id, db_session
    )

    assert updated_settings.id == original_id
    assert updated_settings.background == "var(--new-file-bg)"
    assert updated_settings.font_size == "24px"
    assert updated_settings.columns == 4
    assert updated_settings.created_at == original_created_at
    assert updated_settings.updated_at > original_created_at


async def test_get_file_settings_found(db_session, test_user):
    """Test getting existing file settings"""
    # Create a file
    file = File(
        title="Test File",
        source="test content",
        owner_id=test_user.id,
    )
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    # Create settings
    settings_data = FileSettingsBase(background="var(--retrieved-bg)", font_size="19px")
    created_settings = await FileSettingsDB.upsert_file_settings(
        file.id, settings_data, test_user.id, db_session
    )

    # Get settings
    retrieved_settings = await FileSettingsDB.get_file_settings(file.id, test_user.id, db_session)

    assert retrieved_settings is not None
    assert retrieved_settings.id == created_settings.id
    assert retrieved_settings.file_id == file.id
    assert retrieved_settings.background == "var(--retrieved-bg)"
    assert retrieved_settings.font_size == "19px"


async def test_file_settings_excludes_soft_deleted(db_session, test_user):
    """Test that soft-deleted settings are not returned"""
    # Create a file
    file = File(
        title="Test File",
        source="test content",
        owner_id=test_user.id,
    )
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)

    # Create and soft delete settings
    settings_data = FileSettingsBase(background="var(--deleted-bg)")
    settings = await FileSettingsDB.upsert_file_settings(
        file.id, settings_data, test_user.id, db_session
    )

    # Manually soft delete
    settings.deleted_at = datetime.now()
    await db_session.commit()

    # Try to get soft-deleted settings
    retrieved_settings = await FileSettingsDB.get_file_settings(file.id, test_user.id, db_session)
    assert retrieved_settings is None


async def test_file_settings_base_defaults():
    """Test FileSettingsBase default values"""
    settings = FileSettingsBase()

    assert settings.background == "var(--surface-page)"
    assert settings.font_size == "16px"
    assert settings.line_height == "1.5"
    assert settings.font_family == "Source Sans 3"
    assert settings.margin_width == "16px"
    assert settings.columns == 1


async def test_default_settings_user_isolation(db_session, test_user):
    """Test that default settings are isolated per user"""
    import uuid
    
    # Create another user with unique email
    unique_email = f"user2+{uuid.uuid4().hex[:8]}@example.com"
    user2 = User(
        name="user two",
        email=unique_email,
        password_hash="hash2",
    )
    db_session.add(user2)
    await db_session.commit()
    await db_session.refresh(user2)

    # Create settings for first user
    settings_data1 = FileSettingsBase(background="var(--user1-bg)")
    await FileSettingsDB.upsert_default_settings(settings_data1, test_user.id, db_session)

    # Create settings for second user
    settings_data2 = FileSettingsBase(background="var(--user2-bg)")
    await FileSettingsDB.upsert_default_settings(settings_data2, user2.id, db_session)

    # Verify isolation
    user1_settings = await FileSettingsDB.get_default_settings(test_user.id, db_session)
    user2_settings = await FileSettingsDB.get_default_settings(user2.id, db_session)

    assert user1_settings.background == "var(--user1-bg)"
    assert user2_settings.background == "var(--user2-bg)"
    assert user1_settings.id != user2_settings.id
