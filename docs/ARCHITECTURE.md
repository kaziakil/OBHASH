# OBHASH Architecture Guide

**Phase:** 8 of 8 (Integration, Testing & Competition Launch)  
**Document Status:** Complete & Production-Verified

---

## 1. System Overview

OBHASH is engineered as a full-stack, modular web application using Next.js 16 (App Router), TypeScript, Supabase, and a server-side provider-independent AI layer.

The design emphasizes:
- **Human-Centered Intelligence**: Strengthening human agency rather than automating cognitive effort away.
- **Clean Boundaries**: Strict separation between presentation, application logic, persistence, and external AI services.
- **Evidence-Informed Personalization**: Grounding developmental roadmaps in authentic assessment demonstration.
- **Zero-Leak Security**: Secrets and privileged database capabilities are confined strictly to server-side runtimes.
- **Phase-Ready Extensibility**: Clean abstraction boundaries for upcoming phases (AI Growth Coach, Challenge Workspace, Portfolio).

---

## 2. Directory Structure

```text
OBHASH/
├── public/                     # Static assets (favicons, SVGs, brand marks)
├── src/
│   ├── app/                    # Next.js App Router (pages, layouts, routes)
│   │   ├── api/
│   │   │   ├── health/         # System health verification endpoint
│   │   │   └── ai/
│   │   │       └── test/       # AI connectivity test endpoint
│   │   ├── layout.tsx          # Root branded shell (Header, Main, Footer)
│   │   ├── page.tsx            # Foundation dashboard & capability preview
│   │   ├── error.tsx           # Global runtime error boundary
│   │   ├── not-found.tsx       # Standardized 404 handler
│   │   ├── loading.tsx         # Root suspense fallback
│   │   └── globals.css         # Tailwind CSS styling directives
│   │
│   ├── components/
│   │   └── shared/             # Reusable UI components
│   │       ├── Header.tsx      # Branded navigation header
│   │       ├── Footer.tsx      # System metadata footer
│   │       ├── Card.tsx        # Accessible content container
│   │       └── StatusBadge.tsx # Infrastructure status indicator
│   │
│   ├── lib/
│   │   ├── supabase/           # Supabase client isolation
│   │   │   ├── client.ts       # Browser-side client (anon key only)
│   │   │   ├── server.ts       # Server-side client (cookie-based SSR)
│   │   │   ├── admin.ts        # Privileged admin client (service role, server-only)
│   │   │   └── middleware.ts   # Session refresh middleware utility
│   │   │
│   │   ├── ai/                 # Provider-independent AI service layer
│   │   │   ├── service.ts      # AIService orchestrator & timeout manager
│   │   │   └── providers/
│   │   │       ├── gemini.ts   # Google Gemini adapter (@google/genai)
│   │   │       └── openai.ts   # OpenAI / Compatible REST adapter
│   │   │
│   │   └── utils/
│   │       ├── cn.ts           # Class merge utility (clsx + tailwind-merge)
│   │       ├── logger.ts       # Structured JSON logging utility
│   │       └── response.ts     # Standardized API response helpers
│   │
│   ├── config/
│   │   ├── constants.ts        # App metadata and capability constants
│   │   └── env.ts              # Zod environment schema & runtime inspection
│   │
│   └── types/
│       ├── api.ts              # ApiResponse<T> & HealthStatus interfaces
│       ├── ai.ts               # AI contracts, adapters & error classes
│       └── database.ts         # Supabase PostgreSQL schema types
│
├── supabase/
│   ├── migrations/             # Versioned SQL migration files
│   │   └── 20261120000000_initial_schema.sql
│   └── README.md               # Migration run instructions
│
├── docs/                       # Architectural and technical documentation
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── ENVIRONMENT.md
│   └── TECHNICAL_DECISIONS.md
│
├── .env.example                # Environment variables reference template
├── .gitignore                  # Git ignore rules (protecting .env*)
├── package.json
└── tsconfig.json
```

---

## 3. Frontend Architecture

- **Next.js App Router (Server-First)**: Pages default to React Server Components (RSC) to minimize client-side JavaScript payloads.
- **Client Boundaries**: Client components (`"use client"`) are restricted to interactive UI elements (e.g., `error.tsx`, interactive widgets).
- **Design System & Tailwind CSS**: Utility-first styling with accessible color contrast and native dark mode support.
- **Shared Components**: Located in `src/components/shared/`, enforcing accessibility, type safety, and standard props.

---

## 4. Backend & API Architecture

- **Next.js Route Handlers (`src/app/api/`)**: High-performance endpoints returning standard envelopes:
  ```typescript
  interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    details?: unknown;
    timestamp: string;
  }
  ```
- **Error Handling**: Standardized via `apiSuccess()` and `apiError()` helpers in `src/lib/utils/response.ts`.
- **Structured Logging**: `src/lib/utils/logger.ts` emits JSON logs with timestamps, levels (`INFO`, `WARN`, `ERROR`), and structured context metadata.

---

## 5. Database Architecture (Supabase)

### 5.1 Client Segregation
1. **Browser Client (`src/lib/supabase/client.ts`)**: Uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Subject to Row Level Security.
2. **Server Client (`src/lib/supabase/server.ts`)**: Uses `@supabase/ssr` to read/write auth session cookies directly via `next/headers`.
3. **Admin Client (`src/lib/supabase/admin.ts`)**: Uses `SUPABASE_SERVICE_ROLE_KEY`. Enforces a strict runtime check:
   ```typescript
   if (typeof window !== "undefined") {
     throw new Error("SECURITY VIOLATION: createAdminSupabaseClient cannot be invoked in a browser environment.");
   }
   ```

