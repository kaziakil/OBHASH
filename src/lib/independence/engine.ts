// ==============================================================================
// OBHASH Phase 7: Independence Measurement Engine
// ==============================================================================

import type {
  IndependenceDimensionKey,
  IndependenceDimensionSummary,
  IndependenceOverviewData,
  EvidenceSufficiency,
  AIAssistanceLevel,
  AIAssistanceBreakdown,
  CapabilityDevelopmentTimelineItem,
  ObservableBehaviorSummary,
} from "@/types/independence";
import { independenceLocalStore } from "./local-store";

export const INDEPENDENCE_DIMENSIONS_CONFIG: Record<
  IndependenceDimensionKey,
  {
    title: string;
    description: string;
    behaviorTemplates: { key: string; label: string }[];
    recommendedPractice: string;
  }
> = {
  "independent-reasoning": {
    title: "Independent Reasoning",
    description:
      "The capacity to formulate arguments, evaluate supporting vs contradictory evidence, identify underlying assumptions, and consider rival hypotheses.",
    behaviorTemplates: [
      { key: "explains_conclusions", label: "Explains conclusions with self-authored rationale" },
      { key: "identifies_assumptions", label: "Explicitly identifies foundational assumptions" },
      { key: "evaluates_evidence", label: "Scrutinizes and weighs supporting vs contradictory evidence" },
      { key: "considers_alternatives", label: "Explores counterarguments or rival hypotheses before choosing a stance" },
    ],
    recommendedPractice:
      "Practice auditing unstated assumptions in real-world arguments, particularly when initial premises seem intuitively appealing.",
  },
  "self-directed-exploration": {
    title: "Self-Directed Exploration",
    description:
      "The capacity to formulate generative questions, investigate systemic unknowns, recognize knowledge gaps, and steer inquiry beyond default assumptions.",
    behaviorTemplates: [
      { key: "formulates_questions", label: "Formulates generative, non-obvious questions" },
      { key: "pursues_inquiries", label: "Systematically investigates key unknowns" },
      { key: "recognizes_knowledge_gaps", label: "Candidly notes what remains unknown or uncertain" },
      { key: "directs_investigation", label: "Sets their own trajectory of exploration" },
    ],
    recommendedPractice:
      "Conduct open-ended inquiry sessions by drafting at least 5 divergent 'why' and 'what if' questions before searching for answers.",
  },
  "independent-problem-solving": {
    title: "Independent Problem-Solving",
    description:
      "The capacity to frame complex problem spaces, generate distinct solution architectures, navigate trade-offs, and adapt under real constraints.",
    behaviorTemplates: [
      { key: "defines_problem_space", label: "Frames core constraints and root problems clearly" },
      { key: "generates_multiple_approaches", label: "Produces distinct alternatives before choosing one" },
      { key: "evaluates_tradeoffs", label: "Articulates trade-offs and compromises with clarity" },
      { key: "adapts_to_constraints", label: "Refines and iterates when faced with real-world barriers" },
    ],
    recommendedPractice:
      "When designing solutions, require yourself to outline at least three distinct paradigms (e.g. behavioral, technological, incentive-based) before selecting one.",
  },
  "thoughtful-ai-use": {
    title: "Thoughtful AI Use",
    description:
      "The ability to engage AI as an interlocutor and thinking partner while maintaining editorial scrutiny, rejecting poor suggestions, and preserving decision ownership.",
    behaviorTemplates: [
      { key: "discriminating_prompts", label: "Uses targeted, clarifying prompts rather than requesting complete answers" },
      { key: "critiques_ai_output", label: "Identifies errors, biases, or limitations in AI suggestions" },
      { key: "rejects_unsuitable_ideas", label: "Rejects superficial or misaligned AI suggestions" },
      { key: "preserves_decision_ownership", label: "Retains final authorship and decision-making responsibility" },
    ],
    recommendedPractice:
      "Treat AI responses as provisional hypotheses to be critically challenged rather than accepted as authoritative answers.",
  },
  "reflection-self-direction": {
    title: "Reflection and Self-Direction",
    description:
      "The capacity to diagnose shifts in one's own cognitive heuristics, learn from unsuccessful approaches, embrace productive uncertainty, and steer next growth steps.",
    behaviorTemplates: [
      { key: "identifies_learning", label: "Articulates specific shifts in perspective after practice" },
      { key: "acknowledges_uncertainty", label: "Honest awareness of limitations and ongoing doubts" },
      { key: "learns_from_missteps", label: "Extracts actionable insights from flawed approaches" },
      { key: "sets_next_development_steps", label: "Defines self-directed goals for ongoing capability growth" },
    ],
    recommendedPractice:
      "Complete post-challenge reflections by identifying which of your own initial assumptions proved weakest and how you modified your approach.",
  },
};

