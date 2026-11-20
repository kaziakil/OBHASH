# OBHASH — Human-Centered Intelligence Platform

**Phase:** Phase 2 of 8 (User Experience & Onboarding)  
**Team:** PastForward  
**Philosophy:** Human-Centered Intelligence  
**Target Audience:** Ages 18–30  
**Status:** Phase 2 Complete — Ready for Review  

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
| **Language** | TypeScript | 5.9.3 | Strict end-to-end typing across DB, API, and UI |
| **Styling** | Tailwind CSS | 4.3.3 | Modern utility styling with `@tailwindcss/turbopack` |
| **UI Components** | React & React DOM | 19.3.0 | Accessible components, React Server Components |
| **Database** | Supabase (PostgreSQL) | Latest | Relational database with Row Level Security (RLS) |
| **Authentication** | Supabase Auth (`@supabase/ssr`) | Latest | Secure cookie-based SSR session management |
| **AI Integration** | Server-side LLM Layer | Modular | Provider-agnostic adapter (Google Gemini / OpenAI compatible) |
| **Validation** | Zod | 3.24.2 | Schema-driven environment and request validation |
| **Deployment** | Vercel-compatible | — | Edge-ready serverless/Node.js hosting |

---

## 3. Quick Start

### 3.1 Install Dependencies
```bash
git clone <repo-url>
cd OBHASH
npm install
```

### 3.2 Configure Environment
```bash
cp .env.example .env.local
```
Add your Supabase project URL and anon key:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-key
AI_PROVIDER=gemini
```

### 3.3 Apply Database Migrations
Run the migrations in `supabase/migrations/` using Supabase CLI or the Supabase SQL Editor:
- `20261120000000_initial_schema.sql` (Phase 1: Profiles, Capabilities, Audit Logs, RLS)
- `20261120010000_phase2_profiles.sql` (Phase 2: Display name, Interests, Growth intentions, Trigger)

### 3.4 Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 4. Key Routes Implemented

- **Public Landing Page**: [`/`](http://localhost:3000/) — Complete brand presentation, philosophy, approach, 3 capabilities, and 7-stage framework.
- **Sign In**: [`/login`](http://localhost:3000/login) — Supabase Auth login.
- **Sign Up**: [`/signup`](http://localhost:3000/signup) — Supabase Auth registration.
- **Password Recovery**: [`/forgot-password`](http://localhost:3000/forgot-password) — Password reset request.
- **User Onboarding**: [`/onboarding`](http://localhost:3000/onboarding) — 5-step conversational onboarding flow.
- **User Dashboard**: [`/dashboard`](http://localhost:3000/dashboard) — Authenticated personal home, capability preview, and next-step prompt.
- **User Settings**: [`/settings`](http://localhost:3000/settings) — Profile editing, interests, growth intentions, and sign out.
- **System Health**: [`/api/health`](http://localhost:3000/api/health) — Diagnostic status of services.
- **AI Connectivity**: [`/api/ai/test`](http://localhost:3000/api/ai/test) — AI adapter test route.

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

## 6. Documentation Index

- [User Experience Guide](file:///Users/kazi/Projects/OBHASH/docs/USER_EXPERIENCE.md)
- [Database & Schema Reference](file:///Users/kazi/Projects/OBHASH/docs/DATABASE.md)
- [Authentication Architecture](file:///Users/kazi/Projects/OBHASH/docs/AUTHENTICATION.md)
- [System Architecture](file:///Users/kazi/Projects/OBHASH/docs/ARCHITECTURE.md)
- [Local Setup Guide](file:///Users/kazi/Projects/OBHASH/docs/SETUP.md)
- [Environment Configuration](file:///Users/kazi/Projects/OBHASH/docs/ENVIRONMENT.md)
- [Technical Decisions](file:///Users/kazi/Projects/OBHASH/docs/TECHNICAL_DECISIONS.md)
