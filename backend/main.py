"""Aris backend: FastApi app."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from aris.routes import (
    file_router,
    tag_router,
    user_router,
    file_assets_router,
    file_settings_router,
    render_router,
    auth_router,
)

app = FastAPI()


@app.get("/health")
async def health_check():
    """Health check route."""
    return {"status": "ok"}


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

app.include_router(user_router)
app.include_router(file_router)
app.include_router(tag_router)
app.include_router(file_assets_router)
app.include_router(file_settings_router)
app.include_router(render_router)
app.include_router(auth_router)


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
