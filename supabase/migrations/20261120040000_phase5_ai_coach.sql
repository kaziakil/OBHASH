-- ==============================================================================
-- OBHASH Phase 5 Schema Migration: AI Growth Coach
-- Migration ID: 20261120040000_phase5_ai_coach.sql
-- ==============================================================================

-- 1. Coaching Sessions Table
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Coaching Session',
    capability_key TEXT NOT NULL CHECK (capability_key IN ('critical-thinking', 'creative-problem-solving', 'curiosity')),
    journey_id UUID REFERENCES public.growth_journeys(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES public.development_goals(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    current_hint_level INTEGER NOT NULL DEFAULT 0 CHECK (current_hint_level BETWEEN 0 AND 3),
    instruction_version TEXT NOT NULL DEFAULT 'v1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user ON public.coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_status ON public.coaching_sessions(status);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_capability ON public.coaching_sessions(capability_key);

ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own coaching sessions"
    ON public.coaching_sessions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------

-- 2. Coaching Messages Table
CREATE TABLE IF NOT EXISTS public.coaching_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.coaching_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    response_type TEXT NOT NULL DEFAULT 'dialogue' CHECK (response_type IN ('dialogue', 'question', 'hint', 'explanation', 'perspective', 'challenge', 'summary', 'feedback')),
    hint_level INTEGER CHECK (hint_level BETWEEN 0 AND 3),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_coaching_messages_session ON public.coaching_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_coaching_messages_created_at ON public.coaching_messages(created_at);

ALTER TABLE public.coaching_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage messages in their own sessions"
    ON public.coaching_messages
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.coaching_sessions
            WHERE coaching_sessions.id = coaching_messages.session_id
            AND coaching_sessions.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.coaching_sessions
            WHERE coaching_sessions.id = coaching_messages.session_id
            AND coaching_sessions.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------

-- 3. Coaching Session Summaries Table
CREATE TABLE IF NOT EXISTS public.coaching_session_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.coaching_sessions(id) ON DELETE CASCADE UNIQUE,
    explored_topics TEXT[] NOT NULL DEFAULT '{}',
    key_questions_considered TEXT[] NOT NULL DEFAULT '{}',
    perspectives_developed TEXT[] NOT NULL DEFAULT '{}',
    reasoning_demonstrated TEXT NOT NULL,
    growth_frontiers TEXT[] NOT NULL DEFAULT '{}',
    recommended_next_steps TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_coaching_summaries_session ON public.coaching_session_summaries(session_id);

ALTER TABLE public.coaching_session_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage summaries in their own sessions"
    ON public.coaching_session_summaries
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.coaching_sessions
            WHERE coaching_sessions.id = coaching_session_summaries.session_id
            AND coaching_sessions.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.coaching_sessions
            WHERE coaching_sessions.id = coaching_session_summaries.session_id
            AND coaching_sessions.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------

-- 4. Coaching Session Context Snapshots Table
CREATE TABLE IF NOT EXISTS public.coaching_session_context_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.coaching_sessions(id) ON DELETE CASCADE UNIQUE,
    assessment_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    journey_goal_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    user_interests TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_coaching_snapshots_session ON public.coaching_session_context_snapshots(session_id);

ALTER TABLE public.coaching_session_context_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view context snapshots in their own sessions"
    ON public.coaching_session_context_snapshots
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.coaching_sessions
            WHERE coaching_sessions.id = coaching_session_context_snapshots.session_id
            AND coaching_sessions.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.coaching_sessions
            WHERE coaching_sessions.id = coaching_session_context_snapshots.session_id
            AND coaching_sessions.user_id = auth.uid()
        )
    );
