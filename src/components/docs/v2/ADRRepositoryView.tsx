"use client";

import React, { useState, useMemo } from "react";
import { V2_ADR_RECORDS } from "@/lib/docs/adr-repository";

interface ADRRepositoryViewProps {
  searchQuery?: string;
}

export function ADRRepositoryView({ searchQuery = "" }: ADRRepositoryViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [expandedADRId, setExpandedADRId] = useState<string | null>("ADR-001");

  const query = searchQuery.trim().toLowerCase();

  const statuses = ["All", "Approved", "Proposed", "Superseded"];

  // Filter ADRs
  const filteredADRs = useMemo(() => {
    return V2_ADR_RECORDS.filter((adr) => {
      const matchesStatus = selectedStatus === "All" || adr.status === selectedStatus;
      const matchesQuery =
        !query ||
        adr.id.toLowerCase().includes(query) ||
        adr.title.toLowerCase().includes(query) ||
        adr.context.toLowerCase().includes(query) ||
        adr.decision.toLowerCase().includes(query) ||
        adr.author.toLowerCase().includes(query) ||
        adr.relatedEngines.some((e) => e.toLowerCase().includes(query)) ||
        adr.relatedPhases.some((p) => p.toLowerCase().includes(query));

      return matchesStatus && matchesQuery;
    });
  }, [selectedStatus, query]);

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* 1. HEADER */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Architecture Decision Records (ADRs) • Searchable Technical Repository
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Architecture Decision Records & Governance Rationale
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Searchable repository recording significant architectural decisions, alternatives considered,
          rejection rationales, system consequences, and multi-disciplinary approval history across Team PastForward.
        </p>

        {/* Phase 07 Mandate Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <span className="text-base">⚖️</span>
            <span>
              <strong>ADR-005 Active Mandate:</strong> The production technology stack will be formally finalized in Phase 07 following empirical benchmarks.
            </span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold shrink-0">
            PHASE 07 GATE
          </span>
        </div>
      </div>

      {/* 2. STATUS FILTER BUTTONS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
        {statuses.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedStatus === st
                ? "bg-white dark:bg-[#161421] text-[#5B3BFF] dark:text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {st} ({st === "All" ? V2_ADR_RECORDS.length : V2_ADR_RECORDS.filter((a) => a.status === st).length})
          </button>
        ))}
      </div>

      {/* 3. ADR CARDS LIST */}
      <div className="space-y-6">
        {filteredADRs.map((adr) => {
          const isExpanded = expandedADRId === adr.id;
          return (
            <article
              key={adr.id}
              className={`rounded-3xl border transition-all ${
                isExpanded
                  ? "bg-white dark:bg-[#161421] border-[#5B3BFF]/40 shadow-md"
                  : "bg-white dark:bg-[#161421] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {/* Header Toggle */}
              <button
                type="button"
                onClick={() => setExpandedADRId(isExpanded ? null : adr.id)}
                className="w-full text-left p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[#5B3BFF] dark:text-[#9D86FF] shrink-0">
                    {adr.id}
                  </span>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-zinc-900 dark:text-white">
                      {adr.title}
                    </h3>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>Author: {adr.author}</span>
                      <span>•</span>
                      <span>Date: {adr.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      adr.status === "Approved"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    ● {adr.status}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {isExpanded ? "▲ Collapse" : "▼ Details"}
                  </span>
                </div>
              </button>

              {/* Expanded ADR Specification */}
              {isExpanded && (
                <div className="p-6 sm:p-8 pt-0 border-t border-zinc-100 dark:border-zinc-800 space-y-6 text-xs mt-2">
                  {/* Context & Decision */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-[11px]">
                        Context & Problem Statement
                      </h4>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {adr.context}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-[11px]">
                        Architectural Decision
                      </h4>
                      <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 text-purple-950 dark:text-purple-200 leading-relaxed font-medium">
                        {adr.decision}
                      </div>
                    </div>
                  </div>

                  {/* Alternatives Considered */}
                  <div className="space-y-3">
                    <h4 className="font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-[11px]">
                      Alternatives Considered & Rejection Rationale
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {adr.alternativesConsidered.map((alt, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-200/60 dark:border-zinc-800 space-y-1.5"
                        >
                          <div className="font-bold text-zinc-900 dark:text-white">
                            {alt.title}
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-snug">
                            {alt.description}
                          </p>
                          <div className="text-rose-600 dark:text-rose-400 text-[11px] font-medium pt-1">
                            <strong>Why rejected:</strong> {alt.rejectionReason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consequences */}
                  <div className="space-y-3">
                    <h4 className="font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-[11px]">
                      Consequences & Trade-Offs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1.5">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300">
                          Positive Impacts
                        </div>
                        <ul className="space-y-1 text-zinc-700 dark:text-zinc-300 text-[11px]">
                          {adr.consequences.positive.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1.5">
                        <div className="font-bold text-amber-800 dark:text-amber-300">
                          Trade-Offs & Complexity
                        </div>
                        <ul className="space-y-1 text-zinc-700 dark:text-zinc-300 text-[11px]">
                          {adr.consequences.negative.map((n, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">!</span>
                              <span>{n}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Approval History & Related Entities */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
                    <div className="space-y-1">
                      <div className="font-bold text-zinc-700 dark:text-zinc-300">
                        Approval History:
                      </div>
                      <div className="flex flex-wrap gap-2 text-zinc-500">
                        {adr.approvalHistory.map((h, idx) => (
                          <span key={idx}>
                            [{h.date}] {h.event} ({h.actor})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 self-start sm:self-auto shrink-0">
                      {adr.relatedEngines.map((e, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#5B3BFF]/10 text-[#5B3BFF] font-mono text-[10px] font-bold"
                        >
                          {e}
                        </span>
                      ))}
                      {adr.relatedPhases.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
