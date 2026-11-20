import React from "react";
import Link from "next/link";
import { APP_METADATA } from "@/config/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold tracking-wider text-base">
            O
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {APP_METADATA.name}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 -mt-1 font-medium">
              {APP_METADATA.tagline}
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Health API
          </a>
          <a
            href="/api/ai/test"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            AI Status API
          </a>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Phase 1
          </span>
        </nav>
      </div>
    </header>
  );
}
