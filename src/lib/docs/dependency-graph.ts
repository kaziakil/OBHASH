import type { DependencyNode, DependencyEdge } from "@/types/docs";

/**
 * OBHASH Dependency Graph — Authoritative Multi-Tier Relational Map
 * Connects Applications, Shared Engines, Components, APIs, Data Entities, and Roadmap Work Packages.
 * Only verified relationships are present.
 */

export const DEPENDENCY_NODES: DependencyNode[] = [
  // 1. Applications
  {
    id: "app-01",
    code: "APP-01",
    name: "Career Readiness",
    category: "Application",
    description: "Executive decision-making, workplace reasoning, and strategic memo challenges.",
    owner: "Kazi (Lead Architect)",
    status: "Operational",
  },
  {
    id: "app-02",
    code: "APP-02",
    name: "Creative Development",
    category: "Application",
    description: "Constraint-breaking ideation, lateral divergence, and contrarian sparring.",
    owner: "Marcus Vance",
    status: "Operational",
  },
  {
    id: "app-03",
    code: "APP-03",
    name: "Critical Thinking",
    category: "Application",
    description: "Argument deconstruction, fallacy detection, and verbatim evidence analysis.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "app-04",
    code: "APP-04",
    name: "Lifelong Learning",
    category: "Application",
    description: "Self-directed inquiry navigation, mental model cross-pollination, and curiosity trails.",
    owner: "Marcus Vance",
    status: "Operational",
  },
  {
    id: "app-05",
    code: "APP-05",
    name: "Personal Development",
    category: "Application",
    description: "Metacognitive calibration, emotional self-regulation, and cognitive stamina.",
    owner: "Kazi",
    status: "Operational",
  },

  // 2. Shared Core Engines
  {
    id: "eng-01",
    code: "ENG-01",
    name: "Human Capability Engine",
    category: "Engine",
    description: "Standardized competency ontologies, 4-tier rubrics, and capability taxonomies.",
    owner: "Marcus Vance",
    status: "Operational",
  },
  {
    id: "eng-02",
    code: "ENG-02",
    name: "AI Intelligence Engine",
    category: "Engine",
    description: "Socratic coaching dialogue, 4-tier progressive hints, and prompt isolation fences.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "eng-03",
    code: "ENG-03",
    name: "Assessment Engine",
    category: "Engine",
    description: "Diagnostic scenario runner, automated rubric scoring, and verbatim citation extraction.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "eng-04",
    code: "ENG-04",
    name: "Personalization Engine",
    category: "Engine",
    description: "Adaptive developmental roadmaps, prerequisite sequencing, and challenge matching.",
    owner: "Kazi",
    status: "Operational",
  },
  {
    id: "eng-05",
    code: "ENG-05",
    name: "Learning & Growth Engine",
    category: "Engine",
    description: "Continuous autosave workspace, AI assistance telemetry logger, and immutable snapshot vault.",
    owner: "Aria Chen",
    status: "Operational",
  },
  {
    id: "eng-06",
    code: "ENG-06",
    name: "Evidence & Analytics Engine",
    category: "Engine",
    description: "5-dimension independence measurement, Level A/B classification, and public portfolio showcase.",
    owner: "Elena Rostova",
    status: "Operational",
  },

  // 3. Components
  {
    id: "comp-socratic-coach",
    code: "COMP-01",
    name: "Socratic Dialogue Orchestrator",
    category: "Component",
    description: "Coordinates multi-turn dialogue with strict refusal to generate direct answers.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "comp-hint-scaffolder",
    code: "COMP-02",
    name: "Progressive Hint Engine",
    category: "Component",
    description: "Dispenses 4-tier progressive hint nudges without solving problems for user.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "comp-autosave-vault",
    code: "COMP-03",
    name: "Autosave & Telemetry Vault",
    category: "Component",
    description: "1500ms debounced persistence capturing draft keystrokes and AI interaction logs.",
    owner: "Aria Chen",
    status: "Operational",
  },
  {
    id: "comp-independence-calc",
    code: "COMP-04",
    name: "Independence Dimension Calculator",
    category: "Component",
    description: "Calculates Critical Distance, Autonomy, Self-Reliance, Originality, and Reflection.",
    owner: "Marcus Vance",
    status: "Operational",
  },

  // 4. APIs
  {
    id: "api-coach",
    code: "API-01",
    name: "/api/ai/coach",
    category: "API",
    description: "Socratic coaching turn exchange with progressive hint scaffolding.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "api-assessment-eval",
    code: "API-02",
    name: "/api/assessment/evaluate",
    category: "API",
    description: "Evaluates diagnostic submissions against 4-tier rubrics with verbatim quotes.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "api-workspace-autosave",
    code: "API-03",
    name: "/api/workspace/autosave",
    category: "API",
    description: "Persists working drafts and logs assistance category telemetry.",
    owner: "Aria Chen",
    status: "Operational",
  },
  {
    id: "api-portfolio-showcase",
    code: "API-04",
    name: "/api/portfolio/[slug]",
    category: "API",
    description: "Serves public verified growth portfolio showcase data.",
    owner: "Kazi",
    status: "Operational",
  },

  // 5. Data Entities
  {
    id: "entity-user",
    code: "DB-01",
    name: "User & CapabilityProfile",
    category: "DataEntity",
    description: "User authentication, profile settings, and baseline capability scores.",
    owner: "Kazi",
    status: "Operational",
  },
  {
    id: "entity-attempt",
    code: "DB-02",
    name: "AssessmentAttempt & Response",
    category: "DataEntity",
    description: "Diagnostic assessment items, student submissions, and rubric scores.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "entity-challenge-attempt",
    code: "DB-03",
    name: "ChallengeAttempt & Snapshot",
    category: "DataEntity",
    description: "Frozen immutable challenge deliverable with word count and SHA-256 hash.",
    owner: "Aria Chen",
    status: "Operational",
  },
  {
    id: "entity-independence",
    code: "DB-04",
    name: "IndependenceProfile",
    category: "DataEntity",
    description: "5-dimension scores, Level A/B counts, and assistance frequency records.",
    owner: "Marcus Vance",
    status: "Operational",
  },

  // 6. Roadmap Work Packages
  {
    id: "wp-phase-07",
    code: "PHASE-07",
    name: "Phase 07: Tech Stack ADR Gate",
    category: "WorkPackage",
    description: "Formal empirical benchmarking and architecture decision record freeze.",
    owner: "Kazi",
    status: "Operational",
  },
  {
    id: "wp-phase-11",
    code: "PHASE-11",
    name: "Phase 11: AI Socratic Engine",
    category: "WorkPackage",
    description: "AI Intelligence Engine hardening and non-generative answer policy.",
    owner: "Elena Rostova",
    status: "Operational",
  },
  {
    id: "wp-phase-13",
    code: "PHASE-13",
    name: "Phase 13: Analytics & Independence",
    category: "WorkPackage",
    description: "Behavioral telemetry processing and public Growth Portfolio hosting.",
    owner: "Team PastForward",
    status: "Operational",
  },
];

