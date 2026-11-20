import React from "react";
import Link from "next/link";
import { HeroPreview } from "@/components/landing/HeroPreview";
import { CognitiveContrast } from "@/components/landing/CognitiveContrast";
import { CapabilityExplorer } from "@/components/landing/CapabilityExplorer";
import { JourneyPipeline } from "@/components/landing/JourneyPipeline";
import { MethodologyBento } from "@/components/landing/MethodologyBento";
import { ProductShowcase } from "@/components/landing/ProductShowcase";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#F7F7FA] dark:bg-[#0E0D14] transition-colors">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 lg:pt-28 pb-20 border-b border-zinc-200/80 dark:border-zinc-800/80">
        {/* Subtle Background Glow (Restrained) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#5B3BFF]/5 dark:bg-[#5B3BFF]/10 blur-[120px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Philosophy Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#161421] text-[#5B3BFF] dark:text-indigo-300 border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#5B3BFF] animate-pulse" />
              <span>Human-Centered Intelligence</span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-zinc-500 font-normal">Phase 8 Launch Ready</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#17151F] dark:text-zinc-50 leading-[1.08]">
              Become more capable. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B3BFF] via-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Not more dependent.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto font-normal">
              An AI-powered personal growth platform that helps you strengthen your thinking, creativity, curiosity, and independence.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
              <Link href="/signup" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-xl bg-[#5B3BFF] hover:bg-[#4829E6] text-white shadow-md shadow-[#5B3BFF]/25 hover:shadow-lg hover:shadow-[#5B3BFF]/30 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Start Capability Assessment</span>
                  <span>→</span>
                </button>
              </Link>
              <Link href="#showcase" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-xl bg-white dark:bg-[#161421] text-[#17151F] dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 shadow-xs transition-all cursor-pointer"
                >
                  <span>Explore Live Prototype</span>
                  <span className="text-zinc-400">↓</span>
                </button>
              </Link>
            </div>

            {/* Trust & Demographic Cues */}
            <div className="pt-4 text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span>Audience: Ages 18–30</span>
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
              <span>No Automated Task-Outsourcing</span>
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
              <span>Authentic Human Agency</span>
            </div>
          </div>

          {/* Real Interactive Studio Interface Preview */}
          <HeroPreview />
        </div>
      </section>

      {/* 2. The Cognitive Challenge (Paradigm Contrast) */}
      <CognitiveContrast />

      {/* 3. Three Foundational Capabilities */}
      <CapabilityExplorer />

      {/* 4. Seven-Stage Journey Pipeline */}
      <JourneyPipeline />

      {/* 5. Our Methodology Bento Grid */}
      <MethodologyBento />

      {/* 6. Product Experience Showcase */}
      <ProductShowcase />

      {/* 7. Closing CTA Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-white to-[#F0EDFF]/60 dark:from-[#0E0D14] dark:to-[#17151F] border-t border-zinc-200/80 dark:border-zinc-800/80 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#5B3BFF]/10 text-[#5B3BFF] dark:text-indigo-300 border border-[#5B3BFF]/20">
            Human-Centered Intelligence
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#17151F] dark:text-white leading-[1.12]">
            Your growth should be your own.
          </h2>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Discover what you are capable of becoming when AI is used to challenge and elevate your mind, not replace it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-8 py-4 rounded-xl bg-[#5B3BFF] hover:bg-[#4829E6] text-white shadow-lg shadow-[#5B3BFF]/25 hover:shadow-xl hover:shadow-[#5B3BFF]/35 active:scale-98 transition-all cursor-pointer"
              >
                <span>Start Your Journey</span>
                <span>→</span>
              </button>
            </Link>
            <Link href="/p/alex-chen" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-4 rounded-xl bg-white dark:bg-[#161421] text-[#17151F] dark:text-white border border-zinc-200/90 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-xs transition-all cursor-pointer"
              >
                <span>View Public Portfolio Showcase</span>
                <span>↗</span>
              </button>
            </Link>
          </div>

          <div className="pt-8 text-xs text-zinc-400 flex items-center justify-center gap-4">
            <span>Free Diagnostic Assessment</span>
            <span>•</span>
            <span>No Credit Card Required</span>
            <span>•</span>
            <span>Private by Default</span>
          </div>
        </div>
      </section>
    </div>
  );
}
