// ==============================================================================
// OBHASH Phase 7: Local In-Memory Store for Growth Portfolios
// ==============================================================================

import type {
  Portfolio,
  PortfolioSection,
  PortfolioItem,
  PortfolioPublicationSettings,
} from "@/types/portfolio";

interface PortfolioStoreData {
  portfolios: Map<string, Portfolio>; // userId -> Portfolio
  slugIndex: Map<string, string>; // publicSlug -> userId
}

declare global {
  var __OBHASH_PORTFOLIO_STORE__: PortfolioStoreData | undefined;
}

function getStore(): PortfolioStoreData {
  if (!globalThis.__OBHASH_PORTFOLIO_STORE__) {
    const store: PortfolioStoreData = {
      portfolios: new Map(),
      slugIndex: new Map(),
    };

    // Seed realistic demo portfolio for demo-user-1 (and demo-user)
    const demoUserId = "demo-user-1";
    const demoPortfolioId = "port-demo-1";
    const demoSlug = "alex-chen";

    const demoSettings: PortfolioPublicationSettings = {
      id: "set-demo-1",
      portfolioId: demoPortfolioId,
      allowSearchIndexing: false,
      showCapabilityBadges: true,
      showAiDisclosures: true,
      showReflections: true,
      showJourneyTimeline: true,
      customShareMessage: "Explore my human capability development portfolio, featuring independent problem-solving projects and reflections.",
      createdAt: "2026-11-20T08:00:00.000Z",
      updatedAt: "2026-11-20T12:00:00.000Z",
    };

    const sectionIntro: PortfolioSection = {
      id: "sec-intro",
      portfolioId: demoPortfolioId,
      sectionType: "personal_intro",
      title: "Personal Introduction & Learning Philosophy",
      subtitle: "Who I am and how I approach capability development",
      isVisible: true,
      orderIndex: 1,
      items: [],
      createdAt: "2026-11-20T08:00:00.000Z",
      updatedAt: "2026-11-20T12:00:00.000Z",
    };

    const sectionCapabilities: PortfolioSection = {
      id: "sec-capabilities",
      portfolioId: demoPortfolioId,
      sectionType: "capability_overview",
      title: "Demonstrated Capabilities",
      subtitle: "Grounded in verifiable assessments and practice challenges",
      isVisible: true,
      orderIndex: 2,
      customNotes: "Verified via OBHASH multi-dimensional rubrics across Critical Thinking and Creative Problem-Solving.",
      items: [
        {
          id: "item-cap-1",
          portfolioId: demoPortfolioId,
          sectionId: "sec-capabilities",
          sourceType: "assessment_achievement",
          sourceRecordId: "eval-ct-baseline",
          title: "Critical Thinking: Premise & Evidence Evaluation",
          description: "Demonstrated proficiency in deconstructing complex claims and isolating confounding variables under empirical scrutiny.",
          capabilityKey: "critical-thinking",
          dimensions: ["Analytical Reasoning", "Evidence Evaluation"],
          aiAssistanceLevel: "Level A",
          aiAssistanceDisclosure: "Evaluated under independent assessment module conditions.",
          orderIndex: 1,
          isFeatured: true,
          createdAt: "2026-11-20T08:00:00.000Z",
          updatedAt: "2026-11-20T12:00:00.000Z",
        },
        {
          id: "item-cap-2",
          portfolioId: demoPortfolioId,
          sectionId: "sec-capabilities",
          sourceType: "challenge_submission",
          sourceRecordId: "sub-demo-2",
          title: "Creative Problem-Solving: Divergent Architecture",
          description: "Achieved Exemplary rating by generating 3 distinct solution paradigms addressing food waste at systemic root levels.",
          capabilityKey: "creative-problem-solving",
          dimensions: ["Idea Generation", "Cognitive Flexibility"],
          aiAssistanceLevel: "Level A",
          aiAssistanceDisclosure: "Solutions authored independently; AI was not used for concept generation.",
          orderIndex: 2,
          isFeatured: true,
          createdAt: "2026-11-20T08:00:00.000Z",
          updatedAt: "2026-11-20T12:00:00.000Z",
        },
      ],
      createdAt: "2026-11-20T08:00:00.000Z",
      updatedAt: "2026-11-20T12:00:00.000Z",
    };

    const sectionFeatured: PortfolioSection = {
      id: "sec-featured",
      portfolioId: demoPortfolioId,
      sectionType: "featured_work",
      title: "Featured Challenge Work",
      subtitle: "Hands-on projects and problem-solving artifacts",
      isVisible: true,
      orderIndex: 3,
      items: [
        {
          id: "item-feat-1",
          portfolioId: demoPortfolioId,
          sectionId: "sec-featured",
          sourceType: "challenge_submission",
          sourceRecordId: "sub-demo-2",
          title: "Everyday Innovation: Three Paradigms for Dining Hall Food Waste",
          description: "Developed three distinct intervention architectures: Behavioral Nudge (trayless dining with 22cm plates), Predictive Logistics (weather & schedule micro-demand app with passive presence sensing), and Incentive Restructuring (clean plate mutual credit for campus grants).",
          capabilityKey: "creative-problem-solving",
          dimensions: ["Idea Generation", "Cognitive Flexibility", "Friction Analysis"],
          userReflection: "Pivoting away from superficial food redistribution apps forced me to look at the psychological root causes of over-portioning.",
          aiAssistanceLevel: "Level A",
          aiAssistanceDisclosure: "Level A (Independent): Wholly self-authored. Evaluator confirmed high lateral flexibility across 3 distinct domains.",
          artifacts: [
            {
              title: "Deliverables Summary",
              type: "text",
              content: "Concept A: Trayless dining. Concept B: Predictive micro-demand with Bluetooth beacon estimation. Concept C: Clean plate mutual credit grant pool.",
            },
          ],
          orderIndex: 1,
          isFeatured: true,
          createdAt: "2026-11-20T08:00:00.000Z",
          updatedAt: "2026-11-20T12:00:00.000Z",
        },
      ],
      createdAt: "2026-11-20T08:00:00.000Z",
      updatedAt: "2026-11-20T12:00:00.000Z",
    };

    const sectionJourney: PortfolioSection = {
      id: "sec-journey",
      portfolioId: demoPortfolioId,
      sectionType: "development_journey",
      title: "Growth Journey & Milestones",
      subtitle: "My personalized 8-week developmental focus",
      isVisible: true,
      orderIndex: 4,
      items: [
        {
          id: "item-jrn-1",
          portfolioId: demoPortfolioId,
          sectionId: "sec-journey",
          sourceType: "journey_milestone",
          sourceRecordId: "ms-ct-1",
          title: "Milestone: Identify Unstated Assumptions in Technical Arguments",
          description: "Systematically audited claims across 3 empirical studies to isolate confounding variables before accepting recommendations.",
          capabilityKey: "critical-thinking",
          dimensions: ["Evidence Evaluation"],
          aiAssistanceLevel: "Level B",
          aiAssistanceDisclosure: "Level B (AI-Informed): Consulted AI coach for method clarification on co-intervention controls.",
          orderIndex: 1,
          isFeatured: false,
          createdAt: "2026-11-20T08:00:00.000Z",
          updatedAt: "2026-11-20T12:00:00.000Z",
        },
      ],
      createdAt: "2026-11-20T08:00:00.000Z",
      updatedAt: "2026-11-20T12:00:00.000Z",
    };

    const sectionThoughtfulAI: PortfolioSection = {
      id: "sec-ai",
      portfolioId: demoPortfolioId,
      sectionType: "thoughtful_ai_use",
      title: "Thoughtful AI Use Disclosures",
      subtitle: "How I engage AI as an interlocutor while maintaining critical agency",
      isVisible: true,
      orderIndex: 5,
      items: [
        {
          id: "item-ai-1",
          portfolioId: demoPortfolioId,
          sectionId: "sec-ai",
          sourceType: "custom_project",
          title: "My AI Collaboration Standard",
          description: "I treat AI tools as sparring partners rather than answer dispensers. When tackling complex challenges, I use AI exclusively to test assumptions, probe edge cases, and simulate counterarguments.",
          dimensions: ["Thoughtful AI Use", "Decision Ownership"],
          userReflection: "If an AI generates an entire solution, I have not practiced the cognitive skill. Meaningful growth requires doing the synthesis myself.",
          aiAssistanceLevel: "Level B",
          aiAssistanceDisclosure: "Level B (AI-Informed): Background exploration protocol with active human validation.",
          orderIndex: 1,
          isFeatured: true,
          createdAt: "2026-11-20T08:00:00.000Z",
          updatedAt: "2026-11-20T12:00:00.000Z",
        },
      ],
      createdAt: "2026-11-20T08:00:00.000Z",
      updatedAt: "2026-11-20T12:00:00.000Z",
    };

    const sectionReflections: PortfolioSection = {
      id: "sec-reflections",
      portfolioId: demoPortfolioId,
      sectionType: "personal_reflections",
      title: "Personal Metacognitive Reflections",
      subtitle: "Observations on cognitive habits and perspective changes",
      isVisible: true,
      orderIndex: 6,
      items: [
        {
          id: "item-ref-1",
          portfolioId: demoPortfolioId,
          sectionId: "sec-reflections",
          sourceType: "challenge_reflection",
          sourceRecordId: "ref-demo-2",
          title: "Overcoming Availability Heuristics in Design",
          description: "Reflections on how easily our first problem-solving thoughts latch onto familiar memories, and how structural constraints compel multi-disciplinary thinking.",
          capabilityKey: "creative-problem-solving",
          dimensions: ["Reflection and Self-Direction"],
          userReflection: "The first idea is almost always an echo of something we have seen recently. Forcing myself into three distinct categories broke that cognitive inertia and made me consider economics and passive telemetry.",
          aiAssistanceLevel: "Level A",
          aiAssistanceDisclosure: "Level A (Independent): Written as a personal metacognitive journal entry.",
          orderIndex: 1,
          isFeatured: true,
          createdAt: "2026-11-20T08:00:00.000Z",
          updatedAt: "2026-11-20T12:00:00.000Z",
        },
      ],
      createdAt: "2026-11-20T08:00:00.000Z",
      updatedAt: "2026-11-20T12:00:00.000Z",
    };

    const demoPortfolio: Portfolio = {
      id: demoPortfolioId,
      userId: demoUserId,
      publicSlug: demoSlug,
      displayName: "Alex Chen",
      headline: "Curious Systems Thinker & Human-Centered Problem Solver",
      personalIntroduction:
        "I am an aspiring researcher and developer passionate about urban systems, behavioral psychology, and human capability growth. I focus on developing rigorous reasoning habits and creative problem-solving fluency.",
      learningPhilosophy:
        "True capability is the capacity to think clearly, examine unstated premises, and design thoughtful interventions under real-world constraints. AI is an exceptional thinking partner, but human responsibility and discernment must anchor every decision.",
      areasOfInterest: ["Urban Systems", "Behavioral Economics", "Cognitive Heuristics", "Human-Centered AI"],
      isPublished: true,
      visibility: "public",
      publishedAt: "2026-11-20T12:00:00.000Z",
      sections: [
        sectionIntro,
        sectionCapabilities,
        sectionFeatured,
        sectionJourney,
        sectionThoughtfulAI,
        sectionReflections,
      ],
      settings: demoSettings,
      createdAt: "2026-11-20T08:00:00.000Z",
      updatedAt: "2026-11-20T12:00:00.000Z",
    };

    store.portfolios.set(demoUserId, demoPortfolio);
    store.portfolios.set("demo-user", demoPortfolio);
    store.slugIndex.set(demoSlug, demoUserId);

    globalThis.__OBHASH_PORTFOLIO_STORE__ = store;
  }
  return globalThis.__OBHASH_PORTFOLIO_STORE__;
}

