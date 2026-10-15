from fastapi import APIRouter

router = APIRouter(tags=["resume"])

RESUME_VERSIONS = {
    "full-stack": {
        "label": "Full-Stack Developer Resume",
        "url": "/resumes/adnan-ahmed-full-stack-developer-resume.pdf",
    },
    "cloud-support": {
        "label": "Cloud Support Engineer Resume",
        "url": "/resumes/adnan-ahmed-cloud-support-engineer-resume.pdf",
    },
    "it-operations": {
        "label": "IT Operations Resume",
        "url": "/resumes/adnan-ahmed-it-operations-resume.pdf",
    },
}


@router.get("/download")
async def download_resume(version: str = "full-stack") -> dict[str, str]:
    selected = RESUME_VERSIONS.get(version, RESUME_VERSIONS["full-stack"])
    return {
        "status": "available",
        "version": version,
        "label": selected["label"],
        "url": selected["url"],
    }
