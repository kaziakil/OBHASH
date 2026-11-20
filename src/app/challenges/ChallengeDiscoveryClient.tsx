"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Card, CardTitle, CardDescription } from "@/components/shared/Card";
import { toggleBookmarkAction, startOrResumeChallengeAttemptAction } from "@/lib/challenges/actions";
import type {
  Challenge,
  ChallengeRecommendation,
  UserWorkSummaryItem,
  ChallengeCapability,
  ChallengeDifficulty,
} from "@/types/challenge";

interface ChallengeDiscoveryClientProps {
  initialChallenges: Challenge[];
  recommendations: ChallengeRecommendation[];
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

export function ChallengeDiscoveryClient({
  initialChallenges,
  recommendations,
  userWork,
}: ChallengeDiscoveryClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [selectedCapability, setSelectedCapability] = useState<ChallengeCapability | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    const set = new Set<string>();
    userWork.items.forEach((item) => {
      if (item.isBookmarked) set.add(item.challenge.id);
    });
    return set;
  });
  const [startingChallengeId, setStartingChallengeId] = useState<string | null>(null);

  // Map of challengeId -> attempt
  const attemptMap = new Map<string, UserWorkSummaryItem>();
  userWork.items.forEach((item) => {
    attemptMap.set(item.challenge.id, item);
  });

  // Filter challenges
  const filteredChallenges = initialChallenges.filter((challenge) => {
    if (selectedCapability !== "all" && challenge.capability_category !== selectedCapability) {
      return false;
    }
    if (selectedDifficulty !== "all" && challenge.difficulty !== selectedDifficulty) {
      return false;
    }
    if (showBookmarkedOnly && !bookmarks.has(challenge.id)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = challenge.title.toLowerCase().includes(q);
      const matchDesc = challenge.short_description.toLowerCase().includes(q);
      const matchDim = challenge.relevant_dimensions.some((d) => d.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchDim) return false;
    }
    return true;
  });

  async function handleToggleBookmark(e: React.MouseEvent, challengeId: string) {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(challengeId)) next.delete(challengeId);
      else next.add(challengeId);
      return next;
    });

    await toggleBookmarkAction(challengeId);
  }

  async function handleStartOrResume(challengeId: string) {
    setStartingChallengeId(challengeId);
    try {
      const res = await startOrResumeChallengeAttemptAction(challengeId);
      startTransition(() => {
        router.push(`/workspace/${res.attemptId}`);
      });
    } catch {
      setStartingChallengeId(null);
    }
  }

  const capabilityLabels: Record<ChallengeCapability, { title: string; color: string }> = {
    "critical-thinking": { title: "Critical Thinking", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800" },
    "creative-problem-solving": { title: "Creative Problem-Solving", color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800" },
    curiosity: { title: "Curiosity", color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800" },
  };

  const difficultyColors: Record<ChallengeDifficulty, string> = {
    beginner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    intermediate: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
    advanced: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
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
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 transition-colors shadow-sm"
              >
                Challenges
              </Link>
              <Link
                href="/my-work"
                className="px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                My Work ({userWork.counts.inProgress + userWork.counts.completed + userWork.counts.submitted})
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/my-work"
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              My Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white via-zinc-50 to-indigo-50/30 dark:from-zinc-900 dark:via-zinc-900/60 dark:to-indigo-950/20 p-8 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <span>🎯</span>
              <span>Phase 6: Challenge & Reflection Workspace</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Capability Practice Challenges
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Genuine capability development requires active, independent practice. Tackle structured real-world scenarios, record your reasoning, consult your AI Growth Coach for Socratic guidance when stuck, and build authentic evidence of your thinking.
            </p>
          </div>
        </div>

        {/* Personalized Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>✨</span>
                  <span>Recommended for Your Growth Priorities</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Grounded in your baseline assessment opportunities and active growth journey targets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map(({ challenge, rationale, relatedDimension }) => {
                const isBookmarked = bookmarks.has(challenge.id);
                const attemptItem = attemptMap.get(challenge.id);
                const isStarting = startingChallengeId === challenge.id;

                return (
                  <Card
                    key={`rec-${challenge.id}`}
                    className="p-5 flex flex-col justify-between border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-br from-white to-indigo-50/20 dark:from-zinc-900 dark:to-indigo-950/10 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              capabilityLabels[challenge.capability_category].color
                            }`}
                          >
                            {capabilityLabels[challenge.capability_category].title}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                              difficultyColors[challenge.difficulty]
                            }`}
                          >
                            {challenge.difficulty.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            ⏱️ {challenge.estimated_completion_time}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleToggleBookmark(e, challenge.id)}
                          className="text-zinc-400 hover:text-amber-500 transition-colors p-1"
                          title={isBookmarked ? "Remove bookmark" : "Bookmark challenge"}
                        >
                          {isBookmarked ? "★" : "☆"}
                        </button>
                      </div>

                      <div>
                        <Link href={`/challenges/${challenge.id}`}>
                          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {challenge.title}
                          </h3>
                        </Link>
                        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {challenge.short_description}
                        </p>
                      </div>

                      {/* Recommendation Rationale Callout */}
                      <div className="rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-2.5 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                        <span className="text-sm">💡</span>
                        <div>
                          <p className="font-semibold text-[11px]">Why recommended:</p>
                          <p className="text-[11px] leading-tight text-indigo-800 dark:text-indigo-300">
                            {rationale}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-400">Practices:</span>
                        <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          {relatedDimension}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/challenges/${challenge.id}`}
                          className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          Details
                        </Link>
                        <Button
                          size="sm"
                          isLoading={isStarting}
                          onClick={() => handleStartOrResume(challenge.id)}
                          className="text-xs"
                        >
                          {attemptItem?.attempt.status === "in_progress"
                            ? "Resume Draft →"
                            : attemptItem?.attempt.status === "completed"
                            ? "View Work →"
                            : "Start Challenge →"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Discovery Filter & Search Bar */}
        <section className="space-y-6 pt-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                Explore All Challenges
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Showing {filteredChallenges.length} of {initialChallenges.length} challenges
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search by topic, keyword, or dimension..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <span className="text-xs font-semibold text-zinc-400 mr-2">Capability:</span>
            <button
              onClick={() => setSelectedCapability("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedCapability === "all"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200"
              }`}
            >
              All Capabilities
            </button>
            <button
              onClick={() => setSelectedCapability("critical-thinking")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedCapability === "critical-thinking"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100"
              }`}
            >
              Critical Thinking
            </button>
            <button
              onClick={() => setSelectedCapability("creative-problem-solving")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedCapability === "creative-problem-solving"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 hover:bg-purple-100"
              }`}
            >
              Creative Problem-Solving
            </button>
            <button
              onClick={() => setSelectedCapability("curiosity")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedCapability === "curiosity"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100"
              }`}
            >
              Curiosity
            </button>

            <span className="text-xs font-semibold text-zinc-400 ml-4 mr-2">Difficulty:</span>
            <button
              onClick={() => setSelectedDifficulty("all")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedDifficulty === "all"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200"
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setSelectedDifficulty("beginner")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedDifficulty === "beginner"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setSelectedDifficulty("intermediate")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedDifficulty === "intermediate"
                  ? "bg-sky-600 text-white"
                  : "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setSelectedDifficulty("advanced")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedDifficulty === "advanced"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              Advanced
            </button>

            <button
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              className={`ml-auto px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                showBookmarkedOnly
                  ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700"
                  : "bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:bg-zinc-50"
              }`}
            >
              {showBookmarkedOnly ? "★ Showing Bookmarked" : "☆ Show Bookmarked"}
            </button>
          </div>

          {/* Challenge Cards Grid */}
          {filteredChallenges.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 space-y-3">
              <span className="text-3xl">🔍</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">No challenges match your criteria</p>
              <p className="text-xs text-zinc-500">Try adjusting your filters, clearing search terms, or toggling off bookmarks.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCapability("all");
                  setSelectedDifficulty("all");
                  setSearchQuery("");
                  setShowBookmarkedOnly(false);
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredChallenges.map((challenge) => {
                const isBookmarked = bookmarks.has(challenge.id);
                const attemptItem = attemptMap.get(challenge.id);
                const isStarting = startingChallengeId === challenge.id;

                let statusBadge = null;
                if (attemptItem?.attempt.status === "in_progress") {
                  statusBadge = (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
                      In Progress
                    </span>
                  );
                } else if (attemptItem?.attempt.status === "completed") {
                  statusBadge = (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                      ✓ Completed
                    </span>
                  );
                } else if (attemptItem?.attempt.status === "submitted" || attemptItem?.attempt.status === "reflection_pending") {
                  statusBadge = (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300">
                      Submitted
                    </span>
                  );
                }

                return (
                  <Card
                    key={challenge.id}
                    className="p-5 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              capabilityLabels[challenge.capability_category].color
                            }`}
                          >
                            {capabilityLabels[challenge.capability_category].title}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                              difficultyColors[challenge.difficulty]
                            }`}
                          >
                            {challenge.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {statusBadge}
                          <button
                            onClick={(e) => handleToggleBookmark(e, challenge.id)}
                            className="text-zinc-400 hover:text-amber-500 transition-colors p-1"
                            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                          >
                            {isBookmarked ? "★" : "☆"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Link href={`/challenges/${challenge.id}`}>
                          <CardTitle className="text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {challenge.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="text-xs line-clamp-3 mt-1.5 leading-relaxed">
                          {challenge.short_description}
                        </CardDescription>
                      </div>

                      {/* Dimensions tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {challenge.relevant_dimensions.map((dim) => (
                          <span
                            key={dim}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
                          >
                            {dim}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500 font-medium">
                        ⏱️ {challenge.estimated_completion_time}
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/challenges/${challenge.id}`}
                          className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 px-2 py-1 rounded transition-colors"
                        >
                          Overview
                        </Link>
                        <Button
                          size="sm"
                          isLoading={isStarting}
                          onClick={() => handleStartOrResume(challenge.id)}
                          className="text-xs"
                        >
                          {attemptItem?.attempt.status === "in_progress"
                            ? "Resume →"
                            : attemptItem?.attempt.status === "completed"
                            ? "View Work →"
                            : "Start →"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
