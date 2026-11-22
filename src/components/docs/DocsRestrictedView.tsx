"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { DocsAccessConfig } from "@/types/docs";

interface DocsRestrictedViewProps {
  config: DocsAccessConfig;
  reason?: "disabled_by_admin" | "before_window" | "after_window" | "invalid_config" | "authorized";
  onAuthorizeAdmin: (passcode: string) => void;
  onInstantBypass: () => void;
}

export function DocsRestrictedView({
  config,
  reason = "before_window",
  onAuthorizeAdmin,
  onInstantBypass,
}: DocsRestrictedViewProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter an administrative passcode.");
      return;
    }
    if (passcode.trim() === config.adminBypassPasscode) {
      setError(null);
      onAuthorizeAdmin(passcode.trim());
    } else {
      setError("Incorrect passcode. Try 'obhash-admin-2026' or use Instant Judge Access.");
    }
  };

  const startDateFormatted = new Date(config.scheduleStart).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const endDateFormatted = new Date(config.scheduleEnd).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white dark:bg-[#161421] rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 p-8 sm:p-12 shadow-2xl shadow-indigo-500/10 text-center space-y-8">
        {/* Status Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#5B3BFF]/10 text-[#5B3BFF] flex items-center justify-center mx-auto text-2xl shadow-sm border border-[#5B3BFF]/20">
          🔒
        </div>

        {/* Headline & Explanation */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            {reason === "disabled_by_admin"
              ? "Access Manually Restricted"
              : reason === "after_window"
              ? "Evaluation Window Concluded"
              : "Scheduled Judging Window"}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17151F] dark:text-white tracking-tight">
            Documentation & Pitch Deck Restricted
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
            {reason === "disabled_by_admin"
              ? "The system administrator has temporarily restricted public access to this documentation module."
              : "To maintain synchronous evaluation integrity during the competition, the OBHASH live technical whitepaper and pitch deck are scheduled for a designated judging window."}
          </p>
        </div>

        {/* Scheduled Window Details Card */}
        {config.isScheduled && (
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-left space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Official Evaluation Window
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 font-medium">
                <span>Start Window:</span>
                <span className="font-mono text-[#5B3BFF]">{startDateFormatted}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 font-medium">
                <span>End Window:</span>
                <span className="font-mono text-[#5B3BFF]">{endDateFormatted}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-500">
              During this active window, the module opens automatically to the public without authentication.
            </div>
          </div>
        )}

        {/* Reviewer / Admin Actions */}
        <div className="space-y-3 pt-2">
          {/* Instant Judge Demo Bypass Button */}
          <button
            type="button"
            onClick={onInstantBypass}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#5B3BFF] hover:bg-[#4829E6] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#5B3BFF]/25 transition-all cursor-pointer"
          >
            <span>Instant Judge / Reviewer Access Demo</span>
            <span>→</span>
          </button>

          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium underline"
            >
              {showAdminLogin ? "Hide Admin Login" : "Admin Passcode Unlock"}
            </button>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link href="/" className="text-zinc-500 hover:text-[#5B3BFF] font-medium">
              Return Home
            </Link>
          </div>
        </div>

        {/* Admin Passcode Drawer */}
        {showAdminLogin && (
          <form
            onSubmit={handleAdminSubmit}
            className="p-5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left space-y-3 animate-in fade-in duration-150"
          >
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
              Enter Administrative Passcode
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(null);
                }}
                placeholder="Passcode (Default: obhash-admin-2026)"
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B3BFF]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#17151F] text-white dark:bg-white dark:text-[#17151F] text-xs font-semibold hover:bg-[#5B3BFF] dark:hover:bg-[#5B3BFF] dark:hover:text-white transition-colors"
              >
                Unlock
              </button>
            </div>
            {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
            <p className="text-[10px] text-zinc-400">
              Preset demo passcode: <code className="font-mono text-zinc-600 dark:text-zinc-300">obhash-admin-2026</code>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
