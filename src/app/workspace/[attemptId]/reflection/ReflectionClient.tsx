"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle } from "@/components/shared/Card";
import { submitReflectionAction } from "@/lib/challenges/actions";
import type {
  Challenge,
  ChallengeAttempt,
  ChallengeReflection,
  ChallengeAIAssistanceRecord,
} from "@/types/challenge";

interface ReflectionClientProps {
  attempt: ChallengeAttempt;
  challenge: Challenge;
  initialReflection: ChallengeReflection | null;
  aiAssistance: ChallengeAIAssistanceRecord | null;
}

export function ReflectionClient({
  attempt,
  challenge,
  initialReflection,
  aiAssistance,
}: ReflectionClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Combine challenge reflection prompts with an AI assistance reflection prompt if AI was used
  const prompts = [...challenge.reflection_prompts];
  if (aiAssistance && aiAssistance.queries_count > 0) {
    prompts.push(
      "Where did you consult the AI Growth Coach during this challenge, and how did its questions or hints influence your thinking?"
    );
  }

  const [responses, setResponses] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    prompts.forEach((p) => {
      initial[p] = initialReflection?.responses?.[p] || "";
    });
    return initial;
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(
    initialReflection?.is_submitted || false
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleResponseChange(prompt: string, val: string) {
    setResponses((prev) => ({ ...prev, [prompt]: val }));
  }

  async function handleSubmitReflection() {
    setIsSaving(true);
    setErrorMsg(null);

    try {
      const res = await submitReflectionAction(attempt.id, responses);
      if (res.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save reflection.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href={`/workspace/${attempt.id}/evaluation`}
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Evaluation Feedback</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/my-work"
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              My Work Overview
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Header Hero */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {challenge.capability_category.replace("-", " ")}
            </span>
            <span className="text-xs font-semibold text-zinc-500">
              Stage 5: Reflect & Consolidate
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Reflection Workspace: {challenge.title}
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Metacognition is central to human capability development. Reflecting on <em>how</em> you solved a problem, which assumptions shifted, and where you met friction solidifies learning far more effectively than merely producing an answer.
          </p>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-3 text-xs text-zinc-600 dark:text-zinc-400">
            💡 <strong>Guidance:</strong> Short, authentic thoughts are more valuable than long, polished paragraphs. Write what you genuinely experienced.
          </div>
        </div>

        {isSubmitted && (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6 space-y-3 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <h3 className="font-bold text-base">
                Reflection Preserved in Your Growth Records
              </h3>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              Your challenge attempt is now marked as <strong>Completed</strong>. Your submission, evaluation feedback, and reflection have been compiled into an authentic evidence artifact in your development journey.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button
                size="sm"
                onClick={() => {
                  startTransition(() => {
                    router.push("/my-work");
                  });
                }}
                className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white"
              >
                Go to My Work →
              </Button>
              <Link
                href="/dashboard"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Reflection Prompt Form */}
        <div className="space-y-6">
          {prompts.map((promptText, idx) => (
            <Card key={idx} className="p-6 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-sm sm:text-base flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 select-none">
                    {idx + 1}.
                  </span>
                  <span>{promptText}</span>
                </CardTitle>
              </div>

              <textarea
                rows={4}
                disabled={isSubmitted}
                value={responses[promptText] || ""}
                onChange={(e) => handleResponseChange(promptText, e.target.value)}
                placeholder="Share your honest observation or realization..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 transition-colors disabled:opacity-75 disabled:bg-zinc-100 dark:disabled:bg-zinc-900"
              />
            </Card>
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Action Footer */}
        {!isSubmitted && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                Ready to finalize your reflection?
              </h4>
              <p className="text-xs text-zinc-500">
                Submitting preserves your answers alongside your challenge submission.
              </p>
            </div>

            <Button
              isLoading={isSaving}
              onClick={handleSubmitReflection}
              className="text-xs px-6 py-2"
            >
              Submit Reflection & Complete Challenge →
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
