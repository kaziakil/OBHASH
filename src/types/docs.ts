/**
 * OBHASH Documentation & Transparency Portal Core Types
 * Official Architecture v2.0.0 — One Ecosystem, Five Applications, Six Shared Engines
 */

export type ImplementationStatus =
  | "Operational"
  | "Implemented"
  | "In Development"
  | "Planned"
  | "Under Research"
  | "Deprecated";

export type DocsExperienceView =
  | "product"
  | "engineering"
  | "roadmap"
  | "transparency"
  | "dependencies"
  | "adrs";
export type DocsTabMode = DocsExperienceView | "pitch" | "technical" | "live-system";

export type DocVisibilityClassification = "Public" | "Restricted" | "Private";
export type DocReviewStatus = "Approved" | "Under Review" | "Draft" | "Deprecated";

export interface DocGovernanceMetadata {
  owner: string;
  reviewer: string;
  reviewStatus: DocReviewStatus;
  lastReviewedAt: string;
  maintenancePolicy: string;
  visibilityClassification: DocVisibilityClassification;
}

export interface ADRRecord {
  id: string;
  number: number;
  title: string;
  status: "Proposed" | "Approved" | "Superseded" | "Deprecated";
  date: string;
  author: string;
  approvers: string[];
  context: string;
  decision: string;
  alternativesConsidered: {
    title: string;
    description: string;
    rejectionReason: string;
  }[];
  consequences: {
    positive: string[];
    negative: string[];
    neutral?: string[];
  };
  relatedEngines: string[];
  relatedPhases: string[];
  approvalHistory: {
    date: string;
    event: string;
    actor: string;
  }[];
}

export type DependencyCategory =
  | "Application"
  | "Engine"
  | "Component"
  | "API"
  | "DataEntity"
  | "WorkPackage";

export interface DependencyNode {
  id: string;
  name: string;
  code: string;
  category: DependencyCategory;
  description: string;
  owner: string;
  status: ImplementationStatus;
}

export interface DependencyEdge {
  sourceId: string;
  targetId: string;
  relationship: string;
  isVerified: boolean;
}

export interface DocQAReport {
  score: number;
  totalLinksChecked: number;
  brokenLinksCount: number;
  totalReferencesChecked: number;
  missingReferencesCount: number;
  terminologyConsistencyScore: number;
  governanceCompleteness: number;
  isPassing: boolean;
  auditedAt: string;
  checks: {
    rule: string;
    passed: boolean;
    details: string;
  }[];
}

export interface PrivacyAwareAnalytics {
  totalPageViews: number;
  sectionEngagement: Record<string, number>;
  topSearchTerms: { term: string; count: number }[];
  feedbackSummary: {
    helpfulVotes: number;
    unhelpfulVotes: number;
    satisfactionRate: number;
  };
  lastAggregatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  email: string;
  avatarUrl: string;
  bio: string;
  responsibilities?: string[];
  contributions: string[];
  linkedin?: string;
  github?: string;
}

export interface PitchDeckSlide {
  id: string;
  order: number;
  category: string;
  title: string;
  tagline: string;
  content: {
    lead: string;
    points: {
      headline: string;
      description: string;
      metric?: string;
    }[];
    callout?: string;
  };
}

export interface TechnicalDocSection {
  id: string;
  code: string;
  title: string;
  category: string;
  summary: string;
  body: string[];
  codeSnippet?: string;
  tables?: {
    headers: string[];
    rows: string[][];
  }[];
}

export interface DocsVersionRecord {
  versionId: string;
  versionName: string;
  releaseDate: string;
  publishState: "published" | "draft" | "archived";
  author: string;
  notes: string;
  isCurrent: boolean;
}

