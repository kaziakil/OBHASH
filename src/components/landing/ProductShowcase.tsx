"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ShowcaseTab {
  id: string;
  label: string;
  headline: string;
  description: string;
  screenshotSrc: string;
  badge: string;
  targetRoute: string;
  buttonLabel: string;
  features: string[];
}

const TABS: ShowcaseTab[] = [
  {
    id: "assessment",
    label: "1. Baseline Assessment",
    headline: "Diagnostic Capability Scoring With Verbatim Citations",
    description:
      "Before building capability, OBHASH diagnoses your current baseline. Unlike simple multiple-choice quizzes, our evaluation engine analyzes multi-part reasoning and quotes your actual text to highlight strengths and developmental gaps.",
    screenshotSrc: "/showcase/assessment.png",
    badge: "Phase 3 Engine",
    targetRoute: "/assessment",
    buttonLabel: "Explore Assessment Runner",
    features: [
      "Multi-part open reasoning scenarios",
      "Grounded 4-level rubric evaluation",
      "Direct verbatim citations as evidence",
      "Dynamic baseline profile calculation",
    ],
  },
  {
    id: "coach",
    label: "2. Socratic AI Coach",
    headline: "A Thinking Partner That Refuses to Spoon-Feed Answers",
    description:
      "When you encounter a mental roadblock, the AI Growth Coach steps in. Configured with strict Socratic rules, it refuses to solve problems for you, instead offering three tiers of scaffolded hints to prompt your own deductive breakthrough.",
    screenshotSrc: "/showcase/coach.png",
    badge: "Phase 5 Engine",
    targetRoute: "/coach",
    buttonLabel: "Launch Socratic Coach",
    features: [
      "Socratic dialogue calibrated for cognitive inquiry",
      "Progressive hint scaffolding (Levels 1–3)",
      "Contextual perspective-challenging actions",
      "Comprehensive session insight summaries",
    ],
  },
  {
    id: "workspace",
    label: "3. Practical Challenges",
    headline: "Real-World Execution With AI Assistance Telemetry",
    description:
      "Practice your capabilities in structured challenge workspaces. Tackle messy, open-ended problems across marketing, urban planning, and science while the system transparently logs every AI interaction to protect authentic human effort.",
    screenshotSrc: "/showcase/workspace.png",
    badge: "Phase 6 Engine",
    targetRoute: "/challenges",
    buttonLabel: "Browse Challenge Library",
    features: [
      "Dual-pane workspace with live debounced autosave",
      "Integrated AI Coach drawer with prompt injection defense",
      "Auditable AI assistance categorization (Levels A–E)",
      "Post-submission metacognitive reflection prompts",
    ],
  },
  {
    id: "independence",
    label: "4. Independence & Portfolio",
    headline: "5 Autonomy Dimensions & Shareable Growth Showcase",
    description:
      "Every completed challenge and reflection feeds into the Independence Measurement Engine. Track 5 dimensions of intellectual autonomy and publish a clean, verifiable Growth Portfolio like Alex Chen's profile.",
    screenshotSrc: "/showcase/portfolio.png",
    badge: "Phase 7 Engine",
    targetRoute: "/p/alex-chen",
    buttonLabel: "View Live Alex Chen Portfolio",
    features: [
      "5 Core Independence Dimensions (Autonomy, Reflection, Rigor)",
      "Level A (Unassisted) & Level B (AI-Informed) verification",
      "Transparent AI disclosure statements attached to work",
      "Clean, public URL showcase ready for external evaluation",
    ],
  },
];

export function ProductShowcase() {
  const [activeTabId, setActiveTabId] = useState<string>("assessment");
  const currentTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <section id="showcase" className="py-24 bg-white dark:bg-[#111019] border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5B3BFF]/10 text-[#5B3BFF] dark:text-indigo-300 border border-[#5B3BFF]/20">
            Real Product Experience
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#17151F] dark:text-zinc-50 leading-[1.15]">
            Built, Tested, and Fully Demonstrable
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            OBHASH is not a speculative mockup or slide deck. Every stage is a functional, tested application module ready for live interaction.
          </p>
        </div>

        {/* Tab Selector Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#17151F] text-white dark:bg-white dark:text-[#17151F] shadow-md shadow-black/10 scale-102"
                    : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Card */}
        <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/60 dark:bg-[#161421] p-6 sm:p-10 shadow-lg shadow-zinc-500/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Details & Value Proposition (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#5B3BFF]/10 text-[#5B3BFF] border border-[#5B3BFF]/20">
                  {currentTab.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17151F] dark:text-white leading-tight">
                  {currentTab.headline}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {currentTab.description}
              </p>

              {/* Feature Checklist */}
              <div className="space-y-2.5 pt-2">
                {currentTab.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-200 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Link
                  href={currentTab.targetRoute}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-3 rounded-xl bg-[#5B3BFF] hover:bg-[#4829E6] text-white shadow-md shadow-[#5B3BFF]/20 hover:shadow-lg hover:shadow-[#5B3BFF]/30 active:scale-98 transition-all"
                >
                  <span>{currentTab.buttonLabel}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Column: High-Res Interface Screenshot (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#111019] p-2 shadow-2xl shadow-indigo-500/10 overflow-hidden group">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={currentTab.screenshotSrc}
                    alt={currentTab.headline}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>
                <div className="px-3 py-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Live Product Interface Snapshot</span>
                  <Link href={currentTab.targetRoute} className="hover:text-[#5B3BFF] font-sans font-semibold">
                    Launch Interactive View ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
