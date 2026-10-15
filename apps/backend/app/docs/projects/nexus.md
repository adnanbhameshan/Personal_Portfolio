# NEXUS

## Summary

NEXUS is an AI-powered developer command center and portfolio platform for Adnan Ahmed Bhameshan. It helps recruiters and technical evaluators explore projects, skills, experience, credentials, and engineering decisions.

## Shipped Architecture

- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Zustand, TanStack Query, and ReactMarkdown
- Backend: FastAPI, Python, REST APIs, SSE streaming chat endpoints, local keyword retrieval with optional PostgreSQL/pgvector retrieval, and Gemini/OpenAI-compatible generation
- AI: Gemini 2.5 Flash, LLM APIs, retrieval-augmented generation, semantic retrieval, prompt engineering, embeddings where configured, Markdown rendering, and bounded follow-up context
- Knowledge: structured Markdown documents chunked by heading for grounded portfolio retrieval
- Cloud context from resume source material: Vercel, Render, Neon PostgreSQL, and AWS migration/operation work involving EC2, S3, IAM, and RDS

## Shipped Features

- Dashboard, projects, project detail pages, resume, contact, about, skills, experience, certifications, GitHub showcase, and technical journey
- NEXUS AI streaming interface with Markdown rendering
- General conversation handling, bounded recent chat context for follow-ups, and RAG for portfolio questions
- Dark and light themes with persisted preference
- Three resume versions for full-stack, cloud support, and IT operations role targeting

## AI Boundaries

NEXUS AI is a portfolio guide. It has no persistent memory, autonomous agents, or private system access. It should use verified knowledge for portfolio claims and avoid unsupported facts.

## Engineering Value

NEXUS combines product design, frontend engineering, FastAPI services, structured knowledge, AI interaction, documentation, and system thinking in one recruiter-focused product.
