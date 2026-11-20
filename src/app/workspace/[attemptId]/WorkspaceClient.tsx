"use client";

import React, { useState, useRef, useTransition, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import {
  saveDraftAction,
  submitChallengeAction,
  askCoachInChallengeAction,
} from "@/lib/challenges/actions";
import type {
  Challenge,
  ChallengeAttempt,
  ChallengeDraft,
  ChallengeAIAssistanceRecord,
} from "@/types/challenge";

interface WorkspaceClientProps {
  attempt: ChallengeAttempt;
  challenge: Challenge;
  initialDraft: ChallengeDraft | null;
  initialAIAssistance: ChallengeAIAssistanceRecord | null;
}

interface CoachChatMessage {
  role: "coach" | "user";
  content: string;
  type: string;
  hintLevel?: number;
  timestamp: string;
}

export function WorkspaceClient({
  attempt,
  challenge,
  initialDraft,
  initialAIAssistance,
}: WorkspaceClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Active view tab for responsive layouts
  const [activeTab, setActiveTab] = useState<"workspace" | "brief" | "coach">("workspace");

  // State for user content
  const [notes, setNotes] = useState(initialDraft?.notes || "");
  const [deliverables, setDeliverables] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    challenge.required_deliverables.forEach((d) => {
      initial[d.id] = initialDraft?.deliverables?.[d.id] || "";
    });
    return initial;
  });

  // Autosave status state
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>(
    initialDraft?.last_saved_at
      ? new Date(initialDraft.last_saved_at).toLocaleTimeString()
      : "Just now"
  );
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Coach Panel State
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState<number>(() => {
    if (initialAIAssistance && initialAIAssistance.hint_levels_used.length > 0) {
      return Math.max(...initialAIAssistance.hint_levels_used);
    }
    return 0;
  });
  const [coachMessages, setCoachMessages] = useState<CoachChatMessage[]>([
    {
      role: "coach",
      content: `Hello! I am your AI Growth Coach for this challenge. My role is to help you think through problems, question assumptions, and explore perspectives—not to write your deliverables for you. How can I guide your reasoning today?`,
      type: "intro",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [coachQuestionInput, setCoachQuestionInput] = useState("");
  const [isCoachThinking, setIsCoachThinking] = useState(false);
  const [aiAssistanceRecord, setAiAssistanceRecord] = useState<ChallengeAIAssistanceRecord | null>(
    initialAIAssistance
  );

  // Submission State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [authorshipCertified, setAuthorshipCertified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Autosave handler with debounce
  const triggerAutosave = useCallback((updatedNotes: string, updatedDeliverables: Record<string, string>) => {
    setSaveStatus("unsaved");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const res = await saveDraftAction(attempt.id, updatedNotes, updatedDeliverables);
        if (res.success) {
          setSaveStatus("saved");
          setLastSavedTime(new Date(res.lastSavedAt).toLocaleTimeString());
        }
      } catch {
        setSaveStatus("unsaved");
      }
    }, 1500);
  }, [attempt.id]);

  function handleDeliverableChange(id: string, value: string) {
    const nextDeliverables = { ...deliverables, [id]: value };
    setDeliverables(nextDeliverables);
    triggerAutosave(notes, nextDeliverables);
  }

  function handleNotesChange(value: string) {
    setNotes(value);
    triggerAutosave(value, deliverables);
  }

  async function handleManualSave() {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaveStatus("saving");
    try {
      const res = await saveDraftAction(attempt.id, notes, deliverables);
      if (res.success) {
        setSaveStatus("saved");
        setLastSavedTime(new Date(res.lastSavedAt).toLocaleTimeString());
      }
    } catch {
      setSaveStatus("unsaved");
    }
  }

  // AI Growth Coach Interactions
  async function handleCoachAction(
    actionType: "hint" | "explain" | "perspective" | "challenge" | "question",
    customPrompt?: string
  ) {
    setIsCoachThinking(true);
    let targetHint = currentHintLevel;
    if (actionType === "hint") {
      targetHint = currentHintLevel >= 3 ? 3 : currentHintLevel + 1;
      setCurrentHintLevel(targetHint);
    }

    // Add user query to chat history
    const userMsg = customPrompt
      ? customPrompt
      : actionType === "hint"
      ? `Can you give me a Level ${targetHint} hint?`
      : actionType === "explain"
      ? "Can you explain the core concepts and heuristics in this challenge?"
      : actionType === "perspective"
      ? "What alternative perspective or stakeholder angle should I consider?"
      : actionType === "challenge"
      ? "Could you constructively challenge my reasoning and assumptions?"
      : "Can you ask me a guiding question?";

    setCoachMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMsg,
        type: actionType,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    try {
      const res = await askCoachInChallengeAction(
        attempt.id,
        actionType,
        targetHint,
        customPrompt
      );

      setCoachMessages((prev) => [
        ...prev,
        {
          role: "coach",
          content: res.reply,
          type: res.responseType,
          hintLevel: res.hintLevel,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setAiAssistanceRecord(res.assistanceRecord);
    } catch {
      setCoachMessages((prev) => [
        ...prev,
        {
          role: "coach",
          content:
            "I encountered a temporary communication glitch, but consider this: step back from the current solution and ask what fundamental constraint or unstated premise you might be taking for granted.",
          type: "fallback",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsCoachThinking(false);
      setCoachQuestionInput("");
    }
  }

  // Submission handler
  async function handleConfirmSubmit() {
    if (!authorshipCertified) return;
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // First ensure draft is saved
      await saveDraftAction(attempt.id, notes, deliverables);

      // Submit challenge
      const res = await submitChallengeAction(attempt.id);
      if (res.success) {
        startTransition(() => {
          router.push(`/workspace/${attempt.id}/evaluation`);
        });
      }
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : "Failed to submit challenge.");
      setIsSubmitting(false);
    }
  }

  // Word count utility
  function getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  const totalWords = Object.values(deliverables).reduce((sum, text) => sum + getWordCount(text), 0);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col h-screen overflow-hidden">
      {/* Workspace Top Bar */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/challenges"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ← Exit
          </Link>

          <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-[260px] sm:max-w-md">
              {challenge.title}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hidden md:inline-block">
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* Middle: Save Status & Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            {saveStatus === "saving" ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Saving...</span>
              </span>
            ) : saveStatus === "saved" ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                <span>✓</span>
                <span>Saved {lastSavedTime}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-400 text-[11px]">
                <span className="inline-block w-2 h-2 rounded-full bg-zinc-400" />
                <span>Unsaved changes</span>
              </span>
            )}
          </div>

          <button
            onClick={handleManualSave}
            title="Force save draft"
            className="text-xs px-2.5 py-1 rounded text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hidden sm:inline-block"
          >
            Save
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Coach Toggle Button */}
          <button
            onClick={() => setIsCoachOpen(!isCoachOpen)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              isCoachOpen
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 hover:bg-indigo-100"
            }`}
          >
            <span>🌱</span>
            <span>AI Coach</span>
            {aiAssistanceRecord && aiAssistanceRecord.queries_count > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-indigo-700 text-white text-[10px]">
                {aiAssistanceRecord.queries_count}
              </span>
            )}
          </button>

          {/* Submit Work Button */}
          <Button
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
            className="text-xs px-3.5 py-1.5"
          >
            Preview & Submit →
          </Button>
        </div>
      </header>

      {/* Mobile Tab Selector */}
      <div className="md:hidden flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-xs">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex-1 py-1.5 rounded-md font-semibold text-center ${
            activeTab === "workspace"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          Deliverables ({totalWords}w)
        </button>
        <button
          onClick={() => setActiveTab("brief")}
          className={`flex-1 py-1.5 rounded-md font-semibold text-center ${
            activeTab === "brief"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          Scenario Brief
        </button>
        <button
          onClick={() => {
            setActiveTab("coach");
            setIsCoachOpen(true);
          }}
          className={`flex-1 py-1.5 rounded-md font-semibold text-center ${
            activeTab === "coach"
              ? "bg-indigo-600 text-white"
              : "text-indigo-600 dark:text-indigo-400"
          }`}
        >
          AI Coach
        </button>
      </div>

      {/* Main Workspace Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Challenge Brief & Instructions (Scrollable) */}
        <aside
          className={`w-full md:w-[420px] lg:w-[460px] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-6 space-y-6 shrink-0 ${
            activeTab === "brief" ? "block" : "hidden md:block"
          }`}
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
              {challenge.capability_category.replace("-", " ")}
            </span>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {challenge.title}
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {challenge.short_description}
            </p>
          </div>

          {/* Scenario Callout */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              The Scenario
            </h3>
            <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 whitespace-pre-line font-normal">
              {challenge.scenario}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Instructions
            </h3>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {challenge.detailed_instructions}
            </p>
          </div>

          {/* Suggested Thinking Steps */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Suggested Thinking Process
            </h3>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              {challenge.suggested_thinking_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 select-none">
                    {idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reference Material */}
          {challenge.optional_resources.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Mental Models & Resources
              </h3>
              <div className="space-y-2">
                {challenge.optional_resources.map((res, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 p-3 text-xs space-y-1"
                  >
                    <p className="font-semibold text-zinc-900 dark:text-zinc-200">
                      {res.title}
                    </p>
                    <p className="text-zinc-500 leading-relaxed">
                      {res.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Center Pane: The Thinking & Deliverables Workspace */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-50 dark:bg-zinc-950 space-y-8 ${
            activeTab === "workspace" ? "block" : "hidden md:block"
          }`}
        >
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header banner */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Your Thinking & Deliverables
                </h1>
                <p className="text-xs text-zinc-500">
                  Record your reasoning, arguments, and decisions. Your work autosaves continuously.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {totalWords} words
                </span>
                <p className="text-[10px] text-zinc-400">Total volume</p>
              </div>
            </div>

            {/* Deliverables Input Cards */}
            <div className="space-y-6">
              {challenge.required_deliverables.map((deliv) => {
                const text = deliverables[deliv.id] || "";
                const wordCount = getWordCount(text);
                const meetsMin = !deliv.minWords || wordCount >= deliv.minWords;

                return (
                  <div
                    key={deliv.id}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs space-y-3 transition-focus-within focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {deliv.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {deliv.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {deliv.minWords && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              meetsMin
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            }`}
                          >
                            {wordCount} / {deliv.minWords} min words
                          </span>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={6}
                      value={text}
                      onChange={(e) => handleDeliverableChange(deliv.id, e.target.value)}
                      placeholder={deliv.placeholder}
                      className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 transition-colors font-mono leading-relaxed"
                    />
                  </div>
                );
              })}
            </div>

            {/* Thinking Scratchpad / Informal Notes */}
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    <span>💭</span>
                    <span>Working Scratchpad (Informal Notes)</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Use this space to jot down unpolished thoughts, test ideas, brainstorm angles, or outline arguments.
                  </p>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">
                  {getWordCount(notes)} words
                </span>
              </div>

              <textarea
                rows={4}
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Brainstorming, draft hypotheses, questions to self..."
                className="w-full text-xs p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 transition-colors"
              />
            </div>
          </div>
        </main>

        {/* Right Drawer / Pane: AI Growth Coach (Collapsible / Slide-over) */}
        {isCoachOpen && (
          <aside className="w-full md:w-96 lg:w-[420px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0 z-20 shadow-lg md:shadow-none animate-in slide-in-from-right duration-200">
            {/* Coach Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2">
                <span className="text-base">🌱</span>
                <div>
                  <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    AI Growth Coach
                  </h3>
                  <p className="text-[10px] text-zinc-500">
                    Socratic thinking partner • Coach, don&apos;t replace
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCoachOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1"
                title="Close Coach Panel"
              >
                ✕
              </button>
            </div>

            {/* Socratic Quick Action Triggers */}
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-1.5">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Socratic Assistance Actions
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  disabled={isCoachThinking}
                  onClick={() => handleCoachAction("hint")}
                  className="text-[11px] font-semibold text-left px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 hover:bg-amber-100 transition-colors disabled:opacity-50"
                >
                  💡 Get Hint ({currentHintLevel < 3 ? `Lvl ${currentHintLevel + 1}` : "Lvl 3"})
                </button>
                <button
                  disabled={isCoachThinking}
                  onClick={() => handleCoachAction("challenge")}
                  className="text-[11px] font-semibold text-left px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50"
                >
                  ⚡ Challenge My Logic
                </button>
                <button
                  disabled={isCoachThinking}
                  onClick={() => handleCoachAction("perspective")}
                  className="text-[11px] font-semibold text-left px-2.5 py-1.5 rounded-lg border border-purple-200 dark:border-purple-900 bg-purple-50/60 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200 hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  👁️ Alt Perspective
                </button>
                <button
                  disabled={isCoachThinking}
                  onClick={() => handleCoachAction("explain")}
                  className="text-[11px] font-semibold text-left px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  📖 Explain Heuristic
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {coachMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col space-y-1 ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-br-none"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {msg.hintLevel && (
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100 mb-1.5">
                        Hint Level {msg.hintLevel}
                      </span>
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isCoachThinking && (
                <div className="flex items-center gap-2 text-zinc-500 text-xs italic p-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>The Coach is formulating Socratic guidance...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (coachQuestionInput.trim() && !isCoachThinking) {
                    handleCoachAction("question", coachQuestionInput.trim());
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask a question or describe your dilemma..."
                  value={coachQuestionInput}
                  onChange={(e) => setCoachQuestionInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button
                  size="sm"
                  type="submit"
                  disabled={!coachQuestionInput.trim() || isCoachThinking}
                  className="text-xs shrink-0"
                >
                  Ask
                </Button>
              </form>
            </div>
          </aside>
        )}
      </div>

      {/* Submission Preview & Confirmation Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Preview & Submit Challenge"
      >
        <div className="space-y-6 text-xs sm:text-sm max-h-[75vh] overflow-y-auto pr-1">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-4 space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
              {challenge.title}
            </h4>
            <p className="text-zinc-500 text-xs">
              Capability: {challenge.capability_category.replace("-", " ")} • Total submission volume: {totalWords} words
            </p>
          </div>

          {/* Deliverables Preview */}
          <div className="space-y-4">
            <h5 className="font-bold text-xs uppercase tracking-wider text-zinc-500">
              Submitted Deliverables
            </h5>
            {challenge.required_deliverables.map((deliv) => (
              <div
                key={deliv.id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 space-y-1.5"
              >
                <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  {deliv.title}
                </p>
                <div className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-line bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
                  {deliverables[deliv.id]?.trim() || (
                    <span className="text-zinc-400 italic font-sans">(Empty deliverable)</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AI Assistance Metadata Audit */}
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/30 p-3.5 space-y-1">
            <p className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <span>🌱</span>
              <span>AI Coaching Assistance Transparency</span>
            </p>
            <p className="text-xs text-indigo-800 dark:text-indigo-300">
              {aiAssistanceRecord && aiAssistanceRecord.queries_count > 0 ? (
                <>
                  You consulted the AI Growth Coach {aiAssistanceRecord.queries_count} times during this challenge (Actions: {aiAssistanceRecord.action_types_used.join(", ")}). This metadata is recorded to preserve authentic development tracking.
                </>
              ) : (
                "No AI coaching interactions were recorded for this attempt. This submission represents unassisted independent performance."
              )}
            </p>
          </div>

          {/* Authorship Certification Checkbox */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={authorshipCertified}
                onChange={(e) => setAuthorshipCertified(e.target.checked)}
                className="mt-0.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                I certify that this submission represents my own independent thinking, analysis, and decisions. Any AI coach interactions were used solely for inquiry guidance.
              </span>
            </label>

            {submissionError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                ⚠️ {submissionError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
              >
                Back to Edit
              </Button>
              <Button
                size="sm"
                disabled={!authorshipCertified || isSubmitting}
                isLoading={isSubmitting}
                onClick={handleConfirmSubmit}
              >
                Confirm & Submit Challenge →
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
