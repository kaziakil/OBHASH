"use client";

import React, { useState } from "react";
import type { DocsAccessConfig } from "@/types/docs";

interface AdminControlPanelProps {
  config: DocsAccessConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdateConfig: (updates: Partial<DocsAccessConfig>) => void;
  onResetToDefault: () => void;
}

export function AdminControlPanel({
  config,
  isOpen,
  onClose,
  onUpdateConfig,
  onResetToDefault,
}: AdminControlPanelProps) {
  const [isEnabled, setIsEnabled] = useState(config.isEnabled);
  const [isScheduled, setIsScheduled] = useState(config.isScheduled);
  const [scheduleStart, setScheduleStart] = useState(config.scheduleStart.slice(0, 16));
  const [scheduleEnd, setScheduleEnd] = useState(config.scheduleEnd.slice(0, 16));
  const [banner, setBanner] = useState(config.announcementBanner || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      isEnabled,
      isScheduled,
      scheduleStart: new Date(scheduleStart).toISOString(),
      scheduleEnd: new Date(scheduleEnd).toISOString(),
      announcementBanner: banner,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleInstantPublish = () => {
    setIsEnabled(true);
    setIsScheduled(false);
    onUpdateConfig({
      isEnabled: true,
      isScheduled: false,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleInstantDisable = () => {
    setIsEnabled(false);
    onUpdateConfig({
      isEnabled: false,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetToJuneWindow = () => {
    onResetToDefault();
    setIsEnabled(true);
    setIsScheduled(true);
    setScheduleStart("2026-06-10T00:00");
    setScheduleEnd("2026-06-14T23:59");
    setBanner("International Competition Evaluation Window: June 10 (00:00) – June 14 (23:59), 2026");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#161421] rounded-3xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#5B3BFF] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ⚙
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-[#17151F] dark:text-white">
                Documentation Access & Publishing Control
              </h3>
              <p className="text-xs text-zinc-500">
                Administrative overrides for /docs judging windows and investor reviews
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Quick Action Presets */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
            Instant Override Controls
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleInstantPublish}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              ✓ Live Override (All Open)
            </button>
            <button
              type="button"
              onClick={handleInstantDisable}
              className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              ✕ Restrict Access Now
            </button>
            <button
              type="button"
              onClick={handleResetToJuneWindow}
              className="py-2.5 px-3 rounded-xl bg-[#17151F] dark:bg-zinc-800 hover:bg-[#5B3BFF] text-white font-semibold text-xs shadow-sm transition-all"
            >
              ↺ Reset June 10–14 Window
            </button>
          </div>
        </div>

        {/* Detailed Form Settings */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* 1. Master Enable Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div>
              <span className="font-bold text-sm text-[#17151F] dark:text-white block">
                Master Visibility
              </span>
              <span className="text-xs text-zinc-500">
                When disabled, non-admins receive the restricted page regardless of dates.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? "bg-[#5B3BFF]" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 2. Schedule Window Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div>
              <span className="font-bold text-sm text-[#17151F] dark:text-white block">
                Time-Gated Schedule Availability
              </span>
              <span className="text-xs text-zinc-500">
                Restricts public access outside of specified start and end date/time.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsScheduled(!isScheduled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isScheduled ? "bg-[#5B3BFF]" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isScheduled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 3. Date Time Inputs */}
          {isScheduled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                  Schedule Start (UTC/Local)
                </label>
                <input
                  type="datetime-local"
                  value={scheduleStart}
                  onChange={(e) => setScheduleStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#111019] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B3BFF]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                  Schedule End (UTC/Local)
                </label>
                <input
                  type="datetime-local"
                  value={scheduleEnd}
                  onChange={(e) => setScheduleEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#111019] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B3BFF]"
                />
              </div>
            </div>
          )}

          {/* 4. Announcement Banner */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300 block">
              Announcement Banner Text
            </label>
            <input
              type="text"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="e.g. International Competition Judging Window"
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5B3BFF]"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold animate-pulse">
                ✓ Configuration updated and live!
              </span>
            ) : (
              <span className="text-xs text-zinc-400">
                Changes apply instantly across sessions.
              </span>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#5B3BFF] hover:bg-[#4829E6] text-white text-xs font-semibold shadow-md shadow-[#5B3BFF]/20"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
