"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle, CardDescription } from "@/components/shared/Card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import { signOutAction } from "@/lib/auth/actions";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { CapabilityBaselineProfile } from "@/types/assessment";
import type { GrowthJourneyData } from "@/types/journey";

interface DashboardClientViewProps {
  displayName: string;
  email: string;
  interests: string[];
  growthIntentions: string[];
  isSupabaseConfigured: boolean;
  capabilities: readonly { id: string; title: string; description: string; color: string }[];
  appName: string;
  capabilityProfiles?: CapabilityBaselineProfile[];
  activeJourney?: GrowthJourneyData | null;
}

const JOURNEY_STAGES = [
  { step: "01", name: "Assess", desc: "Discover baseline cognitive strengths and growth frontiers." },
  { step: "02", name: "Explore", desc: "Engage with core concepts across diverse domains." },
  { step: "03", name: "Guide", desc: "Collaborate with an AI coach focused on inquiry over answers." },
  { step: "04", name: "Create", desc: "Tackle open challenges requiring original, independent thought." },
  { step: "05", name: "Reflect", desc: "Articulate decisions, mental models, and lessons learned." },
  { step: "06", name: "Demonstrate", desc: "Apply capabilities independently without AI scaffolding." },
  { step: "07", name: "Track", desc: "Consolidate authentic demonstrated growth in your portfolio." },
];

