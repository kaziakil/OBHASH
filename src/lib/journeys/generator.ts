/**
 * Pedagogical Rule Engine & Deterministic Journey Generator
 * Phase 4: Personalized Growth Journey Engine
 *
 * Implements deterministic prioritization, pedagogical sequencing, transparent
 * rationale generation, and structured growth journey synthesis.
 */

import type { AssessmentCapabilityKey } from "@/types/assessment";
import type {
  GrowthJourneyData,
  JourneyPersonalizationInput,
  ProposedCapabilityFocusArea,
  ProposedGoal,
  ProposedMilestone,
  ProposedPlannedActivity,
} from "@/types/journey";

interface DimensionPedagogy {
  dimensionSlug: string;
  dimensionName: string;
  goals: {
    title: string;
    description: string;
    expectedOutcome: string;
    milestones: {
      title: string;
      description: string;
      expectedOutcome: string;
      suggestedPeriod: string;
      activities: {
        title: string;
        description: string;
        purpose: string;
        estimatedMinutes: number;
      }[];
    }[];
  }[];
}

const PEDAGOGY_BANK: Record<AssessmentCapabilityKey, DimensionPedagogy[]> = {
  "critical-thinking": [
    {
      dimensionSlug: "evidence-evaluation",
      dimensionName: "Evidence Evaluation",
      goals: [
        {
          title: "Audit Methodological Rigor & Identify Confounders",
          description:
            "Build systematic habits to question sample validity, detect self-selection bias, and isolate unstated confounding variables in claims.",
          expectedOutcome:
            "Consistent ability to construct an evidentiary critique pointing out at least 2 potential confounders in empirical reports.",
          milestones: [
            {
              title: "Foundation: Isolating Correlation from Causation",
              description: "Practice identifying third-variable explanations in observational studies and pilot programs.",
              expectedOutcome: "Produce alternate causal explanations for 3 everyday assertions.",
              suggestedPeriod: "Weeks 1-2",
              activities: [
                {
                  title: "The Third-Factor Audit",
                  description:
                    "Take a popular tech or health claim and write down three confounding variables the authors did not control for.",
                  purpose: "Train cognitive skepticism against premature causal attribution.",
                  estimatedMinutes: 20,
                },
                {
                  title: "Spot the Omitted Baseline",
                  description:
                    "Analyze a public announcement containing percentage gains and calculate what the actual absolute numbers represent.",
                  purpose: "Recognize how relative percentages can distort perceived significance.",
                  estimatedMinutes: 25,
                },
              ],
            },
            {
              title: "Application: Auditing Conflicting Stakeholder Reports",
              description: "Examine competing reports on a controversial policy or organizational change.",
              expectedOutcome: "Map out the economic and reputational incentives behind opposing data presentations.",
              suggestedPeriod: "Weeks 3-4",
              activities: [
                {
                  title: "Incentive-Evidence Matrix",
                  description:
                    "Create a 2x2 matrix matching each stakeholder's stated finding against their organizational incentives.",
                  purpose: "Detect motivated reasoning and selective evidence curation.",
                  estimatedMinutes: 30,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      dimensionSlug: "analytical-reasoning",
      dimensionName: "Analytical Reasoning",
      goals: [
        {
          title: "Deconstruct Multi-Layered Systems into First Principles",
          description:
            "Break down complex operational or societal problems into fundamental axioms rather than reasoning by analogy.",
          expectedOutcome:
            "Clarity in isolating core functional constraints before evaluating proposed solutions.",
          milestones: [
            {
              title: "First-Principles Decomposition",
              description: "Strip an industry assumption down to its physical and mathematical truths.",
              expectedOutcome: "Identify which constraints are immutable laws vs legacy habits.",
              suggestedPeriod: "Weeks 1-2",
              activities: [
                {
                  title: "The Axiom Breakdown",
                  description:
                    "Select a standard industry practice in your field of interest and write down what must be physically true for it to work.",
                  purpose: "Separate fundamental truths from cultural inertia.",
                  estimatedMinutes: 25,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      dimensionSlug: "perspective-evaluation",
      dimensionName: "Perspective Evaluation",
      goals: [
        {
          title: "Construct Steel-Man Models of Counter-Perspectives",
          description:
            "Develop intellectual empathy by articulating the most persuasive argument for positions with which you initially disagree.",
          expectedOutcome:
            "Demonstrated capacity to defend opposing viewpoints with the same rigor as your own.",
          milestones: [
            {
              title: "Steel-Man Drafting",
              description: "Formulate the strongest arguments for an opposing perspective without straw-manning.",
              expectedOutcome: "Write a coherent defense of an uncongenial position.",
              suggestedPeriod: "Weeks 3-4",
              activities: [
                {
                  title: "The Adversarial Collaboration Brief",
                  description:
                    "Write a 250-word policy brief advocating the opposite of your personal belief on a contemporary debate.",
                  purpose: "Eliminate reflexive dismissal and identify genuine trade-offs.",
                  estimatedMinutes: 30,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  "creative-problem-solving": [
    {
      dimensionSlug: "idea-generation",
      dimensionName: "Idea Generation & Divergent Thinking",
      goals: [
        {
          title: "Generate High-Volume Divergent Solution Pools",
          description:
            "Overcome premature convergence by generating at least 10 distinct, non-trivial solutions before choosing a path.",
          expectedOutcome:
            "Comfort with generating diverse, radical possibilities before applying analytical constraints.",
          milestones: [
            {
              title: "Divergent Fluency Drills",
              description: "Practice rapid idea listing under zero-judgment conditions.",
              expectedOutcome: "Produce at least 10 structurally distinct concepts for a target challenge.",
              suggestedPeriod: "Weeks 1-2",
              activities: [
                {
                  title: "Crazy Eights Challenge",
                  description:
                    "Spend 8 minutes generating 8 distinct approaches to a community or workplace friction point.",
                  purpose: "Force cognition past obvious first-tier answers into novel territory.",
                  estimatedMinutes: 20,
                },
                {
                  title: "Constraint Inversion",
                  description:
                    "Take a problem with zero budget and imagine solving it with abundant resources, then reverse the exercise.",
                  purpose: "Reveal how artificial constraints unlock creative bypasses.",
                  estimatedMinutes: 25,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      dimensionSlug: "flexibility",
      dimensionName: "Cognitive Flexibility & Reframing",
      goals: [
        {
          title: "Reframe Unstructured Problems Across Cross-Disciplinary Domains",
          description:
            "Apply conceptual frameworks from biology, architecture, or game theory to resolve everyday organizational challenges.",
          expectedOutcome:
            "Ability to pivot cognitive frames when an initial problem-solving model stalls.",
          milestones: [
            {
              title: "Analogical Transfer",
              description: "Synthesize solutions by borrowing mechanisms from unrelated scientific systems.",
              expectedOutcome: "Draft an operational prototype inspired by ecological dynamics.",
              suggestedPeriod: "Weeks 3-4",
              activities: [
                {
                  title: "Biomimetic Problem Solving",
                  description:
                    "Look at how living organisms handle resource scarcity or waste removal, and translate that pattern to a modern process.",
                  purpose: "Broaden creative problem space through cross-domain pollination.",
                  estimatedMinutes: 30,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  "curiosity": [
    {
      dimensionSlug: "question-formulation",
      dimensionName: "Question Formulation",
      goals: [
        {
          title: "Develop High-Leverage Second-Order Inquiry Trees",
          description:
            "Transition from descriptive questions ('What is this?') to generative systemic questions ('What conditions allowed this to emerge?').",
          expectedOutcome:
            "Habitual generation of 5 diverse inquiry angles across technical, ethical, and sociological lenses.",
          milestones: [
            {
              title: "Hierarchical Question Mapping",
              description: "Deconstruct anomalous observations into multi-tier investigative pathways.",
              expectedOutcome: "Construct an inquiry map categorizing proximate vs root mechanisms.",
              suggestedPeriod: "Weeks 1-2",
              activities: [
                {
                  title: "The 5-Why Recursive Diagnostic",
                  description:
                    "Take a sudden failure or puzzling trend and ask 'Why?' across 5 consecutive causal iterations.",
                  purpose: "Unearth hidden institutional and structural incentives.",
                  estimatedMinutes: 25,
                },
                {
                  title: "Outlier Questioning",
                  description:
                    "Find data points that do not fit the common narrative and formulate 3 focused hypotheses explaining the anomaly.",
                  purpose: "Avoid discarding outlier signals in complex environments.",
                  estimatedMinutes: 20,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      dimensionSlug: "intellectual-openness",
      dimensionName: "Intellectual Openness & Exploration",
      goals: [
        {
          title: "Explore Unfamiliar Knowledge Frontiers with Humility",
          description:
            "Actively seek out foundational literature in fields outside your primary domain to challenge personal epistemological boundaries.",
          expectedOutcome:
            "Routine exploration of counter-intuitive theories without reflexive defense mechanisms.",
          milestones: [
            {
              title: "Cross-Disciplinary Immersion",
              description: "Read foundational texts or papers from an unfamiliar discipline.",
              expectedOutcome: "Summarize 3 mental models from the new field applicable to your current work.",
              suggestedPeriod: "Weeks 3-4",
              activities: [
                {
                  title: "The Unfamiliar Field Deep-Dive",
                  description:
                    "Spend 30 minutes reading an introductory paper in a domain you know nothing about (e.g. quantum cryptography, behavioral ecology).",
                  purpose: "Re-engage beginner's mind and stimulate associative discovery.",
                  estimatedMinutes: 30,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Synthesizes a deterministic personalized growth journey based on assessment evidence and profile inputs.
 */
export function generateDeterministicJourney(
  input: JourneyPersonalizationInput,
  userId = "user"
): GrowthJourneyData {
  const journeyId = `journey-${Date.now()}`;
  const now = new Date().toISOString();

  // 1. Determine capability areas to include
  const selectedCapabilities: AssessmentCapabilityKey[] =
    input.selectedCapabilities && input.selectedCapabilities.length > 0
      ? input.selectedCapabilities
      : ["critical-thinking", "creative-problem-solving", "curiosity"];

  // 2. Synthesize title based on capabilities and interests
  const capabilityNames = selectedCapabilities.map((c) => {
    if (c === "critical-thinking") return "Clear Reasoning";
    if (c === "creative-problem-solving") return "Creative Synthesis";
    return "Deep Inquiry";
  });
  const interestKeyword =
    input.userInterests && input.userInterests.length > 0 ? input.userInterests[0] : "Complex Challenges";

  const title = `${capabilityNames.join(" & ")}: Exploring ${interestKeyword}`;
  const description = `A personalized ${input.targetDuration || "8-week"} development journey structured around evidence from your baseline capability assessments. Designed to strengthen your independent reasoning, creative problem framing, and curiosity while applying them directly to ${interestKeyword}.`;

  // 3. Build focus areas
  const focusAreas: ProposedCapabilityFocusArea[] = [];
  const primaryPriorities: string[] = [];

  for (let i = 0; i < selectedCapabilities.length; i++) {
    const capKey = selectedCapabilities[i];
    const profile = input.assessmentProfiles.find((p) => p.capabilityKey === capKey);
    const pedagogyList = PEDAGOGY_BANK[capKey] || [];

    // Find strengths and development opportunities from assessment profile if available
    const hasBaseline = Boolean(profile);
    const overallScore = profile ? profile.overallScore.toFixed(2) : "Unassessed";
    const strengths = profile?.strengthsSummary || [];
    const opportunities = profile?.opportunitiesSummary || [];

    let rationale = "";
    if (hasBaseline) {
      rationale = `Your assessment revealed a baseline score of ${overallScore} (${profile?.performanceLevel}). ${
        strengths.length > 0 ? `Demonstrated strengths include: ${strengths[0]}. ` : ""
      }${
        opportunities.length > 0
          ? `Key developmental focus: ${opportunities[0]}.`
          : "Focusing on structured practice to build consistent mastery."
      }`;
    } else {
      rationale = `Self-selected capability area aligned with your growth intention to build self-reliant mastery in ${capKey.replace(
        "-",
        " "
      )}.`;
    }

    const capName =
      capKey === "critical-thinking"
        ? "Critical Thinking"
        : capKey === "creative-problem-solving"
        ? "Creative Problem-Solving"
        : "Curiosity";

    // Select goals from pedagogy bank
    const goals: ProposedGoal[] = [];
    const selectedDimensions: string[] = [];

    pedagogyList.slice(0, 2).forEach((dim, dimIdx) => {
      selectedDimensions.push(dim.dimensionSlug);
      primaryPriorities.push(dim.dimensionName);

      dim.goals.forEach((gTemplate, gIdx) => {
        const goalId = `goal-${capKey}-${dimIdx}-${gIdx}-${Date.now()}`;

        // Construct transparent recommendation rationale
        const reasonForRecommendation = hasBaseline
          ? `Selected because your baseline evaluation demonstrated readiness in adjacent reasoning (${overallScore}), and targeted practice in ${dim.dimensionName} will accelerate overall capability.`
          : `Aligned with your stated intention to develop ${capName} and your interest in exploring ${interestKeyword}.`;

        const milestones: ProposedMilestone[] = gTemplate.milestones.map((mTemplate, mIdx) => {
          const milestoneId = `ms-${capKey}-${dimIdx}-${gIdx}-${mIdx}`;
          const activities: ProposedPlannedActivity[] = mTemplate.activities.map((aTemplate, aIdx) => ({
            id: `act-${capKey}-${dimIdx}-${gIdx}-${mIdx}-${aIdx}`,
            goalId,
            milestoneId,
            capabilityKey: capKey,
            title: aTemplate.title,
            description: aTemplate.description,
            purpose: aTemplate.purpose,
            estimatedMinutes: aTemplate.estimatedMinutes,
            suggestedOrder: aIdx,
            status: "not_started",
          }));

          return {
            id: milestoneId,
            goalId,
            title: mTemplate.title,
            description: mTemplate.description,
            expectedOutcome: mTemplate.expectedOutcome,
            suggestedPeriod: mTemplate.suggestedPeriod,
            status: "not_started",
            orderIndex: mIdx,
            activities,
          };
        });

        goals.push({
          id: goalId,
          focusAreaId: `fa-${capKey}-${i}`,
          capabilityKey: capKey,
          dimensionSlug: dim.dimensionSlug,
          title: gTemplate.title,
          description: gTemplate.description,
          reasonForRecommendation,
          expectedOutcome: gTemplate.expectedOutcome,
          priority: gIdx === 0 ? "high" : "medium",
          status: "not_started",
          orderIndex: gIdx,
          milestones,
          activities: [],
        });
      });
    });

    focusAreas.push({
      id: `fa-${capKey}-${i}`,
      capabilityKey: capKey,
      capabilityName: capName,
      rationale,
      selectedDimensions,
      intendedOutcomes: [
        `Develop independent confidence in evaluating complex claims within ${interestKeyword}`,
        `Consistently recognize and overcome cognitive biases before arriving at conclusions`,
      ],
      priority: i + 1,
      status: "active",
      goals,
    });
  }

  return {
    id: journeyId,
    userId,
    assessmentAttemptId: input.assessmentProfiles[0]?.assessedAt || null,
    title,
    description,
    status: "active",
    targetDuration: input.targetDuration || "8 weeks",
    weeklyCommitmentHours: input.weeklyCommitmentHours || "3-4 hours/week",
    capabilityKeys: selectedCapabilities,
    primaryPriorities: Array.from(new Set(primaryPriorities)).slice(0, 4),
    focusAreas,
    createdAt: now,
    updatedAt: now,
    generationMetadata: {
      provider: "deterministic",
      modelName: "obhash-pedagogy-v1",
      generationType: "deterministic-fallback",
      createdAt: now,
    },
  };
}
