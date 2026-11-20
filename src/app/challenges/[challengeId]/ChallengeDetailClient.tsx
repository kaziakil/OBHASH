"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle } from "@/components/shared/Card";
import { startOrResumeChallengeAttemptAction, toggleBookmarkAction } from "@/lib/challenges/actions";
import type { Challenge, UserWorkSummaryItem } from "@/types/challenge";

interface ChallengeDetailClientProps {
  challenge: Challenge;
  existingItem?: UserWorkSummaryItem;
}

export function ChallengeDetailClient({
  challenge,
  existingItem,
}: ChallengeDetailClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isStarting, setIsStarting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(existingItem?.isBookmarked || false);

  async function handleToggleBookmark() {
    setIsBookmarked(!isBookmarked);
    await toggleBookmarkAction(challenge.id);
  }

  async function handleStart() {
    setIsStarting(true);
    try {
      const res = await startOrResumeChallengeAttemptAction(challenge.id);
      startTransition(() => {
        router.push(`/workspace/${res.attemptId}`);
      });
    } catch {
      setIsStarting(false);
    }
  }

  const capabilityNames = {
    "critical-thinking": "Critical Thinking",
    "creative-problem-solving": "Creative Problem-Solving",
    curiosity: "Curiosity",
  };

  const isCompleted = existingItem?.attempt.status === "completed";
  const isInProgress = existingItem?.attempt.status === "in_progress";
  const isSubmitted = existingItem?.attempt.status === "submitted" || existingItem?.attempt.status === "reflection_pending";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/challenges"
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Challenge Catalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                isBookmarked
                  ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700"
                  : "bg-white text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 hover:bg-zinc-100"
              }`}
            >
              <span>{isBookmarked ? "★" : "☆"}</span>
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>

            {isCompleted ? (
              <Button
                size="sm"
                onClick={() => router.push(`/workspace/${existingItem?.attempt.id}/evaluation`)}
              >
                View Submission & Evaluation →
              </Button>
            ) : isSubmitted ? (
              <Button
                size="sm"
                onClick={() => router.push(`/workspace/${existingItem?.attempt.id}/evaluation`)}
              >
                View Feedback / Continue Reflection →
              </Button>
            ) : (
              <Button
                size="sm"
                isLoading={isStarting}
                onClick={handleStart}
              >
                {isInProgress ? "Resume Workspace Draft →" : "Enter Practice Workspace →"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Challenge Header Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {capabilityNames[challenge.capability_category]}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 uppercase">
              {challenge.difficulty}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              ⏱️ Estimated time: {challenge.estimated_completion_time}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {challenge.title}
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {challenge.short_description}
          </p>

          {/* Learning Objective Box */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 p-4 text-xs text-blue-900 dark:text-blue-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span>🎯</span>
              <span>Development Objective</span>
            </p>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              {challenge.learning_objective}
            </p>
          </div>

          {/* Relevant Dimensions */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-500">Core Dimensions:</span>
            {challenge.relevant_dimensions.map((dim) => (
              <span
                key={dim}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                {dim}
              </span>
            ))}
          </div>
        </div>

        {/* Challenge Scenario & Problem Statement */}
        <Card className="p-6 space-y-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📋</span>
            <span>The Scenario & Problem Context</span>
          </CardTitle>
          <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 font-normal">
            {challenge.scenario}
          </div>
        </Card>

        {/* Detailed Instructions */}
        <Card className="p-6 space-y-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📝</span>
            <span>Task Instructions</span>
          </CardTitle>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {challenge.detailed_instructions}
          </p>
        </Card>

        {/* Required Deliverables */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>📤</span>
              <span>Required Deliverables</span>
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              You will complete and record your thinking for each of the following sections inside the workspace:
            </p>
          </div>

          <div className="space-y-3">
            {challenge.required_deliverables.map((deliv) => (
              <div
                key={deliv.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {deliv.title}
                  </h4>
                  {deliv.minWords && (
                    <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      Min ~{deliv.minWords} words
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {deliv.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Suggested Thinking Steps & Optional Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thinking Steps */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span>🧠</span>
              <span>Suggested Thinking Steps</span>
            </CardTitle>
            <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
              {challenge.suggested_thinking_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 select-none">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Resources & Heuristics */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span>📚</span>
              <span>Mental Models & Heuristics</span>
            </CardTitle>
            <div className="space-y-3 text-xs">
              {challenge.optional_resources.map((res, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-3 space-y-1"
                >
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">
                    {res.title}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {res.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Reflection Prompts Preview */}
        <Card className="p-6 space-y-3 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
          <CardTitle className="text-base flex items-center gap-2">
            <span>🪞</span>
            <span>Post-Submission Reflection Preview</span>
          </CardTitle>
          <p className="text-xs text-zinc-500">
            After submitting your work, you will complete a structured reflection to examine your reasoning process:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 pl-1">
            {challenge.reflection_prompts.map((prompt, i) => (
              <li key={i}>{prompt}</li>
            ))}
          </ul>
        </Card>

        {/* Bottom Action Footer */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Ready to practice your capabilities?
            </h4>
            <p className="text-xs text-zinc-500">
              Your drafts autosave continuously. Consult the AI Growth Coach if you need a Socratic thinking partner.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto text-sm px-6 py-2.5"
              isLoading={isStarting}
              onClick={handleStart}
            >
              {isInProgress
                ? "Resume In-Progress Draft →"
                : isCompleted
                ? "Review Completed Submission →"
                : "Enter Challenge Workspace →"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
