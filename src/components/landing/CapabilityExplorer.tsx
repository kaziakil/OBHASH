"use client";

import React, { useState } from "react";
import Link from "next/link";

interface CapabilityData {
  id: string;
  slug: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  badgeStyle: string;
  borderStyle: string;
  mentalModels: string[];
  rubricFocus: { criteria: string; target: string }[];
  sampleChallenge: {
    title: string;
    scenario: string;
    href: string;
  };
}

const CAPABILITIES: CapabilityData[] = [
  {
    id: "critical-thinking",
    slug: "critical-thinking",
    number: "01",
    name: "Critical Thinking",
    tagline: "Discerning truth from plausibility",
    description:
      "The disciplined ability to evaluate assertions, dissect causal claims, isolate confounding variables, and recognize cognitive bias in an age of automated persuasion.",
    accentColor: "from-blue-600 to-indigo-600",
    badgeStyle: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    borderStyle: "border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-400 dark:hover:border-indigo-700",
    mentalModels: [
      "Correlation vs. Causation Dissection",
      "Falsification & Counterfactual Reasoning",
      "Selection & Survivorship Bias Identification",
      "Source Provenance & Evidentiary Weighting",
    ],
    rubricFocus: [
      { criteria: "Evidentiary Discernment", target: "Isolates unsupported premises and demands empirical backing." },
      { criteria: "Logical Coherence", target: "Constructs deductive chains without fallacious leaps." },
      { criteria: "Counter-Argument Rigor", target: "Steelmans opposing interpretations objectively." },
    ],
    sampleChallenge: {
      title: "The Unproven Claim: Dissecting Wellness Marketing",
      scenario: "Evaluate a viral dietary supplement advertorial. Identify hidden selection biases, unmeasured lifestyle covariates, and design an objective clinical trial.",
      href: "/challenges/the-unproven-claim",
    },
  },
  {
    id: "creative-problem-solving",
    slug: "creative-problem-solving",
    number: "02",
    name: "Creative Problem-Solving",
    tagline: "Synthesizing novel connections under constraint",
    description:
      "The capacity to reframe ambiguous challenges, break through functional fixedness, synthesize cross-domain metaphors, and prototype unconventional, workable solutions.",
    accentColor: "from-[#5B3BFF] to-violet-600",
    badgeStyle: "bg-[#5B3BFF]/10 text-[#5B3BFF] dark:text-indigo-300 border-[#5B3BFF]/20",
    borderStyle: "border-[#5B3BFF]/30 dark:border-[#5B3BFF]/30 hover:border-[#5B3BFF] dark:hover:border-[#5B3BFF]",
    mentalModels: [
      "Constraint Inversion & Lateral Thinking",
      "Cross-Domain Analogy & Biomimicry",
      "Divergent-Convergent Idea Cycling",
      "First Principles Solution Prototyping",
    ],
    rubricFocus: [
      { criteria: "Perspective Multiplicity", target: "Generates divergent solutions crossing conventional boundaries." },
      { criteria: "Feasibility Synthesis", target: "Harmonizes radical novelty with practical real-world execution." },
      { criteria: "Constraint Reframing", target: "Turns perceived resource limitations into central advantages." },
    ],
    sampleChallenge: {
      title: "The Multi-Perspective Urban Transit Dilemma",
      scenario: "Re-architect a congested historic downtown without building new highways or bulldozing historic heritage. Harmonize pedestrian autonomy and freight logistics.",
      href: "/challenges",
    },
  },
  {
    id: "curiosity",
    slug: "curiosity",
    number: "03",
    name: "Curiosity Cultivation",
    tagline: "Active inquiry beyond the surface",
    description:
      "The self-directed drive to venture into the unknown, formulate probing second-order questions, explore systemic interconnections, and resist premature closure.",
    accentColor: "from-amber-500 to-orange-600",
    badgeStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    borderStyle: "border-amber-200 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-700",
    mentalModels: [
      "Second-Order Inquiry Trees",
      "Interdisciplinary Boundary Exploration",
      "Assumption Challenging Protocols",
      "Epistemic Humility & Active Listening",
    ],
    rubricFocus: [
      { criteria: "Inquiry Depth", target: "Formulates questions that penetrate beneath symptom to root cause." },
      { criteria: "Breadth of Exploration", target: "Connects insights across seemingly unrelated disciplines." },
      { criteria: "Intellectual Openness", target: "Willingly tests own priors against unexpected empirical findings." },
    ],
    sampleChallenge: {
      title: "Mapping the Horizon of Unasked Questions",
      scenario: "Investigate an emergent technological breakthrough. Generate an inquiry map of 12 non-obvious ethical, ecological, and sociological questions.",
      href: "/challenges",
    },
  },
];

