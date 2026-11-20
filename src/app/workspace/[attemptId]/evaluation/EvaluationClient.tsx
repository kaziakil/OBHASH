"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle } from "@/components/shared/Card";
import type {
  Challenge,
  ChallengeAttempt,
  ChallengeSubmission,
  ChallengeEvaluation,
  ChallengeReflection,
  ChallengeAIAssistanceRecord,
} from "@/types/challenge";

interface EvaluationClientProps {
  attempt: ChallengeAttempt;
  challenge: Challenge;
  submission: ChallengeSubmission | null;
  evaluation: ChallengeEvaluation;
  reflection: ChallengeReflection | null;
  aiAssistance: ChallengeAIAssistanceRecord | null;
}

export function EvaluationClient({
  attempt,
  challenge,
  submission,
  evaluation,
  reflection,
  aiAssistance,
}: EvaluationClientProps) {
  const router = useRouter();
  const isReflectionComplete = reflection !== null && reflection.is_submitted;

  const rubricLevelColors: Record<number, string> = {
    1: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300",
    2: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300",
    3: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-300",
    4: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300",
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/my-work"
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to My Work</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-500">
              Status: Evaluated
            </span>
            {isReflectionComplete ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/workspace/${attempt.id}/reflection`)}
                className="text-xs"
              >
                Review Reflection →
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => router.push(`/workspace/${attempt.id}/reflection`)}
                className="text-xs"
              >
                Proceed to Reflection Workspace →
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Header Hero */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {challenge.capability_category.replace("-", " ")}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 uppercase">
                {challenge.difficulty}
              </span>
            </div>

            <span className="text-xs text-zinc-500 font-medium">
              Submitted: {submission ? new Date(submission.submitted_at).toLocaleDateString() : "Recent"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Evaluation Feedback: {challenge.title}
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            This evaluation provides constructive, evidence-grounded feedback based strictly on observable demonstration in your submitted deliverables. It identifies demonstrated strengths, concrete developmental frontiers, and alternative angles.
          </p>

          {/* AI Assistance Badge if used */}
          {aiAssistance && aiAssistance.queries_count > 0 && (
            <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🌱</span>
                <span>
                  <strong>AI Assistance Noted:</strong> You consulted the AI Growth Coach {aiAssistance.queries_count} times ({aiAssistance.action_types_used.join(", ")}).
                </span>
              </div>
              <span className="text-[11px] text-indigo-700 dark:text-indigo-300">
                Independent authorship preserved
              </span>
            </div>
          )}
        </div>

        {/* Strengths & Growth Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="p-6 space-y-4 border-emerald-100 dark:border-emerald-950/40 bg-gradient-to-br from-white to-emerald-50/20 dark:from-zinc-900 dark:to-emerald-950/10">
            <CardTitle className="text-base text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <span>🌟</span>
              <span>What Worked (Demonstrated Strengths)</span>
            </CardTitle>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              {evaluation.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Growth Opportunities */}
          <Card className="p-6 space-y-4 border-amber-100 dark:border-amber-950/40 bg-gradient-to-br from-white to-amber-50/20 dark:from-zinc-900 dark:to-amber-950/10">
            <CardTitle className="text-base text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <span>🌱</span>
              <span>What Could Be Developed</span>
            </CardTitle>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              {evaluation.growth_opportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">↗</span>
                  <span className="leading-relaxed">{opp}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Grounded Evidence Citations */}
        <Card className="p-6 space-y-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>🔍</span>
            <span>Observable Evidence Citations</span>
          </CardTitle>
          <p className="text-xs text-zinc-500">
            Quotes and observable evidence extracted directly from your submitted deliverables:
          </p>

          <div className="space-y-3">
            {evaluation.evidence_citations.map((cite, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-4 space-y-2 text-xs"
              >
                <p className="font-bold text-zinc-900 dark:text-zinc-100">
                  {cite.claim}
                </p>
                <blockquote className="border-l-2 border-indigo-500 pl-3 italic text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 py-1.5 px-2 rounded-r">
                  &ldquo;{cite.quote}&rdquo;
                </blockquote>
                <p className="text-[11px] text-zinc-500">
                  {cite.analysis}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Dimension Indicators Breakdown */}
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>📊</span>
              <span>Relevant Dimension Indicators</span>
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              4-level rubric indicators reflecting observable demonstration across challenge dimensions:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(evaluation.dimension_evaluations).map(([dimName, dimEval]) => (
              <div
                key={dimName}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {dimEval.dimension}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      rubricLevelColors[dimEval.level]
                    }`}
                  >
                    Level {dimEval.level} • {dimEval.label}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                    <strong>Evidence:</strong> {dimEval.evidence}
                  </p>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    <strong>Guidance:</strong> {dimEval.guidance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alternative Perspectives & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span>👁️</span>
              <span>Alternative Perspective to Consider</span>
            </CardTitle>
            <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              {evaluation.alternative_perspectives.map((persp, i) => (
                <p key={i} className="leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  {persp}
                </p>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span>🎯</span>
              <span>Recommended Next Steps</span>
            </CardTitle>
            <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              {evaluation.recommended_next_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Bottom CTA to Reflection */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              {isReflectionComplete ? "Reflection Completed" : "Step 2: Consolidate Your Learning"}
            </h4>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isReflectionComplete
                ? "Your reflection is securely preserved in your development records."
                : "Complete a brief structured reflection on what you discovered and how your thinking developed."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/my-work"
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              My Work Overview
            </Link>
            <Button
              size="sm"
              onClick={() => router.push(`/workspace/${attempt.id}/reflection`)}
              className="text-xs"
            >
              {isReflectionComplete ? "Review Reflection →" : "Start Reflection Workspace →"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