export interface DocsAccessConfig {
  isEnabled: boolean; // Master enable/disable toggle
  publishState: "published" | "draft" | "archived"; // Publishing lifecycle state
  isScheduled: boolean; // True if time-gated by window
  scheduleStart: string; // ISO timestamp
  scheduleEnd: string; // ISO timestamp
  timezone: string; // Explicit timezone (e.g. "UTC")
  allowAdminBypass: boolean;
  adminBypassPasscode: string;
  superAdminPasscode: string;
  publishedVersion: string;
  versionHistory: DocsVersionRecord[];
  lastUpdated: string;
  announcementBanner?: string;
}

export interface DocumentationIntegrityReport {
  isValid: boolean;
  totalApplications: number;
  totalSharedEngines: number;
  totalRoadmapStages: number;
  totalRoadmapPhases: number;
  totalDocumentationSections: number;
  integrityScore: number;
  checks: {
    name: string;
    passed: boolean;
    details: string;
  }[];
  validationTimestamp: string;
}

export interface LiveSystemMetrics {
  environment: string;
  status: "operational" | "degraded" | "maintenance";
  uptimeSeconds: number;
  frameworkVersion: string;
  routesCount: number;
  capabilitiesCount: number;
  challengesCount: number;
  passingTestsCount: number;
  totalTestsCount: number;
  dbMigrationsCount: number;
  persistenceMode: string;
  aiProvider: string;
  lastVerifiedAt: string;
}

export interface ApplicationSpec {
  id: string;
  code: string; // e.g. "APP-01"
  name: string;
  tagline: string;
  badge: string;
  focus: string[];
  overview: string;
  purpose: string;
  targetUsers: string;
  capabilityFramework: {
    dimension: string;
    description: string;
    competencies: string[];
  }[];
  coreFeatures: {
    name: string;
    description: string;
    status: ImplementationStatus;
  }[];
  functionalRequirements: string[];
  userJourneys: {
    persona: string;
    journey: string;
    outcome: string;
  }[];
  assessmentIntegration: string;
  aiIntegration: string;
  personalization: string;
  dataRequirements: string[];
  dependencies: string[];
  implementationStatus: ImplementationStatus;
  futureDevelopment: string[];
}

export interface SharedEngineSpec {
  id: string;
  code: string; // e.g. "ENG-01"
  name: string;
  tagline: string;
  purpose: string;
  coreCapabilities: string[];
  internalComponents: {
    name: string;
    responsibility: string;
  }[];
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  interfaces: string[];
  relationshipsWithOtherEngines: {
    engineName: string;
    relationship: string;
  }[];
  applicationLevelUtilization: {
    appName: string;
    usage: string;
  }[];
  implementationStatus: ImplementationStatus;
  plannedEvolution: string[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseCode: string; // e.g. "PHASE-01"
  title: string;
  stageNumber: number;
  stageName: string;
  focus: string;
  workPackages: string[];
  deliverables: string[];
  dependencies: string[];
  crossCuttingWorkstreams: string[];
  approvalGate: string;
  status: ImplementationStatus;
  simultaneousAppScope: string;
}

export interface RoadmapStage {
  stageNumber: number;
  stageName: string;
  description: string;
  phases: RoadmapPhase[];
}

export interface DocumentationSection {
  id: string;
  code: string; // e.g. "A", "B", "C" ... "Q"
  title: string;
  subtitle?: string;
  category: "Vision & Ecosystem" | "Architecture & Engines" | "Applications" | "Systems & Governance" | "Operations & Roadmap";
  targetAudience: "Both" | "Product" | "Engineering";
  summary: string;
  content: string[];
  codeSnippet?: string;
  subsections?: {
    id: string;
    title: string;
    content: string[];
    codeSnippet?: string;
    badges?: string[];
  }[];
  diagramId?: string;
  governance?: DocGovernanceMetadata;
}

export interface ImplementationInventoryItem {
  id: string;
  name: string;
  type: "Application" | "Engine" | "Feature" | "API" | "Infrastructure" | "Governance";
  status: ImplementationStatus;
  version: string;
  source: string;
  isLiveSynced: boolean;
  notes: string;
}
