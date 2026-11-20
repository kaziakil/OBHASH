import React from "react";
import Link from "next/link";

export function CognitiveContrast() {
  const contrastPoints = [
    {
      dimension: "Primary User Role",
      passive: "Passive recipient who prompts for answers and copies outputs.",
      active: "Active thinker who grapples with ambiguity and defends their reasoning.",
    },
    {
      dimension: "AI Function",
      passive: "Answering engine that replaces human cognitive effort.",
      active: "Socratic sparring partner that asks questions and tests assumptions.",
    },
    {
      dimension: "Cognitive Outcome",
      passive: "Gradual cognitive atrophy and vulnerability to plausible falsehoods.",
      active: "Strengthened neural pathways, mental models, and intellectual autonomy.",
    },
    {
      dimension: "Work Verification",
      passive: "Unverified deliverables with zero insight into whether the user understands.",
      active: "Transparent, Level A verified artifacts with auditable AI assistance disclosures.",
    },
  ];

  return (
    <section id="philosophy" className="py-24 bg-white dark:bg-[#111019] border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            The Cognitive Challenge
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#17151F] dark:text-zinc-50 leading-[1.15]">
            The Risk of Cognitive Outsourcing
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            As artificial intelligence becomes faster at generating plausible answers, the temptation to outsource human judgment grows stronger. When people rely on AI to think for them, their own intellectual faculties risk atrophy.
          </p>
        </div>

        {/* The Two Paradigms: High-Contrast Visual Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card A: The Trap of Passive AI Dependence */}
          <div className="rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/10 p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-rose-600 dark:text-rose-400 font-mono">
                  The Conventional Paradigm
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold">
                  Cognitive Atrophy
                </span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Passive AI Dependence
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Using AI as an answer-dispenser that bypasses the productive discomfort of problem-solving.
              </p>

              {/* Trajectory Flow */}
              <div className="space-y-3 pt-3">
                <div className="flex items-start gap-3 text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Prompt for Solutions:</strong> Skipping the essential phase of problem framing and conceptual struggle.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Uncritical Adoption:</strong> Accepting synthesized outputs without evaluating empirical validity or bias.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Learned Helplessness:</strong> Inability to reason or write without continuous machine prompting.</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 font-medium italic">
              &ldquo;When a tool does the thinking for you, you do not become more powerful—you become subordinate to the tool.&rdquo;
            </div>
          </div>

          {/* Card B: The OBHASH Paradigm */}
          <div className="rounded-2xl border-2 border-[#5B3BFF]/40 dark:border-[#5B3BFF]/50 bg-white dark:bg-[#161421] p-8 space-y-6 flex flex-col justify-between shadow-xl shadow-[#5B3BFF]/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-[#5B3BFF] dark:text-indigo-400 font-mono">
                  The OBHASH Paradigm
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#5B3BFF]/10 text-[#5B3BFF] font-semibold border border-[#5B3BFF]/20">
                  Human-Centered Intelligence
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#17151F] dark:text-white">
                Active Capability Cultivation
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Using AI as a rigorous Socratic sparring partner that challenges your mind to formulate sharper questions and reach deeper conclusions.
              </p>

              {/* Trajectory Flow */}
              <div className="space-y-3 pt-3">
                <div className="flex items-start gap-3 text-xs text-zinc-800 dark:text-zinc-200">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Guided Discovery:</strong> The AI refuses to answer directly, nudging your investigation through progressive hints.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-zinc-800 dark:text-zinc-200">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Independent Synthesis:</strong> You formulate the deliverables, structure the arguments, and test the hypotheses.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-zinc-800 dark:text-zinc-200">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Verifiable Autonomy:</strong> An auditable Growth Portfolio proves your genuine human capability without AI dependence.</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#5B3BFF]/5 dark:bg-[#5B3BFF]/15 border border-[#5B3BFF]/30 text-xs text-zinc-900 dark:text-zinc-100 font-medium">
              <span className="font-bold text-[#5B3BFF] block mb-0.5">The OBHASH Principle:</span>
              AI should act as a gym for the mind—strengthening your cognitive muscle, never lifting the weights for you.
            </div>
          </div>
        </div>

        {/* Comparison Points Table / Cards */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 p-6 sm:p-8 space-y-6">
          <h4 className="font-bold text-center text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Dimensional Comparison
          </h4>
          <div className="space-y-4">
            {contrastPoints.map((pt, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3.5 rounded-xl bg-white dark:bg-[#17151F] border border-zinc-200/60 dark:border-zinc-800 text-xs"
              >
                <div className="md:col-span-1 font-bold text-zinc-900 dark:text-zinc-100 flex items-center">
                  {pt.dimension}
                </div>
                <div className="md:col-span-2 text-rose-600 dark:text-rose-400 flex items-start gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold shrink-0 px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60">Passive</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{pt.passive}</span>
                </div>
                <div className="md:col-span-2 text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold shrink-0 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">OBHASH</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">{pt.active}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B3BFF] hover:underline"
            >
              Take the baseline capability diagnostic to assess your cognitive autonomy →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
