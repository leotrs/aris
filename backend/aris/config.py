"""Backend configuration.

Implemented as a Pydantic model that is then read by FastAPI.

"""

import os

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

    model_config = ConfigDict(extra="forbid")


settings = Settings(_env_file=".env.ci" if os.getenv("ENV") == "CI" else ".env")
