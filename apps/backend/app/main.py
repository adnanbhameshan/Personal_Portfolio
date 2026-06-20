from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import ai, contact, health, resume

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(ai.router, prefix=f"{settings.api_prefix}/ai")
app.include_router(contact.router, prefix=f"{settings.api_prefix}/contact")
app.include_router(resume.router, prefix=f"{settings.api_prefix}/resume")

