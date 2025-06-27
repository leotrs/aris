"""Reset test user to known state for visual regression tests.

This script resets the test user (testuser@aris.pub) to a known state
with stable test data for visual regression testing.
"""

import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import text

from aris import ArisSession
from aris.models.models import File, FileStatus, Tag, User
from aris.security import hash_password


# Load environment variables using the same logic as config.py
BASE_DIR = Path(__file__).resolve().parent.parent
env_file = BASE_DIR / (".env.ci" if os.getenv("ENV") == "CI" else ".env")
load_dotenv(env_file)

TEST_USER_EMAIL = os.getenv("TEST_USER_EMAIL", "testuser@aris.pub")
TEST_USER_PASSWORD = os.getenv("TEST_USER_PASSWORD")
SKIP_AUTH_FOR_TESTS = os.getenv("SKIP_AUTH_FOR_TESTS", "false").lower() == "true"

if not TEST_USER_PASSWORD and not SKIP_AUTH_FOR_TESTS:
    raise ValueError("TEST_USER_PASSWORD not found in environment variables (required unless SKIP_AUTH_FOR_TESTS=true)")


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

            # Update user with fresh password hash (if password provided)
            if TEST_USER_PASSWORD:
                password_hash = hash_password(TEST_USER_PASSWORD)
                await session.execute(
                    text("UPDATE users SET password_hash = :password_hash, name = :name WHERE id = :user_id"),
                    {"password_hash": password_hash, "name": "Test User", "user_id": user_id},
                )
            else:
                # Just update name when no password needed (no-auth mode)
                await session.execute(
                    text("UPDATE users SET name = :name WHERE id = :user_id"),
                    {"name": "Test User", "user_id": user_id},
                )
            await session.commit()
        else:
            # Create new test user
            if TEST_USER_PASSWORD:
                password_hash = hash_password(TEST_USER_PASSWORD)
            else:
                # Use empty password hash for no-auth mode
                password_hash = ""
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

        # Verify the user was actually created/updated
        verify_user = await session.execute(
            text("SELECT id, email, password_hash FROM users WHERE email = :email"), 
            {"email": TEST_USER_EMAIL}
        )
        verify_row = verify_user.first()
        
        print(f"✅ Test user {TEST_USER_EMAIL} reset successfully")
        print(f"   - User ID: {user_id}")
        print(f"   - Password length: {len(TEST_USER_PASSWORD) if TEST_USER_PASSWORD else 0}")
        print(f"   - Password hash length: {len(verify_row.password_hash) if verify_row else 'None'}")
        print(f"   - Files created: {len(test_files)}")
        print(f"   - Tags created: {len(test_tags)}")
        print(f"   - User verified in DB: {'Yes' if verify_row else 'No'}")
        print(f"   - Skip auth mode: {SKIP_AUTH_FOR_TESTS}")
        
        # Test password verification (only if password provided)
        if verify_row and TEST_USER_PASSWORD:
            from aris.security import verify_password
            password_valid = verify_password(TEST_USER_PASSWORD, verify_row.password_hash)
            print(f"   - Password verification test: {'✅ PASS' if password_valid else '❌ FAIL'}")
        elif SKIP_AUTH_FOR_TESTS:
            print("   - ⏭️  Password verification skipped (no-auth mode)")
        else:
            print("   - ❌ Could not verify user in database")

    except Exception as e:
        await session.rollback()
        print(f"❌ Error resetting test user: {e}")
        raise
    finally:
        await session.close()


if __name__ == "__main__":
    asyncio.run(reset_test_user())