export const portfolioLocalStore = {
  getPortfolioByUserId(userId: string): Portfolio {
    const store = getStore();
    const effectiveUserId = (userId === "demo-user" || userId === "demo-user-1") ? "demo-user-1" : userId;
    const existing = store.portfolios.get(effectiveUserId);
    if (existing) {
      return existing;
    }

    // Create fresh default draft portfolio for new users
    const newId = `port-${Date.now()}`;
    const slug = `user-${Math.random().toString(36).substring(2, 8)}`;
    const newPortfolio: Portfolio = {
      id: newId,
      userId: effectiveUserId,
      publicSlug: slug,
      displayName: "Learner",
      headline: "Human Capability Explorer",
      personalIntroduction: "Welcome to my capability development portfolio.",
      learningPhilosophy: "Developing independent reasoning and thoughtful problem-solving through authentic practice.",
      areasOfInterest: ["Critical Thinking", "Creative Problem-Solving", "Curiosity"],
      isPublished: false,
      visibility: "private",
      publishedAt: null,
      sections: [
        {
          id: `sec-intro-${newId}`,
          portfolioId: newId,
          sectionType: "personal_intro",
          title: "Personal Introduction",
          subtitle: "About my learning background",
          isVisible: true,
          orderIndex: 1,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sec-cap-${newId}`,
          portfolioId: newId,
          sectionType: "capability_overview",
          title: "Capability Overview",
          subtitle: "Demonstrated skills and indicators",
          isVisible: true,
          orderIndex: 2,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sec-feat-${newId}`,
          portfolioId: newId,
          sectionType: "featured_work",
          title: "Featured Work",
          subtitle: "Selected challenges and projects",
          isVisible: true,
          orderIndex: 3,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sec-jrn-${newId}`,
          portfolioId: newId,
          sectionType: "development_journey",
          title: "Development Journey",
          subtitle: "Goals and milestones",
          isVisible: true,
          orderIndex: 4,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sec-ai-${newId}`,
          portfolioId: newId,
          sectionType: "thoughtful_ai_use",
          title: "Thoughtful AI Use",
          subtitle: "How I engage AI assistance",
          isVisible: true,
          orderIndex: 5,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sec-ref-${newId}`,
          portfolioId: newId,
          sectionType: "personal_reflections",
          title: "Personal Reflections",
          subtitle: "Key metacognitive discoveries",
          isVisible: true,
          orderIndex: 6,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      settings: {
        id: `set-${newId}`,
        portfolioId: newId,
        allowSearchIndexing: false,
        showCapabilityBadges: true,
        showAiDisclosures: true,
        showReflections: true,
        showJourneyTimeline: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.portfolios.set(effectiveUserId, newPortfolio);
    store.slugIndex.set(slug, effectiveUserId);
    return newPortfolio;
  },

  getPortfolioBySlug(slug: string): Portfolio | null {
    const store = getStore();
    const userId = store.slugIndex.get(slug);
    if (!userId) {
      // Check all portfolios in case of manual slug update
      for (const p of store.portfolios.values()) {
        if (p.publicSlug === slug) {
          return p;
        }
      }
      return null;
    }
    return store.portfolios.get(userId) || null;
  },

  savePortfolio(portfolio: Portfolio): Portfolio {
    const store = getStore();
    portfolio.updatedAt = new Date().toISOString();
    store.portfolios.set(portfolio.userId, portfolio);
    store.slugIndex.set(portfolio.publicSlug, portfolio.userId);
    return portfolio;
  },

  addItemToSection(userId: string, sectionType: string, itemData: Omit<PortfolioItem, "id" | "portfolioId" | "sectionId" | "createdAt" | "updatedAt">): PortfolioItem {
    const portfolio = this.getPortfolioByUserId(userId);
    const section = portfolio.sections.find((s) => s.sectionType === sectionType);
    if (!section) {
      throw new Error(`Section with type ${sectionType} not found in portfolio`);
    }

    const newItem: PortfolioItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      portfolioId: portfolio.id,
      sectionId: section.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    section.items.push(newItem);
    this.savePortfolio(portfolio);
    return newItem;
  },

  removeItem(userId: string, itemId: string): boolean {
    const portfolio = this.getPortfolioByUserId(userId);
    let removed = false;
    for (const sec of portfolio.sections) {
      const idx = sec.items.findIndex((i) => i.id === itemId);
      if (idx !== -1) {
        sec.items.splice(idx, 1);
        removed = true;
        break;
      }
    }
    if (removed) {
      this.savePortfolio(portfolio);
    }
    return removed;
  },
};
