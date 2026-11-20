"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "../supabase/server";
import { challengeStore } from "./local-store";
import { CHALLENGE_CATALOG } from "./catalog";
import { computeChallengeRecommendations } from "./recommendations";
import { evaluateChallengeSubmission } from "../ai/challenge-evaluator";
import { generateCoachReply } from "../ai/coach-engine";
import { journeyLocalStore } from "../journeys/local-store";
import { localStore as assessmentLocalStore } from "../assessments/local-store";
import type {
  Challenge,
  ChallengeAttempt,
  ChallengeDraft,
  ChallengeSubmission,
  ChallengeEvaluation,
  ChallengeReflection,
  ChallengeRecommendation,
  ChallengeAIAssistanceRecord,
  UserWorkSummaryItem,
  ChallengeCapability,
  ChallengeDifficulty,
} from "@/types/challenge";
import type { ContextualActionType, HintLevel } from "@/types/coach";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Expected outside Next.js request context (e.g. test scripts)
  }
}

async function getAuthenticatedUser(): Promise<{ id: string; email: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return { id: user.id, email: user.email || "user@obhash.local" };
      }
    }
  } catch {
    // Fallback for development / mock session
  }
  return { id: "demo-user-1", email: "demo@obhash.local" };
}

export async function getChallengesAction(filters?: {
  capability?: ChallengeCapability | "all";
  difficulty?: ChallengeDifficulty | "all";
  maxTime?: number;
  search?: string;
  bookmarkedOnly?: boolean;
}): Promise<Challenge[]> {
  const user = await getAuthenticatedUser();
  let list = [...CHALLENGE_CATALOG];

  if (filters?.capability && filters.capability !== "all") {
    list = list.filter((c) => c.capability_category === filters.capability);
  }

  if (filters?.difficulty && filters.difficulty !== "all") {
    list = list.filter((c) => c.difficulty === filters.difficulty);
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.short_description.toLowerCase().includes(q) ||
        c.relevant_dimensions.some((d) => d.toLowerCase().includes(q))
    );
  }

  if (filters?.bookmarkedOnly) {
    const bookmarks = challengeStore.getBookmarks(user.id);
    const bookmarkedSet = new Set(bookmarks);
    list = list.filter((c) => bookmarkedSet.has(c.id));
  }

  return list;
}

export async function getChallengeByIdAction(id: string): Promise<Challenge | null> {
  return challengeStore.getChallengeById(id);
}

export async function getRecommendedChallengesAction(): Promise<ChallengeRecommendation[]> {
  const user = await getAuthenticatedUser();
  const baselineProfiles = assessmentLocalStore.getUserProfiles(user.id);
  const activeJourney = journeyLocalStore.getActiveJourney(user.id);

  const completedAttempts = challengeStore
    .getUserAttempts(user.id)
    .filter((a) => a.status === "completed" || a.status === "submitted" || a.status === "evaluated");
  const completedIds = completedAttempts.map((a) => a.challenge_id);

  return computeChallengeRecommendations(
    {
      userId: user.id,
      baselineProfiles,
      activeJourney,
      userInterests: ["Critical Thinking", "Technology", "Design", "Problem-Solving"],
      completedChallengeIds: completedIds,
    },
    4
  );
}

export async function toggleBookmarkAction(challengeId: string): Promise<boolean> {
  const user = await getAuthenticatedUser();
  const isBookmarked = challengeStore.toggleBookmark(user.id, challengeId);
  safeRevalidate("/challenges");
  safeRevalidate("/my-work");
  return isBookmarked;
}

export async function isChallengeBookmarkedAction(challengeId: string): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return challengeStore.isBookmarked(user.id, challengeId);
}

