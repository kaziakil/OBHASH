/**
 * OBHASH Documentation & YC-Style Pitch Deck Core Types
 * Phase 8 Enhancement: Live Documentation System with Access Control & Scheduling
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  email: string;
  avatarUrl: string;
  bio: string;
  contributions: string[];
  linkedin?: string;
  github?: string;
}

export interface DocsAccessConfig {
  isEnabled: boolean; // Master enable/disable toggle
  isScheduled: boolean; // True if time-gated by window
  scheduleStart: string; // ISO timestamp, default: "2026-06-10T00:00:00.000Z"
  scheduleEnd: string; // ISO timestamp, default: "2026-06-14T23:59:59.000Z"
  allowAdminBypass: boolean;
  adminBypassPasscode: string;
  publishedVersion: string;
  lastUpdated: string;
  announcementBanner?: string;
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

export type DocsTabMode = "pitch" | "technical" | "live-system";

export interface PitchDeckSlide {
  id: string;
  order: number;
  title: string;
  tagline: string;
  category: "Vision & Problem" | "Product & Advantage" | "Market & Model" | "Team & Future";
  content: {
    lead: string;
    points: { headline: string; description: string; metric?: string }[];
    callout?: string;
    visualSnippet?: string;
  };
}

export interface TechnicalDocSection {
  id: string;
  code: string; // e.g. "B", "C", "D"
  title: string;
  category: "Architecture" | "Data & AI" | "Operations & Security";
  summary: string;
  body: string[];
  diagramSvg?: string;
  codeSnippet?: string;
}
