"""Global test fixtures and configuration.

This module provides centralized testing infrastructure for the Aris backend,
following FastAPI testing best practices. It includes:

- Database setup with proper isolation
- Authentication fixtures for API testing
- Test data factories for consistent test data
- Utility functions for common test operations

Usage:
    Test files can import fixtures directly from conftest.py via pytest's
    automatic fixture discovery. Import TestConstants and TestDataFactory
    for standardized test data.
"""

import os
import sys
import uuid

import httpx
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool


# Import pytest-postgresql for PostgreSQL testing
try:
    from pytest_postgresql import factories

    postgresql_proc = factories.postgresql_proc(
        port=None, unixsocketdir="/tmp", postgres_options="-F"
    )
    postgresql = factories.postgresql("postgresql_proc")
    POSTGRESQL_AVAILABLE = True
except ImportError:
    POSTGRESQL_AVAILABLE = False
    postgresql_proc = None
    postgresql = None


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure test environment to use mock provider for cost protection
os.environ["COPILOT_PROVIDER"] = "mock"

from aris.config import settings
from aris.deps import get_db
from aris.models import Base, File, User
from main import app


@pytest_asyncio.fixture
async def test_engine(request):
    """Create test engine for each test."""
    database_url = settings.get_test_database_url()

    # If we're using PostgreSQL and pytest-postgresql is available
    # Skip pytest-postgresql in CI environment since we use the service
    if database_url.startswith("postgresql") and POSTGRESQL_AVAILABLE and not os.environ.get("CI"):
        try:
            # Try to get the postgresql fixture if it exists
            postgresql = request.getfixturevalue("postgresql")
            conn_info = postgresql.info
            database_url = f"postgresql+asyncpg://{conn_info.user}:@{conn_info.host}:{conn_info.port}/{conn_info.dbname}"
        except Exception:
            # Fall back to the configured URL if pytest-postgresql isn't being used
            pass
    
    # Configure engine based on database type
    if database_url.startswith("sqlite"):
        engine = create_async_engine(
            database_url,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
            future=True,
        )
    else:
        # PostgreSQL configuration - use connection pooling to handle parallel tests
        engine = create_async_engine(
            database_url,
            future=True,
            pool_size=20,  # Increase pool size for parallel testing
            max_overflow=30,  # Allow more connections during peak usage
            pool_pre_ping=True,  # Verify connections before use
        )

    yield engine
    await engine.dispose()

    # Clean up SQLite database files
    if database_url.startswith("sqlite"):
        db_file = database_url.split("///")[1]
        if os.path.exists(db_file):
            os.remove(db_file)


async def create_database_if_not_exists(database_url: str):
    """Create database if it doesn't exist (PostgreSQL only)."""
    if not database_url.startswith("postgresql"):
        return
    
    # For CI, skip database creation - use existing aris_test database
    if os.environ.get("ENV") == "CI":
        return
    
    import asyncio
    
    # Extract database name from URL
    db_name = database_url.split("/")[-1]
    
    # For local development
    admin_dbs = ["postgres", "test_aris"]  # Try both for local development
    
    for admin_db in admin_dbs:
        admin_url = database_url.replace(f"/{db_name}", f"/{admin_db}")
        
        # Retry logic with exponential backoff
        max_retries = 3
        for attempt in range(max_retries):
            admin_engine = create_async_engine(admin_url, isolation_level="AUTOCOMMIT")
            
            try:
                async with admin_engine.connect() as conn:
                    # Check if database exists
                    result = await conn.execute(
                        text("SELECT 1 FROM pg_database WHERE datname = :db_name"),
                        {"db_name": db_name}
                    )
                    if not result.fetchone():
                        # Create database
                        await conn.execute(text(f'CREATE DATABASE "{db_name}"'))
                    
                    # Success! Exit both retry and admin_db loops
                    return
            except Exception as e:
                if attempt == max_retries - 1:  # Last retry
                    if admin_db == admin_dbs[-1]:  # Last admin database
                        raise e
                    break  # Try next admin database
                # Wait before retry with exponential backoff
                await asyncio.sleep(2 ** attempt)
            finally:
                await admin_engine.dispose()


