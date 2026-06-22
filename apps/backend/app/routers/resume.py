from fastapi import APIRouter

router = APIRouter(tags=["resume"])


@router.get("/download")
async def download_resume(version: str = "standard") -> dict[str, str]:
    # No resume PDF is attached yet. Once one is added (and served via a
    # static URL or object storage), this endpoint should redirect or
    # stream it instead of returning this status payload.
    return {
        "status": "unavailable",
        "version": version,
        "message": "Resume available upon request via the contact form.",
    }
