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

Use only the provided context. If information is unavailable or marked as needing verification, state that clearly and do not guess.
Synthesize the context into a useful answer. Never copy raw document fragments.

Tone:
Professional, technical, helpful, confident, and grounded.
Avoid hype, sales language, generic corporate phrasing, and exaggerated claims.

Rules:
Never include source metadata such as source, category, last_updated, file names, or section names.
Use semantic Markdown when it improves scanability. Prefer a short direct opening, then concise `##` sections and `-` lists where useful.
Use `**bold**` only for emphasis and keep a blank line between Markdown blocks.
Do not force headings or lists into simple answers.
Prefer concise answers unless the question asks for depth."""

CONVERSATION_PROMPT = """You are NEXUS AI, the portfolio assistant for Adnan Ahmed Bhameshan.
You can naturally greet visitors and explain that you help explore Adnan's projects, skills, experience, certifications, learning journey, and engineering decisions.
You have no persistent memory, no autonomous agents, and no private system access. Stay concise, friendly, accurate, and use Markdown only when it improves readability."""


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
        history: list[object] | None = None,
    ) -> AsyncIterator[str]:
        intent = self.classify_intent(question)
        history = history or []
        if intent == "conversation":
            answer = self._conversation_answer(question)
            for token in answer.split(" "):
                yield token + " "
                await asyncio.sleep(0.008)
            return
        if intent == "follow_up" and not history:
            answer = "I can help with Adnan's projects, skills, experience, certifications, or technical decisions. What would you like me to expand on?"
            for token in answer.split(" "):
                yield token + " "
                await asyncio.sleep(0.008)
            return
        resolved_question = self.resolve_contextual_question(question, history)
        if chunks is None or resolved_question != question:
            chunks = await self.retrieve_for_intent(question, history)
        direct_answer = self._direct_grounded_answer(resolved_question, chunks)
        if direct_answer:
            for token in direct_answer.split(" "):
                yield token + " "
                await asyncio.sleep(0.008)
            return
        provider = self._active_provider()

        if provider == "gemini":
            try:
                async for token in self._stream_gemini_answer(question, resolved_question, chunks, history, intent):
                    yield token
                return
            except Exception:
                # Gemini call failed (bad key, quota, network). Fall through
                # to OpenAI if configured, otherwise to local fallback.
                pass

        if provider == "openai" or settings.openai_api_key:
            try:
                async for token in self._stream_llm_answer(question, resolved_question, chunks, history, intent):
                    yield token
                return
            except Exception:
                pass

        # local fallback
        fallback = self._build_fallback_answer(resolved_question, chunks, history, intent)
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

    async def retrieve_for_intent(self, question: str, history: list[object] | None = None) -> list[RetrievedChunk]:
        intent = self.classify_intent(question)
        if intent == "conversation" or (intent == "follow_up" and not history):
            return []
        return await self.retrieve(self.resolve_contextual_question(question, history or []))

    def classify_intent(self, question: str) -> str:
        normalized = " ".join(question.lower().strip().split())
        normalized = normalized.strip("?.!")
        conversational = {
            "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
            "who are you", "what can you help me with", "what can i ask you", "thanks",
            "thank you", "that's interesting", "that is interesting",
        }
        if normalized in conversational:
            return "conversation"
        if normalized in {"tell me more", "explain that", "why?", "how does that work", "can you explain that"}:
            return "follow_up"
        return "portfolio"

    def resolve_contextual_question(self, question: str, history: list[object]) -> str:
        """Attach a recent portfolio topic to short contextual follow-ups."""
        if not history:
            return question

        lowered = question.lower()
        explicit_topics = {
            "trackr", "digivote", "vjit", "scheduler", "nexus", "aws", "sahl",
            "experience", "certification", "certifications", "certificate",
            "skill", "skills", "github", "project", "portfolio", "terraform",
            "infrastructure", "vpc", "rds", "cloudwatch",
        }
        if any(topic in lowered for topic in explicit_topics):
            return question

        contextual_terms = {
            "it", "its", "that", "this", "there", "those", "they", "them",
            "he", "his", "technologies", "technology", "stack", "use", "used",
            "when", "certified", "where",
        }
        question_terms = set(re.findall(r"[a-z0-9+#.-]+", lowered))
        if not question_terms.intersection(contextual_terms):
            return question

        topic = self._infer_recent_topic(history)
        if not topic:
            return question
        return f"{question} about {topic}"

    def _infer_recent_topic(self, history: list[object]) -> str | None:
        topic_patterns = [
            ("Trackr", ("trackr",)),
            ("DigiVote", ("digivote", "voting")),
            ("VJIT Sports Scheduler", ("vjit", "sports scheduler", "scheduler")),
            ("NEXUS", ("nexus",)),
            ("Cloud Infrastructure Platform", ("cloud infrastructure", "terraform", "vpc", "rds", "cloudwatch", "load balancer")),
            ("Adnan's SAHL Business Solutions experience", ("sahl", "business solutions", "experience", "full stack developer", "software engineer")),
            ("Adnan's AWS certification", ("aws", "solutions architect", "certified", "certification")),
            ("Adnan's certifications", ("certifications", "certificates", "credentials")),
            ("Adnan's skills", ("skills", "technologies", "tech stack")),
        ]
        for preferred_role in ("user", "assistant"):
            for item in reversed(history[-6:]):
                role = getattr(item, "role", None) or (item.get("role") if isinstance(item, dict) else None)
                if role != preferred_role:
                    continue
                content = getattr(item, "content", None) or (item.get("content") if isinstance(item, dict) else None)
                if not isinstance(content, str):
                    continue
                lowered = content.lower()
                for topic, patterns in topic_patterns:
                    if any(pattern in lowered for pattern in patterns):
                        return topic
        return None

    def _conversation_answer(self, question: str) -> str:
        normalized = question.lower().strip().strip("?.!")
        if normalized in {"thanks", "thank you"}:
            return "You're welcome. If you'd like, ask about a project, Adnan's experience, skills, or certifications."
        if normalized == "who are you":
            return "I'm **NEXUS AI**, an assistant for exploring Adnan's portfolio, projects, skills, experience, certifications, learning journey, and engineering decisions."
        return "Hi - I'm **NEXUS AI**. I can help you explore Adnan's projects, professional experience, skills, certifications, and the engineering decisions behind them."

    def _direct_grounded_answer(self, question: str, chunks: list[RetrievedChunk]) -> str | None:
        lowered = question.lower()
        if "aws" in lowered and "certified" in lowered and any(term in lowered for term in ("when", "date", "issued", "get")):
            if self._knowledge_mentions("July 25, 2026"):
                return (
                    "Adnan earned the **AWS Certified Solutions Architect - Associate** credential on "
                    "**July 25, 2026**. It is valid until **July 25, 2029**, and the validation number is "
                    "`c6aa0324cde04484a41525db066ff4c7`."
                )
        if ("sahl" in lowered or "experience" in lowered) and any(term in lowered for term in ("technology", "technologies", "stack", "use", "used")):
            if self._knowledge_mentions("SAHL Business Solutions"):
                return (
                    "At **SAHL Business Solutions**, Adnan used **React.js**, **Node.js**, **FastAPI**, "
                    "**REST APIs**, **JWT and bcrypt authentication**, **MongoDB**, **PostgreSQL**, "
                    "**Python-based AI services**, **AWS**, **Vercel**, **Render**, **Git/GitHub**, and **CI/CD**."
                )
        if any(term in lowered for term in ("cloud infrastructure", "infrastructure project", "terraform", "vpc", "cloud project", "aws services")):
            if self._knowledge_mentions("Cloud Infrastructure Platform"):
                return (
                    "**Cloud Infrastructure Platform — AWS & Terraform** documents Adnan's AWS infrastructure project. "
                    "The resume-sourced scope includes **VPC**, **public/private subnets**, **route tables**, "
                    "**security groups**, **EC2**, **Application Load Balancer**, **RDS PostgreSQL**, **S3**, "
                    "**IAM**, **CloudWatch**, **Docker**, **GitHub Actions**, and **Terraform** modules/remote state. "
                    "The current portfolio repository does not include Terraform source files, so the implementation should not invent unpublished infrastructure code."
                )
        if "certification" in lowered or "certifications" in lowered or "credentials" in lowered:
            if self._knowledge_mentions("AWS Certified Solutions Architect"):
                return (
                    "Adnan's documented credentials include:\n\n"
                    "- **AWS Certified Solutions Architect - Associate** - issued July 25, 2026, valid until July 25, 2029.\n"
                    "- **Nutanix Certified Professional - Multicloud Infrastructure 6**.\n"
                    "- **Google Advanced Data Analytics Capstone**.\n"
                    "- **React Front-End Development** from HackerRank.\n"
                    "- **Cybersecurity Essentials**, **PCAP: Programming Essentials in Python**, and **Programming Essentials in C++** from Cisco-aligned programs.\n"
                    "- **Technical Quiz - 2nd Prize** and **IELTS Academic**."
                )
        return None

    def _context_mentions(self, chunks: list[RetrievedChunk], text: str) -> bool:
        needle = text.lower()
        return any(needle in chunk.content.lower() for chunk in chunks)

    def _knowledge_mentions(self, text: str) -> bool:
        needle = text.lower()
        return any(needle in chunk.content.lower() for chunk in self._local_chunks)

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
        if (
            "terraform" in question
            or "infrastructure" in question
            or "vpc" in question
            or "rds" in question
            or "cloudwatch" in question
            or "cloud project" in question
        ) and "cloud-infrastructure-platform" in source:
            boost += 1.6
        if ("cloud" in question or "aws" in question) and (
            "career_goals" in source or "cloud" in section or "cloud-infrastructure-platform" in source
        ):
            boost += 1.0
        if ("certification" in question or "certifications" in question or "credential" in question or "certified" in question) and "certifications" in source:
            boost += 1.4
        if ("experience" in question or "sahl" in question) and "experience" in source:
            boost += 1.4
        if ("role" in question or "seeking" in question) and "career_goals" in source:
            boost += 1.0
        if "hire" in question and source in {"resume.md", "about.md", "career_goals.md"}:
            boost += 0.7

        return boost

    async def _stream_gemini_answer(
        self,
        question: str,
        resolved_question: str,
        chunks: list[RetrievedChunk],
        history: list[object],
        intent: str,
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
                "parts": [{"text": SYSTEM_PROMPT if intent == "portfolio" else CONVERSATION_PROMPT}],
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": self._compose_user_message(question, resolved_question, context, history)}
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
        resolved_question: str,
        chunks: list[RetrievedChunk],
        history: list[object],
        intent: str,
    ) -> AsyncIterator[str]:
        context = self._format_context(chunks)
        payload = {
            "model": settings.openai_chat_model,
            "stream": True,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT if intent == "portfolio" else CONVERSATION_PROMPT},
                {
                    "role": "user",
                    "content": self._compose_user_message(question, resolved_question, context, history),
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

    def _compose_user_message(self, question: str, resolved_question: str, context: str, history: list[object]) -> str:
        history_lines = []
        for item in history[-6:]:
            role = getattr(item, "role", None) or (item.get("role") if isinstance(item, dict) else None)
            content = getattr(item, "content", None) or (item.get("content") if isinstance(item, dict) else None)
            if role in {"user", "assistant"} and isinstance(content, str):
                history_lines.append(f"{role.title()}: {content}")
        parts = [f"Question: {question}"]
        if resolved_question != question:
            parts.append(f"Resolved portfolio question for retrieval: {resolved_question}")
        if history_lines:
            parts.append("Recent conversation:\n" + "\n".join(history_lines))
        if context:
            parts.append(f"Verified portfolio context:\n{context}")
        return "\n\n".join(parts)

    def _build_fallback_answer(
        self, question: str, chunks: list[RetrievedChunk], history: list[object], intent: str
    ) -> str:
        if intent == "follow_up" and history:
            latest = history[-1]
            previous = getattr(latest, "content", None) or (latest.get("content") if isinstance(latest, dict) else "")
            return f"## Continuing the conversation\n\nI can expand on the previous point:\n\n{previous}\n\nWhat part would you like to explore further?"
        if not chunks:
            return "## I need a little more context\n\nI don't have verified portfolio information for that yet, and I don't want to guess. Try asking about a project, skills, experience, certifications, or a specific engineering decision."

        topic = self._infer_topic(question)
        bullets = self._fallback_key_points(question, chunks)
        evidence = self._fallback_evidence(question, chunks)
        conclusion = self._fallback_conclusion(question)
        return f"## {topic}\n\n### Key points\n{bullets}\n\n### Evidence\n{evidence}\n\n### Takeaway\n{conclusion}"

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
        elif "trackr" in lowered and any(term in lowered for term in ("technology", "technologies", "stack", "use", "uses")):
            points = [
                "Trackr uses React for the frontend and Node.js with Express.js for the backend API.",
                "MongoDB Atlas and Mongoose handle application data modelling and persistence.",
                "JWT authentication, bcrypt hashing, dashboard analytics, and service separation support the product workflow.",
                "A separate FastAPI service performs pure-Python TF-IDF and cosine-similarity resume matching.",
            ]
        elif "trackr" in lowered:
            points = [
                "Trackr combines job-application tracking with secure full-stack product workflows.",
                "Its resume analyzer uses TF-IDF and Cosine Similarity through a separate FastAPI NLP service.",
                "The project demonstrates MERN architecture, JWT authentication, analytics, and service separation.",
            ]
        elif "sahl" in lowered or "experience" in lowered:
            points = [
                "At SAHL Business Solutions, Adnan worked across React, Node.js, FastAPI, REST APIs, and authentication.",
                "The experience included MongoDB, PostgreSQL, Python-based AI services, AWS, deployment platforms, GitHub, and CI/CD.",
                "The role is documented as Full Stack Developer work from February 2025 to July 2026 in Hyderabad, India.",
            ]
        elif "certification" in lowered or "certifications" in lowered or "certified" in lowered:
            points = [
                "Adnan holds AWS Certified Solutions Architect – Associate, issued July 25, 2026 and valid until July 25, 2029.",
                "He also has Nutanix, Google/Coursera, HackerRank React, Cisco Python, Cisco C++, Cybersecurity Essentials, IELTS Academic, and Technical Quiz credentials.",
                "The AWS validation number is c6aa0324cde04484a41525db066ff4c7.",
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
        elif any(term in lowered for term in ("terraform", "infrastructure", "vpc", "rds", "cloudwatch", "cloud project", "aws services")):
            points = [
                "Cloud Infrastructure Platform — AWS & Terraform is documented as Adnan's AWS infrastructure project.",
                "The resume-sourced scope includes VPC networking, public/private subnets, route tables, security groups, EC2, ALB, RDS PostgreSQL, S3, IAM, CloudWatch, Docker, GitHub Actions, and Terraform.",
                "The current portfolio repository does not contain Terraform source files, so unpublished infrastructure implementation details should not be invented.",
            ]
        elif "cloud" in lowered or "aws" in lowered:
            points = [
                "Adnan is an AWS Certified Solutions Architect – Associate.",
                "The certification validates knowledge across cloud architecture, security, availability, and fault tolerance.",
                "His software engineering background supports continued growth across cloud and platform-focused roles.",
            ]
        elif "role" in lowered or "seeking" in lowered:
            points = [
                "Adnan's portfolio is positioned around full-stack development, cloud support, IT operations, AWS cloud, and junior DevOps-aligned work.",
                "His resume variants support Full-Stack Developer, Cloud Support Engineer, and IT Operations / IT Support positioning.",
                "His long-term direction is toward cloud engineering, platform engineering, and solutions architecture.",
            ]
        else:
            points = self._extract_fallback_points(chunks)

        return "\n".join(f"- {point}" for point in points[:4])

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
        if "sahl" in lowered or "experience" in lowered:
            return (
                "The knowledge base documents SAHL Business Solutions as Full Stack Developer experience from February 2025 to July 2026 in Hyderabad, India. "
                "The confirmed scope includes React, Node.js, FastAPI, REST APIs, JWT and bcrypt authentication, MongoDB, PostgreSQL, Python AI services, AWS, deployment platforms, GitHub, and CI/CD."
            )
        if "certification" in lowered or "certifications" in lowered or "certified" in lowered:
            return (
                "The certifications knowledge base lists AWS Certified Solutions Architect – Associate with issue date July 25, 2026, expiry July 25, 2029, and validation number c6aa0324cde04484a41525db066ff4c7, plus the supporting technical credentials shown in the Certifications UI."
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
        if any(term in lowered for term in ("terraform", "infrastructure", "vpc", "rds", "cloudwatch", "cloud project", "aws services")):
            return (
                "The Cloud Infrastructure Platform entry is sourced from Adnan's resume material and documents AWS infrastructure design with Terraform. "
                "It lists VPC, public/private subnets, route tables, security groups, EC2, Application Load Balancer, RDS PostgreSQL, S3, IAM, CloudWatch, Docker, GitHub Actions, and Terraform modules/remote state. "
                "Because the repository does not currently include Terraform files, the portfolio presents it as documented project evidence rather than fabricated live infrastructure."
            )
        if "cloud" in lowered or "aws" in lowered:
            return (
                "Adnan holds AWS Certified Solutions Architect – Associate. The certification supports his cloud architecture, security, availability, and fault-tolerance foundation, alongside practical software engineering experience."
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
        if any(term in lowered for term in ("terraform", "infrastructure", "vpc", "rds", "cloudwatch", "cloud project", "aws services")):
            return "The cloud infrastructure project strengthens the portfolio's AWS story while staying honest about what is resume-sourced versus present in the repository."
        if "cloud" in lowered or "aws" in lowered:
            return "The certification adds a verified cloud foundation to Adnan's full-stack engineering experience."
        if "certification" in lowered or "certifications" in lowered or "certified" in lowered:
            return "These credentials give recruiters verified signals across cloud, infrastructure, frontend, programming, cybersecurity, analytics, and communication."
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
        if any(term in lowered for term in ("terraform", "infrastructure", "vpc", "rds", "cloudwatch", "cloud project", "aws services")):
            return "Cloud Infrastructure Platform"
        if "cloud" in lowered or "aws" in lowered:
            return "Adnan's AWS background"
        if "sahl" in lowered or "experience" in lowered:
            return "Adnan's professional experience"
        if "certification" in lowered or "certifications" in lowered or "certified" in lowered:
            return "Adnan's certifications"
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
