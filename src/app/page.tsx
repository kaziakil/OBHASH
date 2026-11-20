import React from "react";
import Link from "next/link";
import { APP_METADATA, CORE_CAPABILITIES } from "@/config/constants";
import { Card, CardTitle, CardDescription } from "@/components/shared/Card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getEnvStatus } from "@/config/env";

export default function Home() {
  const env = getEnvStatus();

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          {APP_METADATA.phase}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Human-Centered Intelligence
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {APP_METADATA.description}
        </p>
        <div className="pt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Initial Focus: Empowering people aged <span className="font-semibold text-zinc-800 dark:text-zinc-200">18–30</span> to develop cognitive independence through guided challenges and reflection.
        </div>
      </section>

      {/* Target Capabilities Section */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Core Target Capabilities
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            The foundational capabilities prioritized for initial human capability development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CORE_CAPABILITIES.map((cap, idx) => (
            <Card key={cap.id} className="relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium text-zinc-400">0{idx + 1}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  Core
                </span>
              </div>
              <CardTitle className="text-xl mb-2">{cap.title}</CardTitle>
              <CardDescription>{cap.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Phase 1 Technical Foundation Status */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Phase 1: Technical Infrastructure Status
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Verification of foundational architecture, services, and security boundaries.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/api/health"
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-colors"
            >
              Verify Health API →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Next.js Core */}
          <Card variant="muted" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Frontend & Core</span>
              <StatusBadge status="operational" />
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Next.js 16 + React 19</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              App Router, TypeScript 5, Tailwind CSS 4, Turbopack, and SSR enabled.
            </p>
          </Card>

          {/* Supabase Layer */}
          <Card variant="muted" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Database & Auth</span>
              <StatusBadge status={env.supabase.isConfigured ? "configured" : "unconfigured"} />
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Supabase Integration</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {env.supabase.isConfigured
                ? "Client, SSR server client, admin client, and schema migrations ready."
                : "Integration layer ready. Awaiting Supabase project URL & anon key in .env.local."}
            </p>
          </Card>

          {/* AI Integration */}
          <Card variant="muted" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">AI Integration</span>
              <StatusBadge status={env.ai.isConfigured ? "configured" : "unconfigured"} />
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Server-Side LLM Layer</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {env.ai.isConfigured
                ? `Active provider: ${env.ai.provider} (${env.ai.model}) with timeout enforcement.`
                : `Provider-independent adapter ready. Add ${env.ai.provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"} in .env.local.`}
            </p>
          </Card>

          {/* Security & Secrets */}
          <Card variant="muted" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Security</span>
              <StatusBadge status="operational" label="Protected" />
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Zero-Leak Guardrails</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Service keys restricted to server, .env.local git-ignored, browser boundaries strictly guarded.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
