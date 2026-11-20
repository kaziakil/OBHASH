// ==============================================================================
// OBHASH Phase 6 Types: Challenge & Reflection Workspace
// ==============================================================================

export type ChallengeCapability = "critical-thinking" | "creative-problem-solving" | "curiosity";
export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";

export type ChallengeAttemptStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "evaluating"
  | "evaluated"
  | "reflection_pending"
  | "completed"
  | "abandoned";

export interface ChallengeDeliverableSpec {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  minWords?: number;
}

export interface ChallengeResource {
  title: string;
  type: "article" | "framework" | "case_study" | "heuristic";
  content: string;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  detailed_instructions: string;
  capability_category: ChallengeCapability;
  relevant_dimensions: string[];
  difficulty: ChallengeDifficulty;
  estimated_completion_time: string;
  learning_objective: string;
  scenario: string;
  required_deliverables: ChallengeDeliverableSpec[];
  suggested_thinking_steps: string[];
  optional_resources: ChallengeResource[];
  reflection_prompts: string[];
  version: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ChallengeAttempt {
  id: string;
  user_id: string;
  challenge_id: string;
  challenge_version: number;
  status: ChallengeAttemptStatus;
  journey_activity_id?: string | null;
  started_at: string;
  submitted_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChallengeDraft {
  id: string;
  attempt_id: string;
  user_id: string;
  notes: string;
  deliverables: Record<string, string>;
  last_saved_at: string;
  updated_at: string;
}

export interface ChallengeSubmission {
  id: string;
  attempt_id: string;
  user_id: string;
  challenge_id: string;
  challenge_version: number;
  notes_snapshot: string;
  deliverables_snapshot: Record<string, string>;
  submission_number: number;
  submitted_at: string;
}

export interface EvidenceCitation {
  claim: string;
  quote: string;
  analysis: string;
}

export interface DimensionEvaluation {
  dimension: string;
  level: 1 | 2 | 3 | 4;
  label: string;
  evidence: string;
  guidance: string;
}

export interface ChallengeEvaluation {
  id: string;
  submission_id: string;
  attempt_id: string;
  user_id: string;
  evaluator_type: "ai" | "deterministic_fallback" | "human_rubric";
  evaluator_version: string;
  strengths: string[];
  growth_opportunities: string[];
  evidence_citations: EvidenceCitation[];
  alternative_perspectives: string[];
  recommended_next_steps: string[];
  dimension_evaluations: Record<string, DimensionEvaluation>;
  confidence_score: number;
  evidence_sufficiency: "sufficient" | "partial" | "insufficient";
  created_at: string;
}

export interface ChallengeReflection {
  id: string;
  attempt_id: string;
  user_id: string;
  challenge_id: string;
  responses: Record<string, string>;
  is_submitted: boolean;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeAIAssistanceRecord {
  id: string;
  attempt_id: string;
  user_id: string;
  coaching_session_id?: string | null;
  queries_count: number;
  hint_levels_used: number[];
  action_types_used: string[];
  assistance_summary: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeRecommendation {
  challenge: Challenge;
  score: number;
  rationale: string;
  relatedGoalTitle?: string;
  relatedDimension?: string;
}

export interface UserWorkSummaryItem {
  attempt: ChallengeAttempt;
  challenge: Challenge;
  draft?: ChallengeDraft;
  submission?: ChallengeSubmission;
  evaluation?: ChallengeEvaluation;
  reflection?: ChallengeReflection;
  aiAssistance?: ChallengeAIAssistanceRecord;
  isBookmarked: boolean;
}
