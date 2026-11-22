"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { DocsTabMode, DocsAccessConfig } from "@/types/docs";
import { SUPPORTED_LOCALES } from "@/lib/docs/shared-service";

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
  const [currentLocale, setCurrentLocale] = useState("en");

  // Normalize legacy tab values
  const normalizedTab =
    activeTab === "pitch"
      ? "product"
      : activeTab === "technical"
      ? "engineering"
      : activeTab === "live-system"
      ? "transparency"
      : activeTab;

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
    <header
      role="banner"
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#111019]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors print:hidden"
    >
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-[#5B3BFF] focus:text-white focus:rounded-lg focus:shadow-lg focus:text-xs focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Optional Announcement Banner */}
      {config.announcementBanner && (
        <div
          role="region"
          aria-label="Announcement"
          className="bg-[#5B3BFF] text-white text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{config.announcementBanner}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Left: Brand Identity & Mode Switcher Pills */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
          <Link
            href="/"
            aria-label="OBHASH Home"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#17151F] text-white flex items-center justify-center font-black text-xs shadow-sm">
              <span className="text-[#5B3BFF]">O</span>
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#17151F] dark:text-white tracking-tight flex items-center gap-1.5">
                OBHASH Docs
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#5B3BFF]/10 text-[#5B3BFF] font-bold">
                  {config.publishedVersion}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    config.publishState === "published"
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {config.publishState.toUpperCase()}
                </span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block -mt-0.5">
                Transparency & Architecture Portal
              </span>
            </div>
          </Link>

          {/* Mode Switcher Pills (ARIA Navigation) */}
          <nav
            role="navigation"
            aria-label="Documentation sections"
            className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 overflow-x-auto max-w-full"
          >
            <button
              type="button"
              onClick={() => onSelectTab("product")}
              aria-current={normalizedTab === "product" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                normalizedTab === "product"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              💼 Product View
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("engineering")}
              aria-current={normalizedTab === "engineering" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                normalizedTab === "engineering"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              ⚙️ Engineering Spec
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("roadmap")}
              aria-current={normalizedTab === "roadmap" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                normalizedTab === "roadmap"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              🗺️ Roadmap v2.0
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("dependencies")}
              aria-current={normalizedTab === "dependencies" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                normalizedTab === "dependencies"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              🕸️ Dependencies
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("adrs")}
              aria-current={normalizedTab === "adrs" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                normalizedTab === "adrs"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              ⚖️ ADRs
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("transparency")}
              aria-current={normalizedTab === "transparency" ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                normalizedTab === "transparency"
                  ? "bg-white dark:bg-[#17151F] text-[#5B3BFF] dark:text-white font-bold shadow-xs"
                  : "hover:text-[#17151F] dark:hover:text-white"
              }`}
            >
              📊 Transparency
            </button>
          </nav>
        </div>

        {/* Right: Search, Language, Export & Admin Controls */}
        <div className="flex items-center gap-2.5 w-full xl:w-auto justify-end">
          {/* Quick Search Input */}
          <div className="relative flex-1 sm:w-56">
            <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search specifications..."
              aria-label="Search documentation"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#5B3BFF]"
            />
          </div>

          {/* Multilingual / Locale Selector */}
          <select
            value={currentLocale}
            onChange={(e) => setCurrentLocale(e.target.value)}
            aria-label="Select documentation language"
            className="px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200"
          >
            {SUPPORTED_LOCALES.map((loc) => (
              <option key={loc.code} value={loc.code}>
                {loc.name.split(" ")[0]}
              </option>
            ))}
          </select>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              aria-expanded={exportDropdownOpen}
              aria-label="Export documentation options"
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-1.5"
            >
              <span>Export</span>
              <span className="text-[10px] text-zinc-400">▼</span>
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#161421] p-1.5 shadow-xl text-xs z-50 animate-in fade-in duration-100">
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
                  <span>Download Whitepaper (.md)</span>
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
            title="Admin Access, Versioning & Scheduling"
            aria-label="Documentation governance settings"
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-[#5B3BFF] hover:border-[#5B3BFF] transition-colors relative"
          >
            <span className="text-sm">⚙</span>
            {config.isScheduled && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#5B3BFF]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
