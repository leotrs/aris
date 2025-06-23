"""Reset test user to known state for visual regression tests.

This script resets the test user (testuser@aris.pub) to a known state
with stable test data for visual regression testing.
"""

import asyncio
import os

from dotenv import load_dotenv
from sqlalchemy import text

from aris import ArisSession
from aris.models.models import File, FileStatus, Tag, User
from aris.security import hash_password


# Load environment variables
load_dotenv()

TEST_USER_EMAIL = os.getenv("TEST_USER_EMAIL", "testuser@aris.pub")
TEST_USER_PASSWORD = os.getenv("TEST_USER_PASSWORD")

if not TEST_USER_PASSWORD:
    raise ValueError("TEST_USER_PASSWORD not found in environment variables")


async def reset_test_user():
    """Reset test user and their data to known stable state."""
    session = ArisSession()

    try:
        # Find or create test user
        existing_user = await session.execute(
            text("SELECT * FROM users WHERE email = :email"), {"email": TEST_USER_EMAIL}
        )
        user_row = existing_user.first()

        if user_row:
            user_id = user_row.id
            # Delete all existing data for test user
            await session.execute(
                text("DELETE FROM file_tags WHERE file_id IN (SELECT id FROM files WHERE owner_id = :user_id)"),
                {"user_id": user_id},
            )
            await session.execute(
                text("DELETE FROM files WHERE owner_id = :user_id"), {"user_id": user_id}
            )
            await session.execute(text("DELETE FROM tags WHERE user_id = :user_id"), {"user_id": user_id})
            await session.execute(
                text("DELETE FROM file_settings WHERE user_id = :user_id"), {"user_id": user_id}
            )

            # Update user with fresh password hash
            password_hash = hash_password(TEST_USER_PASSWORD)
            await session.execute(
                text("UPDATE users SET password_hash = :password_hash, name = :name WHERE id = :user_id"),
                {"password_hash": password_hash, "name": "Test User", "user_id": user_id},
            )
            await session.commit()
        else:
            # Create new test user
            password_hash = hash_password(TEST_USER_PASSWORD)
            user = User(name="Test User", email=TEST_USER_EMAIL, password_hash=password_hash)
            session.add(user)
            await session.commit()
            user_id = user.id

        # Create stable test files
        test_files = [
            File(
                title="Test Visual Regression File",
                abstract="Stable test file for visual regression testing.",
                keywords="test, visual, regression",
                status=FileStatus.DRAFT,
                owner_id=user_id,
                source=""":rsm:
# Test Visual Regression File

This file is used for visual regression testing.
Content should remain stable.

## Section 1
Lorem ipsum test content.

## Section 2
More stable test content here.

::""",
            ),
            File(
                title="Another Test File",
                abstract="Second stable test file.",
                keywords="test, stable, visual",
                status=FileStatus.DRAFT,
                owner_id=user_id,
                source=""":rsm:
# Another Test File

This is another stable test file for visual tests.

::""",
            ),
        ]

        session.add_all(test_files)
        await session.commit()

        # Create stable test tags
        test_tags = [
            Tag(name="Visual Testing", user_id=user_id, color="BLUE"),
            Tag(name="Regression", user_id=user_id, color="GREEN"),
        ]

        session.add_all(test_tags)
        await session.commit()

        print(f"✅ Test user {TEST_USER_EMAIL} reset successfully")
        print(f"   - User ID: {user_id}")
        print(f"   - Files created: {len(test_files)}")
        print(f"   - Tags created: {len(test_tags)}")

    except Exception as e:
        await session.rollback()
        print(f"❌ Error resetting test user: {e}")
        raise
    finally:
        await session.close()


if __name__ == "__main__":
    asyncio.run(reset_test_user())
