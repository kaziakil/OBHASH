import React from "react";
import Link from "next/link";
import { APP_METADATA } from "@/config/constants";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12 text-sm text-zinc-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-zinc-900 dark:text-zinc-100">
                {APP_METADATA.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                Phase 2
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              AI should help people become more capable, not more dependent. A human-centered platform for personal capability development.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-medium">
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 text-[10px]">
                Platform
              </span>
              <ul className="space-y-1.5">
                <li><Link href="/#philosophy" className="hover:text-zinc-900 dark:hover:text-zinc-100">Philosophy</Link></li>
                <li><Link href="/#approach" className="hover:text-zinc-900 dark:hover:text-zinc-100">Approach</Link></li>
                <li><Link href="/#capabilities" className="hover:text-zinc-900 dark:hover:text-zinc-100">Capabilities</Link></li>
                <li><Link href="/#journey" className="hover:text-zinc-900 dark:hover:text-zinc-100">7-Stage Journey</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 text-[10px]">
                Access
              </span>
              <ul className="space-y-1.5">
                <li><Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-zinc-900 dark:hover:text-zinc-100">Create Account</Link></li>
                <li><Link href="/api/health" className="hover:text-zinc-900 dark:hover:text-zinc-100">System Health</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 text-[10px]">
                Target Focus
              </span>
              <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
                <li>Ages 18–30</li>
                <li>Critical Thinking</li>
                <li>Creative Problem-Solving</li>
                <li>Curiosity Cultivation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 OBHASH. Team PastForward. Human-Centered Intelligence.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Privacy & Terms provided in documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
