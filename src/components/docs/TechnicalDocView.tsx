"use client";

import React, { useState } from "react";
import { TECHNICAL_DOC_SECTIONS } from "@/lib/docs/content";

interface TechnicalDocViewProps {
  searchQuery: string;
}

export function TechnicalDocView({ searchQuery }: TechnicalDocViewProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>("overview");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const filteredSections = TECHNICAL_DOC_SECTIONS.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q) ||
      sec.body.some((b) => b.toLowerCase().includes(q))
    );
  });

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 items-start">
      {/* Left Navigation Rail (Sticky on Desktop) */}
      <div className="lg:col-span-3 sticky top-24 space-y-4 print:hidden">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161421] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
            Technical Architecture Index
          </span>
          <nav className="space-y-1 text-xs">
            {TECHNICAL_DOC_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#sec-${sec.id}`}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between block ${
                  activeSectionId === sec.id
                    ? "bg-[#5B3BFF]/10 text-[#5B3BFF] font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[10px] text-zinc-400 font-bold">{sec.code}</span>
                  <span className="truncate">{sec.title.split("&")[0]}</span>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Column: Full Technical Sections */}
      <div className="lg:col-span-9 space-y-10">
        {filteredSections.map((sec) => (
          <section
            key={sec.id}
            id={`sec-${sec.id}`}
            className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-8 sm:p-10 shadow-sm space-y-6"
          >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#5B3BFF]/10 text-[#5B3BFF] flex items-center justify-center font-mono font-bold text-xs border border-[#5B3BFF]/20">
                  {sec.code}
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#17151F] dark:text-white tracking-tight">
                    {sec.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {sec.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Section Summary */}
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium italic bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
              {sec.summary}
            </p>

            {/* Section Detailed Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {sec.body.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-[#5B3BFF] font-bold shrink-0 mt-0.5">›</span>
                  <p>{p}</p>
                </div>
              ))}
            </div>

            {/* Optional Architecture / Code Snippet */}
            {sec.codeSnippet && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-[11px]">System Architecture Schema</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(sec.id, sec.codeSnippet!)}
                    className="hover:text-[#5B3BFF] font-semibold text-[11px]"
                  >
                    {copiedCodeId === sec.id ? "✓ Copied" : "Copy Schema"}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-[#111019] text-zinc-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-zinc-800">
                  {sec.codeSnippet}
                </pre>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
