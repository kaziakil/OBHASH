-- ==============================================================================
-- OBHASH Phase 4 Schema Migration: Personalized Growth Journey
-- Migration ID: 20261120030000_phase4_growth_journeys.sql
-- ==============================================================================

-- 1. Growth Journeys Table
CREATE TABLE IF NOT EXISTS public.growth_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    target_duration TEXT NOT NULL DEFAULT '8 weeks',
    weekly_commitment_hours TEXT NOT NULL DEFAULT '3-4 hours/week',
    capability_keys TEXT[] NOT NULL DEFAULT '{}',
    primary_priorities TEXT[] NOT NULL DEFAULT '{}',
    personalization_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_growth_journeys_user ON public.growth_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_journeys_status ON public.growth_journeys(status);

ALTER TABLE public.growth_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own growth journeys"
    ON public.growth_journeys
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------

-- 2. Journey Capability Focus Areas Table
CREATE TABLE IF NOT EXISTS public.journey_capability_focus_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.growth_journeys(id) ON DELETE CASCADE,
    capability_key TEXT NOT NULL,
    capability_name TEXT NOT NULL,
    rationale TEXT NOT NULL,
    selected_dimensions TEXT[] NOT NULL DEFAULT '{}',
    intended_outcomes TEXT[] NOT NULL DEFAULT '{}',
    priority INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_journey_focus_areas_journey ON public.journey_capability_focus_areas(journey_id);

ALTER TABLE public.journey_capability_focus_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage focus areas through journeys"
    ON public.journey_capability_focus_areas
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.growth_journeys
            WHERE growth_journeys.id = journey_capability_focus_areas.journey_id
            AND growth_journeys.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.growth_journeys
            WHERE growth_journeys.id = journey_capability_focus_areas.journey_id
            AND growth_journeys.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------

-- 3. Development Goals Table
CREATE TABLE IF NOT EXISTS public.development_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.growth_journeys(id) ON DELETE CASCADE,
    focus_area_id UUID REFERENCES public.journey_capability_focus_areas(id) ON DELETE SET NULL,
    capability_key TEXT NOT NULL,
    dimension_slug TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reason_for_recommendation TEXT NOT NULL,
    expected_outcome TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    target_date DATE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_development_goals_journey ON public.development_goals(journey_id);
CREATE INDEX IF NOT EXISTS idx_development_goals_status ON public.development_goals(status);

ALTER TABLE public.development_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage development goals through journeys"
    ON public.development_goals
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.growth_journeys
            WHERE growth_journeys.id = development_goals.journey_id
            AND growth_journeys.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.growth_journeys
            WHERE growth_journeys.id = development_goals.journey_id
            AND growth_journeys.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------

-- 4. Journey Milestones Table
CREATE TABLE IF NOT EXISTS public.journey_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.growth_journeys(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES public.development_goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    expected_outcome TEXT NOT NULL,
    suggested_period TEXT NOT NULL DEFAULT 'Week 1-2',
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_journey_milestones_journey ON public.journey_milestones(journey_id);
CREATE INDEX IF NOT EXISTS idx_journey_milestones_goal ON public.journey_milestones(goal_id);

ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage milestones through journeys"
    ON public.journey_milestones
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.growth_journeys
            WHERE growth_journeys.id = journey_milestones.journey_id
            AND growth_journeys.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.growth_journeys
            WHERE growth_journeys.id = journey_milestones.journey_id
            AND growth_journeys.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------

-- 5. Planned Activities Table
CREATE TABLE IF NOT EXISTS public.planned_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.growth_journeys(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES public.development_goals(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES public.journey_milestones(id) ON DELETE SET NULL,
    capability_key TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    purpose TEXT NOT NULL,
    estimated_minutes INTEGER NOT NULL DEFAULT 20,
    suggested_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_planned_activities_journey ON public.planned_activities(journey_id);
CREATE INDEX IF NOT EXISTS idx_planned_activities_goal ON public.planned_activities(goal_id);
CREATE INDEX IF NOT EXISTS idx_planned_activities_milestone ON public.planned_activities(milestone_id);

ALTER TABLE public.planned_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage planned activities through journeys"
    ON public.planned_activities
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.growth_journeys
            WHERE growth_journeys.id = planned_activities.journey_id
            AND growth_journeys.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.growth_journeys
            WHERE growth_journeys.id = planned_activities.journey_id
            AND growth_journeys.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------

-- 6. Journey Generation Records Table
CREATE TABLE IF NOT EXISTS public.journey_generation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID REFERENCES public.growth_journeys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    model_name TEXT NOT NULL,
    generation_type TEXT NOT NULL, -- 'hybrid-ai' | 'deterministic-fallback'
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    input_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_journey_generation_records_user ON public.journey_generation_records(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_generation_records_journey ON public.journey_generation_records(journey_id);

ALTER TABLE public.journey_generation_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generation records"
    ON public.journey_generation_records
    FOR SELECT
    USING (auth.uid() = user_id);
