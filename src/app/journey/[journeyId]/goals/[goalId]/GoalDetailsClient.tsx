"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { ProposedGoal, GoalStatus, MilestoneStatus, ActivityStatus } from "@/types/journey";
import {
  updateGoalStatus,
  updateMilestoneStatus,
  updateActivityStatus,
} from "@/lib/journeys/actions";

interface GoalDetailsClientProps {
  journeyId: string;
  journeyTitle: string;
  capabilityName: string;
  initialGoal: ProposedGoal;
}

export function GoalDetailsClient({
  journeyId,
  journeyTitle,
  capabilityName,
  initialGoal,
}: GoalDetailsClientProps) {
  const [goal, setGoal] = useState<ProposedGoal>(initialGoal);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleGoalStatusChange = async (newStatus: GoalStatus) => {
    const res = await updateGoalStatus(journeyId, goal.id, newStatus);
    if (res.success) {
      setGoal((prev) => ({ ...prev, status: newStatus }));
      showStatus(`Goal status updated to ${newStatus}.`);
    }
  };

  const handleMilestoneStatusChange = async (milestoneId: string, newStatus: MilestoneStatus) => {
    const res = await updateMilestoneStatus(journeyId, milestoneId, newStatus);
    if (res.success) {
      setGoal((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) =>
          m.id === milestoneId ? { ...m, status: newStatus } : m
        ),
      }));
      showStatus("Milestone updated.");
    }
  };

  const handleActivityStatusChange = async (activityId: string, newStatus: ActivityStatus) => {
    const res = await updateActivityStatus(journeyId, activityId, newStatus);
    if (res.success) {
      setGoal((prev) => ({
        ...prev,
        activities: prev.activities.map((a) =>
          a.id === activityId ? { ...a, status: newStatus } : a
        ),
        milestones: prev.milestones.map((m) => ({
          ...m,
          activities: m.activities.map((a) =>
            a.id === activityId ? { ...a, status: newStatus } : a
          ),
        })),
      }));
      showStatus("Activity updated.");
    }
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
          <Link href={`/journey/${journeyId}`} className="hover:text-stone-900 transition truncate max-w-xs">
            {journeyTitle}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Goal Deep Dive</span>
        </div>

        {statusMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-fade-in flex items-center space-x-2">
            <span>✓</span>
            <span>{statusMessage}</span>
          </div>
        )}

        {/* GOAL HEADER CARD */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 pb-5">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {capabilityName}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-stone-200 text-stone-800">
                  {goal.priority} priority
                </span>
                {goal.dimensionSlug && (
                  <span className="text-xs font-mono text-stone-500">{goal.dimensionSlug}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {goal.title}
              </h1>
              <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
                {goal.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Link
                href={`/coach?capabilityKey=${goal.capabilityKey}&journeyId=${journeyId}&goalId=${goal.id}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition flex items-center space-x-1.5 shadow-2xs whitespace-nowrap"
              >
                <span>🌱</span>
                <span>Coach on this Goal →</span>
              </Link>
              <select
                value={goal.status}
                onChange={(e) => handleGoalStatusChange(e.target.value as GoalStatus)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 focus:outline-none"
              >
                <option value="not_started">Status: Not Started</option>
                <option value="in_progress">Status: In Progress</option>
                <option value="completed">Status: Completed ✓</option>
                <option value="paused">Status: Paused</option>
              </select>
            </div>
          </div>

          {/* Transparent Recommendation Deep-Dive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                🔍 Evidence-Based Recommendation
              </span>
              <p className="text-xs text-stone-700 leading-relaxed">
                {goal.reasonForRecommendation}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                🎯 Expected Capability Outcome
              </span>
              <p className="text-xs text-stone-700 leading-relaxed">{goal.expectedOutcome}</p>
            </div>
          </div>
        </div>

        {/* MILESTONES & ACTIVITIES BREAKDOWN */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Milestone Progression & Planned Practice
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Mark milestones and activities as you progress through your self-directed capability
              development.
            </p>
          </div>

          <div className="space-y-6">
            {goal.milestones.map((ms, idx) => (
              <div
                key={ms.id}
                className="p-5 rounded-xl border border-stone-200 bg-stone-50/60 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase mr-2">
                      Stage {idx + 1}
                    </span>
                    <strong className="font-serif font-bold text-stone-900 text-base">
                      {ms.title}
                    </strong>
                    <span className="text-xs text-stone-500 font-mono ml-2">
                      ({ms.suggestedPeriod})
                    </span>
                  </div>
                  <select
                    value={ms.status}
                    onChange={(e) =>
                      handleMilestoneStatusChange(ms.id, e.target.value as MilestoneStatus)
                    }
                    className="text-xs px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed ✓</option>
                    <option value="skipped">Skipped</option>
                  </select>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{ms.description}</p>
                <div className="text-xs text-stone-500 bg-white p-2.5 rounded-lg border border-stone-200">
                  🎯 <strong>Observable Demonstration:</strong> {ms.expectedOutcome}
                </div>

                {/* Planned Activities */}
                {ms.activities.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase text-stone-400">
                      Planned Practice Activities:
                    </span>
                    <div className="space-y-2">
                      {ms.activities.map((act) => (
                        <div
                          key={act.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200 gap-3 shadow-2xs"
                        >
                          <div className="space-y-1 flex-1 pr-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-stone-900 text-xs">
                                {act.title}
                              </span>
                              <span className="text-stone-500 font-mono text-[11px]">
                                ⏱ {act.estimatedMinutes} min
                              </span>
                            </div>
                            <p className="text-stone-600 text-[11px] leading-relaxed">
                              {act.description}
                            </p>
                            <div className="text-emerald-800 text-[11px]">
                              <em>Purpose: {act.purpose}</em>
                            </div>
                          </div>

                          <div>
                            <select
                              value={act.status}
                              onChange={(e) =>
                                handleActivityStatusChange(act.id, e.target.value as ActivityStatus)
                              }
                              className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                                act.status === "completed"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : act.status === "in_progress"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-stone-50 text-stone-700 border-stone-200"
                              }`}
                            >
                              <option value="not_started">Not Started</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed ✓</option>
                              <option value="skipped">Skipped</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-4">
          <Link
            href={`/journey/${journeyId}`}
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition"
          >
            ← Back to Full Journey Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
