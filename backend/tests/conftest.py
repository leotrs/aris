"""Global test fixtures and other config."""

import pytest_asyncio
import httpx
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
import os
import sys
import uuid

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app
from aris.models.models import Base
from aris.deps import get_db


def get_test_database_url():
    """Generate unique database URL for each worker process."""
    worker_id = os.environ.get("PYTEST_XDIST_WORKER", "main")
    unique_id = str(uuid.uuid4())[:8]
    return f"sqlite+aiosqlite:///./test_{worker_id}_{unique_id}.db"


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    """Create test engine once per session."""
    database_url = get_test_database_url()
    engine = create_async_engine(
        database_url,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine
    await engine.dispose()
    # Clean up the database file
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
