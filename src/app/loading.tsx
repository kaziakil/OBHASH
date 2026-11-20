import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading OBHASH...</span>
      </div>
    </div>
  );
}
