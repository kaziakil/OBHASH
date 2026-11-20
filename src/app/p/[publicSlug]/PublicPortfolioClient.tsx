"use client";

import React from "react";
import Link from "next/link";
import type { PublicPortfolioView } from "@/types/portfolio";
import type { AIAssistanceLevel } from "@/types/independence";
import { AI_ASSISTANCE_METADATA } from "@/lib/independence/classifier";

interface Props {
  portfolio: PublicPortfolioView;
}

export function PublicPortfolioClient({ portfolio }: Props) {
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
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${colors[level]}`}>
        {level} • {meta.name}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-black text-xs">
              O
            </div>
            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
              OBHASH Growth Showcase
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              🖨️ Export / Print PDF
            </button>
            <Link
              href="/"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            >
              Explore OBHASH
            </Link>
          </div>
        </div>
      </header>

      {/* Main Portfolio Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Hero Section */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              Human Capability Portfolio
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Published on {new Date(portfolio.publishedAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            {portfolio.displayName}
          </h1>

          {portfolio.headline && (
            <p className="text-lg text-indigo-700 dark:text-indigo-300 font-medium">
              {portfolio.headline}
            </p>
          )}

          {portfolio.personalIntroduction && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              {portfolio.personalIntroduction}
            </p>
          )}

          {portfolio.areasOfInterest && portfolio.areasOfInterest.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {portfolio.areasOfInterest.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                >
                  #{interest}
                </span>
              ))}
            </div>
          )}

          {portfolio.learningPhilosophy && (
            <div className="p-5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5 mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Learning Philosophy & AI Engagement Stance
              </span>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
                &ldquo;{portfolio.learningPhilosophy}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Structured Sections */}
        {portfolio.sections.map((section) => (
          <div key={section.sectionType} className="space-y-6">
            <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="text-xs text-zinc-500">{section.subtitle}</p>
              )}
            </div>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h3>
                    {portfolio.settings.showAiDisclosures && getAIBadge(item.aiAssistanceLevel)}
                  </div>

                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {item.description}
                  </p>

                  {item.dimensions && item.dimensions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.dimensions.map((dim) => (
                        <span
                          key={dim}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {dim}
                        </span>
                      ))}
                    </div>
                  )}

                  {portfolio.settings.showAiDisclosures && item.aiAssistanceDisclosure && (
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        AI Assistance Disclosure:
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {item.aiAssistanceDisclosure}
                      </p>
                    </div>
                  )}

                  {portfolio.settings.showReflections && item.userReflection && (
                    <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-[11px] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                        Learner&apos;s Reflection:
                      </span>
                      <p className="text-indigo-950 dark:text-indigo-200 italic leading-relaxed">
                        &ldquo;{item.userReflection}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
