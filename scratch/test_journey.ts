/**
 * Automated Test Suite for Phase 4: Personalized Growth Journey Engine
 */

import { generateDeterministicJourney } from "../src/lib/journeys/generator";
import { generatePersonalizedJourney } from "../src/lib/ai/journey-generator";
import {
  saveGrowthJourney,
  getActiveGrowthJourney,
  getGrowthJourneyById,
  getUserGrowthJourneys,
  updateJourneyStatus,
  updateGoalStatus,
  updateMilestoneStatus,
  updateActivityStatus,
  updateJourneyDetails,
} from "../src/lib/journeys/actions";
import type { CapabilityBaselineProfile } from "../src/types/assessment";
import type { JourneyPersonalizationInput } from "../src/types/journey";

async function runTests() {
  console.log("================================================================");
  console.log("OBHASH Phase 4: Growth Journey Engine Test Suite");
  console.log("================================================================\n");

  const mockProfiles: CapabilityBaselineProfile[] = [
    {
      capabilityKey: "critical-thinking",
      capabilityName: "Critical Thinking",
      overallScore: 3.25,
      performanceLevel: "Strongly Demonstrating",
      dimensionResults: [
        {
          slug: "analytical-reasoning",
          name: "Analytical Reasoning",
          score: 3.5,
          level: "Strongly Demonstrating",
          evidence: ["Isolates foundational axioms and premises clearly."],
        },
        {
          slug: "evidence-evaluation",
          name: "Evidence Evaluation",
          score: 2.25,
          level: "Developing",
          evidence: ["Noted third-party funding but missed confounding variable in transit data."],
        },
      ],
      strengthsSummary: ["Axiomatic deconstruction", "Logical consistency"],
      opportunitiesSummary: ["Audit confounding factors in observational studies"],
      evidenceSummary: ["Explicit critique of sample bias"],
      assessedAt: new Date().toISOString(),
    },
    {
      capabilityKey: "curiosity",
      capabilityName: "Curiosity",
      overallScore: 2.75,
      performanceLevel: "Demonstrating",
      dimensionResults: [
        {
          slug: "question-formulation",
          name: "Question Formulation",
          score: 2.5,
          level: "Demonstrating",
          evidence: ["Asked probing second-order questions."],
        },
      ],
      strengthsSummary: ["Intellectual openness", "Generative questioning"],
      opportunitiesSummary: ["Inquiry tree structuring"],
      evidenceSummary: ["Explored historical analogies"],
      assessedAt: new Date().toISOString(),
    },
  ];

  // Test 1: Complete Assessment Personalization Input
  console.log("--- Test 1: Deterministic Journey Generation with Complete Evidence ---");
  const input1: JourneyPersonalizationInput = {
    assessmentProfiles: mockProfiles,
    userInterests: ["Urban Design", "Ecological Systems"],
    growthIntentions: ["Think more clearly", "Make better policy decisions"],
    selectedCapabilities: ["critical-thinking", "curiosity"],
    targetDuration: "8 weeks",
    weeklyCommitmentHours: "3-4 hours/week",
  };

  const journey1 = generateDeterministicJourney(input1, "test-user-1");
  console.log(`Generated Journey Title: "${journey1.title}"`);
  console.log(`Focus Areas Count: ${journey1.focusAreas.length}`);
  console.log(`Primary Priorities: ${journey1.primaryPriorities.join(", ")}`);

  if (journey1.focusAreas.length !== 2) throw new Error("Expected 2 focus areas");
  const ctFa = journey1.focusAreas.find((f) => f.capabilityKey === "critical-thinking");
  if (!ctFa) throw new Error("Expected critical-thinking focus area");
  console.log(`Focus Area 1 Rationale: "${ctFa.rationale.substring(0, 90)}..."`);
  console.log(`Goals in Focus Area 1: ${ctFa.goals.length}`);
  const firstGoal = ctFa.goals[0];
  console.log(`Goal 1: "${firstGoal.title}"`);
  console.log(`Reason for Recommendation: "${firstGoal.reasonForRecommendation}"`);
  if (!firstGoal.reasonForRecommendation.includes("baseline evaluation")) {
    throw new Error("Expected evidence citation in recommendation reason");
  }
  console.log("✓ Test 1 Passed.\n");

  // Test 2: AI Hybrid / Fallback Generation
  console.log("--- Test 2: AI Hybrid Engine (Graceful Fallback Validation) ---");
  const genResult = await generatePersonalizedJourney(input1, "test-user-1");
  console.log(`Generation Type: ${genResult.generationType}`);
  console.log(`Provider: ${genResult.provider}`);
  console.log(`Model: ${genResult.modelName}`);
  console.log(`Generated Title: "${genResult.journey.title}"`);
  if (!genResult.journey.title || genResult.journey.focusAreas.length === 0) {
    throw new Error("Invalid generated journey structure");
  }
  console.log("✓ Test 2 Passed.\n");

  // Test 3: Unassessed User Journey Generation (Graceful Handling of Insufficient Evidence)
  console.log("--- Test 3: Unassessed User Journey Generation ---");
  const inputUnassessed: JourneyPersonalizationInput = {
    assessmentProfiles: [],
    userInterests: ["Technology Ethics"],
    growthIntentions: ["Strengthen critical inquiry"],
    selectedCapabilities: ["creative-problem-solving"],
    targetDuration: "4 weeks",
    weeklyCommitmentHours: "1-2 hours/week",
  };
  const journeyUnassessed = generateDeterministicJourney(inputUnassessed, "test-user-2");
  console.log(`Unassessed Journey Title: "${journeyUnassessed.title}"`);
  const unassessedFa = journeyUnassessed.focusAreas[0];
  console.log(`Unassessed Rationale: "${unassessedFa.rationale}"`);
  if (unassessedFa.rationale.includes("revealed a baseline score")) {
    throw new Error("Should not cite baseline score when unassessed");
  }
  console.log("✓ Test 3 Passed.\n");

  // Test 4: Journey Persistence & Retrieval via Actions
  console.log("--- Test 4: Journey Persistence and Hierarchy Retrieval ---");
  const saveRes = await saveGrowthJourney(journey1);
  if (!saveRes.success || !saveRes.data) {
    throw new Error(`Save failed: ${saveRes.error}`);
  }
  const journeyId = saveRes.data.journeyId;
  console.log(`Saved Journey ID: ${journeyId}`);

  const retrieved = await getGrowthJourneyById(journeyId);
  if (!retrieved) throw new Error("Failed to retrieve saved journey");
  console.log(`Retrieved Journey Title: "${retrieved.title}"`);
  console.log(`Retrieved Focus Areas: ${retrieved.focusAreas.length}`);
  console.log("✓ Test 4 Passed.\n");

  // Test 5: Status Management (Journey, Goal, Milestone, Activity)
  console.log("--- Test 5: Interactive Status Management ---");
  const goalId = retrieved.focusAreas[0].goals[0].id;
  const milestoneId = retrieved.focusAreas[0].goals[0].milestones[0].id;
  const activityId = retrieved.focusAreas[0].goals[0].milestones[0].activities[0].id;

  // Update activity status
  const actRes = await updateActivityStatus(journeyId, activityId, "completed");
  if (!actRes.success) throw new Error("Failed to update activity status");
  console.log(`Activity ${activityId} updated to: ${actRes.data?.status}`);

  // Update milestone status
  const msRes = await updateMilestoneStatus(journeyId, milestoneId, "in_progress");
  if (!msRes.success) throw new Error("Failed to update milestone status");
  console.log(`Milestone ${milestoneId} updated to: ${msRes.data?.status}`);

  // Update goal status
  const goalRes = await updateGoalStatus(journeyId, goalId, "in_progress");
  if (!goalRes.success) throw new Error("Failed to update goal status");
  console.log(`Goal ${goalId} updated to: ${goalRes.data?.status}`);

  // Update journey status
  const jStatusRes = await updateJourneyStatus(journeyId, "paused");
  if (!jStatusRes.success) throw new Error("Failed to update journey status");
  console.log(`Journey ${journeyId} updated to: ${jStatusRes.data?.status}`);

  // Edit journey details
  const editRes = await updateJourneyDetails(journeyId, {
    title: "Customized Journey Title: Urban Systems Synthesis",
    description: "Refined description after initial reflection.",
  });
  if (!editRes.success) throw new Error("Failed to update journey details");

  const reloaded = await getGrowthJourneyById(journeyId);
  if (!reloaded) throw new Error("Failed to reload journey");
  if (reloaded.title !== "Customized Journey Title: Urban Systems Synthesis") {
    throw new Error("Journey title update did not persist");
  }
  console.log(`Updated Journey Title Confirmed: "${reloaded.title}"`);
  console.log("✓ Test 5 Passed.\n");

  // Test 6: Journey History Preservation
  console.log("--- Test 6: Journey History Preservation ---");
  const allJourneys = await getUserGrowthJourneys();
  console.log(`Total Journeys in History: ${allJourneys.length}`);
  if (allJourneys.length < 1) throw new Error("Expected at least 1 journey in history");
  console.log("✓ Test 6 Passed.\n");

  console.log("================================================================");
  console.log("All 6 Test Suites Passed Successfully! Phase 4 Engine Verified.");
  console.log("================================================================");
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
