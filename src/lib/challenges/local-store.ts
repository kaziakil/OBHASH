import type {
  Challenge,
  ChallengeAttempt,
  ChallengeDraft,
  ChallengeSubmission,
  ChallengeEvaluation,
  ChallengeReflection,
  ChallengeAIAssistanceRecord,
} from "@/types/challenge";
import { CHALLENGE_CATALOG } from "./catalog";

// In-memory backing store for local development, demo sessions, and test suites
interface ChallengeStoreData {
  attempts: Map<string, ChallengeAttempt>;
  drafts: Map<string, ChallengeDraft>;
  submissions: Map<string, ChallengeSubmission>;
  evaluations: Map<string, ChallengeEvaluation>;
  reflections: Map<string, ChallengeReflection>;
  bookmarks: Set<string>; // key: `${userId}:${challengeId}`
  aiAssistance: Map<string, ChallengeAIAssistanceRecord>;
}

declare global {
  var __OBHASH_CHALLENGE_STORE__: ChallengeStoreData | undefined;
}

function getStore(): ChallengeStoreData {
  if (!globalThis.__OBHASH_CHALLENGE_STORE__) {
    const store: ChallengeStoreData = {
      attempts: new Map(),
      drafts: new Map(),
      submissions: new Map(),
      evaluations: new Map(),
      reflections: new Map(),
      bookmarks: new Set(),
      aiAssistance: new Map(),
    };

    // Seed an initial demo in-progress attempt for demo-user-1
    const demoAttempt1: ChallengeAttempt = {
      id: "demo-attempt-1",
      user_id: "demo-user-1",
      challenge_id: "ct-unproven-claim",
      challenge_version: 1,
      status: "in_progress",
      journey_activity_id: "act-ct-1",
      started_at: "2026-11-20T11:00:00.000Z",
      created_at: "2026-11-20T11:00:00.000Z",
      updated_at: "2026-11-20T11:30:00.000Z",
    };
    store.attempts.set(demoAttempt1.id, demoAttempt1);

    const demoDraft1: ChallengeDraft = {
      id: "draft-demo-1",
      attempt_id: demoAttempt1.id,
      user_id: "demo-user-1",
      notes: "Initial thoughts on the NeuroPulse case:\n- Small sample size (N=30) of self-selected tech workers\n- Co-intervention with morning meditation protocol is a massive confounder\n- No sham control group mentioned",
      deliverables: {
        core_claims: "Explicit Claim A: NeuroPulse increases daily deep focus duration by 42% through micro-vibrational stimulation.\nPremise 1: 30 self-selected workers reported feeling significantly more productive after 2 weeks.\nPremise 2: Daily morning meditation was also introduced simultaneously.",
        unstated_assumptions: "Unstated Assumption 1: Self-reported subjective productivity accurately reflects physiological focus duration.\nUnstated Assumption 2: The observed increase was caused by vibrations rather than the guided meditation or the psychological excitement of being in an experimental trial (Hawthorne effect).\nConfounding Factor 1: The guided morning meditation alone could easily account for a 40%+ perceived focus boost.\nConfounding Factor 2: Extreme self-selection bias among tech workers predisposed to optimize productivity.",
        evidence_standard: "An independent randomized, double-blind, sham-controlled trial (RCT) with at least 150 participants per arm. One arm receives the active micro-vibrational device, while the control arm receives an identical device that emits non-functional placebo tactile pulses.",
      },
      last_saved_at: "2026-11-20T11:25:00.000Z",
      updated_at: "2026-11-20T11:25:00.000Z",
    };
    store.drafts.set(demoAttempt1.id, demoDraft1);

    // Seed a completed demo attempt with submission, evaluation, and reflection
    const demoAttempt2: ChallengeAttempt = {
      id: "demo-attempt-completed",
      user_id: "demo-user-1",
      challenge_id: "cps-solve-differently",
      challenge_version: 1,
      status: "completed",
      journey_activity_id: "act-cps-1",
      started_at: "2026-11-19T09:00:00.000Z",
      submitted_at: "2026-11-19T10:00:00.000Z",
      completed_at: "2026-11-19T10:30:00.000Z",
      created_at: "2026-11-19T09:00:00.000Z",
      updated_at: "2026-11-19T10:30:00.000Z",
    };
    store.attempts.set(demoAttempt2.id, demoAttempt2);

    const demoSubmission2: ChallengeSubmission = {
      id: "sub-demo-2",
      attempt_id: demoAttempt2.id,
      user_id: "demo-user-1",
      challenge_id: "cps-solve-differently",
      challenge_version: 1,
      notes_snapshot: "Brainstorming food waste:\n- Why do people take too much food?\n- How can we predict how many students eat on Friday nights?",
      deliverables_snapshot: {
        three_distinct_solutions: "Concept A (Behavioral Nudge - 'Plate Downsizing & Trayless Dining'): Eliminating cafeteria dining trays entirely and reducing plate diameters from 28cm to 22cm. Studies show trayless dining immediately cuts food waste by 25% by preventing impulse loading.\n\nConcept B (Predictive Logistics - 'Micro-Demand Forecast App'): Integrate the student class schedule and weather forecast with culinary prep. Students tap a 1-click 'Attending dinner' button on their student app by 3 PM in exchange for 50 campus coffee reward points.\n\nConcept C (Incentive Restructuring - 'Clean Plate Mutual Credit'): Tables that finish all collected food without waste generate micro-donations funded by university sustainability grants to local food banks, displayed on real-time dining hall screens.",
        feasibility_and_friction: "The primary friction for Concept B is digital fatigue: students may forget to confirm dinner attendance if the reward is too low. Mitigation involves passive Bluetooth presence sensing at campus library exits around 4 PM to estimate dining hall arrival probabilities.",
      },
      submission_number: 1,
      submitted_at: "2026-11-19T10:00:00.000Z",
    };
    store.submissions.set(demoAttempt2.id, demoSubmission2);

    const demoEvaluation2: ChallengeEvaluation = {
      id: "eval-demo-2",
      submission_id: demoSubmission2.id,
      attempt_id: demoAttempt2.id,
      user_id: "demo-user-1",
      evaluator_type: "ai",
      evaluator_version: "1.0",
      strengths: [
        "Exceptional cognitive flexibility demonstrated across three genuinely distinct operating paradigms (behavioral, predictive, and incentive-based).",
        "Clear understanding of upstream root causes rather than defaulting to downstream leftover donation.",
        "Proactively identified human friction (digital fatigue) in the predictive concept.",
      ],
      growth_opportunities: [
        "Could expand on culinary staff operational resistance when transitioning to dynamic prep schedules.",
        "Consider potential unintended consequences of plate downsizing (e.g. students taking multiple plates).",
      ],
      evidence_citations: [
        {
          claim: "High cognitive flexibility across divergent paradigms",
          quote: "Concept A (Behavioral Nudge - 'Plate Downsizing & Trayless Dining') ... Concept B (Predictive Logistics) ... Concept C (Incentive Restructuring)",
          analysis: "Demonstrated clear lateral thinking by avoiding minor variations of the same donation scheme.",
        },
        {
          claim: "Realistic friction appraisal",
          quote: "The primary friction for Concept B is digital fatigue: students may forget to confirm dinner attendance",
          analysis: "Accurately anticipates real-world human adoption barriers rather than assuming frictionless compliance.",
        },
      ],
      alternative_perspectives: [
        "Consider a decentralized culinary repurposing angle: transforming day-old artisanal bread and vegetables into on-campus craft stocks, croutons, and dehydrated snacks sold at campus convenience stores.",
      ],
      recommended_next_steps: [
        "Explore how extreme physical and resource constraints can be integrated into your next challenge.",
        "Try the 'The Constraint Challenge: Zero-Electricity Vaccine Cold Chain' to push practical engineering reasoning.",
      ],
      dimension_evaluations: {
        "Idea Generation": {
          dimension: "Idea Generation",
          level: 4,
          label: "Mastery / Exemplary",
          evidence: "Generated 3 radically distinct, viable architectural concepts addressing upstream drivers.",
          guidance: "Continue challenging default domain assumptions in future problem-solving.",
        },
        "Originality": {
          dimension: "Originality",
          level: 3,
          label: "Proficient",
          evidence: "The clean plate mutual credit and passive presence sensing show strong inventive capability.",
          guidance: "Push further into non-linear systemic interventions.",
        },
        "Cognitive Flexibility": {
          dimension: "Cognitive Flexibility",
          level: 4,
          label: "Mastery / Exemplary",
          evidence: "Seamlessly shifted from psychological nudge architecture to predictive data logistics.",
          guidance: "Exemplary demonstration of multi-paradigm thinking.",
        },
      },
      confidence_score: 0.94,
      evidence_sufficiency: "sufficient",
      created_at: "2026-11-19T10:15:00.000Z",
    };
    store.evaluations.set(demoAttempt2.id, demoEvaluation2);

    const demoReflection2: ChallengeReflection = {
      id: "ref-demo-2",
      attempt_id: demoAttempt2.id,
      user_id: "demo-user-1",
      challenge_id: "cps-solve-differently",
      responses: {
        "Which idea was the easiest to think of, and how did you push beyond your first mental model?":
          "The trayless dining idea came first because I remembered reading about it in college. To push beyond that, I forced myself to think about data and algorithms, which led to the predictive attendance concept.",
        "How did constraining yourself to three different categories expand your creativity?":
          "It completely blocked me from just listing three different food donation organizations. It forced me to think like an engineer, an economist, and a behavioral psychologist in turn.",
      },
      is_submitted: true,
      submitted_at: "2026-11-19T10:30:00.000Z",
      created_at: "2026-11-19T10:30:00.000Z",
      updated_at: "2026-11-19T10:30:00.000Z",
    };
    store.reflections.set(demoAttempt2.id, demoReflection2);

    // Seed bookmark
    store.bookmarks.add("demo-user-1:ct-unproven-claim");
    store.bookmarks.add("demo-user-1:cur-unexpected-connections");

    // Seed AI Assistance record
    const demoAIAssistance: ChallengeAIAssistanceRecord = {
      id: "ai-assist-1",
      attempt_id: demoAttempt1.id,
      user_id: "demo-user-1",
      coaching_session_id: "demo-coach-session-1",
      queries_count: 2,
      hint_levels_used: [1],
      action_types_used: ["hint", "challenge"],
      assistance_summary: "User requested Level 1 directional hint on identifying confounding variables, followed by a constructive challenge on placebo effects.",
      created_at: "2026-11-20T11:15:00.000Z",
      updated_at: "2026-11-20T11:20:00.000Z",
    };
    store.aiAssistance.set(demoAttempt1.id, demoAIAssistance);

    globalThis.__OBHASH_CHALLENGE_STORE__ = store;
  }
  return globalThis.__OBHASH_CHALLENGE_STORE__;
}

