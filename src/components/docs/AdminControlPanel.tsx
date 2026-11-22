"use client";

import React, { useState, useMemo } from "react";
import type { DocsAccessConfig } from "@/types/docs";
import {
  rollbackToVersion,
  createNewVersionSnapshot,
} from "@/lib/docs/access-store";
import { validateDocumentationIntegrity } from "@/lib/docs/v2-content";

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
  const [publishState, setPublishState] = useState<"published" | "draft" | "archived">(
    config.publishState || "published"
  );
  const [isScheduled, setIsScheduled] = useState(config.isScheduled);
  const [scheduleStart, setScheduleStart] = useState(config.scheduleStart.slice(0, 16));
  const [scheduleEnd, setScheduleEnd] = useState(config.scheduleEnd.slice(0, 16));
  const [banner, setBanner] = useState(config.announcementBanner || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New version snapshot inputs
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionNotes, setNewVersionNotes] = useState("");
  const [showSnapshotForm, setShowSnapshotForm] = useState(false);

  // Live Documentation Integrity Report
  const integrityReport = useMemo(() => validateDocumentationIntegrity(), []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      isEnabled,
      publishState,
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
    setPublishState("published");
    setIsScheduled(false);
    onUpdateConfig({
      isEnabled: true,
      publishState: "published",
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

  const handleSetDraftMode = () => {
    setPublishState("draft");
    onUpdateConfig({
      publishState: "draft",
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRollback = (versionId: string) => {
    try {
      const updated = rollbackToVersion(versionId, "Admin");
      onUpdateConfig(updated);
      setPublishState(updated.publishState);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Rollback error:", err);
    }
  };

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;
    const updated = createNewVersionSnapshot(
      newVersionName.trim(),
      newVersionNotes.trim() || "Manual administrative snapshot",
      publishState,
      "Admin"
    );
    onUpdateConfig(updated);
    setNewVersionName("");
    setNewVersionNotes("");
    setShowSnapshotForm(false);
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
              <h3 className="font-extrabold text-lg text-[#17151F] dark:text-white flex items-center gap-2">
                Documentation Governance & Publishing Control
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5B3BFF]/10 text-[#5B3BFF] font-bold">
                  {config.publishedVersion}
                </span>
              </h3>
              <p className="text-xs text-zinc-500">
                Administrative lifecycle, draft/published states, version rollback, and audit trail
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

        {/* 1. DOCUMENTATION INTEGRITY STATUS SEAL */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🛡️</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Ecosystem Integrity & Consistency Audit
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {integrityReport.integrityScore}% VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            {integrityReport.checks.map((chk, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center gap-1.5"
              >
                <span className="text-emerald-500 font-bold">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300 truncate font-medium">
                  {chk.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. QUICK ACTION PRESETS */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
            Instant Lifecycle Overrides
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleInstantPublish}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              ✓ Live (Published)
            </button>
            <button
              type="button"
              onClick={handleSetDraftMode}
              className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              📝 Draft (Admins Only)
            </button>
            <button
              type="button"
              onClick={handleInstantDisable}
              className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              ✕ Restrict Access Now
            </button>
          </div>
        </div>

        {/* 3. VERSION HISTORY & ROLLBACK SECTION */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Version History & Rollback Stack
            </span>
            <button
              type="button"
              onClick={() => setShowSnapshotForm(!showSnapshotForm)}
              className="text-[11px] font-bold text-[#5B3BFF] hover:underline"
            >
              {showSnapshotForm ? "Cancel" : "+ Create Version Snapshot"}
            </button>
          </div>

          {/* New Snapshot Form */}
          {showSnapshotForm && (
            <form
              onSubmit={handleCreateSnapshot}
              className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-[#5B3BFF]/30 space-y-2 text-xs"
            >
              <div className="font-bold text-zinc-900 dark:text-white">
                Create New Version Snapshot
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Version name (e.g. v2.1.0)"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Snapshot release notes"
                  value={newVersionNotes}
                  onChange={(e) => setNewVersionNotes(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-xs"
                />
              </div>
              <button
                type="submit"
                className="py-1 px-3 rounded-lg bg-[#5B3BFF] text-white text-xs font-semibold"
              >
                Save Version Snapshot
              </button>
            </form>
          )}

          {/* Version Stack Table */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {config.versionHistory.map((ver) => (
              <div
                key={ver.versionId}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  ver.isCurrent
                    ? "bg-purple-50/60 dark:bg-purple-950/20 border-[#5B3BFF]/40 text-purple-950 dark:text-purple-100"
                    : "bg-white dark:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[11px]">{ver.versionName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        ver.publishState === "published"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      {ver.publishState}
                    </span>
                    {ver.isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#5B3BFF] text-white">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {ver.notes} • By {ver.author}
                  </div>
                </div>

                {!ver.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRollback(ver.versionId)}
                    className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 shrink-0"
                  >
                    ↺ Rollback
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. DETAILED FORM SETTINGS */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Publishing State Selector */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div>
              <span className="font-bold text-sm text-[#17151F] dark:text-white block">
                Publishing Lifecycle State
              </span>
              <span className="text-xs text-zinc-500">
                Draft mode hides content from public viewers while allowing administrative editing.
              </span>
            </div>
            <select
              value={publishState}
              onChange={(e) =>
                setPublishState(e.target.value as "published" | "draft" | "archived")
              }
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white"
            >
              <option value="published">Published (Public)</option>
              <option value="draft">Draft (Admin Only)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Master Enable Switch */}
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

          {/* Schedule Window Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div>
              <span className="font-bold text-sm text-[#17151F] dark:text-white block">
                Time-Gated Schedule Availability
              </span>
              <span className="text-xs text-zinc-500">
                Restricts public access outside of specified start and end date/time (UTC).
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

          {/* Date Time Inputs */}
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

          {/* Announcement Banner */}
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
                ✓ Governance settings updated and live!
              </span>
            ) : (
              <span className="text-xs text-zinc-400">
                Changes apply instantly across sessions.
              </span>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetToDefault}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Reset Default
              </button>
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
                Save Governance
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