export const DEPENDENCY_EDGES: DependencyEdge[] = [
  // Application -> Shared Engine Consumptions
  { sourceId: "app-01", targetId: "eng-01", relationship: "consumes competency rubrics", isVerified: true },
  { sourceId: "app-01", targetId: "eng-02", relationship: "engages Socratic coach", isVerified: true },
  { sourceId: "app-01", targetId: "eng-05", relationship: "executes workplace memos", isVerified: true },
  { sourceId: "app-01", targetId: "eng-06", relationship: "exports employer proof", isVerified: true },

  { sourceId: "app-02", targetId: "eng-01", relationship: "consumes divergence rubrics", isVerified: true },
  { sourceId: "app-02", targetId: "eng-02", relationship: "uses contrarian sparring", isVerified: true },
  { sourceId: "app-02", targetId: "eng-05", relationship: "executes constraint sandbox", isVerified: true },
  { sourceId: "app-02", targetId: "eng-06", relationship: "tracks originality scores", isVerified: true },

  { sourceId: "app-03", targetId: "eng-01", relationship: "consumes fallacy rubrics", isVerified: true },
  { sourceId: "app-03", targetId: "eng-02", relationship: "uses dialectical questioning", isVerified: true },
  { sourceId: "app-03", targetId: "eng-03", relationship: "runs diagnostic baselines", isVerified: true },
  { sourceId: "app-03", targetId: "eng-06", relationship: "certifies unassisted logic", isVerified: true },

  { sourceId: "app-04", targetId: "eng-04", relationship: "generates curiosity roadmaps", isVerified: true },
  { sourceId: "app-04", targetId: "eng-05", relationship: "runs inquiry workspace", isVerified: true },

  { sourceId: "app-05", targetId: "eng-04", relationship: "schedules reflection habits", isVerified: true },
  { sourceId: "app-05", targetId: "eng-05", relationship: "runs metacognitive journal", isVerified: true },
  { sourceId: "app-05", targetId: "eng-06", relationship: "tracks independence trajectory", isVerified: true },

  // Shared Engine -> Component Subsystems
  { sourceId: "eng-02", targetId: "comp-socratic-coach", relationship: "orchestrates turn dialogue", isVerified: true },
  { sourceId: "eng-02", targetId: "comp-hint-scaffolder", relationship: "manages hint ladder", isVerified: true },
  { sourceId: "eng-05", targetId: "comp-autosave-vault", relationship: "synchronizes drafts", isVerified: true },
  { sourceId: "eng-06", targetId: "comp-independence-calc", relationship: "evaluates 5 dimensions", isVerified: true },

  // Component -> API Layer
  { sourceId: "comp-socratic-coach", targetId: "api-coach", relationship: "serves endpoint", isVerified: true },
  { sourceId: "comp-autosave-vault", targetId: "api-workspace-autosave", relationship: "posts draft batches", isVerified: true },
  { sourceId: "eng-03", targetId: "api-assessment-eval", relationship: "executes server scoring", isVerified: true },
  { sourceId: "eng-06", targetId: "api-portfolio-showcase", relationship: "publishes public JSON", isVerified: true },

  // Engine / Component -> Data Entities
  { sourceId: "eng-03", targetId: "entity-attempt", relationship: "persists diagnostic rows", isVerified: true },
  { sourceId: "comp-autosave-vault", targetId: "entity-challenge-attempt", relationship: "freezes snapshot", isVerified: true },
  { sourceId: "comp-independence-calc", targetId: "entity-independence", relationship: "updates dimension ratings", isVerified: true },

  // Engine -> Roadmap Governance
  { sourceId: "eng-01", targetId: "wp-phase-07", relationship: "governed by architecture freeze", isVerified: true },
  { sourceId: "eng-02", targetId: "wp-phase-11", relationship: "engineered in Phase 11", isVerified: true },
  { sourceId: "eng-06", targetId: "wp-phase-13", relationship: "engineered in Phase 13", isVerified: true },
];

export function getConnectedDependencies(nodeId: string): {
  node: DependencyNode;
  upstream: { node: DependencyNode; relationship: string }[];
  downstream: { node: DependencyNode; relationship: string }[];
} {
  const node = DEPENDENCY_NODES.find((n) => n.id === nodeId) || DEPENDENCY_NODES[0];

  // Upstream: nodes that point to this node
  const upstream = DEPENDENCY_EDGES.filter((e) => e.targetId === node.id)
    .map((e) => {
      const srcNode = DEPENDENCY_NODES.find((n) => n.id === e.sourceId);
      return srcNode ? { node: srcNode, relationship: e.relationship } : null;
    })
    .filter(Boolean) as { node: DependencyNode; relationship: string }[];

  // Downstream: nodes that this node points to
  const downstream = DEPENDENCY_EDGES.filter((e) => e.sourceId === node.id)
    .map((e) => {
      const tgtNode = DEPENDENCY_NODES.find((n) => n.id === e.targetId);
      return tgtNode ? { node: tgtNode, relationship: e.relationship } : null;
    })
    .filter(Boolean) as { node: DependencyNode; relationship: string }[];

  return {
    node,
    upstream,
    downstream,
  };
}
