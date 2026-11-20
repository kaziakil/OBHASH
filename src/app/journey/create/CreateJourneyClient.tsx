"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateJourneyProposal, saveGrowthJourney } from "@/lib/journeys/actions";
import type { CapabilityBaselineProfile, AssessmentCapabilityKey } from "@/types/assessment";
import type { GrowthJourneyData, ProposedGoal } from "@/types/journey";

interface CreateJourneyClientProps {
  initialProfiles: CapabilityBaselineProfile[];
  initialInterests: string[];
  initialIntentions: string[];
}

export function CreateJourneyClient({
  initialProfiles,
  initialInterests,
  initialIntentions,
}: CreateJourneyClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<"configure" | "generating" | "review">("configure");
  const [error, setError] = useState<string | null>(null);

  // Configuration state
  const [selectedCapabilities, setSelectedCapabilities] = useState<AssessmentCapabilityKey[]>([
    "critical-thinking",
    "curiosity",
  ]);
  const [targetDuration, setTargetDuration] = useState("8 weeks");
  const [weeklyCommitment, setWeeklyCommitment] = useState("3-4 hours/week");
  const [userNotes, setUserNotes] = useState("");

  // Proposed journey state
  const [proposedJourney, setProposedJourney] = useState<GrowthJourneyData | null>(null);
  const [generationType, setGenerationType] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Edit mode in review step
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  const toggleCapability = (key: AssessmentCapabilityKey) => {
    setSelectedCapabilities((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const handleGenerateProposal = async () => {
    setError(null);
    setStep("generating");

    try {
      const res = await generateJourneyProposal({
        assessmentProfiles: initialProfiles,
        userInterests: initialInterests,
        growthIntentions: initialIntentions,
        selectedCapabilities,
        targetDuration,
        weeklyCommitmentHours: weeklyCommitment,
        userNotes: userNotes.trim() || undefined,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to generate personalized journey proposal.");
      }

      setProposedJourney(res.data.journey);
      setCustomTitle(res.data.journey.title);
      setCustomDescription(res.data.journey.description);
      setGenerationType(res.data.generationType);
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating journey proposal.");
      setStep("configure");
    }
  };

  const handleSaveJourney = async () => {
    if (!proposedJourney) return;
    setIsSaving(true);
    setError(null);

    const finalJourney: GrowthJourneyData = {
      ...proposedJourney,
      title: customTitle || proposedJourney.title,
      description: customDescription || proposedJourney.description,
      status: "active",
    };

    try {
      const res = await saveGrowthJourney(finalJourney);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to save growth journey.");
      }
      router.push(`/journey/${res.data.journeyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving journey.");
      setIsSaving(false);
    }
  };

  const removeGoal = (focusAreaId: string, goalId: string) => {
    if (!proposedJourney) return;
    const updatedAreas = proposedJourney.focusAreas.map((fa) => {
      if (fa.id === focusAreaId) {
        return {
          ...fa,
          goals: fa.goals.filter((g) => g.id !== goalId),
        };
      }
      return fa;
    });
    setProposedJourney({
      ...proposedJourney,
      focusAreas: updatedAreas,
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-500">
          <Link href="/dashboard" className="hover:text-stone-900 transition">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/journey" className="hover:text-stone-900 transition">
            Journey
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Create Personalized Journey</span>
        </div>

        {/* Header */}
        <div className="border-b border-stone-200 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Phase 4: Personalized Growth Engine
              </span>
              <h1 className="text-3xl font-serif font-bold text-stone-900 mt-2">
                Design Your Growth Journey
              </h1>
              <p className="text-stone-600 mt-1 text-sm max-w-2xl">
                Transform your baseline assessment evidence, personal interests, and development
                intentions into an achievable, self-directed capability journey.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: CONFIGURE */}
        {step === "configure" && (
          <div className="space-y-8">
            {/* Assessment Evidence Summary Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-stone-900 mb-3 flex items-center justify-between">
                <span>Assessment Evidence Status</span>
                <span className="text-xs font-mono font-medium text-stone-500">
                  {initialProfiles.length} of 3 capabilities evaluated
                </span>
              </h2>

              {initialProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {initialProfiles.map((p) => (
                    <div
                      key={p.capabilityKey}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-900 text-sm">{p.capabilityName}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {p.performanceLevel}
                        </span>
                      </div>
                      <div className="text-2xl font-serif font-bold text-stone-900">
                        {p.overallScore.toFixed(2)}
                        <span className="text-xs font-sans text-stone-500 font-normal"> / 4.00</span>
                      </div>
                      {p.strengthsSummary.length > 0 && (
                        <p className="text-xs text-stone-600 line-clamp-2">
                          <strong className="text-stone-800">Strength:</strong> {p.strengthsSummary[0]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-start space-x-3">
                  <div className="text-lg">ℹ️</div>
                  <div>
                    <strong className="font-semibold">No assessment completed yet.</strong>
                    <p className="mt-0.5 text-xs text-amber-800">
                      While you can generate an initial journey based on your stated interests and
                      intentions, completing a capability assessment provides genuine baseline
                      evidence for tailored recommendations.
                    </p>
                    <Link
                      href="/assessment"
                      className="inline-block mt-2 text-xs font-semibold text-amber-900 underline hover:text-amber-950"
                    >
                      Take Capability Assessment →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Capability Selection */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  1. Select Capabilities to Strengthen
                </h2>
                <p className="text-stone-500 text-sm">
                  Choose which capabilities you wish to focus on in this journey.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    key: "critical-thinking" as const,
                    name: "Critical Thinking",
                    desc: "Analyze arguments, isolate confounders, and challenge assumptions.",
                  },
                  {
                    key: "creative-problem-solving" as const,
                    name: "Creative Problem-Solving",
                    desc: "Divergent thinking, cross-domain reframing, and novel prototyping.",
                  },
                  {
                    key: "curiosity" as const,
                    name: "Curiosity",
                    desc: "Inquiry trees, systemic second-order questions, and intellectual openness.",
                  },
                ].map((cap) => {
                  const isSelected = selectedCapabilities.includes(cap.key);
                  return (
                    <button
                      key={cap.key}
                      type="button"
                      onClick={() => toggleCapability(cap.key)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? "border-emerald-700 bg-emerald-50/50 ring-2 ring-emerald-700/20"
                          : "border-stone-200 bg-stone-50 hover:bg-stone-100/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-stone-900 text-sm">{cap.name}</span>
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? "bg-emerald-700 text-white" : "border border-stone-300 text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{cap.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Commitment & Duration */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  2. Realistic Time Commitment
                </h2>
                <p className="text-stone-500 text-sm">
                  Set achievable parameters that fit your actual schedule.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Journey Duration
                  </label>
                  <select
                    value={targetDuration}
                    onChange={(e) => setTargetDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="4 weeks">4 weeks (Sprint Focus)</option>
                    <option value="8 weeks">8 weeks (Balanced Mastery — Recommended)</option>
                    <option value="12 weeks">12 weeks (Deep Transformation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Weekly Time Commitment
                  </label>
                  <select
                    value={weeklyCommitment}
                    onChange={(e) => setWeeklyCommitment(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="1-2 hours/week">1–2 hours/week (Light & Sustainable)</option>
                    <option value="3-4 hours/week">3–4 hours/week (Steady Progression)</option>
                    <option value="5-6 hours/week">5–6 hours/week (Intensive Practice)</option>
                  </select>
                </div>
              </div>

              {/* Contextual Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Personal Context or Specific Topic of Interest (Optional)
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. I am currently working on an environmental project and want to sharpen my ability to evaluate opposing scientific data."
                  rows={3}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition"
              >
                ← Cancel
              </Link>
              <button
                type="button"
                onClick={handleGenerateProposal}
                className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-medium text-sm hover:bg-emerald-900 transition shadow-sm"
              >
                Generate Proposed Journey →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GENERATING */}
        {step === "generating" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Synthesizing Your Personalized Journey...
            </h2>
            <p className="text-stone-600 text-sm max-w-md mx-auto">
              Analyzing assessment evidence, cross-referencing your interests, and mapping out
              sequential milestones and high-leverage development activities.
            </p>
          </div>
        )}

        {/* STEP 3: REVIEW & CUSTOMIZE */}
        {step === "review" && proposedJourney && (
          <div className="space-y-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-sm text-emerald-900">
                <span className="text-lg">✨</span>
                <span>
                  <strong>Personalized Proposal Ready.</strong> Review your focus areas and goals
                  below. You can adjust titles, remove goals, and refine details before activating.
                </span>
              </div>
              <span className="text-xs font-mono font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                {generationType === "hybrid-ai" ? "AI Tailored" : "Pedagogical Rules"}
              </span>
            </div>

            {/* Journey Header Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 mr-4">
                  {isEditingTitle ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl font-serif font-bold text-xl text-stone-900"
                      />
                      <textarea
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm text-stone-700"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingTitle(false)}
                        className="text-xs px-3 py-1 bg-stone-900 text-white rounded-lg"
                      >
                        Save Details
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-serif font-bold text-stone-900">
                        {customTitle || proposedJourney.title}
                      </h2>
                      <p className="text-stone-600 text-sm">
                        {customDescription || proposedJourney.description}
                      </p>
                    </>
                  )}
                </div>
                {!isEditingTitle && (
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(true)}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-50"
                  >
                    Edit Title
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 font-medium">Target Duration:</span>{" "}
                  <strong className="text-stone-800">{proposedJourney.targetDuration}</strong>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Weekly Commitment:</span>{" "}
                  <strong className="text-stone-800">{proposedJourney.weeklyCommitmentHours}</strong>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Primary Priorities:</span>{" "}
                  <strong className="text-stone-800">
                    {proposedJourney.primaryPriorities.join(", ")}
                  </strong>
                </div>
              </div>
            </div>

            {/* Focus Areas & Goals */}
            <div className="space-y-6">
              {proposedJourney.focusAreas.map((fa) => (
                <div
                  key={fa.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6"
                >
                  <div className="border-b border-stone-100 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-emerald-800">
                        Capability Focus Area
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {fa.goals.length} Goals Planned
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
                      {fa.capabilityName}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <strong>Assessment Finding & Rationale:</strong> {fa.rationale}
                    </p>
                  </div>

                  {/* Goals List */}
                  <div className="space-y-4">
                    {fa.goals.map((goal: ProposedGoal) => (
                      <div
                        key={goal.id}
                        className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1 pr-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-stone-200 text-stone-800">
                                {goal.priority} priority
                              </span>
                              {goal.dimensionSlug && (
                                <span className="text-xs text-stone-500 font-mono">
                                  {goal.dimensionSlug}
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-stone-900 text-base">
                              {goal.title}
                            </h4>
                            <p className="text-xs text-stone-600">{goal.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGoal(fa.id, goal.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium p-1 hover:bg-red-50 rounded"
                            title="Remove this goal from journey"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Transparent Recommendation Note */}
                        <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs text-stone-700 space-y-1">
                          <div className="font-semibold text-stone-900 flex items-center space-x-1">
                            <span>🔍</span>
                            <span>Why This Goal Was Selected</span>
                          </div>
                          <p className="text-stone-600">{goal.reasonForRecommendation}</p>
                          <div className="pt-1 text-stone-500">
                            <strong>Expected Outcome:</strong> {goal.expectedOutcome}
                          </div>
                        </div>

                        {/* Milestones & Activities Preview */}
                        <div className="space-y-2 pt-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                            Planned Milestones ({goal.milestones.length})
                          </span>
                          <div className="space-y-2">
                            {goal.milestones.map((ms) => (
                              <div
                                key={ms.id}
                                className="p-3 bg-white rounded-lg border border-stone-200 text-xs space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <strong className="font-medium text-stone-900">{ms.title}</strong>
                                  <span className="text-stone-500 font-mono">{ms.suggestedPeriod}</span>
                                </div>
                                <p className="text-stone-600">{ms.description}</p>
                                <div className="text-stone-500 text-[11px]">
                                  🎯 <em>{ms.expectedOutcome}</em>
                                </div>

                                {ms.activities.length > 0 && (
                                  <div className="pt-2 border-t border-stone-100 space-y-1.5">
                                    <span className="text-[10px] font-bold uppercase text-stone-400">
                                      Planned Activities:
                                    </span>
                                    {ms.activities.map((act) => (
                                      <div
                                        key={act.id}
                                        className="flex items-center justify-between bg-stone-50 p-2 rounded text-stone-700"
                                      >
                                        <div className="pr-2">
                                          <div className="font-medium">{act.title}</div>
                                          <div className="text-stone-500 text-[10px]">
                                            {act.purpose}
                                          </div>
                                        </div>
                                        <span className="text-[11px] font-mono font-medium text-stone-500 whitespace-nowrap">
                                          ⏱ {act.estimatedMinutes}m
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep("configure")}
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition"
              >
                ← Back to Configuration
              </button>
              <button
                type="button"
                onClick={handleSaveJourney}
                disabled={isSaving}
                className="px-8 py-3 rounded-xl bg-emerald-800 text-white font-medium text-sm hover:bg-emerald-900 transition shadow-sm disabled:opacity-50"
              >
                {isSaving ? "Saving & Activating..." : "Confirm & Activate Journey →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
