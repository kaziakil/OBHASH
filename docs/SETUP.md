# OBHASH Local Setup Guide

**Phase:** 1 of 8  
**Scope:** Local Development Environment Setup

---

## 1. Prerequisites

Before setting up the project, ensure your environment has:
- **Node.js**: v20.x or higher (recommended: Node 22+ or 24+)
- **Package Manager**: `npm` (v11+), `pnpm` (v12+), or `yarn`
- **Git**: Installed and authenticated

Check your versions:
```bash
node -v
npm -v
git --version
```

---

## 2. Installation Steps

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd OBHASH
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to create your local `.env.local` configuration:
```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and configure the parameters:

#### A. Application Basics
```ini
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### B. Supabase Configuration (Optional for initial UI testing, required for database operations)
1. Sign in to [Supabase](https://supabase.com) and create or open your project.
2. In Project Settings → **API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`
3. Paste these values into `.env.local`.

#### C. AI Provider Configuration (Optional for initial UI testing, required for AI calls)
1. Obtain an API key from Google AI Studio ([https://aistudio.google.com/](https://aistudio.google.com/)) or OpenAI.
2. Configure `.env.local`:
```ini
AI_PROVIDER=gemini
AI_MODEL_NAME=gemini-2.5-flash
AI_TIMEOUT_MS=30000
GEMINI_API_KEY=your-actual-gemini-key
```

---

## 3. Applying Database Migrations (Supabase)

Once your Supabase project is created:
1. Navigate to the SQL Editor in your Supabase dashboard.
2. Copy the contents of `supabase/migrations/20261120000000_initial_schema.sql`.
3. Execute the script to create the `profiles`, `capabilities`, and `audit_logs` tables and configure RLS policies.

---

## 4. Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Verification Commands

Run the full verification suite locally:

```bash
# 1. Type safety check
npm run typecheck

# 2. Linting check
npm run lint

# 3. Production build verification
npm run build

# 4. Start production server locally
npm run start
```

---

## 6. Verifying API Endpoints

Once the dev server is running:

1. **System Health Check**:
   Open [http://localhost:3000/api/health](http://localhost:3000/api/health).
   Expected: JSON payload indicating operational status of Next.js, Supabase, and AI layers.

2. **AI Provider Roundtrip**:
   Open [http://localhost:3000/api/ai/test](http://localhost:3000/api/ai/test).
   - If `GEMINI_API_KEY` is provided: Returns `connectivity: "connected"` with measured latency.
   - If `GEMINI_API_KEY` is missing: Returns `connectivity: "unconnected"` with instructions on how to activate it.
