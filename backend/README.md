# Aris Backend

This is the backend service for **Aris**, a web-native scientific publishing platform.
Built with **FastAPI**, it provides a RESTful API for managing users, manuscripts,
authentication, and metadata.

## Tech Stack

- **Python 3.13+**
- **FastAPI** – web framework
- **SQLAlchemy** – ORM
- **PostgreSQL** – primary database
- **Alembic** – migrations
- **PyJWT** – token-based authentication
- **Pydantic** – data validation
- **Uvicorn** – ASGI server

## Features

- JWT-based authentication with access and refresh tokens
- CRUD operations for users, manuscripts, tags, and metadata
- Soft-delete support
- Role-free user model (for now)
- Versioned database migrations via Alembic (soon)

## Running Locally

1. **Install dependencies**

   ```bash
   uv sync
   ```

2. **Run migrations**

   ```bash
   alembic upgrade head
   ```

3. **Start the server**

   ```bash
   uvicorn main:app --reload
   ```

3. **API**

Once running, the API docs are available at `http://localhost:8000/docs`.
