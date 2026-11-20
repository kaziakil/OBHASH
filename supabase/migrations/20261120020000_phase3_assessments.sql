-- ==============================================================================
-- OBHASH Phase 3 Schema Migration: Capability Assessment Engine
-- Migration ID: 20261120020000_phase3_assessments.sql
-- ==============================================================================

-- 1. Assessment Modules Table
CREATE TABLE IF NOT EXISTS public.assessment_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE, -- 'critical-thinking', 'creative-problem-solving', 'curiosity'
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    capability_key TEXT NOT NULL,
    estimated_minutes INTEGER NOT NULL DEFAULT 10,
    version TEXT NOT NULL DEFAULT '1.0.0',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on slug
CREATE INDEX IF NOT EXISTS idx_assessment_modules_slug ON public.assessment_modules(slug);

-- Enable RLS
ALTER TABLE public.assessment_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active assessment modules"
    ON public.assessment_modules
    FOR SELECT
    USING (is_active = true);

-- ------------------------------------------------------------------------------
-- 2. Assessment Dimensions Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessment_dimensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.assessment_modules(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    rubric_version TEXT NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(module_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_assessment_dimensions_module ON public.assessment_dimensions(module_id);

ALTER TABLE public.assessment_dimensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view assessment dimensions"
    ON public.assessment_dimensions
    FOR SELECT
    USING (true);

-- ------------------------------------------------------------------------------
-- 3. Assessment Items Table (Activities and Questions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.assessment_modules(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES public.assessment_dimensions(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    title TEXT NOT NULL,
    scenario TEXT NOT NULL,
    instructions TEXT NOT NULL,
    response_type TEXT NOT NULL, -- 'structured-reasoning', 'short-text', 'long-text', 'multiple-choice', 'multiple-select'
    options JSONB,
    rubric JSONB NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    version TEXT NOT NULL DEFAULT '1.0.0',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_assessment_items_module ON public.assessment_items(module_id);
CREATE INDEX IF NOT EXISTS idx_assessment_items_order ON public.assessment_items(order_index);

ALTER TABLE public.assessment_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active assessment items"
    ON public.assessment_items
    FOR SELECT
    USING (is_active = true);

-- ------------------------------------------------------------------------------
-- 4. Assessment Attempts Table (User Test Sessions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.assessment_modules(id) ON DELETE CASCADE,
    assessment_version TEXT NOT NULL DEFAULT '1.0.0',
    status TEXT NOT NULL DEFAULT 'in-progress', -- 'in-progress', 'completed', 'abandoned'
    evaluation_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'evaluating', 'completed', 'error'
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON public.assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON public.assessment_attempts(status);

ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessment attempts"
    ON public.assessment_attempts
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessment attempts"
    ON public.assessment_attempts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessment attempts"
    ON public.assessment_attempts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. Assessment Responses Table (User Answers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.assessment_items(id) ON DELETE CASCADE,
    response_data JSONB NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(attempt_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_assessment_responses_attempt ON public.assessment_responses(attempt_id);

ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own responses"
    ON public.assessment_responses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.assessment_attempts
            WHERE public.assessment_attempts.id = assessment_responses.attempt_id
            AND public.assessment_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own responses"
    ON public.assessment_responses
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.assessment_attempts
            WHERE public.assessment_attempts.id = assessment_responses.attempt_id
            AND public.assessment_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own responses"
    ON public.assessment_responses
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.assessment_attempts
            WHERE public.assessment_attempts.id = assessment_responses.attempt_id
            AND public.assessment_attempts.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- 6. Assessment Evaluations Table (Rubric Evaluation Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessment_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    response_id UUID NOT NULL REFERENCES public.assessment_responses(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES public.assessment_dimensions(id) ON DELETE SET NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 4),
    performance_level TEXT NOT NULL, -- 'Emerging', 'Developing', 'Demonstrating', 'Strongly Demonstrating'
    evidence TEXT NOT NULL,
    strengths TEXT[] DEFAULT '{}'::text[],
    development_opportunities TEXT[] DEFAULT '{}'::text[],
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    evaluator_type TEXT NOT NULL, -- 'deterministic', 'hybrid-ai', 'fallback-rubric'
    evaluator_version TEXT NOT NULL DEFAULT '1.0.0',
    rubric_version TEXT NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_assessment_evaluations_attempt ON public.assessment_evaluations(attempt_id);

ALTER TABLE public.assessment_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evaluations"
    ON public.assessment_evaluations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.assessment_attempts
            WHERE public.assessment_attempts.id = assessment_evaluations.attempt_id
            AND public.assessment_attempts.user_id = auth.uid()
        )
    );

-- Only authenticated users or service role can insert evaluations via server actions
CREATE POLICY "Users can insert own evaluations via attempt"
    ON public.assessment_evaluations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.assessment_attempts
            WHERE public.assessment_attempts.id = assessment_evaluations.attempt_id
            AND public.assessment_attempts.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- 7. Capability Profiles Table (Aggregated Baseline Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.capability_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE SET NULL,
    capability_key TEXT NOT NULL, -- 'critical-thinking', 'creative-problem-solving', 'curiosity'
    overall_score NUMERIC(3, 2) NOT NULL CHECK (overall_score >= 1.00 AND overall_score <= 4.00),
    performance_level TEXT NOT NULL,
    dimension_results JSONB NOT NULL,
    evidence_summary TEXT[] DEFAULT '{}'::text[],
    strengths_summary TEXT[] DEFAULT '{}'::text[],
    opportunities_summary TEXT[] DEFAULT '{}'::text[],
    baseline_version TEXT NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, capability_key)
);

CREATE INDEX IF NOT EXISTS idx_capability_profiles_user ON public.capability_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_capability_profiles_key ON public.capability_profiles(capability_key);

ALTER TABLE public.capability_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own capability profiles"
    ON public.capability_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own capability profiles"
    ON public.capability_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own capability profiles"
    ON public.capability_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
