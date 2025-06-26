"""Aris backend: FastApi app."""

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession

from aris.deps import get_db
from aris.health import HealthResponse, perform_health_check
from aris.logging_config import get_logger, setup_logging
from aris.routes import (
    auth_router,
    file_assets_router,
    file_router,
    file_settings_router,
    render_router,
    signup_router,
    tag_router,
    user_router,
)


# Initialize logging before anything else
setup_logging()
logger = get_logger(__name__)


# API metadata for documentation
logger.info("Starting Aris backend application")
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
        {"name": "signup", "description": "Early access signup and waitlist management"},
        {"name": "health", "description": "System health and status monitoring"},
    ],
)


@app.get("/health", tags=["health"], summary="Health Check", response_model=HealthResponse)
async def health_check(db: AsyncSession = Depends(get_db)):
    """Check the health status of the API and its dependencies.

    Performs comprehensive health checks including:
    - API service availability
    - Database connectivity and responsiveness
    - Email service configuration
    - RSM rendering engine functionality
    - Environment configuration validation

    Returns detailed status information for monitoring and debugging.
    This endpoint does not require authentication.
    """
    health_result = await perform_health_check(db)

    # Return appropriate HTTP status based on health
    if health_result.status == "unhealthy":
        raise HTTPException(status_code=503, detail=health_result.model_dump())

    return health_result


origins = [
    "http://localhost:5173",  # local Vue app (Vite dev server)
    "http://localhost:5174",  # local Vue app (Vite dev server - alternate port)
    "http://localhost:3000",  # local Nuxt app
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
logger.info("Registering API routers")
app.include_router(auth_router, tags=["authentication"])
app.include_router(user_router, tags=["users"])
app.include_router(file_router, tags=["files"])
app.include_router(tag_router, tags=["tags"])
app.include_router(file_assets_router, tags=["file-assets"])
app.include_router(file_settings_router, tags=["file-settings"])
app.include_router(render_router, tags=["render"])
app.include_router(signup_router, tags=["signup"])
logger.info("All routers registered successfully")


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