### 5.2 Row Level Security (RLS)
Every database table in `supabase/migrations/` has RLS enabled by default:
- `profiles`: Users can select and update only their own profile (`auth.uid() = id`).
- `capabilities`: Anyone can read active capabilities; only admins can write.
- `audit_logs`: Users can view their own entries; insertions validated against `auth.uid() = user_id`.

---

## 6. AI Integration Layer

OBHASH requires a provider-independent AI architecture to prevent vendor lock-in.

```
       ┌─────────────────────────────┐
       │   Application Services      │
       │   (Assessments, Coach, etc) │
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │     AIService Singleton     │
       │   (Timeout, Validation,     │
       │    Error Normalization)     │
       └──────────────┬──────────────┘
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│  Gemini Adapter  │      │  OpenAI Adapter  │
│  (@google/genai) │      │  (REST API)      │
└──────────────────┘      └──────────────────┘
```

- **Contracts**: Defined in `src/types/ai.ts` (`AIProviderAdapter`, `CompletionRequest`, `CompletionResponse`).
- **Timeout Management**: Built-in timeout enforcement (`AI_TIMEOUT_MS`, default 30,000ms) with `AbortSignal` / `Promise.race`.
- **Error Normalization**: All vendor-specific errors are mapped to `AIServiceError` with standard codes (`CONFIG_ERROR`, `TIMEOUT_ERROR`, `PROVIDER_ERROR`).

### 6.1 AI Growth Coach Architecture (Phase 5)

The AI Growth Coach is built upon the **Human-Centered Intelligence** paradigm ("Coach, don't replace").
- **Socratic Dialogue Engine**: Calibrated with `temperature: 0.4` to stimulate inquiry without generating unassisted solutions or hallucinating answers.
- **Progressive Hint Engine**: 4 distinct guidance tiers (Level 0: None, Level 1: Directional, Level 2: Conceptual, Level 3: Specific guidance) to support learners while safeguarding independent struggle.
- **Contextual Inquiry Actions**: In-session micro-coaching actions (`hint`, `explain`, `perspective`, `challenge`, `summarize`) that steer the dialogue towards deeper cognitive reflection.
- **Prompt Injection Isolation**: User-provided context and responses are demarcated in untrusted boundary envelopes (`<learner_context>`) to neutralize prompt injection vectors.
- **Deterministic Socratic Fallback**: Full rule-based dialogue fallback ensuring continuity if the AI provider experiences outages or rate limits.

### 6.2 Challenge & Reflection Workspace Architecture (Phase 6)

The Challenge & Reflection Workspace turns personalized development roadmaps into active, independent practice:
- **Challenge Discovery & Recommendation**: Recommendation scoring grounded in Phase 3 baseline opportunities, Phase 4 focus areas and goals, and user interests.
- **Continuous Autosave Engine**: 1500ms debounced server synchronization of notes and deliverables with real-time status reporting.
- **Contextual AI Coach Drawer**: In-workspace Socratic assistance with prompt isolation; AI guidance is kept in assistance logs and never ghostwritten into user deliverables.
- **Grounded Rubric Evaluation**: Server-side evaluation extracting direct quotes from submitted deliverables, evaluating relevant capability dimensions, and assigning 4-level rubric indicators.
- **Metacognitive Reflection**: Capability-adapted reflection prompts consolidating learning into immutable developmental records.

---

## 7. Security Architecture

1. **Zero Exposure of Private Keys**: `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and `OPENAI_API_KEY` are never prefixed with `NEXT_PUBLIC_`.
2. **Git Hygiene**: `.gitignore` explicitly blocks all `.env*` files, permitting only `.env.example`.
3. **Safe Environment Inspection**: `src/config/env.ts` provides diagnostic checks without exposing secret values or crashing during static builds.

---

## 8. Integration Plan for Subsequent Phases

| Phase | Planned Capabilities | Integration Touchpoints | Status |
|---|---|---|---|
| **Phase 1: Foundation** | Next.js 16, TypeScript, Supabase, AI Provider Layer | Core infrastructure and environment | **Completed** |
| **Phase 2: Auth & Onboarding** | User signup, profile completion, age check | Uses `src/lib/supabase/client.ts` and `profiles` table | **Completed** |
| **Phase 3: Capability Assessments** | Baseline scoring across the 3 capabilities | Uses `src/lib/ai/service.ts` for rubric evaluations | **Completed** |
| **Phase 4: Growth Journeys** | 7-stage user development roadmap | Uses Supabase for journeys, tasks, and state management | **Completed** |
| **Phase 5: AI Growth Coach** | Socratic coaching dialogues, guided reflection | Leverages `AIService` with specialized prompt templates | **Completed** |
| **Phase 6: Practical Challenges** | Creative problem-solving simulations & reflection | Interactive workspace, evaluation, reflection, and My Work | **Completed** |
| **Phase 7: Measurement & Portfolio** | Independence scoring, capability metrics, public showcase | Independence Engine, AI Classifier, Growth Portfolio | **Completed** |
| **Phase 8: Polish & Launch Readiness** | End-to-end integration, test suite, cross-device verification | Master E2E suite, 35/35 passing tests, competition demo guide | **Completed & Ready for Review** |
