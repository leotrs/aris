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


## Deployment

The FastAPI app is deployed on fly.io via the command `fly deploy`, which uses the
`Dockerfile` in this directory. Use `fly logs` to stream the live logs.

The database is hosted on Supabase, and `alembic` is used to control its schema.

## Utility Scripts

Helper scripts are available in the `scripts/` directory for common maintenance tasks:

| Script               | Description                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `init_db.py`         | Create all tables in the database using the models’ metadata (i.e., `Base.metadata.create_all`).        |
| `add_mock_data.py`   | Populate the database with mock users, files, and tags for testing purposes.                            |
| `add_example_data.py`| Load example `.rsm` documents into the database from the `rsm-examples` package.                        |
| `sync_columns.py`    | Sync specified columns from one Postgres database to another, skipping duplicates.                      |
