# OBHASH — Production Deployment & Infrastructure Guide

**Project:** OBHASH  
**Team:** PastForward  
**Phase:** 8 of 8 (Integration, Testing & Competition Launch)  
**Target Environments:** Vercel (Recommended), Google Cloud Run, Self-Hosted Node.js  
**Database:** Supabase (PostgreSQL with Row Level Security)  

---

## 1. System Architecture & Prerequisites

OBHASH is built as a cloud-native Next.js 16 (App Router) web application. It is designed to run either in serverless environments (Vercel) or containerized environments (Google Cloud Run / Docker).

### Runtime Requirements
- **Node.js:** `>= 20.9.0` (LTS recommended)
- **Package Manager:** `npm >= 10.0.0`
- **PostgreSQL Database:** PostgreSQL 15+ (Hosted on Supabase)
- **External AI Provider (Optional):** Google Gemini API (`gemini-2.5-flash`) or OpenAI API

---

## 2. Environment Variable Configuration

Create a production `.env.production` or configure your host's secure environment manager:

```bash
# ==============================================================================
# APPLICATION CORE
# ==============================================================================
NODE_ENV="production"
PORT=3000
NEXT_PUBLIC_APP_URL="https://obhash.vercel.app"

# ==============================================================================
# DATABASE & AUTHENTICATION (SUPABASE)
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ==============================================================================
# AI PROVIDER CONFIGURATION
# ==============================================================================
AI_PROVIDER="gemini" # Options: gemini | openai | mock
GEMINI_API_KEY="AIzaSy..." # Required if AI_PROVIDER=gemini
AI_MODEL="gemini-2.5-flash"
AI_TIMEOUT_MS=15000

# ==============================================================================
# SECURITY & CORS
# ==============================================================================
SESSION_SECRET="generate-a-secure-random-64-character-hex-string"
```

> [!IMPORTANT]
> The platform includes built-in mock fallbacks for both Supabase and AI providers. If credentials are not supplied, OBHASH will operate deterministically using local session stores without crashing. For production launch, all Supabase and AI credentials must be provisioned.

---

## 3. Database Migration Sequence

OBHASH maintains seven immutable SQL migrations in [`supabase/migrations/`](file:///Users/kazi/Projects/OBHASH/supabase/migrations):

```bash
# Execute migrations in chronological order against your production Supabase database:
20261120000000_foundation_schema.sql         # Profiles, capabilities, baseline tables
20261120010000_assessment_schema.sql         # Assessment modules, questions, user evaluations
20261120020000_growth_journey_schema.sql     # Journeys, milestones, developmental goals
20261120030000_coaching_schema.sql           # Socratic coaching rooms, messages, hint logs
20261120040000_challenges_schema.sql         # Challenge catalog, submissions, reflections
20261120050000_ai_assistance_schema.sql      # AI interaction telemetry, classification logs
20261120060000_phase7_schema.sql             # Independence observations, portfolios, items
```

### Applying Migrations via Supabase CLI
```bash
npx supabase login
npx supabase link --project-ref your-project-id
npx supabase db push
```

### Verifying Row Level Security (RLS)
Ensure RLS is enabled on all tables:
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- Every table should have rowsecurity = true
```

---

## 4. Deployment Targets

### Option A: Vercel (Zero-Config Recommended)
1. Link GitHub repository to Vercel.
2. Select framework preset: **Next.js**.
3. Set Node.js version to **20.x**.
4. Configure environment variables in the Vercel Project Settings.
5. Deploy. Build command: `npm run build`.

### Option B: Google Cloud Run (Containerized)
1. Build container image:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/obhash-web
   ```
2. Deploy service:
   ```bash
   gcloud run deploy obhash-web \
     --image gcr.io/YOUR_PROJECT_ID/obhash-web \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 3000 \
     --set-env-vars NEXT_PUBLIC_APP_URL="https://your-domain.com"
   ```

---

## 5. Post-Deployment Verification & Smoke Testing

Immediately after deployment, execute the following smoke tests:

1. **System Health Check:**
   ```bash
   curl -i https://your-deployment-url/api/health
   # Expected response: HTTP 200 with JSON payload {"status": "operational" | "degraded"}
   ```
2. **Public Portfolio Resolution:**
   ```bash
   curl -i https://your-deployment-url/p/alex-chen
   # Expected response: HTTP 200 containing Alex Chen's portfolio
   ```
3. **Private Route Protection:**
   ```bash
   curl -i https://your-deployment-url/portfolio
   # Expected response: Redirect (HTTP 307) to /login or rendered authenticated state
   ```
4. **Offline Resilience Smoke Test:**
   - Temporarily disable AI keys to verify that `/assessment`, `/journey`, and `/coach` render deterministic fallbacks gracefully.