export const challengeStore = {
  getChallenges: (): Challenge[] => {
    return CHALLENGE_CATALOG;
  },

  getChallengeById: (id: string): Challenge | null => {
    return CHALLENGE_CATALOG.find((c) => c.id === id || c.slug === id) || null;
  },

  getAttempt: (attemptId: string): ChallengeAttempt | null => {
    return getStore().attempts.get(attemptId) || null;
  },

  getUserAttempts: (userId: string): ChallengeAttempt[] => {
    return Array.from(getStore().attempts.values())
      .filter((a) => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  saveAttempt: (attempt: ChallengeAttempt): void => {
    getStore().attempts.set(attempt.id, attempt);
  },

  getDraft: (attemptId: string): ChallengeDraft | null => {
    return getStore().drafts.get(attemptId) || null;
  },

  saveDraft: (draft: ChallengeDraft): void => {
    getStore().drafts.set(draft.attempt_id, draft);
  },

  getSubmission: (attemptId: string): ChallengeSubmission | null => {
    return getStore().submissions.get(attemptId) || null;
  },

  saveSubmission: (submission: ChallengeSubmission): void => {
    getStore().submissions.set(submission.attempt_id, submission);
  },

  getEvaluation: (attemptId: string): ChallengeEvaluation | null => {
    return getStore().evaluations.get(attemptId) || null;
  },

  saveEvaluation: (evaluation: ChallengeEvaluation): void => {
    getStore().evaluations.set(evaluation.attempt_id, evaluation);
  },

  getReflection: (attemptId: string): ChallengeReflection | null => {
    return getStore().reflections.get(attemptId) || null;
  },

  saveReflection: (reflection: ChallengeReflection): void => {
    getStore().reflections.set(reflection.attempt_id, reflection);
  },

  getBookmarks: (userId: string): string[] => {
    const prefix = `${userId}:`;
    return Array.from(getStore().bookmarks)
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.slice(prefix.length));
  },

  isBookmarked: (userId: string, challengeId: string): boolean => {
    return getStore().bookmarks.has(`${userId}:${challengeId}`);
  },

  toggleBookmark: (userId: string, challengeId: string): boolean => {
    const key = `${userId}:${challengeId}`;
    if (getStore().bookmarks.has(key)) {
      getStore().bookmarks.delete(key);
      return false;
    } else {
      getStore().bookmarks.add(key);
      return true;
    }
  },

  getAIAssistance: (attemptId: string): ChallengeAIAssistanceRecord | null => {
    return getStore().aiAssistance.get(attemptId) || null;
  },

  recordAIAssistance: (
    attemptId: string,
    userId: string,
    actionType: string,
    hintLevel?: number,
    summary?: string
  ): ChallengeAIAssistanceRecord => {
    const store = getStore();
    let record = store.aiAssistance.get(attemptId);
    if (!record) {
      record = {
        id: `ai-assist-${Date.now()}`,
        attempt_id: attemptId,
        user_id: userId,
        queries_count: 0,
        hint_levels_used: [],
        action_types_used: [],
        assistance_summary: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    record.queries_count += 1;
    if (actionType && !record.action_types_used.includes(actionType)) {
      record.action_types_used.push(actionType);
    }
    if (hintLevel !== undefined && !record.hint_levels_used.includes(hintLevel)) {
      record.hint_levels_used.push(hintLevel);
    }
    if (summary) {
      record.assistance_summary = record.assistance_summary
        ? `${record.assistance_summary}; ${summary}`
        : summary;
    }
    record.updated_at = new Date().toISOString();
    store.aiAssistance.set(attemptId, record);
    return record;
  },
};
