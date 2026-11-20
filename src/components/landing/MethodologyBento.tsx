import React from "react";
import Link from "next/link";

export function MethodologyBento() {
  return (
    <section id="approach" className="py-24 bg-zinc-50/70 dark:bg-[#0E0D14] border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5B3BFF]/10 text-[#5B3BFF] dark:text-indigo-300 border border-[#5B3BFF]/20">
            Our Pedagogical Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#17151F] dark:text-zinc-50 leading-[1.15]">
            Human-Centered Intelligence in Practice
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Five core pedagogical principles engineered to foster authentic human capability development rather than automated dependence.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Bento Item 1: Anchor Featured Card (Spans 2 columns on desktop) */}
          <div className="md:col-span-2 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="space-y-4 z-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#5B3BFF]/10 text-[#5B3BFF] border border-[#5B3BFF]/20">
                  Principle 01 · The Sparring Partner
                </span>
                <span className="text-xs font-semibold text-zinc-400">
                  Refuses Direct Answers
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17151F] dark:text-white">
                Guided Socratic Development
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                When you encounter a difficult question, conventional AI outputs a solution and closes the loop of discovery. OBHASH deliberately pauses that cycle—meeting you with targeted inquiries that prompt your own deductive faculties.
              </p>

              {/* In-Card Dialogue Evidence */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-2 mt-4">
                <div className="flex items-center gap-2 text-zinc-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#5B3BFF]" />
                  <span>Socratic Rule in Action:</span>
                </div>
                <p className="text-zinc-800 dark:text-zinc-200 italic">
                  &ldquo;Instead of telling you what policy is optimal, consider: If you subsidize autonomous transit overnight, who bears the unmeasured negative externalities in urban freight congestion?&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">Progressive hint tiers: Level 1 (nudge) &rarr; Level 2 (structure) &rarr; Level 3 (strategy)</span>
              <Link href="/coach" className="font-bold text-[#5B3BFF] hover:underline">
                Explore Coach →
              </Link>
            </div>
          </div>

          {/* Bento Item 2: Independent Thinking */}
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                Principle 02
              </span>
              <h3 className="text-xl font-bold text-[#17151F] dark:text-white">
                Independent Thinking
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Safe, unassisted spaces to grapple with ambiguity, question unexamined premises, and articulate authentic, personal viewpoints.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>✓</span> Unassisted scratchpads & drafting
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <span className="text-zinc-400">Measured: Autonomous Problem Formulation</span>
            </div>
          </div>

          {/* Bento Item 3: Practical Challenges */}
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                Principle 03
              </span>
              <h3 className="text-xl font-bold text-[#17151F] dark:text-white">
                Practical Challenges
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Realistic, messy micro-challenges across marketing, urban design, ethics, and science that require genuine cognitive agility and mental models.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span>⚡</span> 12+ real-world simulation scenarios
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <Link href="/challenges" className="font-semibold text-[#5B3BFF] hover:underline">
                View Challenge Catalog →
              </Link>
            </div>
          </div>

          {/* Bento Item 4: Active Metacognitive Reflection */}
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                Principle 04
              </span>
              <h3 className="text-xl font-bold text-[#17151F] dark:text-white">
                Active Reflection
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Disciplined post-submission introspection that transforms isolated experiences into durable, lasting intellectual habits and self-awareness.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <span>🪞</span> Metacognitive assumption auditing
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <span className="text-zinc-400">Evaluates: Shift in initial mental priors</span>
            </div>
          </div>

          {/* Bento Item 5: Demonstrated Growth */}
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#5B3BFF]/10 text-[#5B3BFF] border border-[#5B3BFF]/20">
                Principle 05
              </span>
              <h3 className="text-xl font-bold text-[#17151F] dark:text-white">
                Demonstrated Growth
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Verifiable capability evidence measured through independent performance and transparent AI disclosures in your shareable portfolio.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>📈</span> Level A/B authenticated evidence
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <Link href="/p/alex-chen" className="font-semibold text-[#5B3BFF] hover:underline">
                View Public Alex Chen Portfolio →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
