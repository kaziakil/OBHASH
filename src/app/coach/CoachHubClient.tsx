"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startCoachingSession } from "@/lib/coach/actions";
import type { CoachingCapabilityKey, CoachingSession } from "@/types/coach";
import type { GrowthJourneyData } from "@/types/journey";
import type { CapabilityBaselineProfile } from "@/types/assessment";

interface CoachHubClientProps {
  initialSessions: CoachingSession[];
  activeJourney: GrowthJourneyData | null;
  capabilityProfiles: CapabilityBaselineProfile[];
}

export function CoachHubClient({
  initialSessions,
  activeJourney,
  capabilityProfiles,
}: CoachHubClientProps) {
  const router = useRouter();
  const [sessions] = useState<CoachingSession[]>(initialSessions);
  const [isStarting, setIsStarting] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [selectedCapability, setSelectedCapability] = useState<CoachingCapabilityKey>("critical-thinking");
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async (
    capabilityKey: CoachingCapabilityKey,
    title?: string,
    goalId?: string
  ) => {
    setIsStarting(true);
    setError(null);
    try {
      const res = await startCoachingSession({
        capabilityKey,
        title,
        journeyId: activeJourney?.id || null,
        goalId: goalId || null,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to start coaching session.");
      }

      router.push(`/coach/${res.data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating session");
      setIsStarting(false);
    }
  };

  const handleStartCustomSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    handleStartSession(selectedCapability, customTopic.trim());
  };

  const ctProf = capabilityProfiles.find((p) => p.capabilityKey === "critical-thinking");
  const cpsProf = capabilityProfiles.find((p) => p.capabilityKey === "creative-problem-solving");
  const cuProf = capabilityProfiles.find((p) => p.capabilityKey === "curiosity");

  const capabilityBadges: Record<CoachingCapabilityKey, { name: string; color: string }> = {
    "critical-thinking": {
      name: "Critical Thinking",
      color: "bg-indigo-50 text-indigo-800 border-indigo-200",
    },
    "creative-problem-solving": {
      name: "Creative Problem-Solving",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    curiosity: {
      name: "Curiosity",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-500">
          <Link href="/dashboard" className="hover:text-stone-900 transition">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">AI Growth Coach</span>
        </div>

        {/* Page Hero Header */}
        <div className="border-b border-stone-200 pb-6 space-y-3">
          <div className="inline-flex items-center space-x-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Phase 5: Socratic Mentorship
            </span>
            <span className="text-xs text-stone-400 font-mono">Coach, Don&apos;t Replace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            AI Growth Coach
          </h1>
          <p className="text-stone-600 text-base max-w-2xl leading-relaxed">
            Think further. Explore deeper. Solve better. Your Growth Coach won&apos;t simply hand you
            answers—it helps you develop the independent ability to find better ones.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* CONTEXTUAL COACHING RECOMMENDATION FROM ACTIVE JOURNEY */}
        {activeJourney && activeJourney.focusAreas.length > 0 && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                <span>🎯</span>
                <span>Recommended from Active Journey: &quot;{activeJourney.title}&quot;</span>
              </span>
              <span className="text-xs font-mono text-emerald-700">Context Synchronized</span>
            </div>
            <p className="text-xs text-stone-700">
              Practice reasoning directly on your active developmental goals with Socratic guidance:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {activeJourney.focusAreas.flatMap((fa) =>
                fa.goals.slice(0, 1).map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    disabled={isStarting}
                    onClick={() =>
                      handleStartSession(fa.capabilityKey, `Coaching: ${goal.title}`, goal.id)
                    }
                    className="text-left p-3.5 bg-white rounded-xl border border-emerald-200 hover:border-emerald-300 transition shadow-2xs hover:shadow-sm space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-800">
                        {fa.capabilityName}
                      </span>
                      <span className="text-xs font-medium text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                        Start Session →
                      </span>
                    </div>
                    <div className="font-serif font-bold text-stone-900 text-sm">{goal.title}</div>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{goal.description}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* THREE CAPABILITY-SPECIFIC COACHING MODES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Select Coaching Capability
            </h2>
            <span className="text-xs text-stone-500 font-mono">3 Specialized Socratic Modes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Critical Thinking */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl block">⚖️</span>
                  {ctProf && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-medium">
                      Baseline: {ctProf.overallScore.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                  Critical Thinking Coach
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Analytical Rigor & Evidence
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Isolate hidden assumptions, distinguish correlation from causation, and build
                  objective, well-reasoned defenses against counterarguments.
                </p>
                <div className="pt-2 text-[11px] text-stone-400 font-mono border-t border-stone-100">
                  Dimensions: Evidence Evaluation, Logic, Perspective Evaluation
                </div>
              </div>
              <button
                type="button"
                disabled={isStarting}
                onClick={() =>
                  handleStartSession(
                    "critical-thinking",
                    "Critical Thinking: Deconstructing Claims"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-indigo-900 text-white font-medium text-xs hover:bg-indigo-950 transition disabled:opacity-50"
              >
                {isStarting ? "Starting..." : "Start Critical Thinking Session →"}
              </button>
            </div>

            {/* 2. Creative Problem-Solving */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl block">💡</span>
                  {cpsProf && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-medium">
                      Baseline: {cpsProf.overallScore.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Creative Problem-Solving Coach
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Divergence & Reframing
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Overcome premature cognitive convergence. Reframe bottlenecks using biological or
                  cross-domain analogies and iterate past standard answers.
                </p>
                <div className="pt-2 text-[11px] text-stone-400 font-mono border-t border-stone-100">
                  Dimensions: Idea Generation, Originality, Cognitive Flexibility
                </div>
              </div>
              <button
                type="button"
                disabled={isStarting}
                onClick={() =>
                  handleStartSession(
                    "creative-problem-solving",
                    "Creative Problem-Solving: Reframing Bottlenecks"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-amber-800 text-white font-medium text-xs hover:bg-amber-900 transition disabled:opacity-50"
              >
                {isStarting ? "Starting..." : "Start Creative Synthesis Session →"}
              </button>
            </div>

            {/* 3. Curiosity */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl block">🔭</span>
                  {cuProf && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium">
                      Baseline: {cuProf.overallScore.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Curiosity Coach
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Inquiry Trees & Discovery
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Turn vague wonder into generative second-order questions. Explore systemic roots,
                  outlier signals, and cross-disciplinary mysteries.
                </p>
                <div className="pt-2 text-[11px] text-stone-400 font-mono border-t border-stone-100">
                  Dimensions: Question Formulation, Exploration, Intellectual Openness
                </div>
              </div>
              <button
                type="button"
                disabled={isStarting}
                onClick={() =>
                  handleStartSession("curiosity", "Curiosity: Recursive Inquiry Mapping")
                }
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 transition disabled:opacity-50"
              >
                {isStarting ? "Starting..." : "Start Curiosity Session →"}
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOM TOPIC START FORM */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Or Explore a Custom Question or Problem
            </h2>
            <p className="text-stone-500 text-xs">
              Bring any real-world challenge, editorial claim, or curious phenomenon you want to
              dissect.
            </p>
          </div>

          <form onSubmit={handleStartCustomSession} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Coaching Focus
                </label>
                <select
                  value={selectedCapability}
                  onChange={(e) => setSelectedCapability(e.target.value as CoachingCapabilityKey)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="critical-thinking">Critical Thinking</option>
                  <option value="creative-problem-solving">Creative Problem-Solving</option>
                  <option value="curiosity">Curiosity & Inquiry</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Topic, Claim, or Question
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Can distributed micro-grids solve urban power brownouts?"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!customTopic.trim() || isStarting}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition disabled:opacity-40"
              >
                {isStarting ? "Starting..." : "Begin Guided Session →"}
              </button>
            </div>
          </form>
        </div>

        {/* RECENT COACHING SESSIONS */}
        {sessions.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Recent Coaching Sessions ({sessions.length})
              </h2>
              <span className="text-xs text-stone-400 font-mono">Continuous Development</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map((sess) => {
                const badge = capabilityBadges[sess.capabilityKey];
                return (
                  <div
                    key={sess.id}
                    className="p-5 bg-white rounded-xl border border-stone-200 space-y-3 hover:border-stone-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}
                      >
                        {badge.name}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        {new Date(sess.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-stone-900 text-base">{sess.title}</h3>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                      <span>{sess.messages.length} exchanges</span>
                      <Link
                        href={`/coach/${sess.id}`}
                        className="font-semibold text-emerald-800 hover:text-emerald-950 underline"
                      >
                        Continue Session →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
