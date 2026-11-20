import React from "react";
import Link from "next/link";
import { CORE_CAPABILITIES } from "@/config/constants";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle, CardDescription } from "@/components/shared/Card";

const PILLARS = [
  {
    step: "01",
    title: "Guided Development",
    desc: "Structured frameworks that prompt your own reasoning rather than handing you quick answers.",
    icon: "🧭",
  },
  {
    step: "02",
    title: "Independent Thinking",
    desc: "Safe spaces to grapple with ambiguity, question premises, and articulate distinct perspectives.",
    icon: "💡",
  },
  {
    step: "03",
    title: "Practical Challenges",
    desc: "Real-world micro-challenges that test and expand your cognitive agility and creative problem-solving.",
    icon: "⚡",
  },
  {
    step: "04",
    title: "Active Reflection",
    desc: "Disciplined self-examination that turns single experiences into permanent intellectual habits.",
    icon: "🪞",
  },
  {
    step: "05",
    title: "Demonstrated Growth",
    desc: "Verifiable progress measured through independent performance without AI assistance.",
    icon: "📈",
  },
];

const JOURNEY_STAGES = [
  { stage: "01", name: "Assess", desc: "Discover your baseline strengths and growth frontiers." },
  { stage: "02", name: "Explore", desc: "Engage with core concepts across multi-disciplinary contexts." },
  { stage: "03", name: "Guide", desc: "Collaborate with an AI coach focused on inquiry over answers." },
  { stage: "04", name: "Create", desc: "Tackle open-ended challenges requiring original thought." },
  { stage: "05", name: "Reflect", desc: "Articulate your process, decisions, and lessons learned." },
  { stage: "06", name: "Demonstrate", desc: "Apply capabilities independently without AI scaffolding." },
  { stage: "07", name: "Track", desc: "Monitor genuine human growth in your personal portfolio." },
];

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Human-Centered Intelligence
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
              Become more capable. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Not more dependent.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              An AI-powered personal growth platform that helps you strengthen your thinking, creativity, curiosity, and independence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Get Started →
                </Button>
              </Link>
              <Link href="#approach">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore OBHASH
                </Button>
              </Link>
            </div>

            <div className="pt-6 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-4">
              <span>Audience: Ages 18–30</span>
              <span>•</span>
              <span>No Automated Task-Outsourcing</span>
              <span>•</span>
              <span>Authentic Human Agency</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problem Section */}
      <section id="philosophy" className="py-20 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              The Cognitive Challenge
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              The Risk of Cognitive Outsourcing
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              As artificial intelligence systems become increasingly capable, the temptation to outsource judgment, creative problem-solving, and decision-making grows stronger. When people rely on AI to think for them, their own intellectual faculties risk atrophy.
            </p>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-950 dark:text-zinc-50 block mb-1 text-base">
                OBHASH is built to reverse this trend.
              </strong>
              We treat AI not as a surrogate brain that answers for you, but as a cognitive sparring partner that trains your mind to formulate better questions, evaluate evidence, and invent novel solutions.
            </div>
          </div>
        </div>
      </section>

      {/* 3. The OBHASH Approach Section */}
      <section id="approach" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Our Methodology
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Human-Centered Intelligence in Practice
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              How OBHASH facilitates human capability cultivation through structured scaffolding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {PILLARS.map((p) => (
              <Card key={p.step} className="flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-xs font-mono font-bold text-zinc-400">{p.step}</span>
                  </div>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <CardDescription className="text-xs">{p.desc}</CardDescription>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Initial Capabilities Section */}
      <section id="capabilities" className="py-20 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Focus Domains
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Three Foundational Human Capabilities
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Prioritized cognitive dimensions designed to build intellectual independence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_CAPABILITIES.map((cap, idx) => (
              <Card key={cap.id} className="relative overflow-hidden p-8 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    Capability 0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Core Focus
                  </span>
                </div>
                <CardTitle className="text-xl">{cap.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {cap.description}
                </CardDescription>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                  <span>Targeted Micro-Challenges</span>
                  <span>Active Reflection</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How OBHASH Works (7-Stage Journey Overview) */}
      <section id="journey" className="py-20 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The Framework
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              How OBHASH Works
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              A progressive seven-stage personal development journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {JOURNEY_STAGES.map((item) => (
              <div
                key={item.stage}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
              >
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                  {item.stage}
                </span>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {item.name}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-zinc-400 max-w-xl mx-auto">
            Note: This journey is introduced progressively as users complete baseline assessments and practical challenges.
          </div>
        </div>
      </section>

      {/* 6. Closing CTA Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-white to-indigo-50/30 dark:from-zinc-950 dark:to-indigo-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Your growth should be your own.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Discover what you are capable of becoming when AI is used to challenge and elevate your mind, not replace it.
          </p>
          <div className="pt-2">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Start Your Journey →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
