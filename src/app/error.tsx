"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { logger } from "@/lib/utils/logger";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Application error caught by root error boundary", error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            System Error Encountered
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            An unexpected error occurred during rendering. Details have been logged to the server.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-zinc-400">Digest: {error.digest}</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
