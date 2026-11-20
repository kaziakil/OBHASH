-- ==============================================================================
-- OBHASH Phase 6 Schema Migration: Challenge & Reflection Workspace
-- Migration ID: 20261120050000_phase6_challenges.sql
-- ==============================================================================

-- 1. Challenges Master Catalog Table
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    detailed_instructions TEXT NOT NULL,
    capability_category TEXT NOT NULL CHECK (capability_category IN ('critical-thinking', 'creative-problem-solving', 'curiosity')),
    relevant_dimensions TEXT[] NOT NULL DEFAULT '{}'::text[],
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_completion_time TEXT NOT NULL,
    learning_objective TEXT NOT NULL,
    scenario TEXT NOT NULL,
    required_deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    suggested_thinking_steps TEXT[] NOT NULL DEFAULT '{}'::text[],
    optional_resources JSONB NOT NULL DEFAULT '[]'::jsonb,
    reflection_prompts TEXT[] NOT NULL DEFAULT '{}'::text[],
    version INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_challenges_capability ON public.challenges(capability_category);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON public.challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_is_published ON public.challenges(is_published);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Everyone can read published challenges; admins can manage
CREATE POLICY "Anyone can view published challenges"
    ON public.challenges
    FOR SELECT
    USING (is_published = true);

-- ------------------------------------------------------------------------------

-- 2. Challenge Versions Table
CREATE TABLE IF NOT EXISTS public.challenge_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(challenge_id, version)
);

CREATE INDEX IF NOT EXISTS idx_challenge_versions_challenge ON public.challenge_versions(challenge_id);

ALTER TABLE public.challenge_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenge versions"
    ON public.challenge_versions
    FOR SELECT
    USING (true);

-- ------------------------------------------------------------------------------

-- 3. Challenge Attempts Table
CREATE TABLE IF NOT EXISTS public.challenge_attempts (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    challenge_version INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'evaluating', 'evaluated', 'reflection_pending', 'completed', 'abandoned')),
    journey_activity_id TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    submitted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_challenge_attempts_user ON public.challenge_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_challenge ON public.challenge_attempts(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_status ON public.challenge_attempts(status);

ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own challenge attempts"
    ON public.challenge_attempts
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------

-- 4. Challenge Drafts Table (Work in Progress / Autosave)
CREATE TABLE IF NOT EXISTS public.challenge_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id TEXT NOT NULL REFERENCES public.challenge_attempts(id) ON DELETE CASCADE UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    notes TEXT NOT NULL DEFAULT '',
    deliverables JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_saved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_challenge_drafts_attempt ON public.challenge_drafts(attempt_id);
CREATE INDEX IF NOT EXISTS idx_challenge_drafts_user ON public.challenge_drafts(user_id);

ALTER TABLE public.challenge_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own drafts"
    ON public.challenge_drafts
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------

-- 5. Challenge Submissions Table (Immutable Record of Submitted Work)
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id TEXT NOT NULL REFERENCES public.challenge_attempts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    challenge_version INTEGER NOT NULL DEFAULT 1,
    notes_snapshot TEXT NOT NULL DEFAULT '',
    deliverables_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    submission_number INTEGER NOT NULL DEFAULT 1,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_challenge_submissions_attempt ON public.challenge_submissions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user ON public.challenge_submissions(user_id);

ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own challenge submissions"
    ON public.challenge_submissions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------

-- 6. Challenge Evaluations Table (Feedback & Evidence Grounding)
CREATE TABLE IF NOT EXISTS public.challenge_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES public.challenge_submissions(id) ON DELETE CASCADE,
    attempt_id TEXT NOT NULL REFERENCES public.challenge_attempts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    evaluator_type TEXT NOT NULL DEFAULT 'ai' CHECK (evaluator_type IN ('ai', 'deterministic_fallback', 'human_rubric')),
    evaluator_version TEXT NOT NULL DEFAULT '1.0',
    strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    growth_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
    evidence_citations JSONB NOT NULL DEFAULT '[]'::jsonb,
    alternative_perspectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_next_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    dimension_evaluations JSONB NOT NULL DEFAULT '{}'::jsonb,
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.90,
    evidence_sufficiency TEXT NOT NULL DEFAULT 'sufficient' CHECK (evidence_sufficiency IN ('sufficient', 'partial', 'insufficient')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_challenge_evaluations_submission ON public.challenge_evaluations(submission_id);
CREATE INDEX IF NOT EXISTS idx_challenge_evaluations_attempt ON public.challenge_evaluations(attempt_id);
CREATE INDEX IF NOT EXISTS idx_challenge_evaluations_user ON public.challenge_evaluations(user_id);

ALTER TABLE public.challenge_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenge evaluations"
    ON public.challenge_evaluations
    FOR SELECT
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------

-- 7. Challenge Reflections Table
CREATE TABLE IF NOT EXISTS public.challenge_reflections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id TEXT NOT NULL REFERENCES public.challenge_attempts(id) ON DELETE CASCADE UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_submitted BOOLEAN NOT NULL DEFAULT true,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_challenge_reflections_attempt ON public.challenge_reflections(attempt_id);
CREATE INDEX IF NOT EXISTS idx_challenge_reflections_user ON public.challenge_reflections(user_id);

ALTER TABLE public.challenge_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reflections"
    ON public.challenge_reflections
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------

-- 8. Challenge Bookmarks Table
CREATE TABLE IF NOT EXISTS public.challenge_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_bookmarks_user ON public.challenge_bookmarks(user_id);

ALTER TABLE public.challenge_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their bookmarks"
    ON public.challenge_bookmarks
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------

-- 9. Challenge AI Assistance Records Table (Transparency & Authorship Integrity)
CREATE TABLE IF NOT EXISTS public.challenge_ai_assistance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id TEXT NOT NULL REFERENCES public.challenge_attempts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    coaching_session_id UUID REFERENCES public.coaching_sessions(id) ON DELETE SET NULL,
    queries_count INTEGER NOT NULL DEFAULT 0,
    hint_levels_used INTEGER[] NOT NULL DEFAULT '{}'::int[],
    action_types_used TEXT[] NOT NULL DEFAULT '{}'::text[],
    assistance_summary TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_challenge_ai_assistance_attempt ON public.challenge_ai_assistance_records(attempt_id);
CREATE INDEX IF NOT EXISTS idx_challenge_ai_assistance_user ON public.challenge_ai_assistance_records(user_id);

ALTER TABLE public.challenge_ai_assistance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their challenge AI assistance records"
    ON public.challenge_ai_assistance_records
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
