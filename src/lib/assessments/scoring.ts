import type {
  AssessmentCapabilityKey,
  AssessmentModuleData,
  CapabilityBaselineProfile,
  DimensionAggregatedScore,
  PerformanceLevel,
  SingleEvaluationResult,
} from "@/types/assessment";

/**
 * Maps a numeric score (1.00 - 4.00) to its descriptive performance tier.
 */
export function getPerformanceTier(score: number): PerformanceLevel {
  if (score < 1.75) return "Emerging";
  if (score < 2.51) return "Developing";
  if (score < 3.41) return "Demonstrating";
  return "Strongly Demonstrating";
}

/**
 * Aggregates individual activity evaluations into a comprehensive capability baseline profile.
 */
export function aggregateAssessmentResults(
  moduleSlug: AssessmentCapabilityKey,
  moduleData: AssessmentModuleData,
  evaluations: SingleEvaluationResult[]
): CapabilityBaselineProfile {
  // Group evaluations by dimension
  const dimensionMap = new Map<
    string,
    { name: string; scores: number[]; evidenceList: string[] }
  >();

  // Initialize with all module dimensions so none are missing
  for (const dim of moduleData.dimensions) {
    dimensionMap.set(dim.slug, {
      name: dim.name,
      scores: [],
      evidenceList: [],
    });
  }

  const allStrengths: string[] = [];
  const allOpportunities: string[] = [];
  const allEvidence: string[] = [];

  for (const evalItem of evaluations) {
    const existing = dimensionMap.get(evalItem.dimensionSlug);
    if (existing) {
      existing.scores.push(evalItem.score);
      if (evalItem.evidence) existing.evidenceList.push(evalItem.evidence);
    } else {
      dimensionMap.set(evalItem.dimensionSlug, {
        name: evalItem.dimensionName,
        scores: [evalItem.score],
        evidenceList: evalItem.evidence ? [evalItem.evidence] : [],
      });
    }

    if (evalItem.strengths) {
      allStrengths.push(...evalItem.strengths);
    }
    if (evalItem.developmentOpportunities) {
      allOpportunities.push(...evalItem.developmentOpportunities);
    }
    if (evalItem.evidence) {
      allEvidence.push(evalItem.evidence);
    }
  }

  // Calculate scores per dimension
  const dimensionResults: DimensionAggregatedScore[] = [];
  let totalScoreSum = 0;
  let scoredDimensionCount = 0;

  for (const [slug, data] of dimensionMap.entries()) {
    let avgScore = 2.0; // default baseline if no responses evaluated
    if (data.scores.length > 0) {
      const sum = data.scores.reduce((a, b) => a + b, 0);
      avgScore = Math.round((sum / data.scores.length) * 100) / 100;
      totalScoreSum += avgScore;
      scoredDimensionCount++;
    } else {
      totalScoreSum += 2.0;
      scoredDimensionCount++;
    }

    dimensionResults.push({
      slug,
      name: data.name,
      score: avgScore,
      level: getPerformanceTier(avgScore),
      evidence: data.evidenceList,
    });
  }

  const overallScore =
    scoredDimensionCount > 0
      ? Math.round((totalScoreSum / scoredDimensionCount) * 100) / 100
      : 2.0;

  const performanceLevel = getPerformanceTier(overallScore);

  // Deduplicate and filter summaries
  const uniqueStrengths = Array.from(new Set(allStrengths)).slice(0, 5);
  const uniqueOpportunities = Array.from(new Set(allOpportunities)).slice(0, 5);
  const uniqueEvidence = Array.from(new Set(allEvidence)).slice(0, 6);

  return {
    capabilityKey: moduleSlug,
    capabilityName: moduleData.name,
    overallScore,
    performanceLevel,
    dimensionResults,
    strengthsSummary: uniqueStrengths,
    opportunitiesSummary: uniqueOpportunities,
    evidenceSummary: uniqueEvidence,
    assessedAt: new Date().toISOString(),
  };
}
