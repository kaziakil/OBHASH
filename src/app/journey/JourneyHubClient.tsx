"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { GrowthJourneyData, JourneyStatus } from "@/types/journey";
import type { CapabilityBaselineProfile } from "@/types/assessment";
import { updateActivityStatus } from "@/lib/journeys/actions";

interface JourneyHubClientProps {
  activeJourney: GrowthJourneyData | null;
  allJourneys: GrowthJourneyData[];
  capabilityProfiles: CapabilityBaselineProfile[];
}

export function JourneyHubClient({
  activeJourney,
  allJourneys,
  capabilityProfiles,
}: JourneyHubClientProps) {
  const [journey, setJourney] = useState<GrowthJourneyData | null>(activeJourney);

  // Extract next planned activity and upcoming milestone
  let nextActivity: {
    id: string;
    title: string;
    description: string;
    purpose: string;
    estimatedMinutes: number;
    capabilityKey: string;
    goalTitle: string;
  } | null = null;

  let upcomingMilestone: {
    title: string;
    description: string;
    period: string;
  } | null = null;

  let totalActivitiesCount = 0;
  let completedActivitiesCount = 0;

  if (journey) {
    for (const fa of journey.focusAreas) {
      for (const goal of fa.goals) {
        for (const ms of goal.milestones) {
          if (!upcomingMilestone && ms.status !== "completed") {
            upcomingMilestone = {
              title: ms.title,
              description: ms.description,
              period: ms.suggestedPeriod,
            };
          }
          for (const act of ms.activities) {
            totalActivitiesCount++;
            if (act.status === "completed") {
              completedActivitiesCount++;
            } else if (!nextActivity) {
              nextActivity = {
                id: act.id,
                title: act.title,
                description: act.description,
                purpose: act.purpose,
                estimatedMinutes: act.estimatedMinutes,
                capabilityKey: act.capabilityKey,
                goalTitle: goal.title,
              };
            }
          }
        }
      }
    }
  }

  const handleMarkActivityCompleted = async (activityId: string) => {
    if (!journey) return;
    const res = await updateActivityStatus(journey.id, activityId, "completed");
    if (res.success) {
      // update state locally
      const updated = { ...journey };
      for (const fa of updated.focusAreas) {
        for (const goal of fa.goals) {
          for (const ms of goal.milestones) {
            for (const act of ms.activities) {
              if (act.id === activityId) {
                act.status = "completed" as const;
              }
            }
          }
        }
      }
      setJourney(updated);
    }
  };

  const statusColors: Record<JourneyStatus, string> = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    paused: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    draft: "bg-stone-100 text-stone-800 border-stone-200",
    archived: "bg-stone-100 text-stone-600 border-stone-200",
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-500">
          <Link href="/dashboard" className="hover:text-stone-900 transition">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Growth Journey</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-5 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Personalized Development Journey
            </span>
            <h1 className="text-3xl font-serif font-bold text-stone-900 mt-2">
              Your Capability Journey
            </h1>
            <p className="text-stone-600 mt-1 text-sm max-w-2xl">
              An evidence-informed, human-centered framework designed to strengthen your independent
              thinking, creative synthesis, and curiosity through progressive milestones.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <span className="text-xs font-semibold text-stone-500">Evaluation Baselines:</span>
              {capabilityProfiles.length > 0 ? (
                capabilityProfiles.map((p) => (
                  <span
                    key={p.capabilityKey}
                    className="text-xs font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                  >
                    {p.capabilityName}: {p.overallScore.toFixed(2)}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-400">None completed yet</span>
              )}
            </div>
          </div>
          <div>
            <Link
              href="/journey/create"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-800 text-white font-medium text-sm hover:bg-emerald-900 transition shadow-sm"
            >
              + Design New Journey
            </Link>
          </div>
        </div>

        {/* ACTIVE JOURNEY CARD */}
        {journey ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        statusColors[journey.status]
                      }`}
                    >
                      {journey.status} Journey
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Started {new Date(journey.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">{journey.title}</h2>
                  <p className="text-stone-600 text-sm max-w-3xl leading-relaxed">
                    {journey.description}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/journey/${journey.id}`}
                    className="inline-block whitespace-nowrap px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition"
                  >
                    View Complete Details →
                  </Link>
                </div>
              </div>

              {/* Journey Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-center">
                <div>
                  <div className="text-xs text-stone-500">Target Duration</div>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">
                    {journey.targetDuration}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">Weekly Commitment</div>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">
                    {journey.weeklyCommitmentHours}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">Focus Areas</div>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">
                    {journey.focusAreas.length} Capabilities
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">Activities Completed</div>
                  <div className="text-sm font-semibold text-emerald-800 mt-0.5">
                    {completedActivitiesCount} of {totalActivitiesCount}
                  </div>
                </div>
              </div>

              {/* NEXT RECOMMENDED ACTION & UPCOMING MILESTONE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Next Activity Card */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Next Planned Activity
                    </span>
                    {nextActivity && (
                      <span className="text-xs font-mono font-medium text-emerald-700">
                        ⏱ {nextActivity.estimatedMinutes} min
                      </span>
                    )}
                  </div>
                  {nextActivity ? (
                    <>
                      <h3 className="font-serif font-bold text-stone-900 text-base">
                        {nextActivity.title}
                      </h3>
                      <p className="text-xs text-stone-600">{nextActivity.description}</p>
                      <div className="text-xs text-emerald-900 bg-white/80 p-2.5 rounded-lg border border-emerald-200/60">
                        <strong>Purpose:</strong> {nextActivity.purpose}
                      </div>
                      <div className="pt-2 flex items-center justify-between">
                        <Link
                          href={`/journey/${journey.id}`}
                          className="text-xs font-semibold text-emerald-900 underline hover:text-emerald-950"
                        >
                          View in Journey Tree →
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleMarkActivityCompleted(nextActivity!.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-medium hover:bg-emerald-900 transition"
                        >
                          Mark Completed ✓
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-emerald-800 py-4">
                      All currently scheduled planned activities are completed. Outstanding work!
                    </div>
                  )}
                </div>

                {/* Upcoming Milestone Card */}
                <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Current Milestone Focus
                    </span>
                    {upcomingMilestone && (
                      <span className="text-xs font-mono text-stone-500">
                        {upcomingMilestone.period}
                      </span>
                    )}
                  </div>
                  {upcomingMilestone ? (
                    <>
                      <h3 className="font-serif font-bold text-stone-900 text-base">
                        {upcomingMilestone.title}
                      </h3>
                      <p className="text-xs text-stone-600">{upcomingMilestone.description}</p>
                      <div className="text-xs text-stone-500">
                        Expected outcome upon completion of this stage.
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-stone-500 py-4">
                      All milestones currently reached.
                    </div>
                  )}
                </div>
              </div>

              {/* Capability Focus Areas Preview */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Active Capability Focus Areas ({journey.focusAreas.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {journey.focusAreas.map((fa) => (
                    <div
                      key={fa.id}
                      className="p-3 rounded-xl border border-stone-200 bg-white space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-stone-900 text-sm">
                          {fa.capabilityName}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                          {fa.goals.length} Goals
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2">{fa.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center shadow-sm space-y-4">
            <div className="text-4xl">🌱</div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              No Active Growth Journey Yet
            </h2>
            <p className="text-stone-600 text-sm max-w-md mx-auto">
              A personalized growth journey translates your current demonstrated capabilities and
              curiosities into structured, progressive milestones.
            </p>
            <div className="pt-2">
              <Link
                href="/journey/create"
                className="inline-block px-6 py-3 rounded-xl bg-emerald-800 text-white font-medium text-sm hover:bg-emerald-900 transition shadow-sm"
              >
                Create Your Personalized Journey →
              </Link>
            </div>
          </div>
        )}

        {/* JOURNEY HISTORY SECTION */}
        {allJourneys.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-stone-200">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Journey History & Archive ({allJourneys.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allJourneys.map((j) => (
                <div
                  key={j.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 hover:border-stone-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        statusColors[j.status]
                      }`}
                    >
                      {j.status}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {new Date(j.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">{j.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2">{j.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                    <span>{j.targetDuration}</span>
                    <Link
                      href={`/journey/${j.id}`}
                      className="font-medium text-stone-900 hover:text-emerald-800 underline"
                    >
                      View Journey →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
