import type { ADRRecord } from "@/types/docs";

/**
 * OBHASH Architecture Decision Records (ADRs)
 * Official Repository of Architectural Decisions, Alternatives, Rationale, and Approval History
 */
export const V2_ADR_RECORDS: ADRRecord[] = [
  {
    id: "ADR-001",
    number: 1,
    title: "Next.js 16 App Router & Turbopack for Unified Multi-Application Portal",
    status: "Approved",
    date: "2026-11-10",
    author: "Kazi (Lead Software Architect)",
    approvers: ["Elena Rostova", "Marcus Vance", "Aria Chen"],
    context:
      "OBHASH requires simultaneously hosting five distinct capability applications, an interactive coaching workspace, live assessment runners, and public portfolios with sub-second page transitions, strict SEO accessibility, and server streaming.",
    decision:
      "Adopt Next.js 16 with Turbopack, React 19 Server Components, and Partial Prerendering (PPR) as the unified frontend and application orchestrator.",
    alternativesConsidered: [
      {
        title: "Micro-Frontend Federation (Webpack / Vite)",
        description: "Deploy 5 separate SPA applications federated under an nginx reverse proxy.",
        rejectionReason:
          "Excessive operational overhead, inconsistent shared component states, poor mobile bundle sizes, and complex unified authentication.",
      },
      {
        title: "Standard SPA with Vite & React Router",
        description: "Single client-side SPA with client-only routing.",
        rejectionReason:
          "Lack of streaming SSR, suboptimal initial load for evaluation window reviewers, and complex open-graph metadata generation for public portfolios.",
      },
    ],
    consequences: {
      positive: [
        "Single repository with shared design tokens and unified session auth across all 5 applications.",
        "Zero-latency internal route transitions with Turbopack fast refreshes under 90ms.",
        "Prerendered static documentation pages alongside dynamic streaming AI coach sessions.",
      ],
      negative: [
        "Requires adherence to React 19 async server-client boundary rules.",
        "Next.js 16 breaking changes necessitate cautious dependency version locking.",
      ],
      neutral: ["Build step is consolidated into a single CI pipeline."],
    },
    relatedEngines: ["Human Capability Engine", "Learning & Growth Engine"],
    relatedPhases: ["PHASE-01", "PHASE-07", "PHASE-18"],
    approvalHistory: [
      { date: "2026-11-08", event: "Proposed by Kazi", actor: "Kazi" },
      { date: "2026-11-09", event: "Technical Review & Benchmark Evaluation", actor: "Aria Chen" },
      { date: "2026-11-10", event: "Approved unanimously by Team PastForward", actor: "Team PastForward" },
    ],
  },
  {
    id: "ADR-002",
    number: 2,
    title: "Socratic Dialogue Scaffolding Protocol vs. Direct Generative Answer Delivery",
    status: "Approved",
    date: "2026-11-12",
    author: "Elena Rostova (Lead AI Systems Engineer)",
    approvers: ["Kazi", "Marcus Vance"],
    context:
      "Conventional AI products (ChatGPT, Claude, Copilot) provide direct answers and write complete deliverables for users. In the context of capability development, this causes cognitive atrophy and dependency. OBHASH exists to solve this problem.",
    decision:
      "Implement the AI Intelligence Engine (ENG-02) with strict Socratic dialogue contracts and prompt isolation. The AI is forbidden from providing direct thesis statements, writing paragraphs, or solving logic puzzles for the user. It operates as a catalytic coach with 4-tier progressive hint nudges.",
    alternativesConsidered: [
      {
        title: "Standard Generative Co-Pilot (Autocomplete)",
        description: "Inline ghost-text autocomplete suggesting the next sentence or paragraph.",
        rejectionReason:
          "Directly contradicts the Human-Centered Intelligence philosophy by encouraging passive completion.",
      },
      {
        title: "Unconstrained Freeform Chat Assistant",
        description: "Allowing users to ask anything without system prompt enforcement.",
        rejectionReason:
          "Users consistently prompt the AI to 'write this for me', completely destroying the pedagogical validity.",
      },
    ],
    consequences: {
      positive: [
        "Users actively exercise their own critical thinking and creative problem-solving faculties.",
        "Preserves the integrity of the Independence Measurement Engine.",
        "Differentiates OBHASH fundamentally from general-purpose generative AI tools.",
      ],
      negative: [
        "Requires higher initial cognitive effort from users, which some first-time users may find demanding.",
        "Complex multi-turn prompt engineering required to handle jailbreak attempts.",
      ],
    },
    relatedEngines: ["AI Intelligence Engine", "Human Capability Engine"],
    relatedPhases: ["PHASE-03", "PHASE-05", "PHASE-11"],
    approvalHistory: [
      { date: "2026-11-11", event: "Pedagogical alignment workshop", actor: "Marcus Vance" },
      { date: "2026-11-12", event: "Formally approved and integrated into AI service contracts", actor: "Elena Rostova" },
    ],
  },
  {
    id: "ADR-003",
    number: 3,
    title: "Dual-Mode Persistence Architecture: PostgreSQL with Resilient In-Memory Failover",
    status: "Approved",
    date: "2026-11-14",
    author: "Kazi (Lead Software Architect)",
    approvers: ["Elena Rostova", "Aria Chen"],
    context:
      "The system must demonstrate uncompromising reliability during live investor demos, offline judge evaluations, and production deployments without failing when network connections to cloud databases are intermittent.",
    decision:
      "Implement a dual-layer persistence abstraction. The primary layer is PostgreSQL managed through Prisma ORM. When cloud credentials or database connections are absent or interrupted, the system automatically and transparently falls back to an in-memory repository without throwing unhandled exceptions.",
    alternativesConsidered: [
      {
        title: "Strict PostgreSQL Database-Only",
        description: "Fail fast with a 500 error if PostgreSQL is unreachable.",
        rejectionReason:
          "Disastrous for offline presentations, air-gapped demo booths, or unconfigured local developer environments.",
      },
      {
        title: "Pure Local SQLite",
        description: "Store all state in a local file-based SQLite database.",
        rejectionReason:
          "Unsuitable for production cloud multi-tenancy and high concurrent user scaling.",
      },
    ],
    consequences: {
      positive: [
        "100% demo reliability: system operates seamlessly even with disconnected database instances.",
        "Identical TypeScript interface across persistence modes ensures zero application-level coupling.",
      ],
      negative: [
        "Requires maintaining parity between Prisma relational queries and in-memory mock collections.",
      ],
    },
    relatedEngines: ["Evidence & Analytics Engine", "Assessment Engine"],
    relatedPhases: ["PHASE-08", "PHASE-13", "PHASE-22"],
    approvalHistory: [
      { date: "2026-11-13", event: "Architecture proposal for offline competition resilience", actor: "Kazi" },
      { date: "2026-11-14", event: "Benchmarked and approved", actor: "Team PastForward" },
    ],
  },
  {
    id: "ADR-004",
    number: 4,
    title: "Algorithmic Behavioral Independence Measurement vs. Self-Reported Surveys",
    status: "Approved",
    date: "2026-11-16",
    author: "Marcus Vance (Lead Psychometrics & Learning Design)",
    approvers: ["Elena Rostova", "Kazi"],
    context:
      "Assessing whether a human has genuinely become more capable cannot rely on subjective Likert-scale self-assessments ('I feel 20% smarter'), which are vulnerable to Dunning-Kruger effects and social desirability bias.",
    decision:
      "Construct the Independence Measurement Engine (ENG-06) around concrete behavioral telemetry: unassisted word ratio, hint progression depth, prompt refinement count, time spent in unassisted deep work, and metacognitive reflection delta.",
    alternativesConsidered: [
      {
        title: "Subjective Self-Report Surveys",
        description: "Post-challenge surveys asking the user to rate their confidence.",
        rejectionReason: "Subjective, easily gamed, and lacks evidentiary weight for employers and universities.",
      },
      {
        title: "Black-Box ML Scoring Model",
        description: "Feeding all telemetry into a deep neural net to output a single score.",
        rejectionReason:
          "Lack of explainability, impossible for users or evaluators to audit, and risks algorithmic bias.",
      },
    ],
    consequences: {
      positive: [
        "Transparent, defensible mathematical formulas for all 5 Independence Dimensions.",
        "Enables verifiable Level A (Unassisted) and Level B (AI-Informed) audit stamps on deliverables.",
      ],
      negative: [
        "Requires tracking fine-grained client autosave events and hint query counters.",
      ],
    },
    relatedEngines: ["Evidence & Analytics Engine", "Learning & Growth Engine"],
    relatedPhases: ["PHASE-06", "PHASE-13", "PHASE-21"],
    approvalHistory: [
      { date: "2026-11-15", event: "Psychometric formulation complete", actor: "Marcus Vance" },
      { date: "2026-11-16", event: "Approved and codified into test suite", actor: "Team PastForward" },
    ],
  },
  {
    id: "ADR-005",
    number: 5,
    title: "Phase 07 Technology Stack Selection Framework & Empirical Benchmarking Gates",
    status: "Approved",
    date: "2026-11-18",
    author: "Kazi (Lead Software Architect)",
    approvers: ["Elena Rostova", "Marcus Vance", "Aria Chen"],
    context:
      "Prematurely freezing the production runtime stack before completing Stage 2 (Competency Architecture) and Stage 3 discovery risks locking into frameworks that may not meet real-time streaming or local inference latency targets.",
    decision:
      "Formally mandate that the final production technology stack will be selected in Phase 07 (Technical Architecture & Technology Selection) following rigorous empirical benchmarks across AI response latency, database write concurrency, and mobile memory footprints. The current implementation serves as the verified reference architecture.",
    alternativesConsidered: [
      {
        title: "Premature Production Stack Lock-in",
        description: "Declaring the initial prototype stack as permanent and unalterable.",
        rejectionReason:
          "Violates engineering best practices and ignores emerging Small Language Models (SLMs) and edge compute developments.",
      },
    ],
    consequences: {
      positive: [
        "Guarantees that final production stack decisions are backed by empirical telemetry, not dogma.",
        "Allows Phase 07 review committee to review concrete performance data.",
      ],
      negative: [
        "Requires maintaining clean modular boundaries so components can adapt to final Phase 07 ADR decisions.",
      ],
    },
    relatedEngines: ["Human Capability Engine", "AI Intelligence Engine", "Assessment Engine"],
    relatedPhases: ["PHASE-07", "PHASE-08", "PHASE-09"],
    approvalHistory: [
      { date: "2026-11-17", event: "Drafted ADR framework", actor: "Kazi" },
      { date: "2026-11-18", event: "Ratified as mandatory roadmap governance gate", actor: "Team PastForward" },
    ],
  },
  {
    id: "ADR-006",
    number: 6,
    title: "Cryptographic Verifiable Credentials for Public Growth Portfolio Showcase",
    status: "Proposed",
    date: "2026-11-20",
    author: "Elena Rostova (Lead AI Systems Engineer)",
    approvers: ["Kazi"],
    context:
      "Employers and credentialing institutions need tamper-proof proof that a candidate's portfolio artifacts were completed independently and scored under verified rubrics.",
    decision:
      "Plan the implementation of W3C Verifiable Credentials and cryptographic SHA-256 deliverable stamping in Stage 7 (Phase 21). Each published portfolio at /p/[slug] will carry a cryptographic integrity badge verifying submission timestamps, prompt telemetry, and unassisted independence levels.",
    alternativesConsidered: [
      {
        title: "Standard PDF Export Only",
        description: "Exporting static PDF certificates without digital signatures.",
        rejectionReason: "Easily edited in Acrobat, forgeable, and lacks machine-verifiable integrity.",
      },
    ],
    consequences: {
      positive: [
        "Transforms the OBHASH portfolio into an internationally recognized credential for university admissions and hiring.",
      ],
      negative: [
        "Requires key management infrastructure and DID (Decentralized Identifier) resolution.",
      ],
    },
    relatedEngines: ["Evidence & Analytics Engine"],
    relatedPhases: ["PHASE-21", "PHASE-24"],
    approvalHistory: [
      { date: "2026-11-20", event: "Proposed for Phase 21 roadmap milestone", actor: "Elena Rostova" },
    ],
  },
];

export function searchADRs(query: string, statusFilter?: string): ADRRecord[] {
  const q = query.trim().toLowerCase();
  return V2_ADR_RECORDS.filter((adr) => {
    const matchesStatus = !statusFilter || statusFilter === "All" || adr.status === statusFilter;
    const matchesQuery =
      !q ||
      adr.id.toLowerCase().includes(q) ||
      adr.title.toLowerCase().includes(q) ||
      adr.context.toLowerCase().includes(q) ||
      adr.decision.toLowerCase().includes(q) ||
      adr.author.toLowerCase().includes(q) ||
      adr.relatedEngines.some((e) => e.toLowerCase().includes(q)) ||
      adr.relatedPhases.some((p) => p.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });
}
