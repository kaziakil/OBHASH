"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  V2_APPLICATIONS,
  V2_SHARED_ENGINES,
  V2_TEAM_MEMBERS,
} from "@/lib/docs/v2-content";

interface ProductViewProps {
  searchQuery?: string;
  onNavigateToTab?: (tab: "engineering" | "roadmap" | "transparency") => void;
}

export function ProductView({ searchQuery = "", onNavigateToTab }: ProductViewProps) {
  const [selectedAppId, setSelectedAppId] = useState<string>("career-readiness");
  const [selectedEngineId, setSelectedEngineId] = useState<string>("human-capability-engine");

  const query = searchQuery.trim().toLowerCase();

  // Filter applications by search query
  const filteredApps = useMemo(() => {
    if (!query) return V2_APPLICATIONS;
    return V2_APPLICATIONS.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.tagline.toLowerCase().includes(query) ||
        app.overview.toLowerCase().includes(query) ||
        app.coreFeatures.some((f) => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query))
    );
  }, [query]);

  // Filter engines by search query
  const filteredEngines = useMemo(() => {
    if (!query) return V2_SHARED_ENGINES;
    return V2_SHARED_ENGINES.filter(
      (eng) =>
        eng.name.toLowerCase().includes(query) ||
        eng.tagline.toLowerCase().includes(query) ||
        eng.purpose.toLowerCase().includes(query) ||
        eng.coreCapabilities.some((c) => c.toLowerCase().includes(query))
    );
  }, [query]);

  const activeApp = useMemo(
    () => V2_APPLICATIONS.find((a) => a.id === selectedAppId) || V2_APPLICATIONS[0],
    [selectedAppId]
  );

  const activeEngine = useMemo(
    () => V2_SHARED_ENGINES.find((e) => e.id === selectedEngineId) || V2_SHARED_ENGINES[0],
    [selectedEngineId]
  );

  return (
    <div className="space-y-16 animate-in fade-in duration-200">
      {/* 1. HERO PITCH BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12101E] via-[#1A162B] to-[#251E42] text-white p-8 sm:p-12 lg:p-16 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5B3BFF]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#38E5FF]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-purple-200">
            <span className="w-2 h-2 rounded-full bg-[#38E5FF] animate-pulse" />
            Official Documentation v2.0.0 • Product Presentation
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            AI should help people become{" "}
            <span className="bg-gradient-to-r from-[#9D86FF] via-[#D3C7FF] to-[#38E5FF] bg-clip-text text-transparent">
              more capable
            </span>
            , not more dependent.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
            OBHASH is an AI-powered human capability development platform. While conventional AI tools
            complete tasks for users and erode cognitive agency, OBHASH cultivates human critical thinking,
            creative problem solving, and adaptive lifelong independence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/onboarding"
              className="px-6 py-3 rounded-xl bg-[#5B3BFF] hover:bg-[#4D30E0] text-white font-bold text-sm shadow-lg shadow-[#5B3BFF]/30 transition-all"
            >
              Experience Capability Assessment →
            </Link>
            <button
              type="button"
              onClick={() => onNavigateToTab?.("engineering")}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Explore Technical Architecture</span>
              <span className="text-xs">⚙️</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab?.("roadmap")}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-semibold text-sm border border-white/10 transition-all"
            >
              Roadmap (8 Stages, 25 Phases)
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-black text-white">5 Apps</div>
              <div className="text-xs text-zinc-400">Developed in Parallel</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">6 Engines</div>
              <div className="text-xs text-zinc-400">Shared Foundation</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">25 Phases</div>
              <div className="text-xs text-zinc-400">Strict Governance Gates</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">100% Human</div>
              <div className="text-xs text-zinc-400">Independence Focused</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CORE PROBLEM & WHY NOW */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5B3BFF] dark:text-[#9D86FF]">
            Market Imperative
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            The Capability Deficit of the Generative AI Era
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            AI adoption is accelerating, but cognitive autonomy is collapsing. Passive outsourcing of writing,
            analysis, and ideation is producing a generation of operators who cannot think critically without a prompt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-lg">
              ⚠️
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Cognitive Atrophy</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When software does the thinking, the human brain stops forming deep analytical models. Users
              experience an illusion of competence while losing foundational problem-solving muscles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
              📉
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">The Evaluation Gap</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Employers, universities, and institutions can no longer trust static portfolio artifacts or resumes.
              There is no verified evidence of how much thinking was done by the person vs. the machine.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
              ✨
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">OBHASH Solution</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Socratic scaffolding, capability progression, and an Independence Measurement Engine that quantifies
              and certifies how effectively a user solves problems without AI assistance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FIVE APPLICATIONS ECOSYSTEM (SIMULTANEOUS SUITE) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold">
              <span>Section D Specification</span>
              <span>•</span>
              <span>Simultaneous Multi-App Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">
              The Five OBHASH Applications
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              All five applications are developed concurrently. They share the same underlying engines,
              cross-app capability ledger, and Socratic intelligence layer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Select Application:</span>
          </div>
        </div>

        {/* Application Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => setSelectedAppId(app.id)}
              className={`p-3 rounded-xl text-left transition-all flex flex-col justify-between ${
                selectedAppId === app.id
                  ? "bg-white dark:bg-[#161421] text-[#5B3BFF] dark:text-white shadow-md border border-zinc-200/60 dark:border-zinc-700 font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300">
                  {app.code}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    app.implementationStatus === "Operational"
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                      : app.implementationStatus === "Implemented"
                      ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                      : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {app.implementationStatus}
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold leading-tight">{app.name}</div>
            </button>
          ))}
        </div>

        {/* Active Application Detail Card */}
        {activeApp && (
          <div className="rounded-3xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#5B3BFF]/10 text-[#5B3BFF] font-bold">
                    {activeApp.code}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                    Target: {activeApp.targetUsers}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                  {activeApp.name}
                </h3>
                <p className="text-sm font-medium text-[#5B3BFF] dark:text-[#9D86FF]">
                  {activeApp.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Status:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ● {activeApp.implementationStatus}
                </span>
              </div>
            </div>

            {/* Overview & Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Application Overview
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {activeApp.overview}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Core Purpose & Outcome
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {activeApp.purpose}
                </p>
              </div>
            </div>

            {/* Capability Framework Dimensions */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Capability Framework Dimensions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeApp.capabilityFramework.map((dim, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-2"
                  >
                    <div className="font-bold text-xs text-[#5B3BFF] dark:text-[#9D86FF]">
                      {dim.dimension}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                      {dim.description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {dim.competencies.map((comp, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Features */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Key Features & Delivery State
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeApp.coreFeatures.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        {feat.name}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {feat.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* User Journeys */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Validated User Journey
              </h4>
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 space-y-2">
                {activeApp.userJourneys.map((uj, ujIdx) => (
                  <div key={ujIdx} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                      <span>Persona:</span>
                      <span className="font-semibold">{uj.persona}</span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">
                      <strong>Journey:</strong> {uj.journey}
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      <strong>Outcome:</strong> {uj.outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. SIX SHARED ENGINES (REUSABLE FOUNDATION) */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <span>Section C Specification</span>
            <span>•</span>
            <span>Unified Foundational Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">
            The Six Shared Core Engines
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            OBHASH applications do not reinvent foundational logic. All five applications consume the
            same six hardened engines, enabling complete cross-app capability tracking and zero redundant code.
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {filteredEngines.map((eng) => (
            <button
              key={eng.id}
              type="button"
              onClick={() => setSelectedEngineId(eng.id)}
              className={`p-3 rounded-xl text-left transition-all border ${
                selectedEngineId === eng.id
                  ? "bg-[#5B3BFF] text-white border-[#5B3BFF] shadow-lg font-bold"
                  : "bg-white dark:bg-[#161421] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="text-[10px] font-mono opacity-80">{eng.code}</div>
              <div className="text-xs font-bold mt-1 line-clamp-1">{eng.name}</div>
            </button>
          ))}
        </div>

        {/* Active Engine Card */}
        {activeEngine && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="font-mono text-xs text-[#5B3BFF] dark:text-[#9D86FF] font-bold">
                  {activeEngine.code}
                </span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">{activeEngine.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{activeEngine.tagline}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 self-start sm:self-auto">
                {activeEngine.implementationStatus}
              </span>
            </div>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {activeEngine.purpose}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Internal Components */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Internal Engine Components
                </h4>
                <div className="space-y-2">
                  {activeEngine.internalComponents.map((comp, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
                    >
                      <div className="font-bold text-zinc-900 dark:text-white">{comp.name}</div>
                      <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {comp.responsibility}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Application Usage */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Application Utilization Matrix
                </h4>
                <div className="space-y-2">
                  {activeEngine.applicationLevelUtilization.map((appUse, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
                    >
                      <div className="font-bold text-[#5B3BFF] dark:text-[#9D86FF]">
                        {appUse.appName}
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {appUse.usage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. SEVEN-STAGE CAPABILITY DEVELOPMENT LOOP */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#5B3BFF] dark:text-[#9D86FF]">
            Pedagogical Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            The 7-Stage Capability Loop
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Users don’t just receive AI summaries. They progress through a validated cognitive cycle
            that measures and proves their independent problem-solving competence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {[
            {
              step: "01",
              name: "Assess",
              desc: "Diagnostic scenarios evaluate baseline critical thinking, creativity, and curiosity.",
            },
            {
              step: "02",
              name: "Explore",
              desc: "Curated problem spaces stimulate inquiry and challenge cognitive biases.",
            },
            {
              step: "03",
              name: "Guide",
              desc: "Socratic AI coach asks catalytic questions without handing out direct answers.",
            },
            {
              step: "04",
              name: "Create",
              desc: "User drafts original solutions, frameworks, and counter-arguments in the workspace.",
            },
            {
              step: "05",
              name: "Reflect",
              desc: "Metacognitive prompting guides user to evaluate how their thinking evolved.",
            },
            {
              step: "06",
              name: "Demonstrate",
              desc: "Timed unassisted performance tests prove ability to execute without AI scaffolding.",
            },
            {
              step: "07",
              name: "Track",
              desc: "Growth portfolio compiles verified evidence and independence ratios over time.",
            },
          ].map((st, sIdx) => (
            <div
              key={sIdx}
              className="p-4 rounded-2xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  STAGE {st.step}
                </span>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white mt-2">{st.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TEAM PASTFORWARD (MANDATORY SHOWCASE) */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <span>Section P Specification</span>
            <span>•</span>
            <span>Founding Team</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">
            Team PastForward
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            A multidisciplinary team combining software systems architecture, AI alignment & evaluation,
            cognitive psychometrics, and human-centered design.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {V2_TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="rounded-3xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Uniform aspect-square avatar */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80">
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">{member.name}</h3>
                  <div className="text-xs font-semibold text-[#5B3BFF] dark:text-[#9D86FF]">
                    {member.role}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                    {member.email}
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Key Contributions
                </div>
                <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                  {member.contributions.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#5B3BFF] font-bold">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION & QUICK LINKS */}
      <section className="rounded-3xl bg-zinc-100 dark:bg-[#14121E] border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Ready to review technical specifications or the master roadmap?
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl">
            Access deep whitepaper sections (A through Q), 10 interactive SVG architecture diagrams,
            and the 25-phase roadmap with rigorous governance gates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateToTab?.("engineering")}
            className="px-5 py-2.5 rounded-xl bg-[#5B3BFF] hover:bg-[#4D30E0] text-white text-xs font-bold transition-all"
          >
            Engineering Spec →
          </button>
          <button
            type="button"
            onClick={() => onNavigateToTab?.("roadmap")}
            className="px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold border border-zinc-200 dark:border-zinc-700 transition-all"
          >
            Roadmap →
          </button>
        </div>
      </section>
    </div>
  );
}
