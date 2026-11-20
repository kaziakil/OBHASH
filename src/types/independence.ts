// ==============================================================================
// OBHASH Phase 7 Types: Independence Measurement Engine
// ==============================================================================

export type IndependenceDimensionKey =
  | "independent-reasoning"
  | "self-directed-exploration"
  | "independent-problem-solving"
  | "thoughtful-ai-use"
  | "reflection-self-direction";

export type EvidenceSufficiency =
  | "insufficient"
  | "emerging"
  | "developing"
  | "consistent";

export type AIAssistanceLevel =
  | "Level A" // Independent: no recorded AI assistance
  | "Level B" // AI-Informed: AI used for background exploration/clarification; user drove core reasoning
  | "Level C" // AI-Assisted: AI contributed ideas/feedback adapted by user
  | "Level D" // AI-Generated: substantial AI generation
  | "Level E"; // Unknown: insufficient evidence to classify

export interface AIAssistanceClassificationInfo {
  level: AIAssistanceLevel;
  name: string;
  tagline: string;
  description: string;
  badgeVariant: "default" | "secondary" | "outline" | "destructive";
}

export type IndependenceSourceType =
  | "challenge_submission"
  | "challenge_reflection"
  | "assessment_evaluation"
  | "coaching_session";

export interface IndependenceObservation {
  id: string;
  userId: string;
  dimensionKey: IndependenceDimensionKey;
  behaviorKey: string;
  behaviorDescription: string;
  sourceType: IndependenceSourceType;
  sourceRecordId: string;
  sourceTitle: string;
  evidenceQuote?: string;
  evidenceAnalysis?: string;
  aiAssistanceClassification: AIAssistanceLevel;
  aiAssistanceNotes?: string;
  confidenceScore: number;
  observedAt: string;
  createdAt?: string;
}

export interface ObservableBehaviorSummary {
  key: string;
  label: string;
  count: number;
  evidenceSnippets: {
    quote: string;
    sourceTitle: string;
    sourceRecordId: string;
    sourceType: IndependenceSourceType;
    aiAssistance: AIAssistanceLevel;
    date: string;
  }[];
}

export interface IndependenceDimensionSummary {
  dimensionKey: IndependenceDimensionKey;
  title: string;
  description: string;
  sufficiency: EvidenceSufficiency;
  sufficiencyLabel: string;
  observationCount: number;
  behaviors: ObservableBehaviorSummary[];
  keyTakeaways: string[];
  recommendedPractice: string;
}

export interface AIAssistanceBreakdown {
  levelCounts: Record<AIAssistanceLevel, number>;
  totalRecords: number;
  predominantLevel: AIAssistanceLevel;
  narrative: string;
}

export interface CapabilityDevelopmentTimelineItem {
  id: string;
  date: string;
  capabilityKey: string;
  dimensionKey?: string;
  activityType: "baseline_assessment" | "challenge_practice" | "coaching_reflection";
  title: string;
  performanceLevel?: string;
  scoreComparison?: {
    baseline?: string;
    current: string;
    isComparable: boolean;
    note: string;
  };
  evidenceSnippet: string;
  aiAssistanceLevel: AIAssistanceLevel;
}

export interface IndependenceOverviewData {
  userId: string;
  frameworkVersion: string;
  hasSufficientEvidence: boolean;
  totalObservationsCount: number;
  dimensions: Record<IndependenceDimensionKey, IndependenceDimensionSummary>;
  aiAssistanceBreakdown: AIAssistanceBreakdown;
  developmentNarrative: {
    overallSummary: string;
    strengthsDemonstrated: string[];
    emergingPatterns: string[];
    areasForInvestigation: string[];
    transparentLimitations: string[];
  };
  developmentTimeline: CapabilityDevelopmentTimelineItem[];
  limitationsNotice: string;
  lastEvaluatedAt: string;
}
