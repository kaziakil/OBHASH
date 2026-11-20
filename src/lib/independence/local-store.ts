// ==============================================================================
// OBHASH Phase 7: Local In-Memory Store for Independence Measurements
// ==============================================================================

import type {
  IndependenceObservation,
  IndependenceOverviewData,
} from "@/types/independence";

interface IndependenceStoreData {
  observations: Map<string, IndependenceObservation[]>; // userId -> observations
  snapshots: Map<string, IndependenceOverviewData[]>; // userId -> historical snapshots
}

declare global {
  var __OBHASH_INDEPENDENCE_STORE__: IndependenceStoreData | undefined;
}

function getStore(): IndependenceStoreData {
  if (!globalThis.__OBHASH_INDEPENDENCE_STORE__) {
    const store: IndependenceStoreData = {
      observations: new Map(),
      snapshots: new Map(),
    };

    // Seed comprehensive evidence observations for demo user (mapping demo-user-1 / demo-user)
    const demoUserId = "demo-user-1";
    const demoObservations: IndependenceObservation[] = [
      // 1. Independent Reasoning
      {
        id: "obs-ir-1",
        userId: demoUserId,
        dimensionKey: "independent-reasoning",
        behaviorKey: "identifies_assumptions",
        behaviorDescription: "Identified unstated assumptions and confounding factors in empirical claims",
        sourceType: "challenge_submission",
        sourceRecordId: "sub-demo-2",
        sourceTitle: "The Everyday Innovation Challenge: Solve It Differently",
        evidenceQuote: "Unstated Assumption: Self-reported subjective productivity accurately reflects physiological focus duration. Confounding Factor: Extreme self-selection bias among tech workers predisposed to optimize productivity.",
        evidenceAnalysis: "Separated explicit marketing claims from hidden physiological assumptions without accepting promotional premises.",
        aiAssistanceClassification: "Level A",
        aiAssistanceNotes: "Formulated unprompted during preliminary draft and final synthesis.",
        confidenceScore: 0.94,
        observedAt: "2026-11-19T10:00:00.000Z",
        createdAt: "2026-11-19T10:00:00.000Z",
      },
      {
        id: "obs-ir-2",
        userId: demoUserId,
        dimensionKey: "independent-reasoning",
        behaviorKey: "considers_alternatives",
        behaviorDescription: "Explored rival hypotheses and multiple operating paradigms before selecting a conclusion",
        sourceType: "challenge_submission",
        sourceRecordId: "sub-demo-2",
        sourceTitle: "The Everyday Innovation Challenge: Solve It Differently",
        evidenceQuote: "Concept A (Behavioral Nudge - 'Plate Downsizing') ... Concept B (Predictive Logistics - 'Micro-Demand Forecast App') ... Concept C (Incentive Restructuring)",
        evidenceAnalysis: "Evaluated 3 radically distinct hypotheses rather than iterating on variations of a single donation model.",
        aiAssistanceClassification: "Level A",
        aiAssistanceNotes: "Authored in deliverables snapshot without external generation.",
        confidenceScore: 0.92,
        observedAt: "2026-11-19T10:05:00.000Z",
        createdAt: "2026-11-19T10:05:00.000Z",
      },
      {
        id: "obs-ir-3",
        userId: demoUserId,
        dimensionKey: "independent-reasoning",
        behaviorKey: "explains_conclusions",
        behaviorDescription: "Explained conclusions using logical causal chains rather than assertions",
        sourceType: "assessment_evaluation",
        sourceRecordId: "eval-ct-baseline",
        sourceTitle: "Critical Thinking Baseline Assessment",
        evidenceQuote: "Systematically decomposed premise validity and identified causal leap between observation and recommendation.",
        evidenceAnalysis: "Demonstrated clear internal validity auditing during baseline structured reasoning.",
        aiAssistanceClassification: "Level A",
        aiAssistanceNotes: "Completed during supervised baseline assessment module.",
        confidenceScore: 0.9,
        observedAt: "2026-11-18T14:30:00.000Z",
        createdAt: "2026-11-18T14:30:00.000Z",
      },

      // 2. Self-Directed Exploration
      {
        id: "obs-sde-1",
        userId: demoUserId,
        dimensionKey: "self-directed-exploration",
        behaviorKey: "formulates_questions",
        behaviorDescription: "Formulated non-obvious questions examining systemic root causes",
        sourceType: "challenge_submission",
        sourceRecordId: "sub-demo-2",
        sourceTitle: "The Everyday Innovation Challenge: Solve It Differently",
        evidenceQuote: "Brainstorming food waste: Why do people take too much food? How can we predict how many students eat on Friday nights?",
        evidenceAnalysis: "Pivoted from symptoms (waste on plates) to root causes (predictive forecasting and portion psychology).",
        aiAssistanceClassification: "Level A",
        aiAssistanceNotes: "Extracted directly from user workspace notes.",
        confidenceScore: 0.88,
        observedAt: "2026-11-19T09:20:00.000Z",
        createdAt: "2026-11-19T09:20:00.000Z",
      },
      {
        id: "obs-sde-2",
        userId: demoUserId,
        dimensionKey: "self-directed-exploration",
        behaviorKey: "recognizes_knowledge_gaps",
        behaviorDescription: "Recognized gaps in observational data and recommended rigorous verification standards",
        sourceType: "challenge_submission",
        sourceRecordId: "sub-demo-2",
        sourceTitle: "The Everyday Innovation Challenge: Solve It Differently",
        evidenceQuote: "The primary friction for Concept B is digital fatigue: students may forget to confirm dinner attendance if the reward is too low.",
        evidenceAnalysis: "Openly identified unknown user adoption friction instead of assuming uncritical compliance.",
        aiAssistanceClassification: "Level B",
        aiAssistanceNotes: "Informed by behavioral nudge literature, synthesized independently.",
        confidenceScore: 0.89,
        observedAt: "2026-11-19T09:45:00.000Z",
        createdAt: "2026-11-19T09:45:00.000Z",
      },

      // 3. Independent Problem-Solving
      {
        id: "obs-ips-1",
        userId: demoUserId,
        dimensionKey: "independent-problem-solving",
        behaviorKey: "generates_multiple_approaches",
        behaviorDescription: "Generated multiple mutually independent solution architectures",
        sourceType: "challenge_submission",
        sourceRecordId: "sub-demo-2",
        sourceTitle: "The Everyday Innovation Challenge: Solve It Differently",
        evidenceQuote: "Plate Downsizing (Behavioral) vs Micro-Demand App (Logistics) vs Clean Plate Mutual Credit (Incentive).",
        evidenceAnalysis: "Demonstrated broad generative problem framing across multiple distinct disciplines.",
        aiAssistanceClassification: "Level A",
        aiAssistanceNotes: "Evaluator noted mastery level across three distinct paradigms.",
        confidenceScore: 0.95,
        observedAt: "2026-11-19T10:00:00.000Z",
        createdAt: "2026-11-19T10:00:00.000Z",
      },
      {
        id: "obs-ips-2",
        userId: demoUserId,
        dimensionKey: "independent-problem-solving",
        behaviorKey: "evaluates_tradeoffs",
        behaviorDescription: "Evaluated practical trade-offs and operational friction under constraints",
        sourceType: "challenge_submission",
        sourceRecordId: "sub-demo-2",
        sourceTitle: "The Everyday Innovation Challenge: Solve It Differently",
        evidenceQuote: "Mitigation involves passive Bluetooth presence sensing at campus library exits around 4 PM to estimate dining hall arrival probabilities without demanding manual user inputs.",
        evidenceAnalysis: "Balanced user cognitive burden against forecasting accuracy, choosing ambient telemetry.",
        aiAssistanceClassification: "Level B",
        aiAssistanceNotes: "User independently generated ambient sensor compromise to solve digital fatigue.",
        confidenceScore: 0.91,
        observedAt: "2026-11-19T10:10:00.000Z",
        createdAt: "2026-11-19T10:10:00.000Z",
      },

      // 4. Thoughtful AI Use
      {
        id: "obs-tau-1",
        userId: demoUserId,
        dimensionKey: "thoughtful-ai-use",
        behaviorKey: "discriminating_prompts",
        behaviorDescription: "Asked targeted, clarifying questions rather than requesting generic solutions",
        sourceType: "coaching_session",
        sourceRecordId: "demo-coach-session-1",
        sourceTitle: "AI Growth Coach: Causal Claims & Confounding Variables",
        evidenceQuote: "How do I rigorously distinguish whether a 42% productivity gain is from micro-vibrations or the concurrent meditation habit?",
        evidenceAnalysis: "Used AI to test conceptual boundaries on co-intervention rather than asking for pre-written analysis.",
        aiAssistanceClassification: "Level B",
        aiAssistanceNotes: "Consulted AI for method clarification; user retained reasoning trajectory.",
        confidenceScore: 0.92,
        observedAt: "2026-11-20T11:15:00.000Z",
        createdAt: "2026-11-20T11:15:00.000Z",
      },
      {
        id: "obs-tau-2",
        userId: demoUserId,
        dimensionKey: "thoughtful-ai-use",
        behaviorKey: "preserves_decision_ownership",
        behaviorDescription: "Maintained critical ownership of final positions, rejecting superficial AI completions",
        sourceType: "challenge_submission",
        sourceRecordId: "sub-demo-2",
        sourceTitle: "The Everyday Innovation Challenge: Solve It Differently",
        evidenceQuote: "Used AI suggestion on trayless dining, but rejected standard food redistribution apps to develop a mutual credit system tied to local food banks.",
        evidenceAnalysis: "Demonstrated discriminating filter over AI generation, adapting concepts to higher systemic leverage.",
        aiAssistanceClassification: "Level C",
        aiAssistanceNotes: "Collaborative synthesis with verified human editorial judgment.",
        confidenceScore: 0.88,
        observedAt: "2026-11-19T10:20:00.000Z",
        createdAt: "2026-11-19T10:20:00.000Z",
      },

      // 5. Reflection and Self-Direction
      {
        id: "obs-rsd-1",
        userId: demoUserId,
        dimensionKey: "reflection-self-direction",
        behaviorKey: "identifies_learning",
        behaviorDescription: "Recognized shifts in their own thinking and cognitive barriers",
        sourceType: "challenge_reflection",
        sourceRecordId: "ref-demo-2",
        sourceTitle: "Reflection: Everyday Innovation Challenge",
        evidenceQuote: "It completely blocked me from just listing three different food donation organizations. It forced me to think like an engineer, an economist, and a behavioral psychologist in turn.",
        evidenceAnalysis: "Articulated how constraints forced cross-disciplinary cognitive shifts.",
        aiAssistanceClassification: "Level A",
        aiAssistanceNotes: "Self-authored post-challenge reflection.",
        confidenceScore: 0.96,
        observedAt: "2026-11-19T10:30:00.000Z",
        createdAt: "2026-11-19T10:30:00.000Z",
      },
      {
        id: "obs-rsd-2",
        userId: demoUserId,
        dimensionKey: "reflection-self-direction",
        behaviorKey: "acknowledges_uncertainty",
        behaviorDescription: "Acknowledged limitations of initial heuristics and pushed beyond familiarity",
        sourceType: "challenge_reflection",
        sourceRecordId: "ref-demo-2",
        sourceTitle: "Reflection: Everyday Innovation Challenge",
        evidenceQuote: "The trayless dining idea came first because I remembered reading about it in college. To push beyond that, I forced myself to think about data and algorithms.",
        evidenceAnalysis: "Consciously diagnosed availability heuristic and deliberately steered inquiry into unfamiliar territory.",
        aiAssistanceClassification: "Level A",
        aiAssistanceNotes: "Self-authored metacognitive evaluation.",
        confidenceScore: 0.93,
        observedAt: "2026-11-19T10:30:00.000Z",
        createdAt: "2026-11-19T10:30:00.000Z",
      },
    ];

    store.observations.set(demoUserId, demoObservations);
    // Also associate with demo-user
    store.observations.set("demo-user", demoObservations);

    globalThis.__OBHASH_INDEPENDENCE_STORE__ = store;
  }
  return globalThis.__OBHASH_INDEPENDENCE_STORE__;
}

export const independenceLocalStore = {
  getObservations(userId: string): IndependenceObservation[] {
    const store = getStore();
    const effectiveUserId = (userId === "demo-user" || userId === "demo-user-1") ? "demo-user-1" : userId;
    return store.observations.get(effectiveUserId) || [];
  },

  addObservation(observation: IndependenceObservation) {
    const store = getStore();
    const existing = store.observations.get(observation.userId) || [];
    existing.push(observation);
    store.observations.set(observation.userId, existing);
  },

  saveSnapshot(userId: string, data: IndependenceOverviewData) {
    const store = getStore();
    const existing = store.snapshots.get(userId) || [];
    existing.unshift(data);
    store.snapshots.set(userId, existing);
  },

  getSnapshots(userId: string): IndependenceOverviewData[] {
    const store = getStore();
    return store.snapshots.get(userId) || [];
  },

  clearUserEvidence(userId: string) {
    const store = getStore();
    store.observations.set(userId, []);
    store.snapshots.set(userId, []);
  },
};
