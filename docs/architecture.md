# NEXUS Technical Architecture

## Product Direction

NEXUS is a SaaS-style AI Developer Command Center, not a traditional portfolio. The first viewport prioritizes the dashboard and project intelligence, with futuristic motion used only to clarify system state.

Target users:
- Recruiters
- Engineering managers
- Technical interviewers
- Startup founders

Design balance:
- 70% professional SaaS product
- 30% futuristic command center

## MVP Scope

Phase 1 builds the product foundation only:
- Folder structure
- Design system
- Tailwind configuration
- Theme tokens
- Routing
- Layout architecture
- Sidebar
- Topbar
- Reusable UI components
- Responsive foundation

Future MVP phases add complete page content, RAG-backed AI, contact submission, resume download tracking, and deployment hardening.

## Folder Structure

```text
apps/
  frontend/
    src/
      app/
      components/
        background/
        boot/
        layout/
        ui/
      constants/
      data/
      hooks/
      lib/
      pages/
      store/
      styles/
      types/
  backend/
    app/
      core/
        rag/
      routers/
      schemas/
      services/
    migrations/
docs/
```

## Frontend Architecture

Core stack:
- React
- TypeScript with strict mode
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Zustand
- TanStack Query

Primary routes:
- `/` redirects through the boot sequence into `/dashboard`
- `/dashboard`
- `/projects`
- `/projects/:slug`
- `/assistant`
- `/resume`
- `/contact`
- `/about`
- Future placeholders: `/skills`, `/github`, `/aws-journey`, `/certifications`

Layout:
- `AppShell` owns the persistent dashboard chrome
- `Sidebar` is desktop-first and fixed width
- `Topbar` handles page context and command actions
- `MobileNav` provides compact route access below tablet widths
- `NexusGridPulse` provides the signature living background with restrained opacity

## Backend Architecture

Core stack:
- FastAPI
- Python 3.12
- PostgreSQL
- pgvector
- OpenAI-compatible API

V1 API routes:
- `GET /api/health`
- `POST /api/ai/chat`
- `GET /api/ai/health`
- `POST /api/contact`
- `GET /api/resume/download`

Deferred routes:
- GitHub intelligence
- Admin ingestion UI
- Authentication
- Recruiter analytics

## RAG Flow

```text
User question
  -> embedding generation
  -> pgvector similarity search
  -> context retrieval
  -> OpenAI-compatible chat completion
  -> answer with source references
```

Knowledge sources:
- Resume
- Projects
- Skills
- Certifications

The MVP avoids conversation memory, agent workflows, multi-step planning, multi-user features, and admin ingestion UI.

## Database Schema

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_file VARCHAR(255) NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  section VARCHAR(255),
  content TEXT NOT NULL,
  embedding vector(1536),
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX document_chunks_embedding_idx
  ON document_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  message_type VARCHAR(50),
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  utm_source VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resume_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR(50) NOT NULL DEFAULT 'standard',
  session_id VARCHAR(100),
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Component Hierarchy

```text
App
  QueryClientProvider
  BrowserRouter
  BootGate
    AppShell
      Sidebar
      Topbar
      MobileNav
      NexusGridPulse
      Outlet
        DashboardPage
          StatCard
          ProjectCard
          SectionHeader
        ProjectsIndexPage
        ProjectDetailPage
        AssistantPage
        ResumePage
        ContactPage
        AboutPage
        FuturePlaceholderPage
```

## Implementation Roadmap

1. Phase 1: foundation, design system, routing, layout, reusable components.
2. Phase 2: complete Dashboard, Projects Index, Project Detail pages, Resume, Contact, About content.
3. Phase 3: FastAPI RAG implementation, knowledge ingestion, pgvector retrieval, AI panel.
4. Phase 4: deployment, Docker, Neon/Render/Vercel configuration, accessibility and device QA.
5. Phase 5: future pages such as GitHub Intelligence, AWS Journey, Certifications Hub, analytics, and admin.

