from fastapi import APIRouter

router = APIRouter(tags=["resume"])


@router.get("/download")
async def download_resume(version: str = "standard") -> dict[str, str]:
    return {"status": "planned", "version": version}

