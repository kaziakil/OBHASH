# OBHASH — Human-Centered Intelligence Platform

**Phase:** Phase 5 of 8 (AI Growth Coach)  
**Team:** PastForward  
**Philosophy:** Human-Centered Intelligence  
**Target Audience:** Ages 18–30  
**Status:** Phase 5 Complete — Ready for Review  

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
| **Personalization Engine** | Hybrid Rule & AI Generator | Dual-engine | AI contextualization with deterministic pedagogical fallback |
| **Evaluation Engine** | Rubric-based Evaluator | Dual-engine | AI rubric evaluation with deterministic fallback engine |
| **Validation** | Zod | 3.24.2 | Schema-driven environment, request, and AI output validation |
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
- `20261120020000_phase3_assessments.sql` (Phase 3: Assessment modules, Dimensions, Items, Attempts, Responses, Evaluations, Baseline Profiles)
- `20261120030000_phase4_growth_journeys.sql` (Phase 4: Growth journeys, Focus areas, Goals, Milestones, Activities, Generation records)
- `20261120040000_phase5_ai_coach.sql` (Phase 5: Coaching sessions, Messages, Summaries, Context snapshots)

### 3.4 Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 4. Key Routes Implemented

### 4.1 Marketing & Public Experience
- **Public Landing Page**: [`/`](http://localhost:3000/) — Complete brand presentation, philosophy, approach, 3 capabilities, and 7-stage framework.
- **Sign In**: [`/login`](http://localhost:3000/login) — Supabase Auth login.
- **Sign Up**: [`/signup`](http://localhost:3000/signup) — Supabase Auth registration.
- **Password Recovery**: [`/forgot-password`](http://localhost:3000/forgot-password) — Password reset request.

### 4.2 Onboarding & User Experience
- **User Onboarding**: [`/onboarding`](http://localhost:3000/onboarding) — 5-step conversational onboarding flow.
- **User Dashboard**: [`/dashboard`](http://localhost:3000/dashboard) — Authenticated personal home, active growth journey widget, capability baseline preview, real-time assessment status, and quick practice actions.
- **User Settings**: [`/settings`](http://localhost:3000/settings) — Profile editing, interests, growth intentions, and sign out.

### 4.3 Phase 3: Capability Assessment Engine
- **Assessment Hub**: [`/assessment`](http://localhost:3000/assessment) — Assessment overview, methodology, capability module selector, and attempt history.
- **Activity Runner**: [`/assessment/[module]`](http://localhost:3000/assessment/critical-thinking) — Interactive, unassisted assessment runner supporting multi-part prompts, word counts, autosave, and direct evaluation submission.
  - Critical Thinking: [`/assessment/critical-thinking`](http://localhost:3000/assessment/critical-thinking)
  - Creative Problem-Solving: [`/assessment/creative-problem-solving`](http://localhost:3000/assessment/creative-problem-solving)
  - Curiosity: [`/assessment/curiosity`](http://localhost:3000/assessment/curiosity)
- **Results Dashboard**: [`/assessment/results/[attemptId]`](http://localhost:3000/assessment/results/demo) — Transparent 4-level rubric evaluation breakdown with dimension scores, evidence citations, primary strengths, and developmental opportunities.

### 4.4 Phase 4: Personalized Growth Journey
- **Journey Hub**: [`/journey`](http://localhost:3000/journey) — Overview of current active journey, next planned activity, upcoming milestone, and historical journey archives.
- **Design Journey**: [`/journey/create`](http://localhost:3000/journey/create) — Interactive journey creation flow integrating assessment baseline evidence, duration, weekly commitment, proposal review, and customization.
- **Journey Details**: [`/journey/[journeyId]`](http://localhost:3000/journey/demo-journey-1) — Full hierarchical view of focus areas, goals, milestones, and planned activities with interactive status management.
- **Goal Deep Dive**: [`/journey/[journeyId]/goals/[goalId]`](http://localhost:3000/journey/demo-journey-1/goals/goal-ct-1) — Transparent recommendation explanations, evidence citations, and milestone practice breakdown.

### 4.5 Phase 5: AI Growth Coach
- **Coaching Hub**: [`/coach`](http://localhost:3000/coach) — Active & recent session roster, mode selectors (Critical Thinking, Creative Problem-Solving, Curiosity), and quick goal-linked coaching triggers.
- **Coaching Room**: [`/coach/[sessionId]`](http://localhost:3000/coach/demo-coach-session-1) — Real-time Socratic thinking partner environment featuring 4-tier progressive hints, contextual inquiry actions (explain, explore perspective, challenge assumptions), sliding context snapshot, and grounded session summaries.

### 4.6 Diagnostic & API Routes
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

- [AI Growth Coach Architecture](file:///Users/kazi/Projects/OBHASH/docs/AI_GROWTH_COACH_ARCHITECTURE.md)
- [Coaching Framework Specification](file:///Users/kazi/Projects/OBHASH/docs/COACHING_FRAMEWORK.md)
- [Socratic Coaching Prompts](file:///Users/kazi/Projects/OBHASH/docs/COACHING_PROMPTS.md)
- [Coaching Database Schema](file:///Users/kazi/Projects/OBHASH/docs/COACHING_DATABASE.md)
- [Coaching Safety and Reliability Guide](file:///Users/kazi/Projects/OBHASH/docs/COACHING_SAFETY_AND_RELIABILITY.md)
- [Growth Journey Architecture](file:///Users/kazi/Projects/OBHASH/docs/GROWTH_JOURNEY_ARCHITECTURE.md)
- [Growth Journey Framework](file:///Users/kazi/Projects/OBHASH/docs/GROWTH_JOURNEY_FRAMEWORK.md)
- [Personalization Engine Specification](file:///Users/kazi/Projects/OBHASH/docs/PERSONALIZATION_ENGINE.md)
- [Growth Journey Database Schema](file:///Users/kazi/Projects/OBHASH/docs/GROWTH_JOURNEY_DATABASE.md)
- [Assessment Framework](file:///Users/kazi/Projects/OBHASH/docs/ASSESSMENT_FRAMEWORK.md)
- [Assessment Rubrics Specification](file:///Users/kazi/Projects/OBHASH/docs/ASSESSMENT_RUBRICS.md)
- [Assessment Content Bank](file:///Users/kazi/Projects/OBHASH/docs/ASSESSMENT_CONTENT.md)
- [Assessment Engine Architecture](file:///Users/kazi/Projects/OBHASH/docs/ASSESSMENT_ENGINE.md)
- [User Experience Guide](file:///Users/kazi/Projects/OBHASH/docs/USER_EXPERIENCE.md)
- [Database & Schema Reference](file:///Users/kazi/Projects/OBHASH/docs/DATABASE.md)
- [Authentication Architecture](file:///Users/kazi/Projects/OBHASH/docs/AUTHENTICATION.md)
- [System Architecture](file:///Users/kazi/Projects/OBHASH/docs/ARCHITECTURE.md)
- [Local Setup Guide](file:///Users/kazi/Projects/OBHASH/docs/SETUP.md)
- [Environment Configuration](file:///Users/kazi/Projects/OBHASH/docs/ENVIRONMENT.md)
- [Technical Decisions](file:///Users/kazi/Projects/OBHASH/docs/TECHNICAL_DECISIONS.md)
