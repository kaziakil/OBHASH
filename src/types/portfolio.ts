// ==============================================================================
// OBHASH Phase 7 Types: Growth Portfolio & Public Showcase
// ==============================================================================

import type { AIAssistanceLevel } from "./independence";

export type PortfolioVisibility = "private" | "unlisted" | "public";

export type PortfolioSectionType =
  | "personal_intro"
  | "capability_overview"
  | "featured_work"
  | "development_journey"
  | "thoughtful_ai_use"
  | "personal_reflections";

export type PortfolioItemSourceType =
  | "challenge_submission"
  | "challenge_reflection"
  | "assessment_achievement"
  | "journey_milestone"
  | "custom_project";

export interface PortfolioItemArtifact {
  title: string;
  type: string;
  content: string;
}

export interface PortfolioItem {
  id: string;
  portfolioId: string;
  sectionId: string;
  sourceType: PortfolioItemSourceType;
  sourceRecordId?: string | null;
  title: string;
  description: string;
  capabilityKey?: string;
  dimensions: string[];
  userReflection?: string;
  aiAssistanceLevel: AIAssistanceLevel;
  aiAssistanceDisclosure?: string;
  artifacts?: PortfolioItemArtifact[];
  orderIndex: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSection {
  id: string;
  portfolioId: string;
  sectionType: PortfolioSectionType;
  title: string;
  subtitle?: string;
  isVisible: boolean;
  orderIndex: number;
  customNotes?: string;
  items: PortfolioItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioPublicationSettings {
  id: string;
  portfolioId: string;
  allowSearchIndexing: boolean;
  showCapabilityBadges: boolean;
  showAiDisclosures: boolean;
  showReflections: boolean;
  showJourneyTimeline: boolean;
  customShareMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  publicSlug: string;
  displayName: string;
  headline?: string;
  personalIntroduction?: string;
  learningPhilosophy?: string;
  areasOfInterest: string[];
  isPublished: boolean;
  visibility: PortfolioVisibility;
  publishedAt?: string | null;
  sections: PortfolioSection[];
  settings: PortfolioPublicationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface EligibleWorkItem {
  id: string;
  sourceType: PortfolioItemSourceType;
  sourceRecordId: string;
  title: string;
  subtitle: string;
  capabilityKey?: string;
  dimensions: string[];
  userContent: string;
  evaluationFeedback?: string;
  reflectionText?: string;
  aiAssistanceLevel: AIAssistanceLevel;
  aiAssistanceSummary?: string;
  completedAt: string;
  isAlreadyInPortfolio: boolean;
}

export interface PublicPortfolioView {
  publicSlug: string;
  displayName: string;
  headline?: string;
  personalIntroduction?: string;
  learningPhilosophy?: string;
  areasOfInterest: string[];
  publishedAt: string;
  sections: {
    sectionType: PortfolioSectionType;
    title: string;
    subtitle?: string;
    customNotes?: string;
    items: {
      id: string;
      title: string;
      description: string;
      capabilityKey?: string;
      dimensions: string[];
      userReflection?: string;
      aiAssistanceLevel: AIAssistanceLevel;
      aiAssistanceDisclosure?: string;
      artifacts?: PortfolioItemArtifact[];
      isFeatured: boolean;
    }[];
  }[];
  settings: {
    showCapabilityBadges: boolean;
    showAiDisclosures: boolean;
    showReflections: boolean;
    showJourneyTimeline: boolean;
  };
}
