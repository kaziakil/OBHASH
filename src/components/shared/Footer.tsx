import React from "react";
import { APP_METADATA } from "@/config/constants";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 py-8 text-sm text-zinc-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {APP_METADATA.name}
          </span>{" "}
          — {APP_METADATA.tagline}
        </div>
        <div className="flex items-center gap-6 text-xs">
          <span>Team: {APP_METADATA.team}</span>
          <span>•</span>
          <span>{APP_METADATA.phase}</span>
          <span>•</span>
          <span>v{APP_METADATA.version}</span>
        </div>
      </div>
    </footer>
  );
}
