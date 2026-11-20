# OBHASH — Human-Centered Intelligence Platform

**Phase 1: Foundation & Project Setup**  
**Team:** PastForward  
**Philosophy:** Human-Centered Intelligence  
**Target Audience:** Ages 18–30  

---

## 1. Overview

OBHASH is an AI-powered human capability development platform built around the philosophy of **Human-Centered Intelligence**.

Unlike conventional AI tools that simply complete tasks for people, OBHASH strengthens human agency, thought, and self-reliance through guided experiences, structured challenges, active reflection, and independent performance.

The platform focuses on three foundational human capabilities:
1. **Critical Thinking** — Evaluating arguments, discerning evidence, identifying cognitive biases, and formulating objective judgments.
2. **Creative Problem-Solving** — Divergent thinking, synthesizing novel connections, framing unstructured challenges, and prototyping inventive solutions.
3. **Curiosity** — Active inquiry, exploratory questioning, cross-disciplinary exploration, and continuous drive for discovery.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.4.6 | Full-stack React framework with SSR and Turbopack |
| **Language** | TypeScript | 5.x | End-to-end static typing and contract safety |
| **UI & Styling** | Tailwind CSS & React | 4.x / 19.3.0 | Modern utility styling and accessible component architecture |
| **Database** | Supabase (PostgreSQL) | Latest | Managed relational database with Row Level Security (RLS) |
| **Authentication** | Supabase Auth (`@supabase/ssr`) | Latest | Secure cookie-based SSR session management |
| **AI Integration** | Server-side LLM Layer | Modular | Provider-agnostic adapter (Google Gemini / OpenAI compatible) |
| **Validation** | Zod | 3.x | Schema-driven environment and request validation |
| **Deployment** | Vercel-compatible | — | Edge-ready serverless/Node.js hosting |

---

## 3. Prerequisites

- **Node.js**: v20.x or higher (tested on Node v24.11.1)
- **Package Manager**: `npm` (v11+), `pnpm` (v12+), or `yarn`
- **Git**: Installed and configured

---

## 4. Quick Start

### 4.1 Clone and Install
```bash
# Clone the repository
git clone <repo-url>
cd OBHASH

# Install dependencies
npm install
```

### 4.2 Configure Environment
```bash
# Copy the environment template
cp .env.example .env.local
```
Edit `.env.local` with your credentials:
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project.
- Set `GEMINI_API_KEY` (or `OPENAI_API_KEY`) from your AI provider dashboard.

### 4.3 Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 5. Development Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts local Next.js development server on port 3000 |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Starts production server |
| `npm run lint` | Runs ESLint analysis |
| `npm run typecheck` | Validates TypeScript types across the entire codebase |

---

## 6. Verification Endpoints

- **Health Check API**: `GET /api/health` — Inspects application uptime, environment configuration status, Supabase connection, and AI provider readiness.
- **AI Connectivity Test**: `GET /api/ai/test` — Performs a lightweight provider-level roundtrip without invoking coaching logic.

---

## 7. Documentation Index

- [Architecture Guide](file:///Users/kazi/Projects/OBHASH/docs/ARCHITECTURE.md)
- [Local Setup Guide](file:///Users/kazi/Projects/OBHASH/docs/SETUP.md)
- [Environment Configuration](file:///Users/kazi/Projects/OBHASH/docs/ENVIRONMENT.md)
- [Technical Decisions & Rationale](file:///Users/kazi/Projects/OBHASH/docs/TECHNICAL_DECISIONS.md)
- [Database Migrations](file:///Users/kazi/Projects/OBHASH/supabase/README.md)

---

## 8. Troubleshooting

- **Supabase shows "unconfigured" on `/api/health`**:
  Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are defined in `.env.local`. Restart `npm run dev` after updating `.env.local`.
- **AI Service shows "unconfigured"**:
  Ensure `GEMINI_API_KEY` (or `OPENAI_API_KEY`) is set in `.env.local` and `AI_PROVIDER` matches the key provided.
- **Port 3000 in use**:
  Run `PORT=3001 npm run dev` or stop the competing process.
