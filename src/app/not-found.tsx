import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <span className="text-5xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
            404
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Resource Not Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            The requested page or route could not be found within the OBHASH platform.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
