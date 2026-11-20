"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle } from "@/components/shared/Card";
import { Stepper } from "@/components/shared/Stepper";
import { Textarea } from "@/components/shared/Textarea";
import {
  saveAssessmentResponse,
  submitAssessmentAttempt,
} from "@/lib/assessments/actions";
import type {
  AssessmentItemData,
  AssessmentModuleData,
  UserResponsePayload,
} from "@/types/assessment";

interface AssessmentRunnerClientProps {
  moduleData: AssessmentModuleData;
}

export function AssessmentRunnerClient({ moduleData }: AssessmentRunnerClientProps) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Retrieve or initialize attemptId lazily from session storage
  const [attemptId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    let saved = sessionStorage.getItem(`obhash_attempt_${moduleData.slug}`);
    if (!saved) {
      saved = `local-attempt-${moduleData.slug}-${Date.now()}`;
      sessionStorage.setItem(`obhash_attempt_${moduleData.slug}`, saved);
    }
    return saved;
  });

  // Restore draft answers lazily from session storage
  const [responses, setResponses] = useState<Record<string, UserResponsePayload>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const draft = sessionStorage.getItem(`obhash_draft_${moduleData.slug}`);
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalItems = moduleData.items.length;
  const currentItem: AssessmentItemData = moduleData.items[currentIdx];

  // Persist draft answers to session storage
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      try {
        sessionStorage.setItem(
          `obhash_draft_${moduleData.slug}`,
          JSON.stringify(responses)
        );
      } catch {
        // Ignore storage errors
      }
    }
  }, [responses, moduleData.slug]);

  const currentPayload: UserResponsePayload = responses[currentItem.id] || {};

  function handleStructuredChange(sectionId: string, val: string) {
    setResponses((prev) => {
      const existing = prev[currentItem.id] || {};
      const structured = { ...(existing.structuredResponses || {}), [sectionId]: val };
      return {
        ...prev,
        [currentItem.id]: {
          ...existing,
          structuredResponses: structured,
        },
      };
    });
  }

  function handleLongTextChange(val: string) {
    setResponses((prev) => ({
      ...prev,
      [currentItem.id]: {
        ...(prev[currentItem.id] || {}),
        textResponse: val,
      },
    }));
  }

  async function handleNext() {
    setErrorMessage(null);

    // Save response to backend asynchronously
    if (attemptId && currentPayload) {
      saveAssessmentResponse(attemptId, currentItem.id, currentPayload);
    }

    if (currentIdx < totalItems - 1) {
      setCurrentIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setErrorMessage(null);
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitAssessmentAttempt(
        attemptId,
        moduleData.slug,
        responses
      );

      if (!result.success || !result.data) {
        setErrorMessage(result.error || "Evaluation failed. Please try again.");
        setIsSubmitting(false);
      } else {
        sessionStorage.removeItem(`obhash_draft_${moduleData.slug}`);
        router.push(`/assessment/results/${attemptId}`);
      }
    } catch {
      setErrorMessage("An unexpected error occurred during evaluation.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/assessment"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            ← Back to Assessment Hub
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {moduleData.name}
          </span>
        </div>

        <Stepper currentStep={currentIdx + 1} totalSteps={totalItems} />
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-700 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

      {/* Main Activity Card */}
      <Card className="p-6 sm:p-10 space-y-8 shadow-sm">
        {/* Activity Metadata Header */}
        <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Activity {currentIdx + 1} of {totalItems}
            </span>
            <span className="text-xs text-zinc-500">
              Evaluating: <strong className="text-zinc-800 dark:text-zinc-200">{currentItem.dimensionName}</strong>
            </span>
          </div>
          <CardTitle className="text-2xl">{currentItem.title}</CardTitle>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {currentItem.instructions}
          </p>
        </div>

        {/* Stimulus Scenario Card */}
        <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 p-6 space-y-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
            Scenario / Stimulus
          </span>
          {currentItem.scenario}
        </div>

        {/* Response Inputs */}
        <div className="space-y-6 pt-2">
          {currentItem.responseType === "structured-reasoning" &&
            currentItem.structuredSections?.map((section) => (
              <div key={section.id} className="space-y-2 text-left">
                <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {section.prompt}
                </label>
                <Textarea
                  value={currentPayload.structuredResponses?.[section.id] || ""}
                  onChange={(e) => handleStructuredChange(section.id, e.target.value)}
                  placeholder={section.placeholder}
                  className="min-h-[100px]"
                />
              </div>
            ))}

          {currentItem.responseType === "long-text" && (
            <div className="space-y-2 text-left">
              <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Your Reasoning & Strategic Decision
              </label>
              <Textarea
                value={currentPayload.textResponse || ""}
                onChange={(e) => handleLongTextChange(e.target.value)}
                placeholder="Structure your analysis, examine trade-offs, and defend your conclusion..."
                className="min-h-[220px]"
              />
              <div className="text-right text-xs text-zinc-400">
                Word count:{" "}
                {(currentPayload.textResponse || "")
                  .split(/\s+/)
                  .filter(Boolean).length}
              </div>
            </div>
          )}
        </div>

        {/* Navigation & Submission Controls */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          {currentIdx > 0 ? (
            <Button variant="outline" size="md" onClick={handleBack}>
              ← Previous Activity
            </Button>
          ) : (
            <div />
          )}

          {currentIdx < totalItems - 1 ? (
            <Button variant="primary" size="md" onClick={handleNext}>
              Next Activity →
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Submit Assessment & Generate Baseline →
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
