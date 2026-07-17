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
Your job is to help recruiters, engineering managers, technical interviewers, and startup founders evaluate Adnan faster.

Use only the provided context. If information is unavailable or marked TODO_VERIFY, state that clearly and do not guess.
Synthesize the context into a useful answer. Never copy raw document fragments.

Tone:
Professional, technical, helpful, confident, and grounded.
Avoid hype, sales language, generic corporate phrasing, and exaggerated claims.

Required response format:
[Short title that directly answers the question]

Key Points
• First key point
• Second key point
• Third key point

Evidence
[Concrete project, skill, resume, or career evidence synthesized from the context.]

Conclusion
[Brief recruiter-facing closing statement.]

Rules:
Never include source metadata such as source, category, last_updated, file names, or section names.
Never use markdown asterisks for bullets.
Use the Unicode bullet character • for lists.
Keep spacing between sections.
Prefer concise answers unless the question asks for depth."""


@dataclass(frozen=True)
class RetrievedChunk:
    source_file: str
    section: str
    content: str
    score: float


class RagService:
    def __init__(self) -> None:
        self._local_chunks = load_knowledge_chunks(KNOWLEDGE_ROOT)

    # ── Provider helpers ──────────────────────────────────────────

    def _active_provider(self) -> str:
        """Return the active LLM provider based on configured API keys.

        Priority: Gemini → OpenAI → local
        """
        if settings.gemini_api_key:
            return "gemini"
        if settings.openai_api_key:
            return "openai"
        return "local"

    def _active_model(self) -> str:
        provider = self._active_provider()
        if provider == "gemini":
            return settings.gemini_chat_model
        if provider == "openai":
            return settings.openai_chat_model
        return "local-keyword-rag"

    def _active_mode(self) -> str:
        provider = self._active_provider()
        has_pgvector = bool(settings.database_url and settings.openai_api_key)
        retrieval = "pgvector" if has_pgvector else "local-retrieval"
        if provider == "local":
            return "local-fallback"
        return f"{retrieval}+{provider}"

    # ── Public interface ──────────────────────────────────────────

    async def health(self) -> dict[str, str | int | bool]:
        provider = self._active_provider()
        return {
            "status": "ready",
            "knowledge_chunks": len(self._local_chunks),
            "pgvector_configured": bool(settings.database_url),
            "llm_configured": provider != "local",
            "provider": provider,
            "model": self._active_model(),
            "mode": self._active_mode(),
        }

    async def stream_answer(
        self,
        question: str,
        chunks: list[RetrievedChunk] | None = None,
    ) -> AsyncIterator[str]:
        chunks = chunks if chunks is not None else await self.retrieve(question)
        provider = self._active_provider()

        if provider == "gemini":
            try:
                async for token in self._stream_gemini_answer(question, chunks):
                    yield token
                return
            except Exception:
                # Gemini call failed (bad key, quota, network). Fall through
                # to OpenAI if configured, otherwise to local fallback.
                pass

        if provider == "openai" or settings.openai_api_key:
            try:
                async for token in self._stream_llm_answer(question, chunks):
                    yield token
                return
            except Exception:
                pass

        # local fallback
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

    async def _stream_gemini_answer(
        self,
        question: str,
        chunks: list[RetrievedChunk],
    ) -> AsyncIterator[str]:
        """Stream a response from the Google Gemini API using SSE."""
        context = self._format_context(chunks)
        url = (
            f"{settings.gemini_base_url.rstrip('/')}"
            f"/models/{settings.gemini_chat_model}"
            f":streamGenerateContent?alt=sse&key={settings.gemini_api_key}"
        )
        payload = {
            "system_instruction": {
                "parts": [{"text": SYSTEM_PROMPT}],
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": f"Question: {question}\n\nContext:\n{context}"}
                    ],
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
            },
        }

        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", url, json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    data = line.removeprefix("data: ").strip()
                    if not data or data == "[DONE]":
                        break
                    try:
                        event = json.loads(data)
                        parts = (
                            event.get("candidates", [{}])[0]
                            .get("content", {})
                            .get("parts", [])
                        )
                        for part in parts:
                            token = part.get("text", "")
                            if token:
                                yield token
                    except (json.JSONDecodeError, IndexError, KeyError):
                        continue

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
                "Verified Information Unavailable\n\n"
                "Key Points\n"
                "• I do not have enough verified context to answer that question yet.\n"
                "• The knowledge base may need another document or a TODO_VERIFY update.\n"
                "• I should not guess when portfolio information is missing.\n\n"
                "Evidence\n"
                "No relevant verified project, resume, skill, or career-goal context was retrieved for this question.\n\n"
                "Conclusion\n"
                "Adnan's portfolio is designed to favor accuracy over unsupported claims."
            )

        topic = self._infer_topic(question)
        bullets = self._fallback_key_points(question, chunks)
        evidence = self._fallback_evidence(question, chunks)
        conclusion = self._fallback_conclusion(question)
        return (
            f"{topic}\n\n"
            "Key Points\n"
            f"{bullets}\n\n"
            "Evidence\n"
            f"{evidence}\n\n"
            "Conclusion\n"
            f"{conclusion}"
        )

    def _format_context(self, chunks: list[RetrievedChunk]) -> str:
        return "\n\n".join(
            f"Context {index + 1}:\n{self._clean_context_text(chunk.content)}"
            for index, chunk in enumerate(chunks)
        )

    def _clean_context_text(self, text: str) -> str:
        lines = []
        for line in text.splitlines():
            stripped = line.strip()
            lowered = stripped.lower()
            if lowered.startswith(("source:", "category:", "last_updated:")):
                continue
            stripped = re.sub(r"^[-*]\s+", "", stripped)
            lines.append(stripped)
        cleaned = " ".join(" ".join(lines).split())
        return re.sub(r"\s[-*]\s+", ", ", cleaned)

    def _fallback_key_points(self, question: str, chunks: list[RetrievedChunk]) -> str:
        lowered = question.lower()
        if "hire" in lowered:
            points = [
                "Demonstrates end-to-end engineering ownership through complete portfolio projects.",
                "Built across frontend, backend, databases, authentication, AI/NLP, and blockchain workflows.",
                "Shows a clear growth path toward cloud, DevOps, and platform-focused engineering roles.",
            ]
        elif "trackr" in lowered:
            points = [
                "Trackr combines job-application tracking with secure full-stack product workflows.",
                "Its resume analyzer uses TF-IDF and Cosine Similarity through a separate FastAPI NLP service.",
                "The project demonstrates MERN architecture, JWT authentication, analytics, and service separation.",
            ]
        elif "digivote" in lowered or "voting" in lowered:
            points = [
                "DigiVote demonstrates blockchain-based voting flows with Solidity smart contracts.",
                "MetaMask handles wallet-based authentication and transaction signing.",
                "Truffle was used for smart contract development and controlled local testing.",
            ]
        elif "vjit" in lowered or "scheduler" in lowered:
            points = [
                "VJIT Sports Scheduler is a role-based academic full-stack scheduling platform.",
                "It uses Node.js, Express.js, PostgreSQL, Sequelize, EJS, Passport.js, bcrypt, and CSRF protection.",
                "The system covers session scheduling, participation tracking, reporting, and admin/student access boundaries.",
            ]
        elif "cloud" in lowered or "aws" in lowered:
            points = [
                "Adnan is actively preparing for the AWS Certified Solutions Architect - Associate path.",
                "His current cloud focus includes IAM, EC2, S3, RDS, VPC, security, availability, and fault tolerance.",
                "He is positioning his software engineering foundation toward cloud support, DevOps, and platform roles.",
            ]
        elif "role" in lowered or "seeking" in lowered:
            points = [
                "Adnan is open to international opportunities and relocation.",
                "His target roles include cloud support, IT support, technical support, system administration, AWS cloud, and junior DevOps.",
                "His long-term direction is toward cloud engineering, platform engineering, and solutions architecture.",
            ]
        else:
            points = self._extract_fallback_points(chunks)

        return "\n".join(f"• {point}" for point in points[:4])

    def _fallback_evidence(self, question: str, chunks: list[RetrievedChunk]) -> str:
        lowered = question.lower()
        if "hire" in lowered:
            return (
                "NEXUS demonstrates frontend engineering, FastAPI backend services, retrieval-augmented generation, "
                "knowledge-base design, AI assistant integration, and technical documentation in one product. "
                "Trackr adds MERN architecture, JWT authentication, dashboard analytics, and a separate FastAPI NLP service. "
                "DigiVote and VJIT Sports Scheduler broaden the evidence with smart contract workflows, role-based access, "
                "PostgreSQL, Sequelize, Passport.js, and CSRF protection."
            )
        if "trackr" in lowered:
            return (
                "Trackr centralizes job applications, protects user-specific data with JWT authentication, stores records in MongoDB Atlas through Mongoose, "
                "and visualizes application pipeline analytics. Its resume analyzer separates NLP into FastAPI and compares resumes with job descriptions using TF-IDF and Cosine Similarity."
            )
        if "digivote" in lowered or "voting" in lowered:
            return (
                "DigiVote uses React, Solidity, Ethereum, Truffle, Web3.js, Node.js, MongoDB, and MetaMask. "
                "Critical vote actions are handled through smart contract interactions, while off-chain metadata remains in MongoDB. "
                "The project was tested in a controlled college environment using a local Ethereum network rather than deployed as a public live demo."
            )
        if "vjit" in lowered or "scheduler" in lowered:
            return (
                "VJIT Sports Scheduler replaces spreadsheet and notice-board coordination with a role-based scheduling platform. "
                "Admins manage sessions, resources, users, and reports, while students browse sports, join sessions, and track participation. "
                "The PDF documentation confirms screenshots for the landing page, authentication flows, dashboard, sessions, reports, password change, and profile editing."
            )
        if "cloud" in lowered or "aws" in lowered:
            return (
                "The knowledge base positions Adnan as actively preparing for AWS Solutions Architect - Associate, with current study across IAM, EC2, S3, RDS, VPC, cloud security, availability, and fault tolerance. "
                "His software projects provide a practical foundation for cloud support, DevOps, and infrastructure-focused growth."
            )

        sentences: list[str] = []
        for chunk in chunks[:4]:
            cleaned = self._clean_context_text(chunk.content)
            for sentence in re.split(r"(?<=[.!?])\s+", cleaned):
                sentence = sentence.strip()
                lowered = sentence.lower()
                if not sentence:
                    continue
                if lowered.startswith(("source:", "category:", "last_updated:")):
                    continue
                if "todo_verify" in lowered:
                    sentences.append(sentence)
                    continue
                if len(sentence.split()) >= 6:
                    sentences.append(sentence)
                if len(sentences) >= 4:
                    break
            if len(sentences) >= 4:
                break

        if not sentences:
            return "The retrieved knowledge base context confirms relevant portfolio information, but it does not contain enough clean detail for a deeper local response."

        evidence = " ".join(sentences)
        return " ".join(evidence.split()[:130])

    def _fallback_conclusion(self, question: str) -> str:
        lowered = question.lower()
        if "hire" in lowered:
            return "Adnan is best suited for teams looking for a high-potential engineer with practical project ownership, strong learning velocity, and a credible path toward cloud and platform engineering."
        if "trackr" in lowered:
            return "Trackr is strong evidence of Adnan's ability to connect product workflows, backend architecture, authentication, analytics, and applied NLP."
        if "digivote" in lowered or "voting" in lowered:
            return "DigiVote shows that Adnan can reason about trust boundaries, wallet-based authentication, and smart contract backed product flows."
        if "vjit" in lowered or "scheduler" in lowered:
            return "VJIT Sports Scheduler demonstrates practical backend engineering, relational data modelling, role-based access, and academic capstone execution."
        if "cloud" in lowered or "aws" in lowered:
            return "His cloud profile is still developing, but the direction is clear and supported by disciplined AWS study and software engineering fundamentals."
        return "This gives recruiters a grounded view of Adnan's experience without relying on unsupported claims."

    def _extract_fallback_points(self, chunks: list[RetrievedChunk]) -> list[str]:
        points: list[str] = []
        for chunk in chunks[:4]:
            cleaned = self._clean_context_text(chunk.content)
            for part in re.split(r"(?<=[.!?])\s+", cleaned):
                sentence = " ".join(part.split())
                if len(sentence.split()) < 6:
                    continue
                if sentence.lower().startswith(("source:", "category:", "last_updated:")):
                    continue
                points.append(sentence.rstrip(".") + ".")
                if len(points) >= 3:
                    return points
        return [
            "Relevant verified context was found in the portfolio knowledge base.",
            "The answer is limited to documented project, skill, resume, and career information.",
            "Missing or uncertain details should be verified before being presented as facts.",
        ]

    def _infer_topic(self, question: str) -> str:
        lowered = question.lower()
        if "hire" in lowered:
            return "Adnan's value proposition"
        if "trackr" in lowered:
            return "Trackr"
        if "voting" in lowered or "digivote" in lowered:
            return "DigiVote"
        if "scheduler" in lowered or "vjit" in lowered:
            return "VJIT Sports Scheduler"
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
