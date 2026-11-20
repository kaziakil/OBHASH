# OBHASH Database & Schema Reference

**Phase:** 2 of 8  
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
