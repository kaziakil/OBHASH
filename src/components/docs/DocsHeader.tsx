"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { DocsTabMode, DocsAccessConfig } from "@/types/docs";

interface DocsHeaderProps {
  activeTab: DocsTabMode;
  onSelectTab: (tab: DocsTabMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  config: DocsAccessConfig;
  onOpenAdmin: () => void;
  onExportMarkdown: () => void;
}

export function DocsHeader({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  config,
  onOpenAdmin,
  onExportMarkdown,
}: DocsHeaderProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      setExportDropdownOpen(false);
    }
  };

  const handlePrintPdf = () => {
    setExportDropdownOpen(false);
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#111019]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors print:hidden">
      {/* Optional Announcement Banner */}
      {config.announcementBanner && (
        <div className="bg-[#5B3BFF] text-white text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{config.announcementBanner}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand Identity & Home Link */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#17151F] text-white flex items-center justify-center font-black text-xs shadow-sm">
              <span className="text-[#5B3BFF]">O</span>
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#17151F] dark:text-white tracking-tight">
                OBHASH Docs
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block -mt-0.5">
                YC Deck & Architecture
              </span>
            </div>
          </Link>

          {/* Mode Switcher Pill */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <button
              type="button"
              onClick={() => onSelectTab("pitch")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "pitch"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              💼 YC Pitch Deck
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("technical")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "technical"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              ⚙️ Technical Spec
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("live-system")}
              className={`px-3 py-1.5 rounded-lg transition-all hidden sm:inline-block ${
                activeTab === "live-system"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              📊 Live Specs
            </button>
          </div>
        </div>

        {/* Right: Search, Export & Admin Override Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Quick Search Input */}
          <div className="relative flex-1 sm:w-60">
            <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter deck & technical docs..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B3BFF]"
            />
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-1.5"
            >
              <span>Export</span>
              <span className="text-[10px] text-zinc-400">▼</span>
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#161421] p-1.5 shadow-xl text-xs z-50 animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-800 dark:text-zinc-200"
                >
                  <span>📄</span>
                  <span>Export to PDF / Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExportDropdownOpen(false);
                    onExportMarkdown();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-800 dark:text-zinc-200"
                >
                  <span>📝</span>
                  <span>Export Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-800 dark:text-zinc-200"
                >
                  <span>🔗</span>
                  <span>{copiedLink ? "Link Copied!" : "Copy Shareable Link"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Admin Override Settings Gear */}
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Admin Access & Scheduling"
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-[#5B3BFF] hover:border-[#5B3BFF] transition-colors relative"
          >
            <span className="text-sm">⚙</span>
            {config.isScheduled && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#5B3BFF]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
