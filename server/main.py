from fastapi import FastAPI

from aris.routes import document_router, user_router

app = FastAPI()
app.include_router(user_router)
app.include_router(document_router)