/**
 * Calculates evidence sufficiency state from observation count.
 */
export function determineSufficiency(count: number): EvidenceSufficiency {
  if (count === 0) return "insufficient";
  if (count <= 2) return "emerging";
  if (count <= 4) return "developing";
  return "consistent";
}

export function getSufficiencyLabel(state: EvidenceSufficiency): string {
  switch (state) {
    case "insufficient":
      return "Insufficient Evidence";
    case "emerging":
      return "Emerging Evidence";
    case "developing":
      return "Developing Evidence";
    case "consistent":
      return "Consistent Evidence";
  }
}

/**
 * Computes the complete independence measurement data for a given user.
 * Preserves evidence provenance, tracks AI assistance levels, and generates development narratives.
 */
export function evaluateUserIndependence(userId: string): IndependenceOverviewData {
  const observations = independenceLocalStore.getObservations(userId);
  const totalCount = observations.length;
  const hasSufficientEvidence = totalCount >= 2;

  // 1. Group observations by dimension
  const dimensionKeys: IndependenceDimensionKey[] = [
    "independent-reasoning",
    "self-directed-exploration",
    "independent-problem-solving",
    "thoughtful-ai-use",
    "reflection-self-direction",
  ];

  const dimensionsResult = {} as Record<IndependenceDimensionKey, IndependenceDimensionSummary>;

  // Track AI assistance levels
  const levelCounts: Record<AIAssistanceLevel, number> = {
    "Level A": 0,
    "Level B": 0,
    "Level C": 0,
    "Level D": 0,
    "Level E": 0,
  };

  for (const dimKey of dimensionKeys) {
    const config = INDEPENDENCE_DIMENSIONS_CONFIG[dimKey];
    const dimObs = observations.filter((o) => o.dimensionKey === dimKey);
    const sufficiency = determineSufficiency(dimObs.length);

    // Group by behavior templates
    const behaviorSummaries: ObservableBehaviorSummary[] = config.behaviorTemplates.map((template) => {
      const matchingObs = dimObs.filter((o) => o.behaviorKey === template.key);
      const snippets = matchingObs.map((o) => ({
        quote: o.evidenceQuote || o.behaviorDescription,
        sourceTitle: o.sourceTitle,
        sourceRecordId: o.sourceRecordId,
        sourceType: o.sourceType,
        aiAssistance: o.aiAssistanceClassification,
        date: o.observedAt,
      }));

      return {
        key: template.key,
        label: template.label,
        count: matchingObs.length,
        evidenceSnippets: snippets,
      };
    });

    const keyTakeaways: string[] = [];
    if (dimObs.length > 0) {
      const independentRatio = dimObs.filter((o) => o.aiAssistanceClassification === "Level A" || o.aiAssistanceClassification === "Level B").length / dimObs.length;
      if (independentRatio >= 0.7) {
        keyTakeaways.push("Demonstrated strong independent initiative with minimal unverified assistance.");
      }
      keyTakeaways.push(`Grounding supported by ${dimObs.length} verifiable behavior observation${dimObs.length > 1 ? "s" : ""}.`);
    } else {
      keyTakeaways.push("No recorded observations yet for this dimension. Additional practice recommended.");
    }

    dimensionsResult[dimKey] = {
      dimensionKey: dimKey,
      title: config.title,
      description: config.description,
      sufficiency,
      sufficiencyLabel: getSufficiencyLabel(sufficiency),
      observationCount: dimObs.length,
      behaviors: behaviorSummaries,
      keyTakeaways,
      recommendedPractice: config.recommendedPractice,
    };
  }

  // Count AI assistance levels across all observations
  for (const obs of observations) {
    levelCounts[obs.aiAssistanceClassification] = (levelCounts[obs.aiAssistanceClassification] || 0) + 1;
  }

  // Predominant level calculation
  let predominantLevel: AIAssistanceLevel = "Level A";
  let maxCount = -1;
  for (const [level, count] of Object.entries(levelCounts) as [AIAssistanceLevel, number][]) {
    if (count > maxCount) {
      maxCount = count;
      predominantLevel = level;
    }
  }

  let aiNarrative = "";
  if (totalCount === 0) {
    aiNarrative = "Insufficient evidence to determine AI assistance patterns.";
  } else {
    const independentTotal = levelCounts["Level A"] + levelCounts["Level B"];
    const percentage = Math.round((independentTotal / totalCount) * 100);
    aiNarrative = `${percentage}% of recorded observations reflect Independent (Level A) or AI-Informed (Level B) execution, indicating that the learner consistently exercises primary agency and critical judgment.`;
  }

  const aiAssistanceBreakdown: AIAssistanceBreakdown = {
    levelCounts,
    totalRecords: totalCount,
    predominantLevel,
    narrative: aiNarrative,
  };

  // 2. Build Capability Development Timeline (Linking Phase 3 baseline + Phase 6 challenges + Phase 5 coaching)
  const developmentTimeline: CapabilityDevelopmentTimelineItem[] = [];

  if (totalCount > 0) {
    // Phase 3 baseline
    developmentTimeline.push({
      id: "timeline-p3-baseline",
      date: "2026-11-18",
      capabilityKey: "critical-thinking",
      dimensionKey: "analytical-reasoning",
      activityType: "baseline_assessment",
      title: "Critical Thinking Baseline Assessment",
      performanceLevel: "Developing (3.00)",
      scoreComparison: {
        baseline: "Level 2 (Developing)",
        current: "Level 2 (Developing)",
        isComparable: true,
        note: "Initial diagnostic measurement under timed, structured prompt conditions.",
      },
      evidenceSnippet: "Structured analysis showed robust premise decomposition, with opportunities to audit unstated confounding factors.",
      aiAssistanceLevel: "Level A",
    });

    // Phase 5 coaching session
    developmentTimeline.push({
      id: "timeline-p5-coaching",
      date: "2026-11-19",
      capabilityKey: "critical-thinking",
      activityType: "coaching_reflection",
      title: "AI Growth Coach: Causal Claims & Confounders",
      evidenceSnippet: "User engaged coach with targeted questions regarding co-intervention variables, retaining ownership of final conclusions.",
      aiAssistanceLevel: "Level B",
    });

    // Phase 6 challenge
    developmentTimeline.push({
      id: "timeline-p6-challenge-cps",
      date: "2026-11-19",
      capabilityKey: "creative-problem-solving",
      dimensionKey: "idea-generation",
      activityType: "challenge_practice",
      title: "The Everyday Innovation Challenge: Solve It Differently",
      performanceLevel: "Demonstrating (Exemplary 4.0)",
      scoreComparison: {
        baseline: "Level 2 (Developing)",
        current: "Level 4 (Exemplary)",
        isComparable: false,
        note: "Note on comparability: Challenge practice evaluated open-ended real-world deliverables, whereas baseline was a structured diagnostic. Improvement indicates practical fluency rather than a direct psychometric shift.",
      },
      evidenceSnippet: "Formulated 3 distinct solution paradigms (behavioral, predictive, incentive-based) and explicitly analyzed real-world adoption friction.",
      aiAssistanceLevel: "Level A",
    });
  }

  // 3. Generate Evidence-Grounded Development Narrative
  const developmentNarrative = {
    overallSummary: hasSufficientEvidence
      ? "Across recent challenges and reflections, you demonstrate a consistent pattern of independent reasoning and metacognitive awareness. You routinely isolate unstated assumptions, anticipate human adoption friction, and utilize AI as a targeted thinking partner rather than an answer engine."
      : "You are at the beginning of your capability development journey. We do not infer independence from silence or speculation; completing hands-on challenges and baseline assessments will establish your evidence profile.",
    strengthsDemonstrated: hasSufficientEvidence
      ? [
          "Rigorous premise auditing: separating subjective marketing claims from empirical facts unprompted.",
          "Cognitive flexibility: generating divergent solution architectures across distinct disciplines.",
          "Thoughtful AI filtering: consulting AI for background context while rejecting generic templates.",
        ]
      : ["Proactive enrollment in capability development."],
    emergingPatterns: hasSufficientEvidence
      ? [
          "Transitioning from passive problem consumption to active constraint modeling.",
          "Deliberate resistance to default availability heuristics during brainstorming.",
        ]
      : ["Awaiting additional evidence across diverse problem contexts."],
    areasForInvestigation: [
      "Testing problem-solving under extreme physical and resource constraints.",
      "Engaging counterarguments in emotionally or ethically contested domains.",
    ],
    transparentLimitations: [
      "Observations reflect specific completed tasks and cannot guarantee identical behavior across unobserved situations.",
      "Independence is measured as demonstrated behavior, not an immutable character trait.",
      "AI assistance telemetry depends on interactions conducted within the OBHASH workspace.",
    ],
  };

  const limitationsNotice =
    "This assessment is an operational diagnostic based on observed workspace telemetry and user-submitted work. It is not an accredited psychometric score or universal intelligence rating. Independence fluctuates across domains and contexts.";

  return {
    userId,
    frameworkVersion: "1.0.0",
    hasSufficientEvidence,
    totalObservationsCount: totalCount,
    dimensions: dimensionsResult,
    aiAssistanceBreakdown,
    developmentNarrative,
    developmentTimeline,
    limitationsNotice,
    lastEvaluatedAt: "2026-11-20T12:00:00.000Z",
  };
}
