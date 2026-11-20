/**
 * AI Growth Coach Core Types & Contracts
 * Phase 5: AI Growth Coach
 *
 * Defines contracts for Socratic capability coaching, progressive hints,
 * contextual session state, and session summarization.
 */

import type { AssessmentCapabilityKey } from "./assessment";

export type CoachingCapabilityKey = AssessmentCapabilityKey;

export type CoachingSessionStatus = "active" | "completed" | "archived";

export type CoachingRole = "user" | "assistant" | "system";

export type CoachingResponseType =
  | "dialogue"
  | "question"
  | "hint"
  | "explanation"
  | "perspective"
  | "challenge"
  | "summary"
  | "feedback";

export type HintLevel = 0 | 1 | 2 | 3;

export type ContextualActionType =
  | "hint"
  | "explain"
  | "perspective"
  | "challenge"
  | "summarize";

export interface CoachingMessage {
  id: string;
  sessionId: string;
  role: CoachingRole;
  content: string;
  responseType: CoachingResponseType;
  hintLevel?: HintLevel | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CoachingSessionSummary {
  id: string;
  sessionId: string;
  exploredTopics: string[];
  keyQuestionsConsidered: string[];
  perspectivesDeveloped: string[];
  reasoningDemonstrated: string;
  growthFrontiers: string[];
  recommendedNextSteps: string[];
  createdAt: string;
}

export interface CoachingSessionContext {
  assessmentSummary?: {
    capabilityName: string;
    overallScore: number;
    performanceLevel: string;
    strengths: string[];
    opportunities: string[];
  };
  journeySummary?: {
    journeyId: string;
    journeyTitle: string;
    targetDuration: string;
  };
  goalSummary?: {
    goalId: string;
    goalTitle: string;
    dimensionSlug?: string;
    expectedOutcome: string;
    reasonForRecommendation: string;
  };
  userInterests: string[];
  growthIntentions: string[];
}

export interface CoachingSession {
  id: string;
  userId: string;
  title: string;
  capabilityKey: CoachingCapabilityKey;
  journeyId?: string | null;
  goalId?: string | null;
  status: CoachingSessionStatus;
  currentHintLevel: HintLevel;
  instructionVersion: string;
  context?: CoachingSessionContext;
  messages: CoachingMessage[];
  summary?: CoachingSessionSummary | null;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  completedAt?: string | null;
}

export interface CoachingActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StartSessionParams {
  capabilityKey: CoachingCapabilityKey;
  title?: string;
  journeyId?: string | null;
  goalId?: string | null;
  initialPrompt?: string;
}

export interface SendMessageParams {
  sessionId: string;
  content: string;
  actionType?: ContextualActionType;
}
