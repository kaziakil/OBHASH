# OBHASH Database & Schema Reference

**Phase:** 6 of 8  
**Storage Engine:** Supabase PostgreSQL  
**Access Model:** Row Level Security (RLS)  

---

## 1. Schema Overview

The database stores user profiles, capability definitions, and audit records with strict user isolation enforced directly by the database engine.

```
       ┌────────────────────────┐
       │      auth.users        │ (Supabase Managed)
       └───────────┬────────────┘
                   │
                   │ (1 : 1, on delete cascade)
                   ▼
       ┌────────────────────────┐
       │    public.profiles     │ (User profile & onboarding data)
       └────────────────────────┘
                   │
                   │ (1 : N)
                   ▼
       ┌────────────────────────┐
       │   public.audit_logs    │ (User action audit trails)
       └────────────────────────┘
```

---

## 2. Table Specifications

### 2.1 `public.profiles`

Stores user profile information, learning preferences, and onboarding completion state.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE` | Matches Supabase Auth user ID |
| `email` | `TEXT` | `NOT NULL` | User primary email address |
| `display_name` | `TEXT` | `NULLABLE` | Preferred name chosen by user |
| `full_name` | `TEXT` | `NULLABLE` | Optional full name |
| `bio` | `TEXT` | `NULLABLE` | User personal introduction |
| `avatar_url` | `TEXT` | `NULLABLE` | Optional profile image URL |
| `target_age_group` | `TEXT` | `DEFAULT '18-30'` | Audience cohort indicator |
| `interests` | `TEXT[]` | `DEFAULT '{}'::text[]` | Selected learning interest categories |
| `growth_intentions`| `TEXT[]` | `DEFAULT '{}'::text[]` | Selected capability growth priorities |
| `onboarding_completed`| `BOOLEAN`| `NOT NULL DEFAULT false` | Status of onboarding wizard completion |
| `preferred_language`| `TEXT` | `NOT NULL DEFAULT 'en'` | UI language preference ('en' or 'bn') |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT now()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT now()` | Last modification timestamp |

### 2.2 `public.capabilities`

Master catalog of human capability domains.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT uuid_generate_v4()` | Unique capability identifier |
| `slug` | `TEXT` | `NOT NULL UNIQUE` | URL-safe slug (`critical-thinking`, etc.) |
| `name` | `TEXT` | `NOT NULL` | Human-readable capability title |
| `description` | `TEXT` | `NOT NULL` | Foundational capability description |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT true` | Active flag |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT now()` | Creation timestamp |

### 2.3 `public.audit_logs`

Immutable security and session audit events.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT uuid_generate_v4()` | Unique audit record identifier |
| `user_id` | `UUID` | `REFERENCES auth.users(id) ON DELETE SET NULL` | Responsible user |
| `action` | `TEXT` | `NOT NULL` | Event action name |
| `resource` | `TEXT` | `NOT NULL` | Affected system resource |
| `metadata` | `JSONB` | `NULLABLE` | Event context and parameters |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL DEFAULT now()` | Event timestamp |

---

## 3. Row Level Security (RLS) Policies

Every table has Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

### 3.1 Profiles Security
- **SELECT**: `auth.uid() = id` (Users can only query their own profile).
- **INSERT**: `auth.uid() = id` (Users can only insert their own record).
- **UPDATE**: `auth.uid() = id` with check `auth.uid() = id` (Users can only update their own record).
- Cross-user profile access is forbidden by database policy.

### 3.2 Automated Profile Creation Trigger
To prevent race conditions where a user account exists in `auth.users` without a corresponding `public.profiles` row:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, full_name, onboarding_completed, preferred_language)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        false,
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. Migrations History

1. `20261120000000_initial_schema.sql` (Phase 1):
   - Created `profiles`, `capabilities`, `audit_logs` tables.
   - Seeded initial 3 capabilities.
   - Enabled RLS across all tables.
2. `20261120010000_phase2_profiles.sql` (Phase 2):
   - Added `display_name`, `bio`, `interests`, `growth_intentions`, `onboarding_completed`, `preferred_language`.
   - Added user signup trigger `handle_new_user()`.
   - Added index on `onboarding_completed`.
3. `20261120020000_phase3_assessments.sql` (Phase 3):
   - Created `assessment_modules` (modules and capability keys).
   - Created `assessment_dimensions` (dimensions per module).
   - Created `assessment_items` (activities, scenarios, and rubrics).
   - Created `assessment_attempts` (user test sessions).
   - Created `assessment_responses` (user answers).
   - Created `assessment_evaluations` (rubric score records).
   - Created `capability_profiles` (aggregated capability baselines).
   - Enforced Row Level Security (RLS) on all assessment tables (`auth.uid() = user_id`).
4. `20261120030000_phase4_growth_journeys.sql` (Phase 4):
   - Created `growth_journeys` (user journey headers, durations, statuses).
   - Created `journey_capability_focus_areas` (selected capabilities, rationales, outcomes).
   - Created `development_goals` (prioritized capability targets and transparent reasons).
   - Created `journey_milestones` (sequential stage checkpoints).
   - Created `planned_activities` (bite-sized 15-30m practice exercises).
   - Created `journey_generation_records` (LLM & deterministic engine audit logs).
   - Enforced Row Level Security (RLS) on all growth journey entities.
5. `20261120040000_phase5_ai_coach.sql` (Phase 5):
   - Created `coaching_sessions` (active and historical coaching engagements).
   - Created `coaching_messages` (multi-turn Socratic interaction logs with hint levels and response types).
   - Created `coaching_session_summaries` (grounded session syntheses, breakthroughs, insights, and next steps).
   - Created `coaching_session_context_snapshots` (learner baseline and goal state captured at session start).
   - Enforced Row Level Security (RLS) on all coaching entities (`auth.uid() = user_id`).
   - Detailed schema reference documented in [Coaching Database Schema](file:///Users/kazi/Projects/OBHASH/docs/COACHING_DATABASE.md).
6. `20261120050000_phase6_challenges.sql` (Phase 6):
   - Created `challenges` (master challenge library across 3 capabilities and 3 difficulty tiers).
   - Created `challenge_versions` (immutable challenge content version snapshots).
   - Created `challenge_attempts` (user practice sessions and lifecycle states).
   - Created `challenge_drafts` (continuous autosave state for notes and deliverables).
   - Created `challenge_submissions` (immutable snapshot of submitted work).
   - Created `challenge_evaluations` (evidence-grounded rubric evaluations, citations, and guidance).
   - Created `challenge_reflections` (metacognitive reflection records).
   - Created `challenge_bookmarks` (user saved challenges).
   - Created `challenge_ai_assistance_records` (auditable logs of AI consultations, hint levels, and action types).
   - Enforced Row Level Security (RLS) on all user data (`auth.uid() = user_id`).
   - Detailed schema reference documented in [Challenge Database Schema](file:///Users/kazi/Projects/OBHASH/docs/CHALLENGE_DATABASE.md).
