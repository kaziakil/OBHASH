"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PITCH_DECK_SLIDES, TEAM_MEMBERS } from "@/lib/docs/content";

interface PitchDeckViewProps {
  searchQuery: string;
}

export function PitchDeckView({ searchQuery }: PitchDeckViewProps) {
  const [selectedSlideId, setSelectedSlideId] = useState<string>("problem");

  const filteredSlides = PITCH_DECK_SLIDES.filter((slide) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      slide.title.toLowerCase().includes(q) ||
      slide.tagline.toLowerCase().includes(q) ||
      slide.content.lead.toLowerCase().includes(q) ||
      slide.content.points.some(
        (p) => p.headline.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    );
  });

  const activeSlide =
    filteredSlides.find((s) => s.id === selectedSlideId) || filteredSlides[0] || PITCH_DECK_SLIDES[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Top Slide Quick Index Navigator */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-x-auto print:hidden">
        <div className="flex items-center gap-1.5 min-w-max">
          {PITCH_DECK_SLIDES.map((slide) => {
            const isSelected = activeSlide.id === slide.id;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setSelectedSlideId(slide.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#5B3BFF] text-white shadow-sm shadow-[#5B3BFF]/20"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">{String(slide.order).padStart(2, "0")}</span>
                <span>{slide.title.split(":")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Active Presentation Card */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-8 sm:p-12 shadow-xl shadow-zinc-500/5 space-y-8 relative overflow-hidden">
        {/* Subtle Brand Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5B3BFF] via-indigo-500 to-purple-600" />

        {/* Slide Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#5B3BFF]/10 text-[#5B3BFF] border border-[#5B3BFF]/20">
                SLIDE {String(activeSlide.order).padStart(2, "0")} / 12
              </span>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {activeSlide.category}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151F] dark:text-white tracking-tight">
              {activeSlide.title}
            </h2>
          </div>

          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-xs sm:text-right">
            {activeSlide.tagline}
          </p>
        </div>

        {/* Slide Lead Paragraph */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <p className="text-base sm:text-lg font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {activeSlide.content.lead}
          </p>
        </div>

        {/* Slide Key Value Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeSlide.content.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#111019] space-y-3 flex flex-col justify-between shadow-xs hover:border-[#5B3BFF]/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#5B3BFF]">
                    POINT 0{idx + 1}
                  </span>
                  {pt.metric && (
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {pt.metric}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-base text-[#17151F] dark:text-white">
                  {pt.headline}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {pt.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Callout Banner */}
        {activeSlide.content.callout && (
          <div className="p-4 rounded-xl bg-[#5B3BFF]/5 dark:bg-[#5B3BFF]/10 border border-[#5B3BFF]/20 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-semibold italic flex items-center gap-3">
            <span className="text-lg">💡</span>
            <span>{activeSlide.content.callout}</span>
          </div>
        )}

        {/* Next / Previous Slide Controls */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 print:hidden">
          <button
            type="button"
            disabled={activeSlide.order === 1}
            onClick={() => {
              const prev = PITCH_DECK_SLIDES.find((s) => s.order === activeSlide.order - 1);
              if (prev) setSelectedSlideId(prev.id);
            }}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none font-semibold"
          >
            ← Previous Slide
          </button>
          <span className="font-mono text-[11px]">
            Slide {activeSlide.order} of {PITCH_DECK_SLIDES.length}
          </span>
          <button
            type="button"
            disabled={activeSlide.order === PITCH_DECK_SLIDES.length}
            onClick={() => {
              const next = PITCH_DECK_SLIDES.find((s) => s.order === activeSlide.order + 1);
              if (next) setSelectedSlideId(next.id);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#17151F] dark:bg-white text-white dark:text-[#17151F] hover:bg-[#5B3BFF] dark:hover:bg-[#5B3BFF] dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none font-semibold transition-colors"
          >
            Next Slide →
          </button>
        </div>
      </div>

      {/* MANDATORY TEAM SECTION: TEAM PASTFORWARD */}
      <section id="team" className="space-y-8 pt-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5B3BFF]/10 text-[#5B3BFF] border border-[#5B3BFF]/20">
            Mandatory Enhancement
          </div>
          <h3 className="text-3xl font-extrabold text-[#17151F] dark:text-white tracking-tight">
            Team PastForward — Founders & Core Contributors
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            A multidisciplinary engineering and cognitive science team with complementary expertise across AI systems architecture, pedagogical rubrics, and accessible user experience.
          </p>
        </div>

        {/* Uniform Grid Layout for Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="space-y-4">
                {/* Auto-Resized Uniform Aspect-Square Image Frame */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
                    Team PastForward
                  </div>
                </div>

                {/* Member Identity Details */}
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[#17151F] dark:text-white group-hover:text-[#5B3BFF] transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#5B3BFF] dark:text-indigo-400">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {member.email}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>

                {/* Key Contributions List */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Core Contributions:
                  </span>
                  <ul className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                    {member.contributions.slice(0, 2).map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#5B3BFF] font-bold">›</span>
                        <span className="line-clamp-2">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Button */}
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                <a
                  href={`mailto:${member.email}`}
                  className="w-full text-center py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-[#5B3BFF] hover:text-white dark:hover:bg-[#5B3BFF] text-zinc-800 dark:text-zinc-200 transition-colors block"
                >
                  Contact {member.name.split(" ")[0]} ✉
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All 12 Slides Sequential Print / Reading Layout */}
      <section className="space-y-8 pt-8">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-extrabold text-xl text-[#17151F] dark:text-white">
            Full YC Pitch Deck Slide Catalog
          </h3>
          <span className="text-xs text-zinc-400">
            {filteredSlides.length} Slides Listed
          </span>
        </div>

        <div className="space-y-6">
          {filteredSlides.map((slide) => (
            <div
              key={slide.id}
              className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#161421] space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#5B3BFF]">
                    Slide {String(slide.order).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <h4 className="font-bold text-base text-[#17151F] dark:text-white">
                    {slide.title}
                  </h4>
                </div>
                <span className="text-xs text-zinc-400 italic">
                  {slide.tagline}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {slide.content.lead}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {slide.content.points.map((pt, i) => (
                  <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-1">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{pt.headline}</span>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{pt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
