-- ==============================================================================
-- OBHASH Initial Schema Migration
-- Phase 1: Foundation & Infrastructure
-- Migration ID: 20261120000000_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table
-- Linked directly to Supabase Auth (auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    target_age_group TEXT DEFAULT '18-30',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies:
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. Capabilities Table
-- Defines core human capabilities (Critical Thinking, Creative Problem-Solving, Curiosity)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for capability slug queries
CREATE INDEX IF NOT EXISTS idx_capabilities_slug ON public.capabilities(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;

-- Capabilities RLS Policies:
-- Anyone (authenticated or anonymous) can view active capabilities
CREATE POLICY "Anyone can view active capabilities"
    ON public.capabilities
    FOR SELECT
    USING (is_active = true);

-- Only administrative service-role can modify capabilities (no insert/update policy for public/authenticated)

-- Seed Initial Core Capabilities
INSERT INTO public.capabilities (slug, name, description)
VALUES 
    ('critical-thinking', 'Critical Thinking', 'Evaluating arguments, discerning evidence, identifying cognitive biases, and formulating objective judgments.'),
    ('creative-problem-solving', 'Creative Problem-Solving', 'Divergent thinking, synthesizing novel connections, framing unstructured challenges, and prototyping inventive solutions.'),
    ('curiosity', 'Curiosity', 'Active inquiry, exploratory questioning, cross-disciplinary exploration, and continuous drive for discovery.')
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. Audit Logs Table
-- Immutable activity and security logging
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for user audit trails and action searches
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit Logs RLS Policies:
-- Users can only view their own audit logs
CREATE POLICY "Users can view own audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- System inserts audit logs via server client or service role
CREATE POLICY "Authenticated users can create audit log entries"
    ON public.audit_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Auto-update updated_at timestamp trigger function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
