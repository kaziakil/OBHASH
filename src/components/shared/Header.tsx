import React from "react";
import Link from "next/link";
import { APP_METADATA } from "@/config/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-black tracking-widest text-sm shadow-sm">
            O
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
              {APP_METADATA.name}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-tight -mt-0.5">
              {APP_METADATA.tagline}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <Link href="/#philosophy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Philosophy
          </Link>
          <Link href="/challenges" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Challenges
          </Link>
          <Link href="/coach" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Growth Coach
          </Link>
          <Link href="/journey" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Journey
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
