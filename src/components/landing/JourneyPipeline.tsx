"use client";

import React, { useState } from "react";
import Link from "next/link";

interface StageDetail {
  number: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  userAction: string;
  evidenceProduced: string;
  targetRoute: string;
  routeLabel: string;
  color: string;
}

const STAGES: StageDetail[] = [
  {
    number: "01",
    name: "Assess",
    shortDesc: "Diagnostic baseline across 3 core capabilities",
    fullDesc: "Complete grounded real-world scenario items evaluating your reasoning, assumption questioning, and bias recognition without AI assistance.",
    userAction: "Analyzes scenario text, evaluates claims, and defends answers.",
    evidenceProduced: "Evaluated capability baseline profile with rubric dimension scores.",
    targetRoute: "/assessment",
    routeLabel: "Launch Assessment Hub",
    color: "from-blue-600 to-indigo-600",
  },
  {
    number: "02",
    name: "Explore",
    shortDesc: "Evidence-informed personalized development roadmap",
    fullDesc: "OBHASH synthesizes your diagnostic strengths and growth frontiers into a multi-week developmental journey with tailored focus areas and goals.",
    userAction: "Reviews recommended development goals, milestones, and challenges.",
    evidenceProduced: "Active developmental roadmap anchored to diagnostic gaps.",
    targetRoute: "/journey",
    routeLabel: "Explore Growth Journeys",
    color: "from-indigo-600 to-violet-600",
  },
  {
    number: "03",
    name: "Guide",
    shortDesc: "Socratic AI Growth Coach as thinking partner",
    fullDesc: "Engage in guided Socratic dialogue. When you get stuck, the coach refuses to answer for you, providing tiered progressive hints (L1–L3) instead.",
    userAction: "Formulates questions, considers alternative perspectives, tests hypotheses.",
    evidenceProduced: "Session summary capturing key insights and hint-dependency telemetry.",
    targetRoute: "/coach",
    routeLabel: "Start Socratic Session",
    color: "from-[#5B3BFF] to-purple-600",
  },
  {
    number: "04",
    name: "Create",
    shortDesc: "Practical challenges in unstructured domains",
    fullDesc: "Execute real-world challenges in a split-pane workspace with continuous autosave, deliverable inputs, and transparent AI assistance logging.",
    userAction: "Drafts comprehensive deliverables, reframes problems, synthesizes solutions.",
    evidenceProduced: "Immutable primary deliverable snapshot with verbatim quotes.",
    targetRoute: "/challenges",
    routeLabel: "Browse Challenge Catalog",
    color: "from-purple-600 to-pink-600",
  },
  {
    number: "05",
    name: "Reflect",
    shortDesc: "Metacognitive self-examination and insight capture",
    fullDesc: "Examine how your thinking shifted during challenge execution. Articulate initial assumptions, mental breakthroughs, and how AI was utilized.",
    userAction: "Answers structured metacognitive prompts examining cognitive process.",
    evidenceProduced: "Metacognitive reflection record paired with challenge evaluation.",
    targetRoute: "/my-work",
    routeLabel: "View Workspace Reflections",
    color: "from-pink-600 to-rose-600",
  },
  {
    number: "06",
    name: "Demonstrate",
    shortDesc: "Authenticated deliverables with transparent AI disclosures",
    fullDesc: "Prove human agency through Level A independent artifacts. Disclose every AI interaction categorized by assistance type and user refinement.",
    userAction: "Curates verified artifacts and attaches transparent usage statements.",
    evidenceProduced: "Level A/B classified evidence ready for portfolio curation.",
    targetRoute: "/growth/independence",
    routeLabel: "Inspect Evidence Classifier",
    color: "from-amber-600 to-orange-600",
  },
  {
    number: "07",
    name: "Track",
    shortDesc: "5 independence dimensions & public Growth Portfolio",
    fullDesc: "Monitor your longitudinal development across 5 independence dimensions and publish a shareable, verifiable Growth Portfolio like /p/alex-chen.",
    userAction: "Monitors cognitive autonomy metrics and publishes public showcase.",
    evidenceProduced: "Living, shareable proof of human capability and intellectual self-reliance.",
    targetRoute: "/p/alex-chen",
    routeLabel: "View Public Showcase",
    color: "from-emerald-600 to-teal-600",
  },
];

