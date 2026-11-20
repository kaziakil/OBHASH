import React from "react";
import Link from "next/link";
import { APP_METADATA } from "@/config/constants";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111019] py-14 text-sm text-zinc-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-zinc-100 dark:border-zinc-800/80">
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-2 space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#17151F] text-white flex items-center justify-center font-black text-xs">
                <span className="text-[#5B3BFF]">O</span>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#17151F] dark:text-zinc-100">
                {APP_METADATA.name}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5B3BFF]/10 text-[#5B3BFF] border border-[#5B3BFF]/20">
                Phase 8 · Launch Ready
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              AI should help people become more capable, not more dependent. A human-centered platform designed to cultivate Critical Thinking, Creative Problem-Solving, and Curiosity through guided inquiry and authentic performance.
            </p>
            <div className="pt-2 text-[11px] font-medium text-zinc-400 flex items-center gap-2">
              <span>Target Audience: Ages 18–30</span>
              <span>•</span>
              <span>Team PastForward</span>
            </div>
          </div>

          {/* Platform Exploration */}
          <div className="space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-[#17151F] dark:text-zinc-100 text-[10px]">
              Platform Journey
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/assessment" className="hover:text-[#5B3BFF] transition-colors">
                  1. Capability Assessment
                </Link>
              </li>
              <li>
                <Link href="/journey" className="hover:text-[#5B3BFF] transition-colors">
                  2. Personalized Journey
                </Link>
              </li>
              <li>
                <Link href="/coach" className="hover:text-[#5B3BFF] transition-colors">
                  3. Socratic AI Coach
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-[#5B3BFF] transition-colors">
                  4. Practical Challenges
                </Link>
              </li>
              <li>
                <Link href="/growth/independence" className="hover:text-[#5B3BFF] transition-colors font-medium text-zinc-700 dark:text-zinc-300">
                  5. Independence Engine
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-[#5B3BFF] transition-colors">
                  6. Growth Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Capabilities & Evidence */}
          <div className="space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-[#17151F] dark:text-zinc-100 text-[10px]">
              Core Capabilities
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/assessment/critical-thinking" className="hover:text-[#5B3BFF] transition-colors">
                  Critical Thinking
                </Link>
              </li>
              <li>
                <Link href="/assessment/creative-problem-solving" className="hover:text-[#5B3BFF] transition-colors">
                  Creative Problem-Solving
                </Link>
              </li>
              <li>
                <Link href="/assessment/curiosity" className="hover:text-[#5B3BFF] transition-colors">
                  Curiosity Cultivation
                </Link>
              </li>
              <li>
                <Link href="/p/alex-chen" className="hover:text-[#5B3BFF] text-[#5B3BFF] font-semibold transition-colors">
                  Live Portfolio Showcase ↗
                </Link>
              </li>
            </ul>
          </div>

          {/* Access & Verification */}
          <div className="space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-[#17151F] dark:text-zinc-100 text-[10px]">
              Access & Integrity
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-[#5B3BFF] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#5B3BFF] transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#5B3BFF] transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/api/health" className="hover:text-[#5B3BFF] transition-colors">
                  System Health & Uptime
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 OBHASH · Team PastForward · Built for International Competition Evaluation
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Human-Centered Intelligence</span>
            <span>•</span>
            <span>Zero Unassisted Outsourcing</span>
            <span>•</span>
            <span>Verifiable Capability Growth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