export function CapabilityExplorer() {
  const [activeViews, setActiveViews] = useState<Record<string, "models" | "rubric" | "challenge">>({
    "critical-thinking": "models",
    "creative-problem-solving": "challenge",
    "curiosity": "rubric",
  });

  const toggleView = (capId: string, view: "models" | "rubric" | "challenge") => {
    setActiveViews((prev) => ({ ...prev, [capId]: view }));
  };

  return (
    <section id="capabilities" className="py-24 bg-zinc-50/70 dark:bg-[#0E0D14] border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5B3BFF]/10 text-[#5B3BFF] dark:text-indigo-300 border border-[#5B3BFF]/20">
            Cognitive Foundations
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#17151F] dark:text-zinc-50 leading-[1.15]">
            Three Capabilities That Cannot Be Automated
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            When machines generate language and code at scale, human value shifts from simple recall to foundational cognitive discernment. OBHASH focuses on three core human faculties.
          </p>
        </div>

        {/* 3 Capability Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CAPABILITIES.map((cap) => {
            const currentView = activeViews[cap.id] || "models";

            return (
              <div
                key={cap.id}
                className={`rounded-2xl border bg-white dark:bg-[#161421] p-7 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-xl ${cap.borderStyle}`}
              >
                {/* Top: Identity & Description */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      Faculty {cap.number}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cap.badgeStyle}`}>
                      {cap.tagline}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#17151F] dark:text-white">
                      {cap.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                      {cap.description}
                    </p>
                  </div>

                  {/* Micro-Interaction Tabs */}
                  <div className="pt-2">
                    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      <button
                        type="button"
                        onClick={() => toggleView(cap.id, "models")}
                        className={`flex-1 py-1 px-2 rounded-md transition-all text-center text-[11px] ${
                          currentView === "models"
                            ? "bg-white dark:bg-[#17151F] text-zinc-950 dark:text-white font-bold shadow-xs"
                            : "hover:text-zinc-950 dark:hover:text-white"
                        }`}
                      >
                        Mental Models
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleView(cap.id, "rubric")}
                        className={`flex-1 py-1 px-2 rounded-md transition-all text-center text-[11px] ${
                          currentView === "rubric"
                            ? "bg-white dark:bg-[#17151F] text-zinc-950 dark:text-white font-bold shadow-xs"
                            : "hover:text-zinc-950 dark:hover:text-white"
                        }`}
                      >
                        Rubric Criteria
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleView(cap.id, "challenge")}
                        className={`flex-1 py-1 px-2 rounded-md transition-all text-center text-[11px] ${
                          currentView === "challenge"
                            ? "bg-white dark:bg-[#17151F] text-zinc-950 dark:text-white font-bold shadow-xs"
                            : "hover:text-zinc-950 dark:hover:text-white"
                        }`}
                      >
                        Live Challenge
                      </button>
                    </div>
                  </div>

                  {/* Tab Panels */}
                  <div className="min-h-[170px] pt-2">
                    {/* Panel 1: Mental Models */}
                    {currentView === "models" && (
                      <div className="space-y-2 animate-in fade-in duration-150">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                          Trained Cognitive Habits:
                        </span>
                        <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                          {cap.mentalModels.map((m, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#5B3BFF] font-bold">›</span>
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Panel 2: Rubric Focus */}
                    {currentView === "rubric" && (
                      <div className="space-y-2 animate-in fade-in duration-150">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                          Evaluation Indicators:
                        </span>
                        <div className="space-y-2 text-xs">
                          {cap.rubricFocus.map((rf, i) => (
                            <div key={i} className="p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[11px]">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{rf.criteria}</span>
                              <span className="text-zinc-500 dark:text-zinc-400">{rf.target}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Panel 3: Live Challenge */}
                    {currentView === "challenge" && (
                      <div className="space-y-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 animate-in fade-in duration-150 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B3BFF] block">
                          Featured Challenge
                        </span>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                          {cap.sampleChallenge.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                          {cap.sampleChallenge.scenario}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
                  <Link
                    href={`/assessment/${cap.slug}`}
                    className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold bg-[#17151F] text-white dark:bg-white dark:text-[#17151F] hover:bg-[#5B3BFF] dark:hover:bg-[#5B3BFF] dark:hover:text-white transition-colors"
                  >
                    Take Diagnostic →
                  </Link>
                  <Link
                    href="/challenges"
                    className="text-xs font-semibold text-zinc-500 hover:text-[#5B3BFF] px-2 py-2"
                  >
                    Browse Tasks
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
