/**
 * Personalized Growth Journey Core Types
 * Phase 4: Personalized Growth Journey Engine
 */

import type { AssessmentCapabilityKey, CapabilityBaselineProfile } from "./assessment";

export type JourneyStatus = "draft" | "active" | "paused" | "completed" | "archived";
export type GoalPriority = "high" | "medium" | "low";
export type GoalStatus = "not_started" | "in_progress" | "completed" | "paused";
export type MilestoneStatus = "not_started" | "in_progress" | "completed" | "skipped";
export type ActivityStatus = "not_started" | "in_progress" | "completed" | "skipped";

export type JourneyDuration = "4 weeks" | "8 weeks" | "12 weeks";
export type WeeklyCommitment = "1-2 hours/week" | "3-4 hours/week" | "5-6 hours/week";

export interface JourneyPersonalizationInput {
  assessmentProfiles: CapabilityBaselineProfile[];
  userInterests: string[];
  growthIntentions: string[];
  selectedCapabilities: AssessmentCapabilityKey[];
  targetDuration: string;
  weeklyCommitmentHours: string;
  userNotes?: string;
}

export interface ProposedPlannedActivity {
  id: string;
  goalId?: string;
  milestoneId?: string;
  capabilityKey: AssessmentCapabilityKey;
  title: string;
  description: string;
  purpose: string;
  estimatedMinutes: number;
  suggestedOrder: number;
  status: ActivityStatus;
}

export interface ProposedMilestone {
  id: string;
  goalId?: string;
  title: string;
  description: string;
  expectedOutcome: string;
  suggestedPeriod: string;
  status: MilestoneStatus;
  orderIndex: number;
  activities: ProposedPlannedActivity[];
}

export interface ProposedGoal {
  id: string;
  focusAreaId?: string;
  capabilityKey: AssessmentCapabilityKey;
  dimensionSlug?: string;
  title: string;
  description: string;
  reasonForRecommendation: string;
  expectedOutcome: string;
  priority: GoalPriority;
  targetDate?: string;
  status: GoalStatus;
  orderIndex: number;
  milestones: ProposedMilestone[];
  activities: ProposedPlannedActivity[];
}

export interface ProposedCapabilityFocusArea {
  id: string;
  capabilityKey: AssessmentCapabilityKey;
  capabilityName: string;
  rationale: string;
  selectedDimensions: string[];
  intendedOutcomes: string[];
  priority: number;
  status: "active" | "completed" | "paused";
  goals: ProposedGoal[];
}

export interface GrowthJourneyData {
  id: string;
  userId: string;
  assessmentAttemptId?: string | null;
  title: string;
  description: string;
  status: JourneyStatus;
  targetDuration: string;
  weeklyCommitmentHours: string;
  capabilityKeys: AssessmentCapabilityKey[];
  primaryPriorities: string[];
  focusAreas: ProposedCapabilityFocusArea[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  generationMetadata?: {
    provider: string;
    modelName: string;
    generationType: "hybrid-ai" | "deterministic-fallback";
    createdAt: string;
  };
}

export interface JourneyGenerationResult {
  journey: GrowthJourneyData;
  generationType: "hybrid-ai" | "deterministic-fallback";
  provider: string;
  modelName: string;
}

export interface JourneyActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