export function JourneyPipeline() {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const activeStage = STAGES[selectedStageIndex];

  return (
    <section id="journey" className="py-24 bg-white dark:bg-[#111019] border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            The Seven-Stage Progression
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#17151F] dark:text-zinc-50 leading-[1.15]">
            How Capability Develops
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Intellectual capability is not built overnight through trivia quizzes. OBHASH guides you through an integrated, continuous development cycle that transforms single efforts into permanent intellectual autonomy.
          </p>
        </div>

        {/* Desktop Pipeline Visualizer */}
        <div className="hidden lg:block">
          {/* Stepper Header Bar */}
          <div className="relative">
            {/* Connecting Bar */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-zinc-200 dark:bg-zinc-800 -z-0" />

            <div className="relative z-10 grid grid-cols-7 gap-2">
              {STAGES.map((stg, idx) => {
                const isSelected = selectedStageIndex === idx;
                const isPast = selectedStageIndex > idx;

                return (
                  <button
                    key={stg.number}
                    type="button"
                    onClick={() => setSelectedStageIndex(idx)}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold font-mono text-sm transition-all duration-200 border-2 ${
                        isSelected
                          ? "bg-[#5B3BFF] text-white border-[#5B3BFF] shadow-lg shadow-[#5B3BFF]/30 scale-110"
                          : isPast
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                          : "bg-white dark:bg-[#161421] text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 group-hover:border-[#5B3BFF]"
                      }`}
                    >
                      {stg.number}
                    </div>
                    <span
                      className={`text-xs font-bold mt-3 transition-colors ${
                        isSelected
                          ? "text-[#5B3BFF] dark:text-indigo-400"
                          : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
                      }`}
                    >
                      {stg.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 text-center line-clamp-1 mt-0.5 px-1">
                      {stg.shortDesc.split(" ")[0]} {stg.shortDesc.split(" ")[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Stage Detail Showcase Card */}
        <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-[#161421] p-6 sm:p-10 shadow-lg shadow-zinc-500/5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200/70 dark:border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#5B3BFF]/10 text-[#5B3BFF] border border-[#5B3BFF]/20">
                  Stage {activeStage.number} of 07
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  {activeStage.shortDesc}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17151F] dark:text-white">
                Stage {activeStage.number}: {activeStage.name}
              </h3>
            </div>

            <Link
              href={activeStage.targetRoute}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#5B3BFF] hover:bg-[#4829E6] text-white shadow-sm transition-all"
            >
              <span>{activeStage.routeLabel}</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Purpose & Scaffolding:
              </span>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {activeStage.fullDesc}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Active Human Action:
              </span>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {activeStage.userAction}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Measurable Evidence Produced:
              </span>
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                {activeStage.evidenceProduced}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Connected Vertical Timeline View */}
        <div className="lg:hidden space-y-4 pt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block text-center mb-2">
            All 7 Stages at a Glance (Tap to select)
          </span>
          <div className="space-y-3">
            {STAGES.map((stg, idx) => (
              <button
                key={stg.number}
                type="button"
                onClick={() => setSelectedStageIndex(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  selectedStageIndex === idx
                    ? "border-[#5B3BFF] bg-[#5B3BFF]/5 dark:bg-[#5B3BFF]/10 shadow-sm"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#161421]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    selectedStageIndex === idx
                      ? "bg-[#5B3BFF] text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {stg.number}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {stg.name}
                    </span>
                    {selectedStageIndex === idx && (
                      <span className="text-[10px] text-[#5B3BFF] font-semibold">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {stg.shortDesc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
