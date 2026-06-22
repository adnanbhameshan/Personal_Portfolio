import logging

import asyncpg
from fastapi import APIRouter, Request, status
from pydantic import BaseModel, EmailStr, Field

from app.config import settings

router = APIRouter(tags=["contact"])
logger = logging.getLogger("nexus.contact")


class ContactSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    company: str | None = Field(default=None, max_length=255)
    message_type: str | None = Field(default=None, max_length=50)
    message: str = Field(min_length=10, max_length=4000)


class FallbackContact(BaseModel):
    email: str


class ContactResponse(BaseModel):
    status: str  # "stored" | "fallback"
    message: str
    fallback_contact: FallbackContact | None = None


@router.post("", response_model=ContactResponse, status_code=status.HTTP_202_ACCEPTED)
async def submit_contact(payload: ContactSubmission, request: Request) -> ContactResponse:
    if settings.database_url:
        try:
            connection = await asyncpg.connect(settings.database_url, timeout=5)
            try:
                await connection.execute(
                    """
                    INSERT INTO contact_submissions
                      (name, email, company, message_type, message, ip_address)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    """,
                    payload.name,
                    payload.email,
                    payload.company,
                    payload.message_type,
                    payload.message,
                    request.client.host if request.client else None,
                )
            finally:
                await connection.close()

            return ContactResponse(
                status="stored",
                message="Thanks for reaching out. Your message has been received.",
            )
        except Exception:
            # Database configured but unreachable/failing. Never lose the
            # submission silently: log it for manual recovery and fall
            # through to the direct-contact fallback response below.
            logger.warning(
                "Contact submission could not be persisted; database unavailable. "
                "name=%r email=%r message_type=%r",
                payload.name,
                payload.email,
                payload.message_type,
            )

    else:
        # No database configured at all in this environment.
        logger.info(
            "Contact submission received with no DATABASE_URL configured. "
            "name=%r email=%r message_type=%r",
            payload.name,
            payload.email,
            payload.message_type,
        )

    return ContactResponse(
        status="fallback",
        message=(
            "Your message could not be stored automatically right now. "
            "Please reach out directly using the contact details below."
        ),
        fallback_contact=(
            FallbackContact(email=settings.contact_email) if settings.contact_email else None
        ),
    )
