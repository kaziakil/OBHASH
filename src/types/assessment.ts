/**
 * Assessment Engine Core Types
 * Phase 3: Capability Assessment Engine
 */

export type PerformanceLevel =
  | "Emerging"
  | "Developing"
  | "Demonstrating"
  | "Strongly Demonstrating";

export type AssessmentCapabilityKey =
  | "critical-thinking"
  | "creative-problem-solving"
  | "curiosity";

export type ResponseType =
  | "structured-reasoning"
  | "short-text"
  | "long-text"
  | "multiple-choice"
  | "multiple-select";

export interface RubricLevel {
  level: 1 | 2 | 3 | 4;
  name: PerformanceLevel;
  description: string;
  indicators: string[];
}

export interface DimensionRubric {
  dimensionSlug: string;
  dimensionName: string;
  criteria: string[];
  levels: {
    1: RubricLevel;
    2: RubricLevel;
    3: RubricLevel;
    4: RubricLevel;
  };
}

export interface StructuredReasoningSection {
  id: string;
  prompt: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export interface AssessmentItemOption {
  id: string;
  label: string;
  description?: string;
}

export interface AssessmentItemData {
  id: string;
  moduleSlug: AssessmentCapabilityKey;
  dimensionSlug: string;
  dimensionName: string;
  activityType: string;
  title: string;
  scenario: string;
  instructions: string;
  responseType: ResponseType;
  options?: AssessmentItemOption[];
  structuredSections?: StructuredReasoningSection[];
  rubric: DimensionRubric;
  orderIndex: number;
}

export interface AssessmentModuleData {
  slug: AssessmentCapabilityKey;
  name: string;
  tagline: string;
  description: string;
  estimatedMinutes: number;
  dimensions: {
    slug: string;
    name: string;
    description: string;
  }[];
  items: AssessmentItemData[];
}

export interface UserResponsePayload {
  textResponse?: string;
  selectedOption?: string;
  selectedOptions?: string[];
  structuredResponses?: Record<string, string>;
}

export interface SingleEvaluationResult {
  dimensionSlug: string;
  dimensionName: string;
  score: 1 | 2 | 3 | 4;
  performanceLevel: PerformanceLevel;
  evidence: string;
  strengths: string[];
  developmentOpportunities: string[];
  confidence: number;
  evaluatorType: "deterministic" | "hybrid-ai" | "fallback-rubric";
}

export interface DimensionAggregatedScore {
  slug: string;
  name: string;
  score: number;
  level: PerformanceLevel;
  evidence: string[];
}

export interface CapabilityBaselineProfile {
  capabilityKey: AssessmentCapabilityKey;
  capabilityName: string;
  overallScore: number;
  performanceLevel: PerformanceLevel;
  dimensionResults: DimensionAggregatedScore[];
  strengthsSummary: string[];
  opportunitiesSummary: string[];
  evidenceSummary: string[];
  assessedAt: string;
}
