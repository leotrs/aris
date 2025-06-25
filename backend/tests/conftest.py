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
        port=None,
        unixsocketdir='/tmp',
        postgres_options='-F'
    )
    postgresql = factories.postgresql('postgresql_proc')
    POSTGRESQL_AVAILABLE = True
except ImportError:
    POSTGRESQL_AVAILABLE = False
    postgresql_proc = None
    postgresql = None


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from aris.config import settings
from aris.deps import get_db
from aris.models import Base, File, User
from main import app


@pytest_asyncio.fixture(scope="session")
async def test_engine(request):
    """Create test engine once per session."""
    database_url = settings.get_test_database_url()
    
    # If we're using PostgreSQL and pytest-postgresql is available
    # Skip pytest-postgresql in CI environment since we use the service
    if database_url.startswith("postgresql") and POSTGRESQL_AVAILABLE and not os.environ.get("CI"):
        try:
            # Try to get the postgresql fixture if it exists
            postgresql = request.getfixturevalue('postgresql')
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
        # PostgreSQL configuration
        engine = create_async_engine(
            database_url,
            future=True,
        )
    
    yield engine
    await engine.dispose()
    
    # Clean up SQLite database files
    if database_url.startswith("sqlite"):
        db_file = database_url.split("///")[1]
        if os.path.exists(db_file):
            os.remove(db_file)


@pytest_asyncio.fixture
async def db_session(test_engine):
    """Create a fresh database for each test."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    TestingSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)
    async with TestingSessionLocal() as session:
        yield session

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
    user = User(
        name="foo bar",
        email="test@example.com",
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

    DEFAULT_USER_EMAIL = "testuser@example.com"
    DEFAULT_USER_NAME = "Test User"
    DEFAULT_USER_INITIALS = "TU"
    DEFAULT_PASSWORD = "testpass123"

    SECOND_USER_EMAIL = "testuser2@example.com"
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
    response = await client.post(
        "/register",
        json={
            "email": TestConstants.DEFAULT_USER_EMAIL,
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
        "email": TestConstants.DEFAULT_USER_EMAIL,
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
def second_auth_headers(second_authenticated_user):
    """Return authorization headers for the second user."""
    return {"Authorization": f"Bearer {second_authenticated_user['token']}"}


@pytest_asyncio.fixture
async def second_authenticated_user(client: AsyncClient):
    """Create a second user for multi-user testing scenarios."""
    response = await client.post(
        "/register",
        json={
            "email": TestConstants.SECOND_USER_EMAIL,
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
        "email": TestConstants.SECOND_USER_EMAIL,
        "password": TestConstants.DEFAULT_PASSWORD,
    }


class TestDataFactory:
    """Factory class for creating consistent test data across test files."""

    @staticmethod
    def user_registration_data(email=None, name=None, initials=None, password=None):
        """Generate user registration data with optional overrides."""
        return {
            "email": email or TestConstants.DEFAULT_USER_EMAIL,
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
