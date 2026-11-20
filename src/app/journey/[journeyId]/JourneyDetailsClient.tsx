"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  ActivityStatus,
  GoalStatus,
  GrowthJourneyData,
  JourneyStatus,
  MilestoneStatus,
} from "@/types/journey";
import {
  updateActivityStatus,
  updateGoalStatus,
  updateJourneyDetails,
  updateJourneyStatus,
  updateMilestoneStatus,
} from "@/lib/journeys/actions";

interface JourneyDetailsClientProps {
  initialJourney: GrowthJourneyData;
}

export function JourneyDetailsClient({ initialJourney }: JourneyDetailsClientProps) {
  const [journey, setJourney] = useState<GrowthJourneyData>(initialJourney);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(initialJourney.title);
  const [editDesc, setEditDesc] = useState(initialJourney.description);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Status handlers
  const handleJourneyStatusChange = async (newStatus: JourneyStatus) => {
    const res = await updateJourneyStatus(journey.id, newStatus);
    if (res.success) {
      setJourney((prev) => ({ ...prev, status: newStatus }));
      showTemporaryStatus(`Journey marked as ${newStatus}.`);
    }
  };

  const handleGoalStatusChange = async (goalId: string, newStatus: GoalStatus) => {
    const res = await updateGoalStatus(journey.id, goalId, newStatus);
    if (res.success) {
      setJourney((prev) => {
        const updatedAreas = prev.focusAreas.map((fa) => ({
          ...fa,
          goals: fa.goals.map((g) => (g.id === goalId ? { ...g, status: newStatus } : g)),
        }));
        return { ...prev, focusAreas: updatedAreas };
      });
      showTemporaryStatus("Goal status updated.");
    }
  };

  const handleMilestoneStatusChange = async (milestoneId: string, newStatus: MilestoneStatus) => {
    const res = await updateMilestoneStatus(journey.id, milestoneId, newStatus);
    if (res.success) {
      setJourney((prev) => {
        const updatedAreas = prev.focusAreas.map((fa) => ({
          ...fa,
          goals: fa.goals.map((g) => ({
            ...g,
            milestones: g.milestones.map((m) =>
              m.id === milestoneId ? { ...m, status: newStatus } : m
            ),
          })),
        }));
        return { ...prev, focusAreas: updatedAreas };
      });
      showTemporaryStatus("Milestone status updated.");
    }
  };

  const handleActivityStatusChange = async (activityId: string, newStatus: ActivityStatus) => {
    const res = await updateActivityStatus(journey.id, activityId, newStatus);
    if (res.success) {
      setJourney((prev) => {
        const updatedAreas = prev.focusAreas.map((fa) => ({
          ...fa,
          goals: fa.goals.map((g) => ({
            ...g,
            activities: g.activities.map((a) =>
              a.id === activityId ? { ...a, status: newStatus } : a
            ),
            milestones: g.milestones.map((m) => ({
              ...m,
              activities: m.activities.map((a) =>
                a.id === activityId ? { ...a, status: newStatus } : a
              ),
            })),
          })),
        }));
        return { ...prev, focusAreas: updatedAreas };
      });
      showTemporaryStatus("Activity status updated.");
    }
  };

  const handleSaveDetails = async () => {
    const res = await updateJourneyDetails(journey.id, {
      title: editTitle,
      description: editDesc,
    });
    if (res.success) {
      setJourney((prev) => ({ ...prev, title: editTitle, description: editDesc }));
      setIsEditing(false);
      showTemporaryStatus("Journey details updated successfully.");
    }
  };

  const showTemporaryStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const statusColors: Record<JourneyStatus, string> = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    paused: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    draft: "bg-stone-100 text-stone-800 border-stone-200",
    archived: "bg-stone-100 text-stone-600 border-stone-200",
  };

  // Compute progress indicators
  let totalActivities = 0;
  let completedActivities = 0;
  for (const fa of journey.focusAreas) {
    for (const g of fa.goals) {
      for (const m of g.milestones) {
        for (const a of m.activities) {
          totalActivities++;
          if (a.status === "completed") completedActivities++;
        }
      }
      for (const a of g.activities) {
        totalActivities++;
        if (a.status === "completed") completedActivities++;
      }
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
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
          <span className="text-stone-900 font-medium truncate max-w-xs">{journey.title}</span>
        </div>

        {statusMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-fade-in flex items-center space-x-2">
            <span>✓</span>
            <span>{statusMessage}</span>
          </div>
        )}

        {/* JOURNEY HEADER */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-serif font-bold text-2xl text-stone-900"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm text-stone-700"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSaveDetails}
                      className="px-4 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-1.5 border border-stone-300 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        statusColors[journey.status]
                      }`}
                    >
                      {journey.status}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Created {new Date(journey.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-serif font-bold text-stone-900">{journey.title}</h1>
                  <p className="text-stone-600 text-sm max-w-3xl leading-relaxed">
                    {journey.description}
                  </p>
                </>
              )}
            </div>

            {/* Status & Edit Controls */}
            {!isEditing && (
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-50"
                >
                  Edit
                </button>
                <select
                  value={journey.status}
                  onChange={(e) => handleJourneyStatusChange(e.target.value as JourneyStatus)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs">
            <div>
              <span className="text-stone-400 block font-medium">Target Duration</span>
              <strong className="text-stone-800 text-sm">{journey.targetDuration}</strong>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Weekly Commitment</span>
              <strong className="text-stone-800 text-sm">{journey.weeklyCommitmentHours}</strong>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Focus Areas</span>
              <strong className="text-stone-800 text-sm">
                {journey.focusAreas.length} Capabilities
              </strong>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Demonstrated Activities</span>
              <strong className="text-emerald-800 text-sm">
                {completedActivities} of {totalActivities} Completed
              </strong>
            </div>
          </div>
        </div>

        {/* FOCUS AREAS & GOALS HIERARCHY */}
        <div className="space-y-8">
          {journey.focusAreas.map((fa) => (
            <div
              key={fa.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-stone-100 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-800">
                    Capability Focus Area #{fa.priority}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    {fa.goals.length} Goals Active
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  {fa.capabilityName}
                </h2>
                <div className="mt-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <strong>Assessment Context & Rationale:</strong>
                  <p className="text-stone-600 leading-relaxed">{fa.rationale}</p>
                </div>
              </div>

              {/* Development Goals */}
              <div className="space-y-6">
                {fa.goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-5 sm:p-6 rounded-xl border border-stone-200 bg-stone-50/50 space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-stone-200 text-stone-800">
                            {goal.priority} priority
                          </span>
                          {goal.dimensionSlug && (
                            <span className="text-xs text-stone-500 font-mono">
                              {goal.dimensionSlug}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-stone-900 text-lg">
                          {goal.title}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {goal.description}
                        </p>
                      </div>

                      {/* Goal Status Dropdown & Deep Dive link */}
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/journey/${journey.id}/goals/${goal.id}`}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-800 hover:text-emerald-950 underline"
                        >
                          Deep Dive →
                        </Link>
                        <select
                          value={goal.status}
                          onChange={(e) =>
                            handleGoalStatusChange(goal.id, e.target.value as GoalStatus)
                          }
                          className="text-xs px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none"
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="paused">Paused</option>
                        </select>
                      </div>
                    </div>

                    {/* Transparent Recommendation Note */}
                    <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span>🔍</span>
                        <span>Evidence & Recommendation Rationale</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {goal.reasonForRecommendation}
                      </p>
                      <div className="pt-1 text-stone-500 border-t border-stone-100 text-[11px]">
                        <strong>Target Capability Outcome:</strong> {goal.expectedOutcome}
                      </div>
                    </div>

                    {/* Milestones Hierarchy */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Milestones & Planned Activities
                      </span>
                      <div className="space-y-3">
                        {goal.milestones.map((ms) => (
                          <div
                            key={ms.id}
                            className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                              <div>
                                <span className="font-serif font-bold text-stone-900 text-sm mr-2">
                                  {ms.title}
                                </span>
                                <span className="text-stone-500 font-mono text-[11px]">
                                  ({ms.suggestedPeriod})
                                </span>
                              </div>
                              <select
                                value={ms.status}
                                onChange={(e) =>
                                  handleMilestoneStatusChange(
                                    ms.id,
                                    e.target.value as MilestoneStatus
                                  )
                                }
                                className="text-xs px-2 py-0.5 bg-stone-50 border border-stone-200 rounded text-stone-700"
                              >
                                <option value="not_started">Not Started</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="skipped">Skipped</option>
                              </select>
                            </div>
                            <p className="text-stone-600">{ms.description}</p>
                            <div className="text-stone-500 text-[11px]">
                              🎯 <em>Expected Outcome: {ms.expectedOutcome}</em>
                            </div>

                            {/* Planned Activities */}
                            {ms.activities.length > 0 && (
                              <div className="pt-2 border-t border-stone-100 space-y-2">
                                <span className="text-[10px] font-bold uppercase text-stone-400">
                                  Planned Activities ({ms.activities.length}):
                                </span>
                                {ms.activities.map((act) => (
                                  <div
                                    key={act.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/80 gap-3"
                                  >
                                    <div className="space-y-1 flex-1 pr-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-stone-900">
                                          {act.title}
                                        </span>
                                        <span className="text-stone-500 font-mono text-[11px]">
                                          ⏱ {act.estimatedMinutes} min
                                        </span>
                                      </div>
                                      <p className="text-stone-600 text-[11px]">
                                        {act.description}
                                      </p>
                                      <p className="text-emerald-800 text-[11px]">
                                        <em>Purpose: {act.purpose}</em>
                                      </p>
                                    </div>

                                    {/* Activity Status Toggle */}
                                    <div className="flex items-center space-x-2">
                                      <select
                                        value={act.status}
                                        onChange={(e) =>
                                          handleActivityStatusChange(
                                            act.id,
                                            e.target.value as ActivityStatus
                                          )
                                        }
                                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                                          act.status === "completed"
                                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                            : act.status === "in_progress"
                                            ? "bg-amber-50 text-amber-800 border-amber-300"
                                            : "bg-white text-stone-700 border-stone-300"
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
      </div>
    </div>
  );
}
