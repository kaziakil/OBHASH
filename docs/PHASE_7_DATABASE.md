# OBHASH Phase 7 Database Architecture

## 1. Migration File

`supabase/migrations/20261120060000_phase7_portfolio_independence.sql`

This migration provisions eight primary tables supporting transparent independence measurement and user-controlled growth portfolios.

---

## 2. Table Specifications

### 2.1 `independence_framework_versions`
Stores the active framework configuration version.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `version_code TEXT NOT NULL UNIQUE` (e.g. '1.0.0')
- `name TEXT NOT NULL`
- `description TEXT`
- `is_active BOOLEAN NOT NULL DEFAULT true`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### 2.2 `independence_dimensions`
Defines the five operational dimensions seeded for v1.0.0.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `framework_version_id UUID REFERENCES independence_framework_versions(id) ON DELETE CASCADE`
- `dimension_key TEXT NOT NULL` (`independent-reasoning`, `self-directed-exploration`, `independent-problem-solving`, `thoughtful-ai-use`, `reflection-self-direction`)
- `title TEXT NOT NULL`
- `description TEXT NOT NULL`
- `observable_behavior_indicators JSONB NOT NULL DEFAULT '[]'`
- `order_index INT NOT NULL DEFAULT 0`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### 2.3 `independence_observations`
Individual verifiable behavior observations linked to authentic evidence.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `dimension_key TEXT NOT NULL`
- `behavior_key TEXT NOT NULL`
- `behavior_description TEXT NOT NULL`
- `source_type TEXT NOT NULL` (`challenge_submission`, `challenge_reflection`, `assessment_evaluation`, `coaching_session`)
- `source_record_id TEXT NOT NULL`
- `source_title TEXT NOT NULL`
- `evidence_quote TEXT`
- `evidence_analysis TEXT`
- `ai_assistance_classification TEXT NOT NULL DEFAULT 'Level E'`
- `ai_assistance_notes TEXT`
- `confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.85`
- `observed_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### 2.4 `independence_measurement_snapshots`
Immutable historical measurement snapshots preserving diagnostic evolution.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `framework_version TEXT NOT NULL DEFAULT '1.0.0'`
- `dimension_snapshots JSONB NOT NULL DEFAULT '{}'`
- `ai_assistance_breakdown JSONB NOT NULL DEFAULT '{}'`
- `development_narrative TEXT NOT NULL`
- `limitations_notice TEXT NOT NULL`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### 2.5 `portfolios`
Root entity for user-controlled growth showcases.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE`
- `public_slug TEXT NOT NULL UNIQUE`
- `display_name TEXT NOT NULL`
- `headline TEXT`
- `personal_introduction TEXT`
- `learning_philosophy TEXT`
- `areas_of_interest TEXT[] NOT NULL DEFAULT '{}'`
- `is_published BOOLEAN NOT NULL DEFAULT false`
- `visibility TEXT NOT NULL DEFAULT 'private'` (`private`, `unlisted`, `public`)
- `published_at TIMESTAMPTZ`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### 2.6 `portfolio_sections`
Structured configurable sections.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE`
- `section_type TEXT NOT NULL` (`personal_intro`, `capability_overview`, `featured_work`, `development_journey`, `thoughtful_ai_use`, `personal_reflections`)
- `title TEXT NOT NULL`
- `subtitle TEXT`
- `is_visible BOOLEAN NOT NULL DEFAULT true`
- `order_index INT NOT NULL DEFAULT 0`
- `custom_notes TEXT`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### 2.7 `portfolio_items`
Explicit items featured within sections.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE`
- `section_id UUID NOT NULL REFERENCES portfolio_sections(id) ON DELETE CASCADE`
- `source_type TEXT NOT NULL` (`challenge_submission`, `challenge_reflection`, `assessment_achievement`, `journey_milestone`, `custom_project`)
- `source_record_id TEXT`
- `title TEXT NOT NULL`
- `description TEXT NOT NULL`
- `capability_key TEXT`
- `dimensions TEXT[] NOT NULL DEFAULT '{}'`
- `user_reflection TEXT`
- `ai_assistance_level TEXT NOT NULL DEFAULT 'Level A'`
- `ai_assistance_disclosure TEXT`
- `artifacts JSONB NOT NULL DEFAULT '[]'`
- `order_index INT NOT NULL DEFAULT 0`
- `is_featured BOOLEAN NOT NULL DEFAULT false`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### 2.8 `portfolio_publication_settings`
Visibility and sharing controls.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE UNIQUE`
- `allow_search_indexing BOOLEAN NOT NULL DEFAULT false`
- `show_capability_badges BOOLEAN NOT NULL DEFAULT true`
- `show_ai_disclosures BOOLEAN NOT NULL DEFAULT true`
- `show_reflections BOOLEAN NOT NULL DEFAULT true`
- `show_journey_timeline BOOLEAN NOT NULL DEFAULT true`
- `custom_share_message TEXT`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

---

## 3. Indexes & Constraints

```sql
CREATE INDEX IF NOT EXISTS idx_independence_obs_user_dim ON public.independence_observations(user_id, dimension_key);
CREATE INDEX IF NOT EXISTS idx_independence_obs_source ON public.independence_observations(source_type, source_record_id);
CREATE INDEX IF NOT EXISTS idx_independence_snapshots_user ON public.independence_measurement_snapshots(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_user ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_public_slug ON public.portfolios(public_slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_portfolio ON public.portfolio_sections(portfolio_id, order_index);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_portfolio ON public.portfolio_items(portfolio_id, section_id, order_index);
```
