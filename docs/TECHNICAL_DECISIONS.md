# OBHASH Technical Decisions & Architecture Rationale

**Phase:** 1 of 8  
**Team:** PastForward  
**Date:** November 2026

---

## 1. Technology Choices & Justifications

### 1.1 Next.js 16 (App Router) & React 19
- **Decision**: Adopt Next.js 16 with App Router, Turbopack, and React 19.
- **Rationale**:
  - Full-stack unified architecture eliminating the need for a separate frontend and backend repository during early phases.
  - Native React Server Components (RSC) drastically reduce client-side bundle size and protect server logic.
  - Route Handlers (`src/app/api/...`) provide standard REST API capabilities.
  - First-class Vercel compatibility ensuring immediate deployment readiness.
- **Alternatives Considered**:
  - Vite + Express: Rejected because it introduces dual-deployment overhead, CORS configuration complexity, and fragmented type definitions.

### 1.2 TypeScript 5 (Strict Mode)
- **Decision**: Enforce TypeScript in strict mode across the entire codebase.
- **Rationale**:
  - Provides compile-time safety across database entities, API envelopes, and AI prompt/response structures.
  - Minimizes runtime bugs in human capability evaluations.

### 1.3 Tailwind CSS 4
- **Decision**: Use Tailwind CSS 4 with `@tailwindcss/turbopack`.
- **Rationale**:
  - High compilation speed in development with Turbopack.
  - Eliminates context switching and oversized CSS bundles.
  - Simplifies design system token management for accessible color schemes.

### 1.4 Supabase (PostgreSQL + Auth + RLS)
- **Decision**: Select Supabase with `@supabase/ssr` for database and authentication foundation.
- **Rationale**:
  - PostgreSQL offers relational integrity required for capability frameworks, assessment rubrics, and user progress tracking.
  - Row Level Security (RLS) guarantees data isolation directly at the database engine level.
  - `@supabase/ssr` manages secure HTTP-only cookies in Next.js Server Components and Route Handlers without client token leakage.
- **Alternatives Considered**:
  - MongoDB / NoSQL: Rejected because human capability development models and user journeys are inherently relational.

### 1.5 Provider-Independent AI Service Architecture
- **Decision**: Implement an adapter-based AI service (`AIService`) in `src/lib/ai/` rather than coupling directly to a single provider SDK.
- **Rationale**:
  - Protects the project against provider pricing changes, rate-limit fluctuations, or model deprecations.
  - Supports Google Gemini (via `@google/genai`) as primary baseline with seamless extensibility for OpenAI or self-hosted models.
  - Enforces mandatory request timeouts (`AbortSignal`) to avoid stalled user experiences.
  - Isolates AI prompts and keys strictly to server runtime.
- **Alternatives Considered**:
  - Direct LangChain or Heavy AI Orchestration Frameworks: Rejected for Phase 1 as unnecessary abstraction/overhead. A lean, strongly-typed adapter pattern provides transparency, performance, and control.

### 1.6 Schema Validation with Zod
- **Decision**: Use Zod for environment variable validation and future API request/response parsing.
- **Rationale**:
  - Lightweight, zero-dependency schema validation that produces static TypeScript types automatically.
  - Allows safe non-crashing inspection of missing environment variables for health checks.

---

## 2. Dependencies Introduced

| Dependency | Purpose | Security / Footprint Note |
|---|---|---|
| `next` (16.4.6) | Core application framework | Official Vercel release |
| `react` / `react-dom` (19.3.0) | UI runtime | Official React release |
| `@supabase/supabase-js` | Supabase SDK | Official Supabase client |
| `@supabase/ssr` | Next.js SSR cookie handling | Official Supabase SSR package |
| `@google/genai` | Google Gemini API SDK | Official Google GenAI SDK |
| `zod` | Input and environment validation | Zero-dependency, lightweight |
| `clsx` / `tailwind-merge` | Conditional class merging | Standard utility for Tailwind |

---

## 3. Row Level Security (RLS) Strategy

All tables must enforce RLS:
1. `public.profiles`: `auth.uid() = id` (User can read and edit only their own profile).
2. `public.capabilities`: Active capabilities are publicly readable; modification is restricted to admin service role.
3. `public.audit_logs`: User can query only their own audit logs; insertion allowed only when `auth.uid() = user_id`.

---

## 4. Outstanding Questions & Recommendations for Phase 2

1. **Authentication Providers**: Decide which OAuth providers (Google, GitHub) to enable alongside Email/Password in Supabase Auth.
2. **Age Verification Pattern**: Confirm the exact onboarding verification mechanism for the 18–30 age group.
3. **AI Model Selection**: Benchmark `gemini-2.5-flash` vs `gemini-2.5-pro` for latency vs reasoning depth in capability assessments.
