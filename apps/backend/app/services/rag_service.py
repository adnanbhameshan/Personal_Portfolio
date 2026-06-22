from __future__ import annotations

import asyncio
import json
import math
import re
from collections.abc import AsyncIterator
from dataclasses import dataclass
from pathlib import Path

import asyncpg
import httpx

from app.config import settings
from app.core.rag.chunking import KnowledgeChunk, load_knowledge_chunks

KNOWLEDGE_ROOT = Path(__file__).resolve().parents[1] / "docs"

SYSTEM_PROMPT = """You are NEXUS AI, an intelligent portfolio guide for Adnan Ahmed Bhameshan.
Help recruiters, engineering managers, technical interviewers, and startup founders evaluate Adnan faster.
Use only the provided context. If information is missing or marked TODO_VERIFY, say that clearly.
Sound professional, technical, helpful, and confident. Avoid hype and generic sales language.
Keep answers concise by default, but include concrete project and technology details when relevant."""


@dataclass(frozen=True)
class RetrievedChunk:
    source_file: str
    section: str
    content: str
    score: float


class RagService:
    def __init__(self) -> None:
        self._local_chunks = load_knowledge_chunks(KNOWLEDGE_ROOT)

    async def health(self) -> dict[str, str | int | bool]:
        return {
            "status": "ready",
            "knowledge_chunks": len(self._local_chunks),
            "pgvector_configured": bool(settings.database_url),
            "llm_configured": bool(settings.openai_api_key),
            "mode": "pgvector+llm" if settings.database_url and settings.openai_api_key else "local-fallback",
        }

    async def stream_answer(
        self,
        question: str,
        chunks: list[RetrievedChunk] | None = None,
    ) -> AsyncIterator[str]:
        chunks = chunks if chunks is not None else await self.retrieve(question)
        if settings.openai_api_key:
            async for token in self._stream_llm_answer(question, chunks):
                yield token
            return

        fallback = self._build_fallback_answer(question, chunks)
        for token in fallback.split(" "):
            yield token + " "
            await asyncio.sleep(0.015)

    async def retrieve(self, question: str) -> list[RetrievedChunk]:
        if settings.database_url and settings.openai_api_key:
            try:
                embedding = await self._embed(question)
                return await self._search_pgvector(embedding)
            except Exception:
                return self._search_local(question)

        return self._search_local(question)

    async def ingest(self) -> dict[str, int | str]:
        if not settings.database_url:
            return {
                "status": "skipped",
                "chunks": len(self._local_chunks),
                "reason": "DATABASE_URL is not configured.",
            }

        if not settings.openai_api_key:
            return {
                "status": "skipped",
                "chunks": len(self._local_chunks),
                "reason": "OPENAI_API_KEY is not configured.",
            }

        connection = await asyncpg.connect(settings.database_url)
        try:
            await connection.execute("CREATE EXTENSION IF NOT EXISTS vector")
            await connection.execute("TRUNCATE TABLE document_chunks")
            for chunk in self._local_chunks:
                embedding = await self._embed(chunk.content)
                vector = "[" + ",".join(str(value) for value in embedding) + "]"
                await connection.execute(
                    """
                    INSERT INTO document_chunks
                      (source_file, source_type, section, content, embedding, token_count)
                    VALUES ($1, $2, $3, $4, $5::vector, $6)
                    """,
                    chunk.source_file,
                    chunk.source_type,
                    chunk.section,
                    chunk.content,
                    vector,
                    len(chunk.content.split()),
                )
        finally:
            await connection.close()

        return {"status": "ingested", "chunks": len(self._local_chunks)}

    async def _embed(self, text: str) -> list[float]:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{settings.openai_base_url.rstrip('/')}/embeddings",
                headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                json={"model": settings.openai_embedding_model, "input": text},
            )
            response.raise_for_status()
            data = response.json()
            return data["data"][0]["embedding"]

    async def _search_pgvector(self, embedding: list[float]) -> list[RetrievedChunk]:
        vector = "[" + ",".join(str(value) for value in embedding) + "]"
        connection = await asyncpg.connect(settings.database_url)
        try:
            records = await connection.fetch(
                """
                SELECT source_file, section, content, 1 - (embedding <=> $1::vector) AS score
                FROM document_chunks
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> $1::vector
                LIMIT $2
                """,
                vector,
                settings.rag_top_k,
            )
        finally:
            await connection.close()

        return [
            RetrievedChunk(
                source_file=record["source_file"],
                section=record["section"],
                content=record["content"],
                score=float(record["score"]),
            )
            for record in records
        ]

    def _search_local(self, question: str) -> list[RetrievedChunk]:
        query_terms = self._tokenize(question)
        lowered_question = question.lower()
        scored: list[RetrievedChunk] = []

        for chunk in self._local_chunks:
            terms = self._tokenize(
                f"{chunk.source_file} {chunk.section} {chunk.content}"
            )
            overlap = len(query_terms.intersection(terms))
            if overlap == 0:
                continue
            score = overlap / math.sqrt(max(len(terms), 1))
            score += self._intent_boost(lowered_question, chunk)
            scored.append(
                RetrievedChunk(
                    source_file=chunk.source_file,
                    section=chunk.section,
                    content=chunk.content,
                    score=score,
                )
            )

        return sorted(scored, key=lambda item: item.score, reverse=True)[: settings.rag_top_k]

    def _intent_boost(self, question: str, chunk: KnowledgeChunk) -> float:
        source = chunk.source_file.lower()
        section = chunk.section.lower()
        boost = 0.0

        if "trackr" in question and "trackr" in source:
            boost += 1.0
        if ("voting" in question or "digivote" in question) and "digivote" in source:
            boost += 1.0
        if ("scheduler" in question or "vjit" in question) and "vjit" in source:
            boost += 1.0
        if ("cloud" in question or "aws" in question) and (
            "career_goals" in source or "cloud" in section
        ):
            boost += 1.0
        if ("role" in question or "seeking" in question) and "career_goals" in source:
            boost += 1.0
        if "hire" in question and source in {"resume.md", "about.md", "career_goals.md"}:
            boost += 0.7

        return boost

    async def _stream_llm_answer(
        self,
        question: str,
        chunks: list[RetrievedChunk],
    ) -> AsyncIterator[str]:
        context = self._format_context(chunks)
        payload = {
            "model": settings.openai_chat_model,
            "stream": True,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Question: {question}\n\nContext:\n{context}",
                },
            ],
        }

        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST",
                f"{settings.openai_base_url.rstrip('/')}/chat/completions",
                headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                json=payload,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    data = line.removeprefix("data: ").strip()
                    if data == "[DONE]":
                        break
                    event = json.loads(data)
                    token = event["choices"][0].get("delta", {}).get("content")
                    if token:
                        yield token

    def _build_fallback_answer(self, question: str, chunks: list[RetrievedChunk]) -> str:
        if not chunks:
            return (
                "I do not have enough verified context to answer that yet. "
                "The knowledge base may need another document or a TODO_VERIFY update."
            )

        topic = self._infer_topic(question)
        highlights = " ".join(chunk.content for chunk in chunks[:3])
        trimmed = " ".join(highlights.split()[:130])
        sources = ", ".join(sorted({chunk.source_file for chunk in chunks[:3]}))
        return (
            f"Based on the verified NEXUS knowledge base, {topic}: {trimmed} "
            f"Sources: {sources}. "
            "Note: live LLM generation is not configured in this environment, so this is an extractive RAG response."
        )

    def _format_context(self, chunks: list[RetrievedChunk]) -> str:
        return "\n\n".join(
            f"[{index + 1}] source={chunk.source_file} section={chunk.section}\n{chunk.content}"
            for index, chunk in enumerate(chunks)
        )

    def _infer_topic(self, question: str) -> str:
        lowered = question.lower()
        if "hire" in lowered:
            return "Adnan's value proposition"
        if "trackr" in lowered:
            return "Trackr"
        if "voting" in lowered or "digivote" in lowered:
            return "DigiVote"
        if "cloud" in lowered or "aws" in lowered:
            return "Adnan's cloud learning path"
        if "role" in lowered or "seeking" in lowered:
            return "Adnan's target role"
        return "here is the most relevant information"

    def _tokenize(self, text: str) -> set[str]:
        stop_words = {
            "a",
            "an",
            "and",
            "are",
            "about",
            "does",
            "for",
            "he",
            "how",
            "in",
            "is",
            "me",
            "of",
            "the",
            "to",
            "what",
            "why",
        }
        return {
            token
            for token in re.findall(r"[a-z0-9+#.-]+", text.lower())
            if len(token) > 2 and token not in stop_words
        }


rag_service = RagService()
