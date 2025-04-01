from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from aris.routes import document_router, user_router

app = FastAPI()

origins = [
    "http://localhost:5173",  # local Vue app
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(document_router)
app.mount(
    "/static",
    StaticFiles(
        directory=".venv/lib/python3.13/site-packages/rsm/static",
    ),
    name="static",
)
