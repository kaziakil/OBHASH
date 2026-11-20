# Supabase Database Migrations

This directory contains the database migrations for OBHASH.

## Migration Convention

Migrations are located in `supabase/migrations/` and follow the timestamp naming convention:
`<YYYYMMDDHHMMSS>_<descriptive_name>.sql`

### Current Migrations

1. `20261120000000_initial_schema.sql`:
   - Creates `public.profiles` linked to `auth.users` with RLS.
   - Creates `public.capabilities` with seeds for the three core capabilities:
     1. Critical Thinking
     2. Creative Problem-Solving
     3. Curiosity
   - Creates `public.audit_logs` for activity tracking with RLS.
   - Enforces Row Level Security (RLS) on all tables with explicit user-isolation policies.

## How to Apply Migrations

### Option 1: Supabase CLI (Recommended)
```bash
# Link project
npx supabase link --project-ref your-project-id

# Push migrations to remote database
npx supabase db push
```

### Option 2: Supabase Web Dashboard
1. Log in to your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Open `supabase/migrations/20261120000000_initial_schema.sql`.
4. Run the SQL script.
