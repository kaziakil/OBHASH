"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle } from "@/components/shared/Card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { CapabilityBaselineProfile, SingleEvaluationResult } from "@/types/assessment";

interface AssessmentResultsClientProps {
  attemptId: string;
  profile: CapabilityBaselineProfile;
  evaluations: SingleEvaluationResult[];
}

export function AssessmentResultsClient({
  profile,
}: AssessmentResultsClientProps) {
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* 1. Header Section */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Baseline Established
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your Capability Baseline
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          This is a starting point for understanding how you currently approach problems, explore ideas, and evaluate information. These indicators describe your observed performance in this assessment, not your fixed potential.
        </p>
      </div>

      {/* 2. Primary Capability Summary Banner */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Capability Assessed
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            {profile.capabilityName}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Internal assessment score based on demonstrated reasoning in OBHASH framework.
          </p>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 pt-4 md:pt-0 md:pl-8">
          <div className="text-center">
            <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 block">
              {profile.overallScore.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-400">Scale 1.00 – 4.00</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-zinc-400 block font-medium">Demonstrated Level</span>
            <StatusBadge status="operational" label={profile.performanceLevel} className="text-sm px-3 py-1" />
          </div>
        </div>
      </div>

      {/* 3. Dimension-Level Results Breakdown */}
      <div className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Dimension Performance Breakdown
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Detailed evaluation of observed evidence across core capability dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.dimensionResults.map((dim) => (
            <Card key={dim.slug} className="p-6 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {dim.level}
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-500">
                    Level {dim.score.toFixed(1)} / 4
                  </span>
                </div>
                <CardTitle className="text-base">{dim.name}</CardTitle>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                    style={{ width: `${(dim.score / 4) * 100}%` }}
                  />
                </div>
              </div>

              {dim.evidence.length > 0 && (
                <div className="pt-2 text-xs text-zinc-500 dark:text-zinc-400 italic line-clamp-3">
                  {dim.evidence[0]}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Strengths & Development Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">✓</span>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Observed Strengths
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            {profile.strengthsSummary.length > 0 ? (
              profile.strengthsSummary.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="text-zinc-400 italic">No specific strengths captured.</li>
            )}
          </ul>
        </div>

        {/* Development Opportunities */}
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">↑</span>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Growth Opportunities
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
            {profile.opportunitiesSummary.length > 0 ? (
              profile.opportunitiesSummary.map((opp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold mt-0.5">•</span>
                  <span>{opp}</span>
                </li>
              ))
            ) : (
              <li className="text-zinc-400 italic">No specific opportunities identified.</li>
            )}
          </ul>
        </div>
      </div>

      {/* 5. Evidence Inspection Accordion */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Assessment Evidence Transparency
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Inspect observed response citations used in evaluation.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-xs"
          >
            {showEvidence ? "Hide Evidence" : "Review Evidence Citations"}
          </Button>
        </div>

        {showEvidence && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3 animate-in fade-in duration-200">
            {profile.evidenceSummary.map((ev, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed"
              >
                {ev}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Next Steps & Actions */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-zinc-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white">
            Continue to your growth journey
          </h4>
          <p className="text-xs text-zinc-300 max-w-md">
            Your capability baseline has been recorded in your profile. You can explore remaining assessments or return to your dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/assessment">
            <Button variant="outline" size="md" className="border-zinc-700 text-white hover:bg-zinc-800">
              Explore Other Assessments
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="md">
              Return to Dashboard →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
