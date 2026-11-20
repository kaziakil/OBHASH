"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import type { UserWorkSummaryItem } from "@/types/challenge";

interface MyWorkClientProps {
  userWork: {
    items: UserWorkSummaryItem[];
    counts: {
      inProgress: number;
      completed: number;
      submitted: number;
      bookmarked: number;
    };
  };
}

export function MyWorkClient({ userWork }: MyWorkClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "in_progress" | "completed" | "bookmarked">("all");

  const filteredItems = userWork.items.filter((item) => {
    if (activeTab === "in_progress") {
      return item.attempt.status === "in_progress";
    }
    if (activeTab === "completed") {
      return item.attempt.status === "completed";
    }
    if (activeTab === "bookmarked") {
      return item.isBookmarked;
    }
    return true;
  });

  const statusBadges: Record<string, { label: string; color: string }> = {
    not_started: { label: "Saved / Not Started", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200" },
    in_progress: { label: "In Progress (Draft)", color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300" },
    evaluating: { label: "Evaluating...", color: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300" },
    submitted: { label: "Submitted", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300" },
    reflection_pending: { label: "Reflection Pending", color: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300" },
    completed: { label: "Completed & Reflected", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300" },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-black text-sm">
                O
              </div>
              <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                OBHASH
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/journey"
                className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Growth Journey
              </Link>
              <Link
                href="/coach"
                className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Growth Coach
              </Link>
              <Link
                href="/challenges"
                className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Challenges
              </Link>
              <Link
                href="/my-work"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm"
              >
                My Work
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/challenges"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              Browse Challenges →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <span>📁</span>
            <span>Personal Practice Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            My Practice & Challenge Work
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            Every challenge you start is safely preserved here. Review in-progress drafts, examine rubric evaluations, revisit past reflections, and track authentic evidence of your human capability growth.
          </p>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg">
              ✏️
            </div>
            <div>
              <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {userWork.counts.inProgress}
              </p>
              <p className="text-[11px] text-zinc-500 font-medium">In Progress Drafts</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
              ✓
            </div>
            <div>
              <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {userWork.counts.completed}
              </p>
              <p className="text-[11px] text-zinc-500 font-medium">Completed & Reflected</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-lg">
              📊
            </div>
            <div>
              <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {userWork.counts.submitted}
              </p>
              <p className="text-[11px] text-zinc-500 font-medium">Under Evaluation</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-lg">
              ★
            </div>
            <div>
              <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {userWork.counts.bookmarked}
              </p>
              <p className="text-[11px] text-zinc-500 font-medium">Bookmarked Challenges</p>
            </div>
          </Card>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            All Work ({userWork.items.length})
          </button>
          <button
            onClick={() => setActiveTab("in_progress")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "in_progress"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            In Progress ({userWork.counts.inProgress})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "completed"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            Completed ({userWork.counts.completed})
          </button>
          <button
            onClick={() => setActiveTab("bookmarked")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "bookmarked"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            Bookmarked ({userWork.counts.bookmarked})
          </button>
        </div>

        {/* List of Challenge Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 space-y-3">
            <span className="text-3xl">📝</span>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">No challenge records in this view</p>
            <p className="text-xs text-zinc-500">Pick an inspiring scenario from the catalog to begin developing your capabilities.</p>
            <Link href="/challenges">
              <Button size="sm">Explore Challenges →</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const status = statusBadges[item.attempt.status] || {
                label: item.attempt.status,
                color: "bg-zinc-100 text-zinc-700",
              };

              return (
                <Card
                  key={`${item.challenge.id}-${item.attempt.id}`}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase">
                        {item.challenge.capability_category.replace("-", " ")}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${status.color}`}
                      >
                        {status.label}
                      </span>
                      {item.isBookmarked && (
                        <span className="text-amber-500 text-xs">★ Bookmarked</span>
                      )}
                    </div>

                    <Link href={`/challenges/${item.challenge.id}`}>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {item.challenge.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {item.challenge.short_description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-zinc-400 pt-1">
                      <span>⏱️ {item.challenge.estimated_completion_time}</span>
                      <span>Difficulty: {item.challenge.difficulty}</span>
                      {item.aiAssistance && item.aiAssistance.queries_count > 0 && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          🌱 AI Coach: {item.aiAssistance.queries_count} consultations
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    {item.attempt.status === "in_progress" ? (
                      <Link href={`/workspace/${item.attempt.id}`}>
                        <Button size="sm" className="text-xs">
                          Resume Workspace Draft →
                        </Button>
                      </Link>
                    ) : item.attempt.status === "completed" ? (
                      <div className="flex items-center gap-2">
                        <Link href={`/workspace/${item.attempt.id}/evaluation`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Evaluation Feedback
                          </Button>
                        </Link>
                        <Link href={`/workspace/${item.attempt.id}/reflection`}>
                          <Button size="sm" className="text-xs">
                            View Reflection →
                          </Button>
                        </Link>
                      </div>
                    ) : item.attempt.status === "reflection_pending" ? (
                      <Link href={`/workspace/${item.attempt.id}/reflection`}>
                        <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-500 text-white">
                          Complete Reflection →
                        </Button>
                      </Link>
                    ) : item.attempt.status === "submitted" || item.attempt.status === "evaluating" ? (
                      <Link href={`/workspace/${item.attempt.id}/evaluation`}>
                        <Button size="sm" className="text-xs">
                          View Evaluation →
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/challenges/${item.challenge.id}`}>
                        <Button size="sm" className="text-xs">
                          Start Challenge →
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
