"use server";

import type {
  Portfolio,
  PortfolioItem,
  EligibleWorkItem,
  PublicPortfolioView,
} from "@/types/portfolio";
import { portfolioLocalStore } from "./local-store";
import { revalidatePath } from "next/cache";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Ignore when called outside of Next.js request context (e.g. scripts/tests)
  }
}

/**
 * Retrieves the user's complete portfolio (draft or published).
 */
export async function getUserPortfolio(userId = "demo-user-1"): Promise<Portfolio> {
  return portfolioLocalStore.getPortfolioByUserId(userId);
}

/**
 * Saves modifications to the user's portfolio in draft mode.
 */
export async function savePortfolioDraft(portfolio: Portfolio): Promise<Portfolio> {
  const saved = portfolioLocalStore.savePortfolio(portfolio);
  safeRevalidate("/portfolio");
  safeRevalidate(`/p/${saved.publicSlug}`);
  return saved;
}

/**
 * Publishes the portfolio, making it accessible via its public slug.
 */
export async function publishPortfolio(
  userId = "demo-user-1",
  visibility: "public" | "unlisted" = "public"
): Promise<Portfolio> {
  const portfolio = portfolioLocalStore.getPortfolioByUserId(userId);
  portfolio.isPublished = true;
  portfolio.visibility = visibility;
  portfolio.publishedAt = new Date().toISOString();
  const saved = portfolioLocalStore.savePortfolio(portfolio);

  safeRevalidate("/portfolio");
  safeRevalidate(`/p/${saved.publicSlug}`);
  return saved;
}

/**
 * Unpublishes the portfolio, instantly revoking public access.
 */
export async function unpublishPortfolio(userId = "demo-user-1"): Promise<Portfolio> {
  const portfolio = portfolioLocalStore.getPortfolioByUserId(userId);
  portfolio.isPublished = false;
  portfolio.visibility = "private";
  const saved = portfolioLocalStore.savePortfolio(portfolio);

  safeRevalidate("/portfolio");
  safeRevalidate(`/p/${saved.publicSlug}`);
  return saved;
}

/**
 * Updates the custom public slug.
 */
export async function updatePublicSlug(
  userId = "demo-user-1",
  newSlug: string
): Promise<{ success: boolean; slug: string; error?: string }> {
  const sanitized = newSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  if (sanitized.length < 3) {
    return { success: false, slug: sanitized, error: "Slug must be at least 3 characters long." };
  }

  const existing = portfolioLocalStore.getPortfolioBySlug(sanitized);
  if (existing && existing.userId !== userId && existing.userId !== "demo-user") {
    return { success: false, slug: sanitized, error: "This public link is already taken by another learner." };
  }

  const portfolio = portfolioLocalStore.getPortfolioByUserId(userId);
  portfolio.publicSlug = sanitized;
  portfolioLocalStore.savePortfolio(portfolio);

  safeRevalidate("/portfolio");
  safeRevalidate(`/p/${sanitized}`);
  return { success: true, slug: sanitized };
}

/**
 * Adds an item to a specific section.
 */
export async function addPortfolioItem(
  userId = "demo-user-1",
  sectionType: string,
  itemData: Omit<PortfolioItem, "id" | "portfolioId" | "sectionId" | "createdAt" | "updatedAt">
): Promise<PortfolioItem> {
  const item = portfolioLocalStore.addItemToSection(userId, sectionType, itemData);
  safeRevalidate("/portfolio");
  return item;
}

/**
 * Removes an item from the portfolio.
 */
export async function removePortfolioItem(
  userId = "demo-user-1",
  itemId: string
): Promise<boolean> {
  const success = portfolioLocalStore.removeItem(userId, itemId);
  if (success) {
    safeRevalidate("/portfolio");
  }
  return success;
}

/**
 * Retrieves all eligible work items that the user can feature in their portfolio.
 * Cross-references Phases 3 (Assessments), 4 (Journeys), 5 (Coaching), and 6 (Challenges).
 */
