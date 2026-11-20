# OBHASH Architecture Guide

**Phase:** 1 of 8  
**Document Status:** Complete & Active

---

## 1. System Overview

OBHASH is engineered as a full-stack, modular web application using Next.js 16 (App Router), TypeScript, Supabase, and a server-side provider-independent AI layer.

The design emphasizes:
- **Human-Centered Intelligence**: Strengthening human agency rather than automating cognitive effort away.
- **Clean Boundaries**: Strict separation between presentation, application logic, persistence, and external AI services.
- **Zero-Leak Security**: Secrets and privileged database capabilities are confined strictly to server-side runtimes.
- **Phase-Ready Extensibility**: Foundations built in Phase 1 support seamless integration of upcoming modules (Assessments, AI Coach, Journeys, Reflection).

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

---

## 7. Security Architecture

1. **Zero Exposure of Private Keys**: `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and `OPENAI_API_KEY` are never prefixed with `NEXT_PUBLIC_`.
2. **Git Hygiene**: `.gitignore` explicitly blocks all `.env*` files, permitting only `.env.example`.
3. **Safe Environment Inspection**: `src/config/env.ts` provides diagnostic checks without exposing secret values or crashing during static builds.

---

## 8. Integration Plan for Subsequent Phases

| Phase | Planned Capabilities | Integration Touchpoints |
|---|---|---|
| **Phase 2: Auth & Onboarding** | User signup, profile completion, age check | Uses `src/lib/supabase/client.ts` and `profiles` table |
| **Phase 3: Capability Assessments** | Baseline scoring across the 3 capabilities | Uses `src/lib/ai/service.ts` for rubric evaluations |
| **Phase 4: Growth Journeys** | 7-stage user development roadmap | Uses Supabase for journeys, tasks, and state management |
| **Phase 5: AI Growth Coach** | Socratic coaching dialogues, guided reflection | Leverages `AIService` with specialized prompt templates |
| **Phase 6: Practical Challenges** | Creative problem-solving simulations | Interactive client components backed by AI evaluator |
| **Phase 7: Measurement & Portfolio** | Independence scoring, capability metrics | Analyzes user session telemetry and audit logs |
| **Phase 8: Polish & Launch Readiness** | Production hardening, performance audits | Leverages baseline logging and health checks |
