// ==============================================================================
// OBHASH Phase 7: AI Assistance Classification Engine
// ==============================================================================

import type { AIAssistanceLevel, AIAssistanceClassificationInfo } from "@/types/independence";
import type { ChallengeAIAssistanceRecord } from "@/types/challenge";

export const AI_ASSISTANCE_METADATA: Record<AIAssistanceLevel, AIAssistanceClassificationInfo> = {
  "Level A": {
    level: "Level A",
    name: "Independent",
    tagline: "Wholly Self-Authored",
    description: "The user formulated arguments, decisions, and solutions without recorded AI assistance.",
    badgeVariant: "default",
  },
  "Level B": {
    level: "Level B",
    name: "AI-Informed",
    tagline: "Background Exploration & Clarification",
    description: "The user used AI for preliminary research, definitions, or clarifying concepts, while driving all core reasoning and conclusions independently.",
    badgeVariant: "secondary",
  },
  "Level C": {
    level: "Level C",
    name: "AI-Assisted",
    tagline: "Collaborative Thinking Partner",
    description: "The AI proposed perspectives, counter-arguments, or structure which the user critically scrutinized, refined, and synthesized into their own work.",
    badgeVariant: "outline",
  },
  "Level D": {
    level: "Level D",
    name: "AI-Generated",
    tagline: "Substantial AI Generation",
    description: "AI provided substantial portions of the final deliverable without sufficient evidence of independent human modification or critical validation.",
    badgeVariant: "destructive",
  },
  "Level E": {
    level: "Level E",
    name: "Unknown",
    tagline: "Insufficient Telemetry / Unclassified",
    description: "Evidence is incomplete or telemetry is unavailable to determine the exact degree of AI involvement.",
    badgeVariant: "outline",
  },
};

export interface ClassificationInput {
  aiRecord?: ChallengeAIAssistanceRecord | null;
  userDisclosure?: string | null;
  deliverables?: Record<string, string>;
  coachingSessionId?: string | null;
  explicitAssistanceLevel?: AIAssistanceLevel;
}

/**
 * Classifies the level of AI involvement based on telemetry, coaching logs, and user disclosures.
 * Never uses superficial "AI detectors". Honors user disclosures and explicit records.
 * Marks ambiguous or unverifiable cases as Level E (Unknown) to maintain transparency.
 */
export function classifyAIAssistance(input: ClassificationInput): {
  level: AIAssistanceLevel;
  confidence: number;
  rationale: string;
} {
  // If explicitly overridden or disclosed by the user with high fidelity
  if (input.explicitAssistanceLevel) {
    return {
      level: input.explicitAssistanceLevel,
      confidence: 0.95,
      rationale: `Classified based on explicit user declaration (${input.explicitAssistanceLevel}).`,
    };
  }

  // If no record exists at all
  if (!input.aiRecord && !input.coachingSessionId && !input.userDisclosure) {
    // If no assistance was recorded anywhere during the challenge attempt
    return {
      level: "Level A",
      confidence: 0.9,
      rationale: "No AI coaching or assistance sessions were initiated during this challenge attempt.",
    };
  }

  const record = input.aiRecord;
  const queriesCount = record?.queries_count ?? 0;
  const hintLevels = record?.hint_levels_used ?? [];
  const actionTypes = record?.action_types_used ?? [];
  const summary = record?.assistance_summary ?? "";

  // Check user disclosure if provided
  if (input.userDisclosure) {
    const disclosureLower = input.userDisclosure.toLowerCase();
    if (disclosureLower.includes("wholly independent") || disclosureLower.includes("no ai used")) {
      return {
        level: "Level A",
        confidence: 0.95,
        rationale: "User disclosed no AI assistance was utilized.",
      };
    }
    if (disclosureLower.includes("clarified concepts") || disclosureLower.includes("background context") || disclosureLower.includes("informed")) {
      return {
        level: "Level B",
        confidence: 0.9,
        rationale: "User disclosed AI was consulted for background inquiry and clarification.",
      };
    }
    if (disclosureLower.includes("brainstormed") || disclosureLower.includes("collaborative") || disclosureLower.includes("adapted suggestions")) {
      return {
        level: "Level C",
        confidence: 0.88,
        rationale: "User disclosed collaborative AI assistance with active critique and adaptation.",
      };
    }
  }

  // If query count is zero and no hints requested
  if (queriesCount === 0 && hintLevels.length === 0) {
    return {
      level: "Level A",
      confidence: 0.9,
      rationale: "Zero coaching queries or hints invoked during the task.",
    };
  }

  // Level B: Minimal coaching interaction, asking for clarification or Level 1 nudge
  const maxHintLevel = hintLevels.length > 0 ? Math.max(...hintLevels) : 0;
  const onlyClarifyingQueries = actionTypes.every(
    (act) => act.includes("clarify") || act.includes("definition") || act.includes("orient")
  );

  if (queriesCount <= 2 && maxHintLevel <= 1 && onlyClarifyingQueries) {
    return {
      level: "Level B",
      confidence: 0.85,
      rationale: `AI was used minimally for background clarification (${queriesCount} query, Level ${maxHintLevel} nudge). Core reasoning was driven independently.`,
    };
  }

  // Level C: Collaborative coaching engagement (Levels 2-3 hints, feedback, brainstorming)
  if (queriesCount <= 6 && maxHintLevel <= 3) {
    return {
      level: "Level C",
      confidence: 0.85,
      rationale: `AI provided guided scaffolding and alternative perspectives (${queriesCount} queries, progressive hint level ${maxHintLevel}). User critically incorporated guidance.`,
    };
  }

  // Level D: Heavy dependency (Level 4 direct answer/walkthrough or high query volume with direct copying)
  if (maxHintLevel >= 4 || queriesCount > 8 || actionTypes.includes("direct_solution")) {
    return {
      level: "Level D",
      confidence: 0.8,
      rationale: `Extensive AI assistance utilized (${queriesCount} queries, Level ${maxHintLevel} direct solution guidance). Independent reasoning cannot be confirmed without further review.`,
    };
  }

  // Default to Level C if moderate assistance with notes, otherwise Level E (Unknown)
  if (summary && summary.length > 10) {
    return {
      level: "Level C",
      confidence: 0.75,
      rationale: `AI coaching record indicates structured collaboration: ${summary}`,
    };
  }

  return {
    level: "Level E",
    confidence: 0.5,
    rationale: "Telemetry is ambiguous; classifying as Level E (Unknown) to prevent unwarranted assumptions.",
  };
}