export async function getEligibleWorkItems(userId = "demo-user-1"): Promise<EligibleWorkItem[]> {
  const currentPortfolio = portfolioLocalStore.getPortfolioByUserId(userId);
  const featuredRecordIds = new Set<string>();
  for (const sec of currentPortfolio.sections) {
    for (const it of sec.items) {
      if (it.sourceRecordId) {
        featuredRecordIds.add(it.sourceRecordId);
      }
    }
  }

  const eligibleItems: EligibleWorkItem[] = [
    // Phase 6 Completed Challenge
    {
      id: "elig-p6-cps-1",
      sourceType: "challenge_submission",
      sourceRecordId: "sub-demo-2",
      title: "The Everyday Innovation Challenge: Solve It Differently",
      subtitle: "3 Distinct Paradigms for Dining Hall Food Waste Reduction",
      capabilityKey: "creative-problem-solving",
      dimensions: ["Idea Generation", "Cognitive Flexibility", "Friction Analysis"],
      userContent: "Developed Concept A (Trayless Dining), Concept B (Predictive Logistics with Bluetooth sensing), Concept C (Clean Plate Mutual Credit pool).",
      evaluationFeedback: "Exemplary rating across idea generation and cognitive flexibility. Successfully anticipated real-world human adoption barriers.",
      reflectionText: "Constraining myself into 3 distinct categories forced me to think like an engineer, an economist, and a behavioral psychologist in turn.",
      aiAssistanceLevel: "Level A",
      aiAssistanceSummary: "Wholly independent. No AI was requested or utilized during deliverable authoring.",
      completedAt: "2026-11-19T10:30:00.000Z",
      isAlreadyInPortfolio: featuredRecordIds.has("sub-demo-2"),
    },
    // Phase 3 Baseline Assessment Achievement
    {
      id: "elig-p3-ct-1",
      sourceType: "assessment_achievement",
      sourceRecordId: "eval-ct-baseline",
      title: "Critical Thinking Baseline Diagnostic",
      subtitle: "Premise Decomposition & Confounding Factor Analysis",
      capabilityKey: "critical-thinking",
      dimensions: ["Analytical Reasoning", "Evidence Evaluation"],
      userContent: "Audited causal assumptions in transit ridership studies; distinguished empirical correlations from confounding co-interventions.",
      evaluationFeedback: "Demonstrated strong premise deconstruction and rigorous skepticism towards self-selected trial samples.",
      aiAssistanceLevel: "Level A",
      aiAssistanceSummary: "Supervised baseline diagnostic conditions.",
      completedAt: "2026-11-18T14:30:00.000Z",
      isAlreadyInPortfolio: featuredRecordIds.has("eval-ct-baseline"),
    },
    // Phase 4 Growth Journey Milestone
    {
      id: "elig-p4-ms-1",
      sourceType: "journey_milestone",
      sourceRecordId: "ms-ct-1",
      title: "Milestone: Evidence Evaluation in Ambiguous Scenarios",
      subtitle: "Completed structured audit of 3 contradictory research claims",
      capabilityKey: "critical-thinking",
      dimensions: ["Evidence Evaluation"],
      userContent: "Identified hidden funding bias and absence of placebo controls in observational claims.",
      aiAssistanceLevel: "Level B",
      aiAssistanceSummary: "Consulted AI coach for method clarification on co-intervention controls.",
      completedAt: "2026-11-19T16:00:00.000Z",
      isAlreadyInPortfolio: featuredRecordIds.has("ms-ct-1"),
    },
    // Phase 6 Reflection
    {
      id: "elig-p6-ref-1",
      sourceType: "challenge_reflection",
      sourceRecordId: "ref-demo-2",
      title: "Metacognitive Reflection: Overcoming Availability Heuristics",
      subtitle: "Personal reflection on cognitive habits during rapid brainstorming",
      capabilityKey: "creative-problem-solving",
      dimensions: ["Reflection and Self-Direction"],
      userContent: "First ideas are almost always an echo of something we have seen recently. Forcing myself into three distinct categories broke cognitive inertia.",
      aiAssistanceLevel: "Level A",
      aiAssistanceSummary: "Wholly independent metacognitive self-critique.",
      completedAt: "2026-11-19T10:30:00.000Z",
      isAlreadyInPortfolio: featuredRecordIds.has("ref-demo-2"),
    },
  ];

  return eligibleItems;
}

/**
 * Retrieves a published portfolio for the public showcase route /p/[publicSlug].
 * Strictly filters out draft/unpublished portfolios and private data.
 */
export async function getPublicPortfolioBySlug(slug: string): Promise<PublicPortfolioView | null> {
  const portfolio = portfolioLocalStore.getPortfolioBySlug(slug);
  if (!portfolio) {
    return null;
  }

  // Enforce privacy: only published portfolios with public or unlisted visibility are accessible
  if (!portfolio.isPublished || portfolio.visibility === "private") {
    return null;
  }

  // Filter sections that are visible
  const visibleSections = portfolio.sections
    .filter((sec) => sec.isVisible)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((sec) => ({
      sectionType: sec.sectionType,
      title: sec.title,
      subtitle: sec.subtitle,
      customNotes: sec.customNotes,
      items: sec.items
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          capabilityKey: item.capabilityKey,
          dimensions: item.dimensions,
          userReflection: item.userReflection,
          aiAssistanceLevel: item.aiAssistanceLevel,
          aiAssistanceDisclosure: item.aiAssistanceDisclosure,
          artifacts: item.artifacts,
          isFeatured: item.isFeatured,
        })),
    }));

  return {
    publicSlug: portfolio.publicSlug,
    displayName: portfolio.displayName,
    headline: portfolio.headline,
    personalIntroduction: portfolio.personalIntroduction,
    learningPhilosophy: portfolio.learningPhilosophy,
    areasOfInterest: portfolio.areasOfInterest,
    publishedAt: portfolio.publishedAt || portfolio.updatedAt,
    sections: visibleSections,
    settings: {
      showCapabilityBadges: portfolio.settings.showCapabilityBadges,
      showAiDisclosures: portfolio.settings.showAiDisclosures,
      showReflections: portfolio.settings.showReflections,
      showJourneyTimeline: portfolio.settings.showJourneyTimeline,
    },
  };
}
