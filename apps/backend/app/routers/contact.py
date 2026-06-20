from fastapi import APIRouter, status
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(tags=["contact"])


class ContactSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    company: str | None = Field(default=None, max_length=255)
    message_type: str | None = Field(default=None, max_length=50)
    message: str = Field(min_length=10, max_length=4000)


@router.post("", status_code=status.HTTP_202_ACCEPTED)
async def submit_contact(_: ContactSubmission) -> dict[str, str]:
    return {"status": "accepted"}