export async function startOrResumeChallengeAttemptAction(
  challengeId: string,
  journeyActivityId?: string
): Promise<{ attemptId: string; isNew: boolean }> {
  const user = await getAuthenticatedUser();
  const challenge = challengeStore.getChallengeById(challengeId);

  if (!challenge) {
    throw new Error(`Challenge with ID "${challengeId}" not found.`);
  }

  // Check if an in-progress attempt already exists for this challenge
  const userAttempts = challengeStore.getUserAttempts(user.id);
  const existingInProgress = userAttempts.find(
    (a) => a.challenge_id === challengeId && (a.status === "in_progress" || a.status === "not_started")
  );

  if (existingInProgress) {
    return { attemptId: existingInProgress.id, isNew: false };
  }

  // Create a new attempt
  const attemptId = `attempt-${Date.now()}`;
  const newAttempt: ChallengeAttempt = {
    id: attemptId,
    user_id: user.id,
    challenge_id: challenge.id,
    challenge_version: challenge.version,
    status: "in_progress",
    journey_activity_id: journeyActivityId || null,
    started_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  challengeStore.saveAttempt(newAttempt);

  // Initialize draft
  const initialDeliverables: Record<string, string> = {};
  for (const d of challenge.required_deliverables) {
    initialDeliverables[d.id] = "";
  }

  const newDraft: ChallengeDraft = {
    id: `draft-${Date.now()}`,
    attempt_id: attemptId,
    user_id: user.id,
    notes: "",
    deliverables: initialDeliverables,
    last_saved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  challengeStore.saveDraft(newDraft);

  safeRevalidate("/challenges");
  safeRevalidate("/my-work");
  safeRevalidate(`/workspace/${attemptId}`);

  return { attemptId, isNew: true };
}

export async function getAttemptContextAction(attemptId: string): Promise<{
  attempt: ChallengeAttempt;
  challenge: Challenge;
  draft: ChallengeDraft | null;
  submission: ChallengeSubmission | null;
  evaluation: ChallengeEvaluation | null;
  reflection: ChallengeReflection | null;
  aiAssistance: ChallengeAIAssistanceRecord | null;
} | null> {
  const attempt = challengeStore.getAttempt(attemptId);
  if (!attempt) return null;

  const challenge = challengeStore.getChallengeById(attempt.challenge_id);
  if (!challenge) return null;

  const draft = challengeStore.getDraft(attemptId);
  const submission = challengeStore.getSubmission(attemptId);
  const evaluation = challengeStore.getEvaluation(attemptId);
  const reflection = challengeStore.getReflection(attemptId);
  const aiAssistance = challengeStore.getAIAssistance(attemptId);

  return {
    attempt,
    challenge,
    draft,
    submission,
    evaluation,
    reflection,
    aiAssistance,
  };
}

export async function saveDraftAction(
  attemptId: string,
  notes: string,
  deliverables: Record<string, string>
): Promise<{ success: boolean; lastSavedAt: string }> {
  const user = await getAuthenticatedUser();
  const attempt = challengeStore.getAttempt(attemptId);

  if (!attempt || attempt.user_id !== user.id) {
    throw new Error("Attempt not found or access denied.");
  }

  const existingDraft = challengeStore.getDraft(attemptId);
  const now = new Date().toISOString();

  const updatedDraft: ChallengeDraft = {
    id: existingDraft?.id || `draft-${Date.now()}`,
    attempt_id: attemptId,
    user_id: user.id,
    notes,
    deliverables,
    last_saved_at: now,
    updated_at: now,
  };

  challengeStore.saveDraft(updatedDraft);

  // Update attempt timestamp
  attempt.updated_at = now;
  challengeStore.saveAttempt(attempt);

  return { success: true, lastSavedAt: now };
}

export async function submitChallengeAction(attemptId: string): Promise<{
  success: boolean;
  submissionId: string;
  evaluation: ChallengeEvaluation;
}> {
  const user = await getAuthenticatedUser();
  const attempt = challengeStore.getAttempt(attemptId);

  if (!attempt || attempt.user_id !== user.id) {
    throw new Error("Attempt not found or access denied.");
  }

  const challenge = challengeStore.getChallengeById(attempt.challenge_id);
  if (!challenge) {
    throw new Error("Associated challenge not found.");
  }

  const draft = challengeStore.getDraft(attemptId);
  if (!draft) {
    throw new Error("No draft found to submit.");
  }

  const now = new Date().toISOString();
  const submissionId = `sub-${Date.now()}`;

  // 1. Create immutable submission snapshot
  const submission: ChallengeSubmission = {
    id: submissionId,
    attempt_id: attemptId,
    user_id: user.id,
    challenge_id: challenge.id,
    challenge_version: challenge.version,
    notes_snapshot: draft.notes,
    deliverables_snapshot: { ...draft.deliverables },
    submission_number: 1,
    submitted_at: now,
  };
  challengeStore.saveSubmission(submission);

  // 2. Update attempt status to evaluating
  attempt.status = "evaluating";
  attempt.submitted_at = now;
  attempt.updated_at = now;
  challengeStore.saveAttempt(attempt);

  // 3. Evaluate submission
  const evaluation = await evaluateChallengeSubmission(challenge, submission);
  challengeStore.saveEvaluation(evaluation);

  // 4. Update attempt status to evaluated / reflection_pending
  attempt.status = "reflection_pending";
  attempt.updated_at = new Date().toISOString();
  challengeStore.saveAttempt(attempt);

  // 5. If this challenge was linked to a Growth Journey activity, update activity status
  if (attempt.journey_activity_id) {
    const activeJourney = journeyLocalStore.getActiveJourney(user.id);
    if (activeJourney) {
      journeyLocalStore.updateActivityStatus(
        activeJourney.id,
        attempt.journey_activity_id,
        "completed"
      );
    }
  }

  safeRevalidate(`/workspace/${attemptId}`);
  safeRevalidate(`/workspace/${attemptId}/evaluation`);
  safeRevalidate("/challenges");
  safeRevalidate("/my-work");
  safeRevalidate("/dashboard");

  return { success: true, submissionId, evaluation };
}

export async function submitReflectionAction(
  attemptId: string,
  responses: Record<string, string>
): Promise<{ success: boolean }> {
  const user = await getAuthenticatedUser();
  const attempt = challengeStore.getAttempt(attemptId);

  if (!attempt || attempt.user_id !== user.id) {
    throw new Error("Attempt not found or access denied.");
  }

  const now = new Date().toISOString();
  const reflection: ChallengeReflection = {
    id: `ref-${Date.now()}`,
    attempt_id: attemptId,
    user_id: user.id,
    challenge_id: attempt.challenge_id,
    responses,
    is_submitted: true,
    submitted_at: now,
    created_at: now,
    updated_at: now,
  };

  challengeStore.saveReflection(reflection);

  // Mark attempt as fully completed
  attempt.status = "completed";
  attempt.completed_at = now;
  attempt.updated_at = now;
  challengeStore.saveAttempt(attempt);

  safeRevalidate(`/workspace/${attemptId}`);
  safeRevalidate(`/workspace/${attemptId}/reflection`);
  safeRevalidate("/challenges");
  safeRevalidate("/my-work");
  safeRevalidate("/dashboard");

  return { success: true };
}

export async function askCoachInChallengeAction(
  attemptId: string,
  actionType: "hint" | "explain" | "perspective" | "challenge" | "question",
  hintLevel = 1,
  userQuestion?: string
): Promise<{
  reply: string;
  responseType: string;
  hintLevel?: number;
  assistanceRecord: ChallengeAIAssistanceRecord;
}> {
  const user = await getAuthenticatedUser();
  const attempt = challengeStore.getAttempt(attemptId);
  if (!attempt || attempt.user_id !== user.id) {
    throw new Error("Attempt not found.");
  }

  const challenge = challengeStore.getChallengeById(attempt.challenge_id);
  if (!challenge) {
    throw new Error("Challenge not found.");
  }

  const draft = challengeStore.getDraft(attemptId);
  const currentWork = draft ? JSON.stringify(draft.deliverables) : "";

  const challengeContextPrompt = `
You are the AI Growth Coach acting inside an active Challenge Workspace.
The learner is working on the challenge: "${challenge.title}".
Scenario summary: ${challenge.scenario}
Relevant capability dimensions: ${challenge.relevant_dimensions.join(", ")}
Learner's current draft notes / answers:
${currentWork ? currentWork.slice(0, 500) : "(No draft content entered yet)"}

Action requested by learner: ${actionType.toUpperCase()}
${userQuestion ? `Specific question from learner: "${userQuestion}"` : ""}

CRITICAL INSTRUCTIONS:
- Guide the learner Socratically.
- DO NOT WRITE THEIR ANSWER FOR THEM.
- DO NOT GHOSTWRITE THEIR DELIVERABLES.
- If they ask for a hint, provide a progressive hint (Level ${hintLevel}):
  * Level 1: Point to an overlooked angle.
  * Level 2: Introduce a conceptual framework or heuristic.
  * Level 3: Provide a structural thinking template, but leave the conclusion blank for the learner.
- If they ask for an explanation, clarify the concept concisely.
- If they ask for a perspective, offer an alternative stakeholder angle.
- If they ask for a challenge, constructively pressure-test their assumptions.
`;

  const coachReply = await generateCoachReply({
    capabilityKey: challenge.capability_category,
    currentHintLevel: (hintLevel as HintLevel) || 1,
    actionType: actionType as ContextualActionType,
    userPrompt: challengeContextPrompt,
    messages: [],
  });

  // Record AI assistance metadata for transparency
  const record = challengeStore.recordAIAssistance(
    attemptId,
    user.id,
    actionType,
    actionType === "hint" ? hintLevel : undefined,
    `Coach consulted for ${actionType} at Level ${hintLevel}`
  );

  return {
    reply: coachReply.replyContent,
    responseType: coachReply.responseType,
    hintLevel: coachReply.hintLevel || undefined,
    assistanceRecord: record,
  };
}

export async function getUserWorkOverviewAction(): Promise<{
  items: UserWorkSummaryItem[];
  counts: {
    inProgress: number;
    completed: number;
    submitted: number;
    bookmarked: number;
  };
}> {
  const user = await getAuthenticatedUser();
  const attempts = challengeStore.getUserAttempts(user.id);
  const bookmarks = new Set(challengeStore.getBookmarks(user.id));

  const items: UserWorkSummaryItem[] = [];

  for (const attempt of attempts) {
    const challenge = challengeStore.getChallengeById(attempt.challenge_id);
    if (!challenge) continue;

    items.push({
      attempt,
      challenge,
      draft: challengeStore.getDraft(attempt.id) || undefined,
      submission: challengeStore.getSubmission(attempt.id) || undefined,
      evaluation: challengeStore.getEvaluation(attempt.id) || undefined,
      reflection: challengeStore.getReflection(attempt.id) || undefined,
      aiAssistance: challengeStore.getAIAssistance(attempt.id) || undefined,
      isBookmarked: bookmarks.has(challenge.id),
    });
  }

  // Also include bookmarked challenges that haven't been attempted yet
  for (const challengeId of bookmarks) {
    if (!attempts.some((a) => a.challenge_id === challengeId)) {
      const challenge = challengeStore.getChallengeById(challengeId);
      if (challenge) {
        items.push({
          attempt: {
            id: `unstarted-${challengeId}`,
            user_id: user.id,
            challenge_id: challenge.id,
            challenge_version: challenge.version,
            status: "not_started",
            started_at: "2026-11-20T00:00:00.000Z",
            created_at: "2026-11-20T00:00:00.000Z",
            updated_at: "2026-11-20T00:00:00.000Z",
          },
          challenge,
          isBookmarked: true,
        });
      }
    }
  }

  const counts = {
    inProgress: attempts.filter((a) => a.status === "in_progress").length,
    completed: attempts.filter((a) => a.status === "completed").length,
    submitted: attempts.filter((a) => a.status === "submitted" || a.status === "evaluating" || a.status === "reflection_pending").length,
    bookmarked: bookmarks.size,
  };

  return { items, counts };
}
