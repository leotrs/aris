"""Aris backend: FastApi app."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from aris.routes import (
    auth_router,
    file_assets_router,
    file_router,
    file_settings_router,
    render_router,
    tag_router,
    user_router,
)


# API metadata for documentation
app = FastAPI(
    title="Aris API",
    description="""
    **Aris** is a web-native scientific publishing platform that manages research manuscripts 
    written in RSM (Research Source Markup) format.

    ## Features

    * **User Management** - Authentication, profile management, and user settings
    * **Document Management** - Create, edit, and organize research manuscripts
    * **Tagging System** - Organize documents with custom tags
    * **File Assets** - Upload and manage images, data files, and other assets
    * **Rendering** - Convert RSM markup to HTML with scientific formatting
    * **Collaboration** - Share and collaborate on research documents

    ## Authentication

    Most endpoints require authentication using JWT tokens. After registering or logging in,
    include the token in the Authorization header:

    ```
    Authorization: Bearer <your_token_here>
    ```

    ## RSM Format

    Research Source Markup (RSM) is a specialized markup format for scientific documents.
    Documents must start with `:rsm:` and end with `::`.

    ## Getting Started

    1. Register a new account at `/register`
    2. Login to get your authentication token at `/login`
    3. Start creating and managing documents through the `/files` endpoints
    """,
    version="1.0.0",
    contact={
        "name": "Aris Development Team",
        "url": "https://github.com/your-org/aris",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    openapi_tags=[
        {
            "name": "authentication",
            "description": "User authentication and registration operations",
        },
        {"name": "users", "description": "User profile management and user-specific operations"},
        {
            "name": "files",
            "description": "Research document management (create, read, update, delete)",
        },
        {"name": "tags", "description": "Document organization with custom tags"},
        {
            "name": "file-assets",
            "description": "Upload and manage document assets (images, data files)",
        },
        {
            "name": "file-settings",
            "description": "User preferences for document display and formatting",
        },
        {"name": "render", "description": "Convert RSM markup to rendered HTML output"},
        {"name": "health", "description": "System health and status monitoring"},
    ],
)


@app.get("/health", tags=["health"], summary="Health Check")
async def health_check():
    """Check the health status of the API.

    Returns a simple status message to verify the API is running correctly.
    This endpoint does not require authentication.
    """
    return {"status": "ok", "message": "Aris API is running"}


origins = [
    "http://localhost:5173",  # local Vue app
    "https://aris-frontend.netlify.app",  # Netlify frontend
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with proper tags
app.include_router(auth_router, tags=["authentication"])
app.include_router(user_router, tags=["users"])
app.include_router(file_router, tags=["files"])
app.include_router(tag_router, tags=["tags"])
app.include_router(file_assets_router, tags=["file-assets"])
app.include_router(file_settings_router, tags=["file-settings"])
app.include_router(render_router, tags=["render"])


@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/static"):
        response.headers["Cache-Control"] = "no-store"
    return response


app.mount(
    "/static",
    StaticFiles(
        directory=".venv/lib/python3.13/site-packages/rsm/static",
    ),
    name="static",
)
