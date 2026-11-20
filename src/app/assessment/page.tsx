import React from "react";
import { ASSESSMENT_MODULES } from "@/lib/assessments/content";
import { getUserCapabilityProfiles } from "@/lib/assessments/actions";
import { AssessmentHubClient } from "./AssessmentHubClient";

export default async function AssessmentHubPage() {
  const existingProfiles = await getUserCapabilityProfiles();

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Capability Baseline Evaluation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Discover Your Demonstrated Capabilities
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          OBHASH assessments evaluate what you can genuinely demonstrate through applied reasoning, open inquiry, and creative synthesis—not what you guess or self-report.
        </p>
      </div>

      {/* Assessment Principles Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          Assessment Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="space-y-1.5">
            <strong className="text-zinc-900 dark:text-zinc-200 block text-sm">
              1. Independent Performance
            </strong>
            <p>
              Assessments must be completed independently without AI assistance, establishing your authentic starting baseline.
            </p>
          </div>
          <div className="space-y-1.5">
            <strong className="text-zinc-900 dark:text-zinc-200 block text-sm">
              2. No Time Pressure
            </strong>
            <p>
              Take the time you need to think deeply. Thoughtful reasoning is prioritized over rushed responses.
            </p>
          </div>
          <div className="space-y-1.5">
            <strong className="text-zinc-900 dark:text-zinc-200 block text-sm">
              3. Transparent Feedback
            </strong>
            <p>
              Every score is grounded in an explicit 4-level rubric with concrete evidence cited from your actual responses.
            </p>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <AssessmentHubClient
        modules={ASSESSMENT_MODULES}
        existingProfiles={existingProfiles}
      />
    </div>
  );
}
