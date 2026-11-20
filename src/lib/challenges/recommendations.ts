import type { ChallengeRecommendation } from "@/types/challenge";
import type { CapabilityBaselineProfile } from "@/types/assessment";
import type { GrowthJourneyData } from "@/types/journey";
import { CHALLENGE_CATALOG } from "./catalog";

export interface RecommendationContext {
  userId: string;
  baselineProfiles?: CapabilityBaselineProfile[];
  activeJourney?: GrowthJourneyData | null;
  userInterests?: string[];
  completedChallengeIds?: string[];
}

export function computeChallengeRecommendations(
  context: RecommendationContext,
  limit = 4
): ChallengeRecommendation[] {
  const completedSet = new Set(context.completedChallengeIds || []);
  const availableChallenges = CHALLENGE_CATALOG.filter((c) => !completedSet.has(c.id));

  // Extract focus areas and active goals from Phase 4 journey
  const focusAreas = context.activeJourney?.focusAreas || [];
  const focusCapabilityKeys = new Set(focusAreas.map((fa) => fa.capabilityKey));

  // Extract developmental opportunities and dimensions from Phase 3 baseline
  const baselineOpportunities = new Set<string>();
  const dimensionScoreMap = new Map<string, number>();

  if (context.baselineProfiles) {
    for (const profile of context.baselineProfiles) {
      if (profile.opportunitiesSummary) {
        for (const opp of profile.opportunitiesSummary) {
          baselineOpportunities.add(opp.toLowerCase());
        }
      }
      if (profile.dimensionResults) {
        for (const dimResult of profile.dimensionResults) {
          dimensionScoreMap.set(dimResult.name.toLowerCase(), dimResult.score);
        }
      }
    }
  }

  const recommendations: ChallengeRecommendation[] = availableChallenges.map((challenge) => {
    let score = 50; // base score
    const rationales: string[] = [];
    let matchedGoalTitle: string | undefined;
    let matchedDimension: string | undefined;

    // 1. Capability Focus Area Alignment (+25 points)
    if (focusCapabilityKeys.has(challenge.capability_category)) {
      score += 25;
      const matchedArea = focusAreas.find((fa) => fa.capabilityKey === challenge.capability_category);
      if (matchedArea) {
        const outcome = matchedArea.intendedOutcomes[0] || matchedArea.capabilityName;
        rationales.push(`Aligns directly with your active focus area: ${outcome}`);
      }
    }

    // 2. Development Goal Alignment (+20 points)
    for (const fa of focusAreas) {
      for (const goal of fa.goals) {
        if (fa.capabilityKey === challenge.capability_category) {
          score += 20;
          matchedGoalTitle = goal.title;
          rationales.push(`Supports your development target: "${goal.title}"`);
          break;
        }
      }
      if (matchedGoalTitle) break;
    }

    // 3. Capability Dimension & Development Opportunity Match (+15 points)
    for (const dim of challenge.relevant_dimensions) {
      const dimLower = dim.toLowerCase();
      // Check if dimension was identified as growth opportunity
      for (const opp of baselineOpportunities) {
        if (opp.includes(dimLower) || dimLower.includes(opp)) {
          score += 15;
          matchedDimension = dim;
          rationales.push(`Directly practices ${dim}, identified in your baseline assessment`);
          break;
        }
      }

      // Slightly prioritize dimensions in the developing / demonstrating range (score 2-3)
      const dimScore = dimensionScoreMap.get(dimLower);
      if (dimScore && dimScore >= 2 && dimScore <= 3) {
        score += 10;
        if (!matchedDimension) matchedDimension = dim;
      }
    }

    // 4. User Interest Context (+10 points)
    if (context.userInterests && context.userInterests.length > 0) {
      const challengeText = `${challenge.title} ${challenge.short_description} ${challenge.scenario}`.toLowerCase();
      for (const interest of context.userInterests) {
        if (challengeText.includes(interest.toLowerCase())) {
          score += 10;
          rationales.push(`Intersects with your expressed interest in ${interest}`);
          break;
        }
      }
    }

    // 5. Difficulty Balance
    if (challenge.difficulty === "intermediate") {
      score += 5; // Ideal default sweet spot for capability practice
    }

    const defaultRationale = `Provides high-impact practice in ${challenge.capability_category.replace("-", " ")} through ${challenge.relevant_dimensions.join(", ")}.`;
    const finalRationale = rationales.length > 0 ? rationales[0] : defaultRationale;

    return {
      challenge,
      score,
      rationale: finalRationale,
      relatedGoalTitle: matchedGoalTitle,
      relatedDimension: matchedDimension || challenge.relevant_dimensions[0],
    };
  });

  return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
}