export function DashboardClientView({
  displayName,
  email,
  interests,
  growthIntentions,
  isSupabaseConfigured,
  capabilities,
  capabilityProfiles = [],
  activeJourney = null,
}: DashboardClientViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "journey" | "profile" | "portfolio">("overview");
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const t = dictionaries.en.dashboard;

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOutAction();
  }

  const completedCount = capabilityProfiles.length;
  const allCompleted = completedCount >= capabilities.length;

  // Extract next activity and upcoming milestone from active journey
  let nextActivity: { title: string; estimatedMinutes: number; purpose: string } | null = null;
  let upcomingMilestone: { title: string; period: string } | null = null;
  if (activeJourney) {
    for (const fa of activeJourney.focusAreas) {
      for (const goal of fa.goals) {
        for (const ms of goal.milestones) {
          if (!upcomingMilestone && ms.status !== "completed") {
            upcomingMilestone = { title: ms.title, period: ms.suggestedPeriod };
          }
          for (const act of ms.activities) {
            if (!nextActivity && act.status !== "completed") {
              nextActivity = {
                title: act.title,
                estimatedMinutes: act.estimatedMinutes,
                purpose: act.purpose,
              };
            }
          }
        }
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Top Dashboard Navigation Bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-sm font-medium">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              Overview
            </button>
            <Link
              href="/assessment"
              className="px-3.5 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Assessments Hub
            </Link>
            <button
              onClick={() => setActiveTab("journey")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "journey"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              My Journey
            </button>
            <Link
              href="/coach"
              className="px-3.5 py-1.5 rounded-lg text-emerald-800 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1.5"
            >
              <span>🌱</span>
              <span>Growth Coach</span>
            </Link>
            <Link
              href="/challenges"
              className="px-3.5 py-1.5 rounded-lg text-indigo-700 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center gap-1.5"
            >
              <span>🎯</span>
              <span>Challenges</span>
            </Link>
            <Link
              href="/my-work"
              className="px-3.5 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 font-semibold hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <span>📁</span>
              <span>My Work</span>
            </Link>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "profile"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              Growth Profile
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "portfolio"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              Portfolio
            </button>
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Settings
            </Link>
            <Button
              variant="outline"
              size="sm"
              isLoading={isSigningOut}
              onClick={handleSignOut}
              className="text-xs"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {!isSupabaseConfigured && (
          <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3">
            <span className="text-base">⚠️</span>
            <div>
              <p className="font-semibold">Supabase Configuration Standby</p>
              <p className="mt-0.5">
                Operating with local session storage. Live database synchronization requires <code className="font-mono font-bold">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code className="font-mono font-bold">.env.local</code>.
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-10 animate-in fade-in duration-150">
            {/* Welcome Banner */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Phase 3 Active
                  </span>
                  <StatusBadge
                    status={allCompleted ? "healthy" : "operational"}
                    label={allCompleted ? "Baseline Complete" : `${completedCount}/3 Assessed`}
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Welcome back, {displayName}.
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t.tagline}
                </p>
              </div>

              {/* Next Step CTA Card */}
              {activeJourney ? (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-300 dark:border-emerald-800 rounded-xl p-5 md:max-w-md w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                      Active Growth Journey
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Stage 02: Explore & Guide</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {activeJourney.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {activeJourney.description}
                  </p>
                  {nextActivity && (
                    <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-emerald-200 dark:border-emerald-900/60 text-xs">
                      <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                        Next Up:{" "}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {nextActivity.title} (⏱ {nextActivity.estimatedMinutes}m)
                      </span>
                    </div>
                  )}
                  <Link href={`/journey/${activeJourney.id}`} className="block w-full">
                    <Button variant="primary" size="sm" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white">
                      Continue Growth Journey →
                    </Button>
                  </Link>
                </div>
              ) : completedCount > 0 ? (
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50/50 dark:from-indigo-950/30 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-5 md:max-w-md w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Baseline Established
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Ready for Personalization</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Design Your Personalized Growth Journey
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Convert your assessment evidence into structured, progressive milestones and targeted activities.
                  </p>
                  <Link href="/journey/create" className="block w-full">
                    <Button variant="primary" size="sm" className="w-full">
                      Design Growth Journey →
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50/50 dark:from-indigo-950/30 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-5 md:max-w-md w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Primary Next Step
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Stage 01: Assess</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {t.assessmentPromptTitle}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t.assessmentPromptDesc}
                  </p>
                  <Link href="/assessment" className="block w-full">
                    <Button variant="primary" size="sm" className="w-full">
                      {`${t.assessmentCta} →`}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Target Capabilities Section */}
            <div className="space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {t.capabilitiesTitle}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Demonstrated baseline capability indicators.
                  </p>
                </div>
                <Link
                  href="/assessment"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Assessment Hub →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {capabilities.map((cap, idx) => {
                  const prof = capabilityProfiles.find((p) => p.capabilityKey === cap.id);
                  return (
                    <Card
                      key={cap.id}
                      className="relative group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-zinc-400">0{idx + 1}</span>
                          {prof ? (
                            <StatusBadge status="operational" label={prof.performanceLevel} />
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              Pending Assessment
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg">{cap.title}</CardTitle>
                        <CardDescription className="text-xs">{cap.description}</CardDescription>
                      </div>

                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4 flex items-center justify-between text-xs">
                        {prof ? (
                          <>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              Score: {prof.overallScore.toFixed(2)} / 4.00
                            </span>
                            <Link
                              href="/assessment"
                              className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                              Details →
                            </Link>
                          </>
                        ) : (
                          <>
                            <span className="text-zinc-400">Baseline Needed</span>
                            <Link
                              href={`/assessment/${cap.id}`}
                              className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                              Start Assessment →
                            </Link>
                          </>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* AI Growth Coach Banner */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-stone-50 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Phase 5 Active
                  </span>
                  <span className="text-xs font-mono text-stone-500">Socratic Thinking Partner</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Practice with the AI Growth Coach
                </h3>
                <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
                  Engage in Socratic mentorship to deconstruct arguments, reframe constraints, and
                  develop multi-tier question trees—without AI doing the thinking for you.
                </p>
              </div>
              <Link
                href="/coach"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 transition shadow-sm whitespace-nowrap self-start sm:self-center"
              >
                Open Growth Coach →
              </Link>
            </div>

            {/* Phase 6: Challenge Practice Workspace Banner */}
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-white dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-zinc-900 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    Phase 6 Active
                  </span>
                  <span className="text-xs font-mono text-zinc-500">Practice & Reflection Workspace</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Tackle Capability Challenges & Build Evidence
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                  Engage with authentic real-world problem scenarios across Critical Thinking, Creative Problem-Solving, and Curiosity. Record your reasoning, submit for grounded rubric evaluation, and reflect.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Link
                  href="/my-work"
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  My Work
                </Link>
                <Link
                  href="/challenges"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition shadow-sm whitespace-nowrap"
                >
                  Explore Challenges →
                </Link>
              </div>
            </div>

            {/* Seven-Stage Journey Preview */}
            <div className="space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {t.journeyTitle}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {t.journeyDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {JOURNEY_STAGES.map((s, idx) => (
                  <div
                    key={s.step}
                    className={`p-4 rounded-xl border transition-all ${
                      idx === 0
                        ? "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 opacity-75"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {s.step}
                      </span>
                      {idx === 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                      {s.name}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Snapshot Card */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Your Learning Profile Snapshot
                </h3>
                <Link
                  href="/settings"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Edit Profile →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-1">Account Email</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{email}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Selected Interests</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {interests.length > 0 ? interests.join(", ") : "None specified"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Growth Intentions</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {growthIntentions.length > 0
                      ? growthIntentions.join(", ")
                      : "General Exploration"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Journey */}
        {activeTab === "journey" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {activeJourney ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {activeJourney.status} Journey
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">
                          {activeJourney.targetDuration} • {activeJourney.weeklyCommitmentHours}
                        </span>
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                        {activeJourney.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                        {activeJourney.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/journey/${activeJourney.id}`}
                        className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition"
                      >
                        Open Complete Journey →
                      </Link>
                    </div>
                  </div>

                  {/* Focus Areas Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeJourney.focusAreas.map((fa) => (
                      <div
                        key={fa.id}
                        className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2"
                      >
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                          {fa.capabilityName}
                        </span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {fa.rationale}
                        </p>
                        <div className="text-[11px] text-zinc-400 pt-1 font-mono">
                          {fa.goals.length} Goals Planned
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {nextActivity && (
                      <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                        <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400">
                          Next Planned Activity
                        </span>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          {nextActivity.title}
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          {nextActivity.purpose}
                        </p>
                        <div className="text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                          ⏱ {nextActivity.estimatedMinutes} minutes
                        </div>
                      </div>
                    )}
                    {upcomingMilestone && (
                      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
                        <span className="text-xs font-bold uppercase text-zinc-500">
                          Upcoming Milestone
                        </span>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          {upcomingMilestone.title}
                        </h4>
                        <div className="text-xs text-zinc-500 font-mono">
                          {upcomingMilestone.period}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8">
                <span className="text-4xl">🌱</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Ready to Shape Your Growth Journey
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  Transform your assessment evidence and stated interests into a structured development plan with clear milestones.
                </p>
                <Link href="/journey/create">
                  <Button variant="primary" size="sm">
                    Design Personalized Journey →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Growth Profile (Active Baseline View) */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Capability Growth Profile
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Demonstrated cognitive baselines recorded through structured evaluation.
              </p>
            </div>

            {capabilityProfiles.length === 0 ? (
              <div className="text-center py-16 space-y-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8">
                <span className="text-4xl">🧠</span>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  No Capability Baselines Recorded Yet
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  Complete the baseline capability assessments to populate your growth profile.
                </p>
                <Link href="/assessment">
                  <Button variant="primary" size="sm">
                    Start Initial Assessment
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {capabilityProfiles.map((prof) => (
                  <Card key={prof.capabilityKey} className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        {prof.capabilityName}
                      </span>
                      <StatusBadge status="operational" label={prof.performanceLevel} />
                    </div>
                    <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                      {prof.overallScore.toFixed(2)} / 4.00
                    </div>
                    <div className="space-y-2 text-xs">
                      {prof.dimensionResults.map((dim) => (
                        <div key={dim.slug} className="flex justify-between text-zinc-600 dark:text-zinc-400">
                          <span>{dim.name}</span>
                          <span className="font-semibold">{dim.score.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Portfolio (Coming Soon State) */}
        {activeTab === "portfolio" && (
          <div className="text-center py-16 space-y-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-8 animate-in fade-in duration-150">
            <span className="text-4xl">📁</span>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Personal Growth Portfolio
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              Your portfolio will store your verified challenge submissions, reflections, and independence benchmarks.
            </p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              Scheduled for Phase 7
            </span>
          </div>
        )}
      </div>

      {/* Modal for Phase 3 Info */}
      <Modal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        title="Capability Assessment Engine"
        description="Phase 3 Evaluation System"
      >
        <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-300">
          <p>
            The Capability Assessment Engine is now operational. You can take the Critical Thinking, Creative Problem-Solving, and Curiosity assessments to discover your demonstrated baseline.
          </p>
          <div className="pt-2 flex justify-end">
            <Link href="/assessment">
              <Button variant="primary" size="sm">
                Open Assessment Hub →
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
