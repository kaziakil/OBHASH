"use client";

import React, { useState, useMemo } from "react";
import { V2_DOCUMENTATION_SECTIONS } from "@/lib/docs/v2-content";
import { ArchitectureDiagrams } from "@/components/docs/ArchitectureDiagrams";

interface EngineeringViewProps {
  searchQuery?: string;
}

export function EngineeringView({ searchQuery = "" }: EngineeringViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedAnchor, setCopiedAnchor] = useState<string | null>(null);

  const query = searchQuery.trim().toLowerCase();

  const categories = [
    "All",
    "Vision & Ecosystem",
    "Architecture & Engines",
    "Applications",
    "Systems & Governance",
    "Operations & Roadmap",
  ];

  // Filter sections by search and category
  const filteredSections = useMemo(() => {
    return V2_DOCUMENTATION_SECTIONS.filter((sec) => {
      const matchesCategory =
        selectedCategory === "All" || sec.category === selectedCategory;
      const matchesQuery =
        !query ||
        sec.title.toLowerCase().includes(query) ||
        sec.code.toLowerCase().includes(query) ||
        sec.summary.toLowerCase().includes(query) ||
        sec.content.some((c) => c.toLowerCase().includes(query)) ||
        sec.subsections?.some(
          (sub) =>
            sub.title.toLowerCase().includes(query) ||
            sub.content.some((sc) => sc.toLowerCase().includes(query))
        );
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, query]);

  const handleCopyAnchor = (sectionId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
      navigator.clipboard.writeText(url);
      setCopiedAnchor(sectionId);
      setTimeout(() => setCopiedAnchor(null), 2000);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* 1. HEADER & ADR MANDATE NOTICE */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Technical Whitepaper & Architectural Reference • Version 2.0.0
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          OBHASH Engineering Whitepaper & Specification
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Comprehensive technical specifications covering the unified multi-application ecosystem,
          six shared engines, Socratic AI contracts, PostgreSQL schema, security governance, and
          interoperability matrices.
        </p>

        {/* Phase 07 ADR Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚖️</span>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider">
                Architectural Decision Record (ADR) Notice — Tech Stack Finalization
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                As specified in the Master Roadmap, the core production technology stack will be formally finalized in <strong>Phase 07 (Technical Architecture & Technology Selection)</strong> following empirical benchmarking across AI latency, concurrency, and local runtime constraints. The current implementation demonstrates the reference prototype.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 font-bold self-end sm:self-auto shrink-0">
            PHASE-07 GATE
          </span>
        </div>
      </div>

      {/* 2. INTERACTIVE ARCHITECTURE DIAGRAMS EXPLORER (10 DIAGRAMS) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>📐 Interactive Architecture Diagrams</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                10 Diagrams Available
              </span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Select any diagram to inspect architectural topologies, AI flow, engine interactions, and data schemas.
            </p>
          </div>
        </div>

        <ArchitectureDiagrams />
      </section>

      {/* 3. 17-SECTION TECHNICAL WHITEPAPER (SECTIONS A TO Q) */}
      <section className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-white dark:bg-[#161421] text-[#5B3BFF] dark:text-white shadow-xs font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section List */}
        <div className="space-y-8">
          {filteredSections.map((sec) => (
            <article
              key={sec.id}
              id={sec.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 scroll-mt-24 transition-all"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#5B3BFF] text-white flex items-center justify-center font-black text-xs font-mono shadow-sm">
                    {sec.code}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                      {sec.title}
                    </h3>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {sec.subtitle} •{" "}
                      <span className="text-[#5B3BFF] dark:text-[#9D86FF]">
                        {sec.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyAnchor(sec.id)}
                    className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1.5"
                    title="Copy direct anchor link"
                  >
                    <span>🔗</span>
                    <span>{copiedAnchor === sec.id ? "Copied!" : "Link"}</span>
                  </button>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    AUDIENCE: {sec.targetAudience.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Section Summary Box */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60">
                <p className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  &ldquo;{sec.summary}&rdquo;
                </p>
              </div>

              {/* Section Paragraphs */}
              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Subsections & Code Blocks */}
              {sec.subsections && sec.subsections.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  {sec.subsections.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                          {sub.title}
                        </h4>
                        {sub.badges && (
                          <div className="flex flex-wrap gap-1">
                            {sub.badges.map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {sub.content.map((cp, cpIdx) => (
                          <p key={cpIdx}>{cp}</p>
                        ))}
                      </div>

                      {sub.codeSnippet && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-800 bg-[#111019] text-zinc-100 font-mono text-xs shadow-inner">
                          <div className="px-4 py-1.5 bg-black/40 border-b border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                            <span>Code Reference & Schema</span>
                            <span>TypeScript / SQL</span>
                          </div>
                          <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed">
                            <code>{sub.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
