"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type {
  CoachingMessage,
  CoachingSession,
  CoachingSessionSummary,
  ContextualActionType,
  HintLevel,
} from "@/types/coach";
import {
  executeContextualAction,
  generateSessionSummary,
  sendCoachingMessage,
  updateSessionTitle,
} from "@/lib/coach/actions";

interface CoachingRoomClientProps {
  initialSession: CoachingSession;
}

export function CoachingRoomClient({ initialSession }: CoachingRoomClientProps) {
  const [session, setSession] = useState<CoachingSession>(initialSession);
  const [messages, setMessages] = useState<CoachingMessage[]>(initialSession.messages);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState<HintLevel>(initialSession.currentHintLevel);
  const [summary, setSummary] = useState<CoachingSessionSummary | null>(
    initialSession.summary || null
  );
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(Boolean(initialSession.summary));
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState(initialSession.title);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle sending a normal message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const textToSend = inputText.trim();
    setInputText("");
    setError(null);
    setIsLoading(true);

    // Optimistically add user message
    const tempUserMsg: CoachingMessage = {
      id: `temp-u-${Date.now()}`,
      sessionId: session.id,
      role: "user",
      content: textToSend,
      responseType: "dialogue",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await sendCoachingMessage({
        sessionId: session.id,
        content: textToSend,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to receive coach response.");
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        res.data!.userMessage || tempUserMsg,
        res.data!.assistantMessage,
      ]);
      setHintLevel(res.data.newHintLevel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle triggering contextual actions
  const handleAction = async (action: ContextualActionType) => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const res = await executeContextualAction(session.id, action);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to execute action.");
      }

      setMessages((prev) => [...prev, res.data!.assistantMessage]);
      setHintLevel(res.data.newHintLevel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle end session & summary generation
  const handleGenerateSummary = async () => {
    if (isSummarizing) return;
    setIsSummarizing(true);
    setError(null);

    try {
      const res = await generateSessionSummary(session.id);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to compile summary.");
      }

      setSummary(res.data);
      setShowSummaryModal(true);
      setSession((prev) => ({ ...prev, status: "completed" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating summary");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!customTitle.trim()) return;
    const res = await updateSessionTitle(session.id, customTitle.trim());
    if (res.success) {
      setSession((prev) => ({ ...prev, title: customTitle.trim() }));
      setIsEditingTitle(false);
    }
  };

  const responseTypeBadges: Record<string, { label: string; color: string }> = {
    question: { label: "Socratic Question", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    hint: { label: "Progressive Hint", color: "bg-amber-50 text-amber-800 border-amber-200" },
    explanation: { label: "Concept Explanation", color: "bg-sky-50 text-sky-800 border-sky-200" },
    perspective: { label: "Alternative Angle", color: "bg-purple-50 text-purple-800 border-purple-200" },
    challenge: { label: "Constructive Challenge", color: "bg-rose-50 text-rose-800 border-rose-200" },
    summary: { label: "Session Synthesis", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    dialogue: { label: "Coaching Guide", color: "bg-stone-100 text-stone-700 border-stone-200" },
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* ROOM HEADER */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Link
              href="/coach"
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition flex items-center space-x-1"
            >
              <span>←</span>
              <span className="hidden sm:inline">All Sessions</span>
            </Link>
            <span className="text-stone-300">/</span>

            {isEditingTitle ? (
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="px-2.5 py-1 text-sm border border-stone-300 rounded-lg text-stone-900 w-full"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="px-2.5 py-1 bg-stone-900 text-white text-xs rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 min-w-0">
                <h1 className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate">
                  {session.title}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-stone-400 hover:text-stone-700 text-xs"
                  title="Rename session"
                >
                  ✎
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="hidden sm:inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
              {session.capabilityKey.replace("-", " ")}
            </span>

            {session.status === "completed" ? (
              <button
                type="button"
                onClick={() => setShowSummaryModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold hover:bg-emerald-200 transition"
              >
                View Summary 📋
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isSummarizing || messages.length <= 1}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition disabled:opacity-40"
              >
                {isSummarizing ? "Compiling..." : "Complete & Summarize ✓"}
              </button>
            )}
          </div>
        </div>

        {/* CONTEXT STRIP IF LINKED TO A GOAL */}
        {session.context?.goalSummary && (
          <div className="bg-stone-50 border-t border-stone-100 px-4 sm:px-6 py-1.5 text-xs text-stone-600 flex items-center justify-between">
            <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
              <span className="truncate">
                <strong className="text-stone-800">Target Goal:</strong>{" "}
                {session.context.goalSummary.goalTitle}
              </span>
              {session.journeyId && (
                <Link
                  href={`/journey/${session.journeyId}`}
                  className="text-emerald-800 font-semibold hover:underline ml-2 whitespace-nowrap"
                >
                  View Journey Goal →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MESSAGES THREAD */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
            {error}
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";
          const badge = responseTypeBadges[m.responseType] || responseTypeBadges.dialogue;

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
            >
              {/* Message Header / Response Badge */}
              <div className="flex items-center space-x-2 px-1 text-[11px] text-stone-400">
                <span>{isUser ? "You" : "Growth Coach"}</span>
                {!isUser && (
                  <span className={`px-2 py-0.2 rounded-full border text-[10px] font-semibold ${badge.color}`}>
                    {badge.label}
                    {m.hintLevel ? ` (L${m.hintLevel})` : ""}
                  </span>
                )}
                <span className="font-mono text-[10px]">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 sm:p-5 rounded-2xl max-w-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-2xs ${
                  isUser
                    ? "bg-stone-900 text-white rounded-tr-none"
                    : "bg-white text-stone-800 border border-stone-200 rounded-tl-none font-normal"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start space-y-1">
            <span className="text-[11px] text-stone-400 px-1">Growth Coach</span>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 text-sm text-stone-500 rounded-tl-none flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span className="italic text-xs font-mono">Examining reasoning & formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CONTEXTUAL ACTION BAR & INPUT */}
      <div className="bg-white border-t border-stone-200 sticky bottom-0 z-20 shadow-md">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-3">
          {/* Quick Socratic Contextual Actions */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold uppercase text-stone-400 whitespace-nowrap mr-1">
              Actions:
            </span>

            {/* Progressive Hint Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleAction("hint")}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 font-medium hover:bg-amber-100 transition whitespace-nowrap disabled:opacity-40"
            >
              <span>💡</span>
              <span>
                {hintLevel === 0
                  ? "Get a Hint (Level 1)"
                  : hintLevel === 1
                  ? "Deeper Hint (Level 2)"
                  : "Concrete Hint (Level 3)"}
              </span>
            </button>

            {/* Explain Concept Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleAction("explain")}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-sky-900 font-medium hover:bg-sky-100 transition whitespace-nowrap disabled:opacity-40"
            >
              <span>📖</span>
              <span>Explain Concept</span>
            </button>

            {/* Alternative Perspective Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleAction("perspective")}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 font-medium hover:bg-purple-100 transition whitespace-nowrap disabled:opacity-40"
            >
              <span>🔄</span>
              <span>Another Perspective</span>
            </button>

            {/* Challenge Reasoning Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleAction("challenge")}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-900 font-medium hover:bg-rose-100 transition whitespace-nowrap disabled:opacity-40"
            >
              <span>⚖️</span>
              <span>Challenge My Reasoning</span>
            </button>

            {/* Summarize Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleAction("summarize")}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 font-medium hover:bg-emerald-100 transition whitespace-nowrap disabled:opacity-40"
            >
              <span>📝</span>
              <span>Summarize So Far</span>
            </button>
          </div>

          {/* User Textarea Input */}
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Explain your thinking, answer the coach's question, or share your reasoning... (Enter to send, Shift+Enter for newline)"
              rows={2}
              className="w-full p-3 pr-20 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2.5 bottom-2.5 px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition disabled:opacity-30"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>

      {/* SESSION SUMMARY MODAL / DRAWER */}
      {showSummaryModal && summary && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl border border-stone-200">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                  Session Completed
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Coaching Session Summary
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  A grounded synthesis of the questions, ideas, and reasoning demonstrated in this session.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Summary Sections */}
            <div className="space-y-4 text-xs">
              {/* Explored Topics */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 uppercase tracking-wider block">
                  📌 Explored Topics
                </span>
                <p className="text-stone-600">{summary.exploredTopics.join(" • ")}</p>
              </div>

              {/* Key Questions Considered */}
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-1.5">
                <span className="font-bold text-indigo-900 uppercase tracking-wider block">
                  ❓ Key Questions Considered
                </span>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  {summary.keyQuestionsConsidered.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>

              {/* Perspectives Developed */}
              <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200 space-y-1.5">
                <span className="font-bold text-purple-900 uppercase tracking-wider block">
                  🔄 Perspectives & Mental Models Developed
                </span>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  {summary.perspectivesDeveloped.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Reasoning Demonstrated */}
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 uppercase tracking-wider block">
                  ⚖️ Reasoning Demonstrated
                </span>
                <p className="text-stone-700 leading-relaxed">{summary.reasoningDemonstrated}</p>
              </div>

              {/* Growth Frontiers & Next Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-700 uppercase tracking-wider block">
                    🌱 Growth Frontiers
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    {summary.growthFrontiers.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-700 uppercase tracking-wider block">
                    🎯 Recommended Next Steps
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    {summary.recommendedNextSteps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <Link
                href="/coach"
                className="text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                ← Return to Coach Hub
              </Link>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
