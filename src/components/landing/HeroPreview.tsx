"use client";

import React, { useState } from "react";
import Link from "next/link";

export function HeroPreview() {
  const [activeTab, setActiveTab] = useState<"coach" | "workspace" | "independence">("coach");

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] shadow-2xl shadow-indigo-500/10 dark:shadow-black/40 overflow-hidden text-left transition-all">
      {/* Studio Window Title Bar */}
      <div className="px-4 py-3 bg-zinc-100/80 dark:bg-[#111019] border-b border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-2 hidden sm:inline">
            obhash.app/studio/preview
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800/60 p-0.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <button
            type="button"
            onClick={() => setActiveTab("coach")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === "coach"
                ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-semibold shadow-xs"
                : "hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Socratic Coach
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("workspace")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === "workspace"
                ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-semibold shadow-xs"
                : "hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Challenge Workspace
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("independence")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === "independence"
                ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-semibold shadow-xs"
                : "hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Independence Radar
          </button>
        </div>
      </div>

      {/* Tab 1: Socratic AI Growth Coach Content */}
      {activeTab === "coach" && (
        <div className="p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                Session: Critical Thinking · Empirical Discernment
              </span>
            </div>
            <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px]">
              Socratic Mode: Active
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-3.5 rounded-2xl rounded-tr-xs border border-zinc-200/50 dark:border-zinc-700/50">
                <p className="font-medium text-[11px] text-zinc-400 mb-1">You</p>
                Can you just point out the primary logical flaw and isolate the confounding variables in this wellness study for me?
              </div>
            </div>

            {/* Coach response */}
            <div className="flex justify-start">
              <div className="max-w-[88%] bg-[#5B3BFF]/5 dark:bg-[#5B3BFF]/10 text-zinc-900 dark:text-zinc-100 p-4 rounded-2xl rounded-tl-xs border border-[#5B3BFF]/20 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#5B3BFF] text-white flex items-center justify-center font-bold text-[10px]">
                      AI
                    </span>
                    <span className="font-bold text-xs text-[#5B3BFF] dark:text-indigo-400">
                      OBHASH Growth Coach
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Direct answer declined
                  </span>
                </div>
                <p className="leading-relaxed">
                  I will not isolate them for you—discovering them is where your analytical discernment strengthens. Instead, look closely at paragraph 3:
                </p>
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs italic text-zinc-600 dark:text-zinc-300">
                  &ldquo;All 45 participants were self-enrolled fitness enthusiasts who bought their own supplements over a 12-week trial.&rdquo;
                </div>
                <p className="leading-relaxed">
                  What pre-existing variables might distinguish people willing to spend their own money on health products from the general population?
                </p>
              </div>
            </div>
          </div>

          {/* Progressive Hint Scaffold */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-[10px] uppercase">
                Progressive Hint L1
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                Orientation Nudge: Consider the difference between healthy user bias and chemical efficacy.
              </span>
            </div>
            <Link
              href="/coach"
              className="font-semibold text-[#5B3BFF] dark:text-indigo-400 hover:underline shrink-0 text-xs"
            >
              Try Socratic Coach →
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Challenge Workspace Content */}
      {activeTab === "workspace" && (
        <div className="p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B3BFF]">
                Challenge CT-01
              </span>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                The Unproven Claim: Dissecting Wellness Marketing
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] text-zinc-500">Draft Autosaved 4s ago</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Challenge Brief */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                Deliverable 1: Claim & Flaw Analysis
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px]">
                Articulate the core claim made by the advertorial, isolate at least two confounding variables, and explain how an objective clinical trial would test the thesis.
              </p>
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-400">
                Minimum: 120 words · Analytical rigor rubric active
              </div>
            </div>

            {/* Right: Live Structured Editor Preview */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#111019] border border-[#5B3BFF]/30 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Your Independent Response
                </span>
                <span className="text-[#5B3BFF] font-mono">148 words</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed font-sans line-clamp-3">
                &ldquo;The advertorial relies on a post hoc ergo propter hoc fallacy: participant improvements in vitality are attributed entirely to the green-tea compound, ignoring that participants also engaged in structured sleep tracking and caloric deficits...&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Level A (Unassisted Reasoning)
                </span>
                <Link
                  href="/challenges"
                  className="text-[#5B3BFF] font-semibold hover:underline"
                >
                  Explore Workspace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Independence Radar Content */}
      {activeTab === "independence" && (
        <div className="p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500">
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                Independence Measurement Engine
              </span>
              <p className="text-[11px] text-zinc-400">
                Demonstrated cognitive agency across 5 dimensions
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20">
              Verified Autonomy: Level A
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex justify-between font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
                <span>Critical Distance</span>
                <span className="text-[#5B3BFF]">88%</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#5B3BFF] h-full rounded-full" style={{ width: "88%" }} />
              </div>
              <span className="text-[10px] text-zinc-400 block">
                Evidence: Evaluated opposing arguments without accepting author premises.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex justify-between font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
                <span>Cognitive Self-Reliance</span>
                <span className="text-emerald-600">92%</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "92%" }} />
              </div>
              <span className="text-[10px] text-zinc-400 block">
                Evidence: 4 completed challenges with zero Level 3 hint requests.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex justify-between font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
                <span>Autonomous Problem Formulation</span>
                <span className="text-[#5B3BFF]">84%</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#5B3BFF] h-full rounded-full" style={{ width: "84%" }} />
              </div>
              <span className="text-[10px] text-zinc-400 block">
                Evidence: Independently structured unstructured scenario bounds.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex justify-between font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
                <span>Depth of Metacognitive Reflection</span>
                <span className="text-[#5B3BFF]">86%</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#5B3BFF] h-full rounded-full" style={{ width: "86%" }} />
              </div>
              <span className="text-[10px] text-zinc-400 block">
                Evidence: Articulated shift in personal assumptions post-evaluation.
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
            <span>Portfolio Profile: Alex Chen (verified)</span>
            <Link
              href="/growth/independence"
              className="font-semibold text-[#5B3BFF] dark:text-indigo-400 hover:underline"
            >
              View Full Independence Framework →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
