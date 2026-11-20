-- ==============================================================================
-- OBHASH Migration: Phase 7 - Independence Measurement & Growth Portfolio
-- Migration: 20261120060000_phase7_portfolio_independence.sql
-- ==============================================================================

-- 1. Independence Framework Versions
CREATE TABLE IF NOT EXISTS public.independence_framework_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Independence Dimensions
CREATE TABLE IF NOT EXISTS public.independence_dimensions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_version_id UUID NOT NULL REFERENCES public.independence_framework_versions(id) ON DELETE CASCADE,
    dimension_key TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    observable_behavior_indicators JSONB NOT NULL DEFAULT '[]'::jsonb,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(framework_version_id, dimension_key)
);

-- 3. Independence Observations (Observable Behaviors tied to source evidence)
CREATE TABLE IF NOT EXISTS public.independence_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension_key TEXT NOT NULL,
    behavior_key TEXT NOT NULL,
    behavior_description TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'challenge_submission', 'challenge_reflection', 'assessment_evaluation', 'coaching_session'
    source_record_id TEXT NOT NULL,
    source_title TEXT NOT NULL,
    evidence_quote TEXT,
    evidence_analysis TEXT,
    ai_assistance_classification TEXT NOT NULL DEFAULT 'Level E', -- 'Level A', 'Level B', 'Level C', 'Level D', 'Level E'
    ai_assistance_notes TEXT,
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.85,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Independence Measurement Snapshots (Historical snapshots preserving measurement evolution)
CREATE TABLE IF NOT EXISTS public.independence_measurement_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    framework_version TEXT NOT NULL DEFAULT '1.0.0',
    dimension_snapshots JSONB NOT NULL DEFAULT '{}'::jsonb,
    ai_assistance_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    development_narrative TEXT NOT NULL,
    limitations_notice TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Portfolios (User controlled growth portfolio)
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    public_slug TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    headline TEXT,
    personal_introduction TEXT,
    learning_philosophy TEXT,
    areas_of_interest TEXT[] NOT NULL DEFAULT '{}'::text[],
    is_published BOOLEAN NOT NULL DEFAULT false,
    visibility TEXT NOT NULL DEFAULT 'private', -- 'private', 'unlisted', 'public'
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Portfolio Sections (Structured configurable sections)
CREATE TABLE IF NOT EXISTS public.portfolio_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- 'personal_intro', 'capability_overview', 'featured_work', 'development_journey', 'thoughtful_ai_use', 'personal_reflections'
    title TEXT NOT NULL,
    subtitle TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    order_index INT NOT NULL DEFAULT 0,
    custom_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Portfolio Items (Explicitly chosen work and evidence items)
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.portfolio_sections(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL, -- 'challenge_submission', 'challenge_reflection', 'assessment_achievement', 'journey_milestone', 'custom_project'
    source_record_id TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    capability_key TEXT,
    dimensions TEXT[] NOT NULL DEFAULT '{}'::text[],
    user_reflection TEXT,
    ai_assistance_level TEXT NOT NULL DEFAULT 'Level A', -- 'Level A', 'Level B', 'Level C', 'Level D', 'Level E'
    ai_assistance_disclosure TEXT,
    artifacts JSONB NOT NULL DEFAULT '[]'::jsonb,
    order_index INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Portfolio Publication Settings
CREATE TABLE IF NOT EXISTS public.portfolio_publication_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE UNIQUE,
    allow_search_indexing BOOLEAN NOT NULL DEFAULT false,
    show_capability_badges BOOLEAN NOT NULL DEFAULT true,
    show_ai_disclosures BOOLEAN NOT NULL DEFAULT true,
    show_reflections BOOLEAN NOT NULL DEFAULT true,
    show_journey_timeline BOOLEAN NOT NULL DEFAULT true,
    custom_share_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance and quick retrieval
CREATE INDEX IF NOT EXISTS idx_independence_obs_user_dim ON public.independence_observations(user_id, dimension_key);
CREATE INDEX IF NOT EXISTS idx_independence_obs_source ON public.independence_observations(source_type, source_record_id);
CREATE INDEX IF NOT EXISTS idx_independence_snapshots_user ON public.independence_measurement_snapshots(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_user ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_public_slug ON public.portfolios(public_slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_portfolio ON public.portfolio_sections(portfolio_id, order_index);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_portfolio ON public.portfolio_items(portfolio_id, section_id, order_index);

-- Enable Row Level Security (RLS)
ALTER TABLE public.independence_framework_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.independence_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.independence_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.independence_measurement_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_publication_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Independence Framework (Read-only for all authenticated users)
CREATE POLICY "Framework versions viewable by authenticated users"
    ON public.independence_framework_versions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Independence dimensions viewable by authenticated users"
    ON public.independence_dimensions FOR SELECT
    TO authenticated
    USING (true);

-- RLS Policies: Independence Observations (Strict user ownership)
CREATE POLICY "Users can view own independence observations"
    ON public.independence_observations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own independence observations"
    ON public.independence_observations FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies: Measurement Snapshots (Strict user ownership)
CREATE POLICY "Users can view own measurement snapshots"
    ON public.independence_measurement_snapshots FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurement snapshots"
    ON public.independence_measurement_snapshots FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies: Portfolios (Owner full control; Public read-only for published portfolios)
CREATE POLICY "Users can manage their own portfolio"
    ON public.portfolios FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view published portfolios"
    ON public.portfolios FOR SELECT
    TO anon, authenticated
    USING (is_published = true AND visibility IN ('public', 'unlisted'));

-- RLS Policies: Portfolio Sections
CREATE POLICY "Users can manage their own portfolio sections"
    ON public.portfolio_sections FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios p
            WHERE p.id = portfolio_id AND p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.portfolios p
            WHERE p.id = portfolio_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view visible sections of published portfolios"
    ON public.portfolio_sections FOR SELECT
    TO anon, authenticated
    USING (
        is_visible = true AND
        EXISTS (
            SELECT 1 FROM public.portfolios p
            WHERE p.id = portfolio_id AND p.is_published = true AND p.visibility IN ('public', 'unlisted')
        )
    );

-- RLS Policies: Portfolio Items
CREATE POLICY "Users can manage their own portfolio items"
    ON public.portfolio_items FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios p
            WHERE p.id = portfolio_id AND p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.portfolios p
            WHERE p.id = portfolio_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view items in published portfolios"
    ON public.portfolio_items FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios p
            JOIN public.portfolio_sections s ON s.id = section_id
            WHERE p.id = portfolio_items.portfolio_id 
              AND p.is_published = true 
              AND p.visibility IN ('public', 'unlisted')
              AND s.is_visible = true
        )
    );

-- RLS Policies: Publication Settings
CREATE POLICY "Users can manage their own publication settings"
    ON public.portfolio_publication_settings FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios p
            WHERE p.id = portfolio_id AND p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.portfolios p
            WHERE p.id = portfolio_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Public can view publication settings of published portfolios"
    ON public.portfolio_publication_settings FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios p
            WHERE p.id = portfolio_id AND p.is_published = true AND p.visibility IN ('public', 'unlisted')
        )
    );

