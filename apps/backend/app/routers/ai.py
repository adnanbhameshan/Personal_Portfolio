import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.services.rag_service import RetrievedChunk, rag_service

router = APIRouter(tags=["ai"])


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    answer: str
    sources: list[str] = Field(default_factory=list)


@router.get("/health")
async def ai_health() -> dict[str, str | int | bool]:
    return await rag_service.health()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    chunks = await rag_service.retrieve(request.question)
    answer_parts = [
        token async for token in rag_service.stream_answer(request.question, chunks)
    ]
    return ChatResponse(
        answer="".join(answer_parts).strip(),
        sources=_unique_sources(chunks),
    )


@router.post("/chat/stream")
async def stream_chat(request: ChatRequest) -> StreamingResponse:
    chunks = await rag_service.retrieve(request.question)

    async def event_stream():
        yield _sse("sources", {"sources": _unique_sources(chunks)})
        try:
            async for token in rag_service.stream_answer(request.question, chunks):
                yield _sse("token", {"content": token})
            yield _sse("done", {"ok": True})
        except Exception as exc:
            yield _sse("error", {"message": str(exc)})

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/ingest")
async def ingest_knowledge_base() -> dict[str, int | str]:
    return await rag_service.ingest()


def _sse(event: str, payload: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(payload)}\n\n"


def _unique_sources(chunks: list[RetrievedChunk]) -> list[str]:
    return list(dict.fromkeys(chunk.source_file for chunk in chunks))
