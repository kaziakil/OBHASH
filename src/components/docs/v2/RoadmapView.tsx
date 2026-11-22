"use client";

import React, { useState, useMemo } from "react";
import { V2_ROADMAP_STAGES } from "@/lib/docs/v2-content";

interface RoadmapViewProps {
  searchQuery?: string;
}

export function RoadmapView({ searchQuery = "" }: RoadmapViewProps) {
  const [selectedStageNumber, setSelectedStageNumber] = useState<number | "all">("all");
  const [expandedPhaseCode, setExpandedPhaseCode] = useState<string | null>("PHASE-01");

  const query = searchQuery.trim().toLowerCase();

  // Filter stages and phases
  const filteredStages = useMemo(() => {
    return V2_ROADMAP_STAGES.map((stage) => {
      const phases = stage.phases.filter((phase) => {
        const matchesQuery =
          !query ||
          phase.title.toLowerCase().includes(query) ||
          phase.phaseCode.toLowerCase().includes(query) ||
          phase.focus.toLowerCase().includes(query) ||
          phase.workPackages.some((wp) => wp.toLowerCase().includes(query)) ||
          phase.deliverables.some((d) => d.toLowerCase().includes(query)) ||
          phase.approvalGate.toLowerCase().includes(query) ||
          phase.simultaneousAppScope.toLowerCase().includes(query);
        return matchesQuery;
      });

      return {
        ...stage,
        phases,
      };
    }).filter((stage) => {
      const matchesStageFilter =
        selectedStageNumber === "all" || stage.stageNumber === selectedStageNumber;
      return matchesStageFilter && stage.phases.length > 0;
    });
  }, [selectedStageNumber, query]);

  // Overall statistics
  const stats = useMemo(() => {
    let totalPhases = 0;
    let operationalPhases = 0;
    let implementedPhases = 0;
    let inDevPhases = 0;
    let plannedPhases = 0;

    V2_ROADMAP_STAGES.forEach((stage) => {
      stage.phases.forEach((p) => {
        totalPhases++;
        if (p.status === "Operational") operationalPhases++;
        else if (p.status === "Implemented") implementedPhases++;
        else if (p.status === "In Development") inDevPhases++;
        else plannedPhases++;
      });
    });

    return { totalPhases, operationalPhases, implementedPhases, inDevPhases, plannedPhases };
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* 1. ROADMAP HEADER & SIMULTANEOUS MULTI-APP PRINCIPLE */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          Master Roadmap v2.0.0 • 8 Stages & 25 Development Phases
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Master Development Roadmap & Governance Gates
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          The OBHASH v2.0.0 roadmap governs simultaneous multi-application development across 8 structured
          stages and 25 rigorous phases. Each phase features explicit work packages, verifiable deliverables,
          cross-cutting workstreams, and non-negotiable approval gates.
        </p>

        {/* Simultaneous Development Principle Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/10 via-[#5B3BFF]/10 to-indigo-900/10 border border-[#5B3BFF]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#5B3BFF] dark:text-[#9D86FF] flex items-center gap-1.5">
              <span>⚡</span>
              <span>Simultaneous Multi-App Development Mandate</span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
              Applications are not developed in sequential isolation. <strong>APP-01 through APP-05 are engineered concurrently</strong>, each advancing through every phase while consuming the unified shared engines (ENG-01 to ENG-06).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              Phases 01-08: Reference Verified
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
              Phases 09-25: Governed Rollout
            </span>
          </div>
        </div>

        {/* Summary Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {stats.totalPhases}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Total Phases</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.operationalPhases}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Operational / Live</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {stats.implementedPhases}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Implemented Core</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.inDevPhases}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">In Development</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-black text-zinc-400">
              {stats.plannedPhases}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Planned Gates</div>
          </div>
        </div>
      </div>

      {/* 2. STAGE FILTER BUTTONS */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
        <button
          type="button"
          onClick={() => setSelectedStageNumber("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedStageNumber === "all"
              ? "bg-white dark:bg-[#161421] text-[#5B3BFF] dark:text-white shadow-xs font-bold"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          All 8 Stages
        </button>
        {V2_ROADMAP_STAGES.map((st) => (
          <button
            key={st.stageNumber}
            type="button"
            onClick={() => setSelectedStageNumber(st.stageNumber)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedStageNumber === st.stageNumber
                ? "bg-white dark:bg-[#161421] text-[#5B3BFF] dark:text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Stage {st.stageNumber}
          </button>
        ))}
      </div>

      {/* 3. ROADMAP STAGES & PHASES TIMELINE */}
      <div className="space-y-12">
        {filteredStages.map((stage) => (
          <section key={stage.stageNumber} className="space-y-6">
            {/* Stage Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#5B3BFF] text-white font-mono text-xs font-black">
                  STAGE 0{stage.stageNumber}
                </span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {stage.stageName}
                </h2>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
                {stage.description}
              </p>
            </div>

            {/* Phases Grid */}
            <div className="space-y-4">
              {stage.phases.map((phase) => {
                const isExpanded = expandedPhaseCode === phase.phaseCode;
                return (
                  <div
                    key={phase.phaseCode}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? "bg-white dark:bg-[#161421] border-[#5B3BFF]/40 shadow-md"
                        : "bg-white dark:bg-[#161421] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    {/* Collapsed / Main Header */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPhaseCode(isExpanded ? null : phase.phaseCode)
                      }
                      className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                          {phase.phaseCode}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                            <span>{phase.title}</span>
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                            {phase.focus}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            phase.status === "Operational"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : phase.status === "Implemented"
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                              : phase.status === "In Development"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          ● {phase.status}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {isExpanded ? "▲ Collapse" : "▼ Details"}
                        </span>
                      </div>
                    </button>

                    {/* Expanded Detail Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 pt-0 border-t border-zinc-100 dark:border-zinc-800/80 space-y-6 mt-2 text-xs">
                        {/* Scope & Focus */}
                        <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 text-purple-900 dark:text-purple-200">
                          <strong>Simultaneous Scope:</strong> {phase.simultaneousAppScope}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Work Packages */}
                          <div className="space-y-2">
                            <h4 className="font-bold uppercase tracking-wider text-[11px] text-zinc-500 dark:text-zinc-400">
                              Work Packages
                            </h4>
                            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
                              {phase.workPackages.map((wp, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-[#5B3BFF] font-bold">•</span>
                                  <span>{wp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Deliverables */}
                          <div className="space-y-2">
                            <h4 className="font-bold uppercase tracking-wider text-[11px] text-zinc-500 dark:text-zinc-400">
                              Deliverables
                            </h4>
                            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
                              {phase.deliverables.map((deliv, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 font-bold">✓</span>
                                  <span>{deliv}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Approval Gate & Governance */}
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="font-bold uppercase tracking-wider text-[10px] text-zinc-500 dark:text-zinc-400">
                              Formal Approval Gate Requirement
                            </div>
                            <div className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                              {phase.approvalGate}
                            </div>
                          </div>
                          {phase.dependencies.length > 0 && (
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 self-start sm:self-auto shrink-0">
                              <strong>Dependencies:</strong> {phase.dependencies.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