@pytest_asyncio.fixture
async def db_session(test_engine):
    """Create a fresh database session for each test with proper isolation."""
    # Create database if needed
    database_url = str(test_engine.url)
    await create_database_if_not_exists(database_url)
    
    # Create schema only for local development
    if not os.environ.get("ENV") == "CI":
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all, checkfirst=True)

    TestingSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)
    
    # Use regular session
    async with TestingSessionLocal() as session:
        yield session
    
    # Clean up data after each test in CI to prevent interference
    if os.environ.get("ENV") == "CI":
        # Use a fresh session for cleanup to avoid session conflicts
        async with TestingSessionLocal() as cleanup_session:
            try:
                # Clean up in dependency order
                await cleanup_session.execute(text("DELETE FROM file_tags"))
                await cleanup_session.execute(text("DELETE FROM file_assets"))
                await cleanup_session.execute(text("DELETE FROM annotation_message"))
                await cleanup_session.execute(text("DELETE FROM annotation"))
                await cleanup_session.execute(text("DELETE FROM file_settings"))
                await cleanup_session.execute(text("DELETE FROM files"))
                await cleanup_session.execute(text("DELETE FROM tags"))
                await cleanup_session.execute(text("DELETE FROM user_settings"))
                await cleanup_session.execute(text("DELETE FROM signups"))
                await cleanup_session.execute(text("DELETE FROM profile_pictures"))
                await cleanup_session.execute(text("DELETE FROM users"))
                await cleanup_session.commit()
            except Exception:
                # If cleanup fails, rollback but don't fail the test
                await cleanup_session.rollback()
    else:
        # For local development, drop all tables
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client(db_session):
    """Create a test client with database dependency override."""

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = httpx.ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def test_user(db_session):
    """Create a test user directly in the database.

    This is different from authenticated_user which creates a user
    through the API and includes auth tokens.
    """
    # Use a unique email to avoid conflicts between parallel tests
    unique_email = f"test_user_{uuid.uuid4().hex[:8]}@example.com"
    user = User(
        name="foo bar",
        email=unique_email,
        password_hash="example_hash_pwd_for_testing",
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def test_file(db_session, test_user):
    """Create a test file directly in the database."""
    file = File(
        owner_id=test_user.id,
        source=":rsm: Test file. ::",
    )
    db_session.add(file)
    await db_session.commit()
    await db_session.refresh(file)
    return file


class TestConstants:
    """Centralized test constants to avoid magic numbers and strings."""

    @staticmethod
    def get_unique_email(prefix="testuser"):
        """Generate a unique email address for test isolation."""
        return f"{prefix}+{uuid.uuid4().hex[:8]}@example.com"

    DEFAULT_USER_EMAIL = "testuser@example.com"  # Fallback for legacy tests
    DEFAULT_USER_NAME = "Test User"
    DEFAULT_USER_INITIALS = "TU"
    DEFAULT_PASSWORD = "testpass123"
    TEST_PASSWORD = DEFAULT_PASSWORD  # Alias for clarity in tests

    SECOND_USER_EMAIL = "testuser2@example.com"  # Fallback for legacy tests
    SECOND_USER_NAME = "Test User 2"
    SECOND_USER_INITIALS = "TU2"

    UPDATED_NAME = "Updated Name"
    UPDATED_INITIALS = "UN"
    UPDATED_EMAIL = "updated@example.com"

    TEST_FILE_TITLE = "Test Document"
    TEST_FILE_ABSTRACT = "A test document"
    TEST_FILE_SOURCE = ":rsm:test content::"

    IMAGE_SIZE = (100, 100)
    IMAGE_COLOR = "red"
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    LARGE_FILE_SIZE = 6 * 1024 * 1024  # 6MB

    NONEXISTENT_ID = 99999


@pytest_asyncio.fixture
async def authenticated_user(client: AsyncClient):
    """Create a user and return auth token and user info.

    This fixture consolidates the authentication pattern used across
    multiple test files to reduce duplication and ensure consistency.
    """
    unique_email = TestConstants.get_unique_email()
    response = await client.post(
        "/register",
        json={
            "email": unique_email,
            "name": TestConstants.DEFAULT_USER_NAME,
            "initials": TestConstants.DEFAULT_USER_INITIALS,
            "password": TestConstants.DEFAULT_PASSWORD,
        },
    )
    assert response.status_code == 200, f"Registration failed: {response.json()}"

    token = response.json()["access_token"]
    user_id = response.json()["user"]["id"]
    user_data = response.json()["user"]

    return {
        "token": token,
        "user_id": user_id,
        "user": user_data,
        "email": unique_email,
        "password": TestConstants.DEFAULT_PASSWORD,
    }


@pytest_asyncio.fixture
def is_postgresql():
    """Check if we're testing against PostgreSQL."""
    return settings.get_test_database_url().startswith("postgresql")


@pytest_asyncio.fixture
def auth_headers(authenticated_user):
    """Return authorization headers for authenticated requests.

    Provides consistent header format across all test files.
    """
    return {"Authorization": f"Bearer {authenticated_user['token']}"}


@pytest_asyncio.fixture
async def authenticated_client(client: AsyncClient, authenticated_user):
    """Return a client with authentication headers pre-configured."""
    client.headers.update({"Authorization": f"Bearer {authenticated_user['token']}"})
    return client


@pytest_asyncio.fixture
def second_auth_headers(second_authenticated_user):
    """Return authorization headers for the second user."""
    return {"Authorization": f"Bearer {second_authenticated_user['token']}"}


@pytest_asyncio.fixture
async def second_authenticated_user(client: AsyncClient):
    """Create a second user for multi-user testing scenarios."""
    unique_email = TestConstants.get_unique_email("testuser2")
    response = await client.post(
        "/register",
        json={
            "email": unique_email,
            "name": TestConstants.SECOND_USER_NAME,
            "initials": TestConstants.SECOND_USER_INITIALS,
            "password": TestConstants.DEFAULT_PASSWORD,
        },
    )
    assert response.status_code == 200, f"Second user registration failed: {response.json()}"

    token = response.json()["access_token"]
    user_id = response.json()["user"]["id"]
    user_data = response.json()["user"]

    return {
        "token": token,
        "user_id": user_id,
        "user": user_data,
        "email": unique_email,
        "password": TestConstants.DEFAULT_PASSWORD,
    }


class TestDataFactory:
    """Factory class for creating consistent test data across test files."""

    @staticmethod
    def user_registration_data(email=None, name=None, initials=None, password=None):
        """Generate user registration data with optional overrides."""
        return {
            "email": email or TestConstants.get_unique_email(),
            "name": name or TestConstants.DEFAULT_USER_NAME,
            "initials": initials or TestConstants.DEFAULT_USER_INITIALS,
            "password": password or TestConstants.DEFAULT_PASSWORD,
        }

    @staticmethod
    def file_creation_data(title=None, abstract=None, source=None, owner_id=None, **kwargs):
        """Generate file creation data with optional overrides."""
        data = {
            "title": title or TestConstants.TEST_FILE_TITLE,
            "abstract": abstract or TestConstants.TEST_FILE_ABSTRACT,
            "source": source or TestConstants.TEST_FILE_SOURCE,
        }
        if owner_id is not None:
            data["owner_id"] = owner_id
        data.update(kwargs)
        return data

    @staticmethod
    def tag_creation_data(name=None, color=None, **kwargs):
        """Generate tag creation data with optional overrides."""
        data = {
            "name": name or "Test Tag",
            "color": color or "#FF0000",
        }
        data.update(kwargs)
        return data
