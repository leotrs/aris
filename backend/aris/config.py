"""Backend configuration.

Implemented as a Pydantic model that is then read by FastAPI.

"""

import os
import uuid
from pathlib import Path

from pydantic import ConfigDict, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    :param DB_URL_LOCAL: Database URL for local development.
    :param DB_URL_PROD: Database URL for production environment.
    :param ENV: Current environment ('LOCAL', 'PROD', etc.).
    :param JWT_SECRET_KEY: Secret key used to sign JWT tokens.
    :param JWT_ALGORITHM: Algorithm used for JWT encoding (default: HS256).
    :param JWT_ACCESS_TOKEN_EXPIRE_MINUTES: Expiration time in minutes for JWT access tokens (default: 30).
    """

    DB_URL_LOCAL: str = Field(..., json_schema_extra={"env": "DB_URL_LOCAL"})
    """Database URL for local development."""

    DB_URL_PROD: str = Field(..., json_schema_extra={"env": "DB_URL_PROD"})
    """Database URL for production environment."""

    ALEMBIC_DB_URL_LOCAL: str = Field(..., json_schema_extra={"env": "ALEMBIC_DB_URL_LOCAL"})
    """Database URL for Alembic local development."""

    ALEMBIC_DB_URL_PROD: str = Field(..., json_schema_extra={"env": "ALEMBIC_DB_URL_PROD"})
    """Database URL for Alembic production environment."""

    ENV: str = Field("LOCAL", json_schema_extra={"env": "ENV"})
    """Current environment ('LOCAL', 'PROD', etc.)."""

    JWT_SECRET_KEY: str = Field(..., json_schema_extra={"env": "JWT_SECRET_KEY"})
    """Secret key used to sign JWT tokens."""

    JWT_ALGORITHM: str = Field("HS256", json_schema_extra={"env": "JWT_ALGORITHM"})
    """Algorithm used for JWT encoding (default: HS256)."""

    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        30, json_schema_extra={"env": "JWT_ACCESS_TOKEN_EXPIRE_MINUTES"}
    )
    """Expiration time in minutes for JWT access tokens (default: 30)."""

    TEST_USER_EMAIL: str = Field(..., json_schema_extra={"env": "TEST_USER_EMAIL"})
    """Test user email for visual tests."""
    
    TEST_USER_PASSWORD: str = Field(..., json_schema_extra={"env": "TEST_USER_PASSWORD"})
    """Password for test user."""

    TEST_DB_URL: str = Field("", json_schema_extra={"env": "TEST_DB_URL"})
    """Test database URL override. If empty, will auto-detect based on environment."""

    model_config = ConfigDict(extra="forbid")

    def get_test_database_url(self) -> str:
        """Get test database URL based on environment and configuration.
        
        Returns:
            - TEST_DB_URL if explicitly set
            - PostgreSQL URL if in actual CI environment (GitHub Actions)
            - SQLite URL for local development (including CI simulation)
        """
        if self.TEST_DB_URL:
            return self.TEST_DB_URL
            
        # Use PostgreSQL only in actual CI environment (GitHub Actions)
        if (self.ENV == "CI" or os.environ.get("CI")) and os.environ.get("GITHUB_ACTIONS"):
            worker_id = os.environ.get("PYTEST_XDIST_WORKER", "main")
            unique_id = str(uuid.uuid4())[:8]
            return f"postgresql+asyncpg://postgres:postgres@localhost:5432/test_aris_{worker_id}_{unique_id}"
            
        # Use SQLite for local development (including CI simulation)
        worker_id = os.environ.get("PYTEST_XDIST_WORKER", "main")
        unique_id = str(uuid.uuid4())[:8]
        return f"sqlite+aiosqlite:///./test_{worker_id}_{unique_id}.db"


BASE_DIR = Path(__file__).resolve().parent.parent
env_file = BASE_DIR / (".env.ci" if os.getenv("ENV") == "CI" else ".env")
settings = Settings(_env_file=str(env_file))
