"""Backend configuration.

Implemented as a Pydantic model that is then read by FastAPI.

"""

from pydantic_settings import BaseSettings
from pydantic import Field


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

    DB_URL_LOCAL: str = Field(..., env="DB_URL_LOCAL")
    """Database URL for local development."""

    DB_URL_PROD: str = Field(..., env="DB_URL_PROD")
    """Database URL for production environment."""

    ALEMBIC_DB_URL_LOCAL: str = Field(..., env="ALEMBIC_DB_URL_LOCAL")
    """Database URL for Alembic local development."""

    ALEMBIC_DB_URL_PROD: str = Field(..., env="ALEMBIC_DB_URL_PROD")
    """Database URL for Alembic production environment."""

    ENV: str = Field("LOCAL", env="ENV")
    """Current environment ('LOCAL', 'PROD', etc.)."""

    JWT_SECRET_KEY: str = Field(..., env="JWT_SECRET_KEY")
    """Secret key used to sign JWT tokens."""

    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    """Algorithm used for JWT encoding (default: HS256)."""

    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="JWT_ACCESS_TOKEN_EXPIRE_MINUTES")
    """Expiration time in minutes for JWT access tokens (default: 30)."""

    class Config:
        """
        Pydantic configuration class.

        Forbids extra fields not defined in this model to avoid silent errors.
        """

        env_file = ".env"
        extra = "forbid"


settings = Settings()
