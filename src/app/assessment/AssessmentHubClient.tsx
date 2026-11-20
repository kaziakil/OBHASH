"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle, CardDescription } from "@/components/shared/Card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { startAssessmentAttempt } from "@/lib/assessments/actions";
import type { AssessmentModuleData, CapabilityBaselineProfile } from "@/types/assessment";

interface AssessmentHubClientProps {
  modules: AssessmentModuleData[];
  existingProfiles: CapabilityBaselineProfile[];
}

export function AssessmentHubClient({ modules, existingProfiles }: AssessmentHubClientProps) {
  const router = useRouter();
  const [loadingModule, setLoadingModule] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  async function handleStart(slug: string) {
    setLoadingModule(slug);
    setErrorNotice(null);

    try {
      const result = await startAssessmentAttempt(slug);
      if (result.success && result.data) {
        sessionStorage.setItem(`obhash_attempt_${slug}`, result.data.attemptId);
        router.push(`/assessment/${slug}`);
      } else {
        setErrorNotice(result.error || "Failed to start assessment.");
        setLoadingModule(null);
      }
    } catch {
      setErrorNotice("An unexpected error occurred. Please try again.");
      setLoadingModule(null);
    }
  }

  return (
    <div className="space-y-6">
      {errorNotice && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-700 dark:text-rose-300">
          {errorNotice}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {modules.map((mod, idx) => {
          const profile = existingProfiles.find((p) => p.capabilityKey === mod.slug);
          const isCompleted = Boolean(profile);

          return (
            <Card
              key={mod.slug}
              className="flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all p-7 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    Module 0{idx + 1}
                  </span>
                  {isCompleted ? (
                    <StatusBadge status="operational" label={profile?.performanceLevel} />
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      ~{mod.estimatedMinutes} mins
                    </span>
                  )}
                </div>

                <div>
                  <CardTitle className="text-xl mb-1">{mod.name}</CardTitle>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {mod.tagline}
                  </p>
                </div>

                <CardDescription className="text-xs leading-relaxed">
                  {mod.description}
                </CardDescription>

                <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Dimensions Measured
                  </span>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                    {mod.dimensions.map((d) => (
                      <li key={d.slug} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{d.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                {isCompleted ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Demonstrated Score</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {profile?.overallScore.toFixed(2)} / 4.00
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleStart(mod.slug)}
                      isLoading={loadingModule === mod.slug}
                    >
                      Retake Assessment
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => handleStart(mod.slug)}
                    isLoading={loadingModule === mod.slug}
                  >
                    Start Assessment →
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