-- Seed Initial Independence Framework Version 1.0.0
INSERT INTO public.independence_framework_versions (version_code, name, description, is_active)
VALUES (
    '1.0.0',
    'OBHASH Independence Measurement Framework v1.0',
    'Initial operational framework for transparent, evidence-grounded independence evaluation across 5 dimensions.',
    true
)
ON CONFLICT (version_code) DO NOTHING;

-- Seed Dimensions for v1.0.0
DO $$
DECLARE
    v_framework_id UUID;
BEGIN
    SELECT id INTO v_framework_id FROM public.independence_framework_versions WHERE version_code = '1.0.0';

    IF v_framework_id IS NOT NULL THEN
        INSERT INTO public.independence_dimensions (framework_version_id, dimension_key, title, description, observable_behavior_indicators, order_index)
        VALUES
        (
            v_framework_id,
            'independent-reasoning',
            'Independent Reasoning',
            'Examines whether the user formulates their own arguments, identifies assumptions, evaluates supporting evidence, and considers alternative explanations.',
            '[
                {"key": "explains_conclusions", "label": "Explains conclusions with self-authored rationale"},
                {"key": "identifies_assumptions", "label": "Explicitly identifies foundational assumptions"},
                {"key": "evaluates_evidence", "label": "Scrutinizes and weighs supporting vs contradictory evidence"},
                {"key": "considers_alternatives", "label": "Explores counterarguments or rival hypotheses before choosing a stance"}
            ]'::jsonb,
            1
        ),
        (
            v_framework_id,
            'self-directed-exploration',
            'Self-Directed Exploration',
            'Examines whether the user independently identifies meaningful questions, pursues relevant inquiries, recognizes knowledge gaps, and explores unfamiliar terrain.',
            '[
                {"key": "formulates_questions", "label": "Formulates generative, non-obvious questions"},
                {"key": "pursues_inquiries", "label": "Systematically investigates key unknowns"},
                {"key": "recognizes_knowledge_gaps", "label": "Candidly notes what remains unknown or uncertain"},
                {"key": "directs_investigation", "label": "Sets their own trajectory of exploration"}
            ]'::jsonb,
            2
        ),
        (
            v_framework_id,
            'independent-problem-solving',
            'Independent Problem-Solving',
            'Examines whether the user defines problem spaces, generates multiple candidate approaches, evaluates trade-offs, and adapts solutions under real constraints.',
            '[
                {"key": "defines_problem_space", "label": "Frames core constraints and root problems clearly"},
                {"key": "generates_multiple_approaches", "label": "Produces distinct alternatives before choosing one"},
                {"key": "evaluates_tradeoffs", "label": "Articulates trade-offs and compromises with clarity"},
                {"key": "adapts_to_constraints", "label": "Refines and iterates when faced with real-world barriers"}
            ]'::jsonb,
            3
        ),
        (
            v_framework_id,
            'thoughtful-ai-use',
            'Thoughtful AI Use',
            'Examines whether the user engages AI as a thinking partner, validates or critiques AI suggestions, avoids passive acceptance, and maintains ownership of key decisions.',
            '[
                {"key": "discriminating_prompts", "label": "Uses targeted, clarifying prompts rather than requesting complete answers"},
                {"key": "critiques_ai_output", "label": "Identifies errors, biases, or limitations in AI suggestions"},
                {"key": "rejects_unsuitable_ideas", "label": "Rejects superficial or misaligned AI suggestions"},
                {"key": "preserves_decision_ownership", "label": "Retains final authorship and decision-making responsibility"}
            ]'::jsonb,
            4
        ),
        (
            v_framework_id,
            'reflection-self-direction',
            'Reflection and Self-Direction',
            'Examines whether the user recognizes changes in their own thinking, learns from missteps, acknowledges uncertainty, and directs their next developmental steps.',
            '[
                {"key": "identifies_learning", "label": "Articulates specific shifts in perspective after practice"},
                {"key": "acknowledges_uncertainty", "label": "Honest awareness of limitations and ongoing doubts"},
                {"key": "learns_from_missteps", "label": "Extracts actionable insights from flawed approaches"},
                {"key": "sets_next_development_steps", "label": "Defines self-directed goals for ongoing capability growth"}
            ]'::jsonb,
            5
        )
        ON CONFLICT (framework_version_id, dimension_key) DO NOTHING;
    END IF;
END $$;
