"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  IndependenceOverviewData,
  IndependenceDimensionKey,
  AIAssistanceLevel,
  EvidenceSufficiency,
} from "@/types/independence";
import { AI_ASSISTANCE_METADATA } from "@/lib/independence/classifier";
import { evaluateUserIndependence } from "@/lib/independence/engine";

interface Props {
  initialData: IndependenceOverviewData;
}

export function IndependenceDashboardClient({ initialData }: Props) {
  const [data, setData] = useState<IndependenceOverviewData>(initialData);
  const [activeTab, setActiveTab] = useState<"dimensions" | "ai_patterns" | "timeline" | "explorer">("dimensions");
  const [selectedDimensionKey, setSelectedDimensionKey] = useState<IndependenceDimensionKey | null>(null);
  const [isSimulatingEmpty, setIsSimulatingEmpty] = useState(false);

  // Toggle demo between active evidence and empty evidence
  const toggleEmptyState = () => {
    if (isSimulatingEmpty) {
      setData(evaluateUserIndependence("demo-user-1"));
      setIsSimulatingEmpty(false);
    } else {
      setData(evaluateUserIndependence("new-empty-user"));
      setIsSimulatingEmpty(true);
    }
  };

  const getSufficiencyBadge = (sufficiency: EvidenceSufficiency) => {
    switch (sufficiency) {
      case "consistent":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">Consistent Evidence</span>;
      case "developing":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">Developing Evidence</span>;
      case "emerging":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">Emerging Evidence</span>;
      case "insufficient":
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">Insufficient Evidence</span>;
    }
  };

  const getAIBadge = (level: AIAssistanceLevel) => {
    const meta = AI_ASSISTANCE_METADATA[level];
    const colors: Record<AIAssistanceLevel, string> = {
      "Level A": "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
      "Level B": "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800",
      "Level C": "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
      "Level D": "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
      "Level E": "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${colors[level]}`}>
        {level} • {meta.name}
      </span>
    );
  };

  const selectedDimension = selectedDimensionKey ? data.dimensions[selectedDimensionKey] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              Phase 7 Measurement Engine
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Framework v{data.frameworkVersion}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-50">
            Independence Measurement & Insights
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl mt-1 leading-relaxed">
            Examining observable evidence of independent reasoning, self-directed exploration, and thoughtful AI collaboration. OBHASH does not produce arbitrary IQ scores; it tracks authentic human capability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleEmptyState}
            className="text-xs px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            {isSimulatingEmpty ? "← Restore Demo Evidence" : "Simulate Insufficient Evidence"}
          </button>
          <Link
            href="/portfolio"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-1.5"
          >
            Open Growth Portfolio →
          </Link>
        </div>
      </div>

      {/* Philosophical Grounding Alert */}
      <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            Human-Centered Intelligence Core Principle
          </p>
          <p className="text-xs leading-relaxed">
            Independence does not mean refusing to use AI. A learner can partner with AI thoughtfully and demonstrate strong independent judgment by auditing premises, testing counterarguments, and retaining ownership of core decisions.
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
            {data.totalObservationsCount} Verifiable Observations
          </span>
        </div>
      </div>

      {/* Empty / Insufficient Evidence Banner */}
      {!data.hasSufficientEvidence && (
        <div className="p-8 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-bold text-lg">
            <span>⚠️</span>
            <span>Insufficient Evidence for Reliable Measurement</span>
          </div>
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed max-w-3xl">
            OBHASH will never generate an arbitrary number or guess your independence without verifiable proof. Because you have fewer than 2 qualified activity records in this profile, your independence dimensions are currently marked as <strong>Insufficient Evidence</strong>.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/challenges"
              className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm"
            >
              Start an Everyday Challenge →
            </Link>
            <Link
              href="/assessments"
              className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100/50"
            >
              Complete Baseline Diagnostic
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-sm font-medium gap-8">
        <button
          onClick={() => setActiveTab("dimensions")}
          className={`pb-3 font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "dimensions"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Five Independence Dimensions
        </button>
        <button
          onClick={() => setActiveTab("ai_patterns")}
          className={`pb-3 font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "ai_patterns"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          AI Assistance Classification (Levels A–E)
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`pb-3 font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "timeline"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Capability Development Over Time
        </button>
        <button
          onClick={() => setActiveTab("explorer")}
          className={`pb-3 font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "explorer"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Evidence Provenance Explorer
        </button>
      </div>

      {/* Tab 1: Dimensions Grid */}
      {activeTab === "dimensions" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.entries(data.dimensions) as [IndependenceDimensionKey, typeof data.dimensions[IndependenceDimensionKey]][]).map(
              ([key, dim]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 flex flex-col justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{dim.title}</h3>
                      {getSufficiencyBadge(dim.sufficiency)}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {dim.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Observable Indicators Demonstrated
                      </p>
                      <div className="space-y-1.5">
                        {dim.behaviors.map((beh) => (
                          <div key={beh.key} className="flex items-center justify-between text-xs py-0.5">
                            <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[210px]">{beh.label}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                beh.count > 0
                                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                              }`}
                            >
                              {beh.count} obs
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {dim.observationCount} qualified citation{dim.observationCount === 1 ? "" : "s"}
                    </span>
                    <button
                      onClick={() => setSelectedDimensionKey(key)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Inspect Evidence →
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Development Narrative Card */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Personalized Development Narrative
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {data.developmentNarrative.overallSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Key Strengths Grounded in Submissions
                </h4>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-4">
                  {data.developmentNarrative.strengthsDemonstrated.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Recommended Areas for Investigation
                </h4>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-4">
                  {data.developmentNarrative.areasForInvestigation.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                {data.limitationsNotice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Assistance Patterns */}
      {activeTab === "ai_patterns" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              5-Tier AI Assistance Classification Distribution
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              OBHASH classifies AI involvement across five transparent categories, never relying on superficial AI-detection algorithms.
            </p>

            {/* Distribution Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {(Object.keys(AI_ASSISTANCE_METADATA) as AIAssistanceLevel[]).map((lvl) => {
                const meta = AI_ASSISTANCE_METADATA[lvl];
                const count = data.aiAssistanceBreakdown.levelCounts[lvl] || 0;
                return (
                  <div key={lvl} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center space-y-1">
                    <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{count}</span>
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{lvl}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{meta.name}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 text-xs text-zinc-700 dark:text-zinc-300">
              <strong>Observed Pattern:</strong> {data.aiAssistanceBreakdown.narrative}
            </div>
          </div>

          {/* Classification Rubric Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.values(AI_ASSISTANCE_METADATA)).map((meta) => (
              <div key={meta.level} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{meta.level}: {meta.name}</span>
                  {getAIBadge(meta.level)}
                </div>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{meta.tagline}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{meta.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Capability Development Over Time */}
      {activeTab === "timeline" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Capability Development Timeline
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Connecting Phase 3 diagnostic baselines, Phase 5 coaching sessions, and Phase 6 practical challenges.
              </p>
            </div>

            {data.developmentTimeline.length === 0 ? (
              <p className="text-sm text-zinc-500 py-6 text-center">No timeline milestones recorded yet.</p>
            ) : (
              <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 space-y-8 py-2">
                {data.developmentTimeline.map((item) => (
                  <div key={item.id} className="relative pl-6 space-y-2">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-zinc-900" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-zinc-500 font-mono">{item.date}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {item.activityType.replace("_", " ").toUpperCase()}
                      </span>
                      {getAIBadge(item.aiAssistanceLevel)}
                      {item.performanceLevel && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {item.performanceLevel}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.evidenceSnippet}
                    </p>

                    {item.scoreComparison && (
                      <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-semibold">
                          <span className="text-zinc-500">Comparison:</span>
                          <span>Baseline: {item.scoreComparison.baseline}</span>
                          <span>→</span>
                          <span>Subsequent: {item.scoreComparison.current}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                          {item.scoreComparison.note}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Evidence Provenance Explorer */}
      {activeTab === "explorer" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Verifiable Evidence Provenance Registry
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Every observation is linked directly to a verifiable submission, reflection, or assessment.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Dimension</th>
                    <th className="py-3 px-3">Behavior Indicator</th>
                    <th className="py-3 px-3">Source & Record</th>
                    <th className="py-3 px-3">Classification</th>
                    <th className="py-3 px-3">Direct Evidence Quote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {(Object.values(data.dimensions)).flatMap((dim) =>
                    dim.behaviors.flatMap((beh) =>
                      beh.evidenceSnippets.map((snip, idx) => (
                        <tr key={`${dim.dimensionKey}-${beh.key}-${idx}`} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                          <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-200 whitespace-nowrap">
                            {dim.title}
                          </td>
                          <td className="py-3 px-3 text-zinc-700 dark:text-zinc-300">
                            {beh.label}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="font-medium text-zinc-800 dark:text-zinc-200 block">{snip.sourceTitle}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{snip.sourceType} • {snip.sourceRecordId}</span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {getAIBadge(snip.aiAssistance)}
                          </td>
                          <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 italic max-w-md">
                            &ldquo;{snip.quote}&rdquo;
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Dimension Evidence Drilldown */}
      {selectedDimension && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedDimension.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">{selectedDimension.description}</p>
              </div>
              <button
                onClick={() => setSelectedDimensionKey(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-500">Evidence Sufficiency:</span>
                {getSufficiencyBadge(selectedDimension.sufficiency)}
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Observable Behavior Demonstrations
                </h4>
                {selectedDimension.behaviors.map((beh) => (
                  <div key={beh.key} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{beh.label}</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[11px] font-bold">
                        {beh.count} demonstrated
                      </span>
                    </div>

                    {beh.evidenceSnippets.length > 0 ? (
                      <div className="space-y-2 pt-2">
                        {beh.evidenceSnippets.map((snip, sIdx) => (
                          <div key={sIdx} className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{snip.sourceTitle}</span>
                              {getAIBadge(snip.aiAssistance)}
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 italic">
                              &ldquo;{snip.quote}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-zinc-400 italic">No specific citations recorded yet.</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-1 text-xs text-indigo-950 dark:text-indigo-200">
                <p className="font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  Recommended Capability Practice
                </p>
                <p className="leading-relaxed">{selectedDimension.recommendedPractice}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDimensionKey(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
