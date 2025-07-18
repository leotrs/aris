"""Aris backend: FastApi app."""

import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from aris.deps import get_db
from aris.health import HealthResponse, perform_health_check
from aris.logging_config import get_logger, setup_logging
from aris.routes import (
    auth_router,
    copilot_router,
    file_assets_router,
    file_router,
    file_settings_router,
    public_router,
    render_router,
    signup_router,
    tag_router,
    user_public_router,
    user_router,
    user_settings_router,
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
        {
            "name": "user-settings",
            "description": "User behavioral preferences and privacy settings",
        },
        {"name": "render", "description": "Convert RSM markup to rendered HTML output"},
        {"name": "signup", "description": "Early access signup and waitlist management"},
        {"name": "copilot", "description": "AI-powered writing assistant for scientific manuscripts"},
        {"name": "public", "description": "Public preprint access without authentication"},
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


@app.get("/debug/user-state", tags=["health"], summary="Debug User State")
async def debug_user_state(db: AsyncSession = Depends(get_db)):
    """Debug endpoint to check test user state for auth-enabled E2E diagnostic.
    
    Returns detailed information about the test user setup including:
    - User existence and credentials
    - File count and basic file information
    - Tag count and basic tag information
    - Database connectivity status
    
    This endpoint is for debugging auth-enabled E2E test failures.
    """
    try:
        # Check if test user exists
        test_user_email = os.getenv("TEST_USER_EMAIL", "testuser@aris.pub")
        
        user_result = await db.execute(
            text("SELECT id, email, name, created_at FROM users WHERE email = :email"),
            {"email": test_user_email}
        )
        user_row = user_result.first()
        
        if not user_row:
            return {
                "status": "error",
                "message": f"Test user {test_user_email} not found in database",
                "user": None,
                "files": [],
                "tags": []
            }
        
        user_id = user_row.id
        
        # Get user files
        files_result = await db.execute(
            text("SELECT id, title, status, created_at FROM files WHERE owner_id = :user_id ORDER BY created_at DESC"),
            {"user_id": user_id}
        )
        files = [{"id": row.id, "title": row.title, "status": row.status, "created_at": str(row.created_at)} 
                for row in files_result.fetchall()]
        
        # Get user tags
        tags_result = await db.execute(
            text("SELECT id, name, color, created_at FROM tags WHERE user_id = :user_id ORDER BY created_at DESC"),
            {"user_id": user_id}
        )
        tags = [{"id": row.id, "name": row.name, "color": row.color, "created_at": str(row.created_at)} 
               for row in tags_result.fetchall()]
        
        return {
            "status": "success",
            "user": {
                "id": user_id,
                "email": user_row.email,
                "name": user_row.name,
                "created_at": str(user_row.created_at)
            },
            "files": files,
            "files_count": len(files),
            "tags": tags,
            "tags_count": len(tags),
            "expected_test_data": {
                "files_expected": 2,
                "tags_expected": 2,
                "files_match": len(files) == 2,
                "tags_match": len(tags) == 2
            }
        }
        
    except Exception as e:
        logger.error(f"Debug user state failed: {e}")
        return {
            "status": "error",
            "message": f"Database error: {str(e)}",
            "user": None,
            "files": [],
            "tags": []
        }


origins = [
    "https://aris-frontend.netlify.app",  # Netlify frontend
]

# Add local development origins only if environment variables are set
if os.getenv('FRONTEND_PORT'):
    origins.extend([
        f"http://localhost:{os.getenv('FRONTEND_PORT')}",  # local Vue app (Vite dev server)
        f"http://localhost:{int(os.getenv('FRONTEND_PORT', '5173')) + 1}",  # alternate port
        f"http://localhost:{int(os.getenv('FRONTEND_PORT', '5173')) + 2}",  # third instance
    ])

if os.getenv('SITE_PORT'):
    origins.append(f"http://localhost:{os.getenv('SITE_PORT')}")  # local Nuxt app

if os.getenv('STORYBOOK_PORT'):
    origins.append(f"http://localhost:{os.getenv('STORYBOOK_PORT')}")  # local Storybook


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
app.include_router(user_public_router, tags=["users"])
app.include_router(file_router, tags=["files"])
app.include_router(tag_router, tags=["tags"])
app.include_router(file_assets_router, tags=["file-assets"])
app.include_router(file_settings_router, tags=["file-settings"])
app.include_router(user_settings_router, tags=["user-settings"])
app.include_router(render_router, tags=["render"])
app.include_router(signup_router, tags=["signup"])
app.include_router(copilot_router, tags=["copilot"])
app.include_router(public_router, tags=["public"])
logger.info("All routers registered successfully")


@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/static") or request.url.path.startswith("/design-assets"):
        response.headers["Cache-Control"] = "no-store"
    return response


# Mount RSM static files
app.mount(
    "/static",
    StaticFiles(
        directory=".venv/lib/python3.13/site-packages/rsm/static",
    ),
    name="static",
)

# Mount design assets (only if directory exists)
design_assets_paths = [
    "../design-assets",  # When running from backend/ directory
    "design-assets",     # When running from project root
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "design-assets")  # Absolute path fallback
]

design_assets_dir = None
for path in design_assets_paths:
    if os.path.exists(path):
        design_assets_dir = path
        break

if design_assets_dir:
    app.mount(
        "/design-assets",
        StaticFiles(directory=design_assets_dir),
        name="design-assets"
    )
    logger.info(f"Design assets mounted successfully at /design-assets from {design_assets_dir}")
else:
    logger.info(f"Design assets directory not found. Tried paths: {design_assets_paths}")
