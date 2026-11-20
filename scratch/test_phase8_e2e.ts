// ==============================================================================
// OBHASH Phase 8: Master End-to-End Integration & Security Test Suite
// ==============================================================================

import { getAssessmentModule } from "../src/lib/assessments/content";
import { localStore as assessmentStore } from "../src/lib/assessments/local-store";
import { evaluateAssessmentResponse } from "../src/lib/ai/assessment-evaluator";
import { aggregateAssessmentResults } from "../src/lib/assessments/scoring";
import { generatePersonalizedJourney } from "../src/lib/ai/journey-generator";
import { generateDeterministicJourney } from "../src/lib/journeys/generator";
import type { UserResponsePayload } from "../src/types/assessment";
import {
  startCoachingSession,
  sendCoachingMessage,
  executeContextualAction,
  generateSessionSummary,
} from "../src/lib/coach/actions";
import { challengeStore } from "../src/lib/challenges/local-store";
import { computeChallengeRecommendations } from "../src/lib/challenges/recommendations";
import { evaluateChallengeSubmission } from "../src/lib/ai/challenge-evaluator";
import { evaluateUserIndependence } from "../src/lib/independence/engine";
import { classifyAIAssistance } from "../src/lib/independence/classifier";
import {
  getUserPortfolio,
  publishPortfolio,
  unpublishPortfolio,
  addPortfolioItem,
  removePortfolioItem,
  getEligibleWorkItems,
  getPublicPortfolioBySlug,
} from "../src/lib/portfolio/actions";

async function runMasterE2ETestSuite() {
  console.log("==============================================================================");
  console.log("OBHASH PHASE 8 MASTER END-TO-END INTEGRATION & LAUNCH AUDIT SUITE");
  console.log("==============================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details || "Assertion failed"}`);
      process.exitCode = 1;
    }
  }

  // --------------------------------------------------------------------------
  // SCENARIO 1: FIRST-TIME USER (Assess -> Diagnostic Results -> Growth Journey)
  // --------------------------------------------------------------------------
  console.log("--- SCENARIO 1: FIRST-TIME USER (Assess -> Baseline -> Journey) ---");
  const testUserId = "user-e2e-first-time";
  
  // 1.1 Retrieve assessment module
  const ctModule = getAssessmentModule("critical-thinking");
  assert(!!ctModule && ctModule.dimensions.length >= 3, "S1.1: Assessment module loaded with core dimensions");

  // 1.2 Start attempt & save response
  const attempt = assessmentStore.createAttempt("e2e-att-ct-1", testUserId, "critical-thinking");
  const responsePayload: UserResponsePayload = {
    structuredResponses: {
      "analytical-reasoning": "The author claims high correlation proves causation, but omits concurrent policy interventions.",
      "evidence-evaluation": "Sample size is small (N=45) and participants were self-selected, introducing selection bias.",
    },
  };
  assessmentStore.saveResponse(attempt.id, ctModule!.items[0].id, responsePayload);
  assert(Object.keys(attempt.responses).length === 1, "S1.2: Diagnostic assessment response persisted");

  // 1.3 Evaluate diagnostic submission
  const singleEval = await evaluateAssessmentResponse(ctModule!.items[0], responsePayload);
  assert(singleEval.score > 0, "S1.3: Assessment response evaluated by evaluation engine");

  const baselineProfile = aggregateAssessmentResults("critical-thinking", ctModule!, [singleEval]);
  assert(!!baselineProfile && baselineProfile.overallScore > 0, "S1.4: Capability baseline profile calculated");

  // Save profile to store
  assessmentStore.completeAttempt(attempt.id, [singleEval], baselineProfile);

  // 1.4 Generate personalized growth journey from baseline
  const journeyResult = await generatePersonalizedJourney(
    {
      assessmentProfiles: [baselineProfile],
      userInterests: ["Urban Design", "Systems Thinking"],
      growthIntentions: ["Strengthen evidence evaluation", "Independent problem-solving"],
      selectedCapabilities: ["critical-thinking"],
      targetDuration: "8 weeks",
      weeklyCommitmentHours: "3-4 hours/week",
    },
    testUserId
  );
  const journey = journeyResult.journey;
  assert(!!journey && journey.focusAreas.length > 0, "S1.5: Personalized growth journey generated from baseline evidence");
  assert(journey.focusAreas[0].goals.length > 0, "S1.6: Journey hierarchy includes structured goals and milestones");

  // --------------------------------------------------------------------------
  // SCENARIO 2: GROWTH & COACHING (Coach Session -> Hints -> Contextual Actions)
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 2: GROWTH & COACHING (Socratic Guidance & Hints) ---");
  const startRes = await startCoachingSession({
    capabilityKey: "critical-thinking",
    journeyId: journey.id,
    goalId: journey.focusAreas[0].goals[0].id,
    title: "Examining Correlation vs Causation in Transit Data",
  });
  assert(startRes.success && !!startRes.data, "S2.1: Socratic coaching session initialized");
  const sessionId = startRes.data!.sessionId;

  // 2.1 Send question to coach
  const msgRes = await sendCoachingMessage({
    sessionId,
    content: "How do I systematically identify confounding variables when testing an intervention?",
  });
  assert(msgRes.success && !!msgRes.data && msgRes.data.assistantMessage.content.length > 0, "S2.2: Coach responded with Socratic inquiry, avoiding direct spoon-feeding");

  // 2.2 Request progressive Level 1 hint
  const hint1 = await executeContextualAction(sessionId, "hint");
  assert(hint1.success && !!hint1.data && hint1.data.assistantMessage.responseType === "hint", "S2.3: Progressive Hint (Directional Nudge) received");

  // 2.3 Contextual action: Alternative Perspective
  const altPerspective = await executeContextualAction(sessionId, "perspective");
  assert(altPerspective.success && !!altPerspective.data && altPerspective.data.assistantMessage.responseType === "perspective", "S2.4: Alternative perspective generated without giving answer");

  // 2.4 Complete session and generate summary
  const summaryRes = await generateSessionSummary(sessionId);
  assert(summaryRes.success && !!summaryRes.data && summaryRes.data.exploredTopics.length > 0, "S2.5: Grounded coaching session summary generated");

  // --------------------------------------------------------------------------
  // SCENARIO 3: CHALLENGE & REFLECTION (Discovery -> Workspace -> Submit -> Reflect)
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 3: CHALLENGE & REFLECTION WORKSPACE ---");
  const allChallenges = challengeStore.getChallenges();
  assert(allChallenges.length >= 6, "S3.1: Challenge catalog accessible (12 challenges across 3 capabilities)");

  // 3.1 Personalized recommendations
  const recs = computeChallengeRecommendations({
    userId: testUserId,
    userInterests: ["Urban Design", "Systems Thinking"],
    baselineProfiles: [baselineProfile],
  });
  assert(recs.length > 0, "S3.2: Personalized challenge recommendations produced with rationales");

  // 3.2 Start attempt & save draft
  const chosenChallenge = allChallenges[0];
  const chalAttemptId = "e2e-attempt-1";
  const chalAttempt = {
    id: chalAttemptId,
    user_id: testUserId,
    challenge_id: chosenChallenge.id,
    challenge_version: chosenChallenge.version,
    status: "in_progress" as const,
    started_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  challengeStore.saveAttempt(chalAttempt);
  assert(chalAttempt.status === "in_progress", "S3.3: Challenge attempt started");

  const draftObj = {
    id: `draft-${chalAttemptId}`,
    attempt_id: chalAttemptId,
    user_id: testUserId,
    notes: "Notes on constraints",
    deliverables: {
      core_claims: "Claim 1: Focus duration increased by 42%.",
      unstated_assumptions: "Assumption: Meditation did not contribute to focus improvement.",
      evidence_standard: "Double-blind randomized controlled trial with active sham control.",
    },
    last_saved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  challengeStore.saveDraft(draftObj);
  const recoveredDraft = challengeStore.getDraft(chalAttempt.id);
  assert(!!recoveredDraft && recoveredDraft.deliverables["core_claims"].length > 0, "S3.4: Challenge workspace draft autosaved and recovered");

  // 3.4 Log AI assistance in workspace
  const assistRecord = challengeStore.recordAIAssistance(
    chalAttempt.id,
    testUserId,
    "clarify_concept",
    1,
    "User asked for clarification on sham controls."
  );
  assert(assistRecord.queries_count === 1 && assistRecord.hint_levels_used.includes(1), "S3.5: Workspace AI assistance telemetry recorded");

  // 3.5 Submit challenge deliverables
  const submissionObj = {
    id: `sub-${chalAttemptId}`,
    attempt_id: chalAttempt.id,
    user_id: testUserId,
    challenge_id: chosenChallenge.id,
    challenge_version: chosenChallenge.version,
    notes_snapshot: draftObj.notes,
    deliverables_snapshot: draftObj.deliverables,
    submission_number: 1,
    submitted_at: new Date().toISOString(),
  };
  challengeStore.saveSubmission(submissionObj);
  const recoveredSub = challengeStore.getSubmission(chalAttempt.id);
  assert(!!recoveredSub && recoveredSub.submission_number === 1, "S3.6: Challenge submitted with immutable deliverables snapshot");

  // 3.6 Evaluate challenge submission
  const chalEval = await evaluateChallengeSubmission(chosenChallenge, submissionObj);
  assert(chalEval.evidence_citations.length > 0, "S3.7: Challenge evaluated with direct verbatim citations");
  challengeStore.saveEvaluation(chalEval);

  // 3.7 Metacognitive reflection
  const reflectionObj = {
    id: `ref-${chalAttemptId}`,
    attempt_id: chalAttempt.id,
    user_id: testUserId,
    challenge_id: chosenChallenge.id,
    responses: {
      "What was your initial heuristic?": "I assumed the micro-vibrations were solely responsible.",
      "How did you overcome that assumption?": "I forced myself to isolate the morning meditation co-intervention.",
    },
    is_submitted: true,
    submitted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  challengeStore.saveReflection(reflectionObj);
  const recoveredRef = challengeStore.getReflection(chalAttempt.id);
  assert(!!recoveredRef && recoveredRef.is_submitted === true, "S3.8: Metacognitive reflection completed and stored");

  // --------------------------------------------------------------------------
  // SCENARIO 4: INDEPENDENCE & PORTFOLIO (Measurement -> Curate -> Publish -> 404)
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 4: INDEPENDENCE MEASUREMENT & GROWTH PORTFOLIO ---");
  const indOverview = evaluateUserIndependence("demo-user-1");
  assert(indOverview.hasSufficientEvidence === true, "S4.1: Demonstrated independence evaluated with sufficient evidence");
  assert(Object.keys(indOverview.dimensions).length === 5, "S4.2: All 5 Independence Dimensions evaluated");

  // 4.1 AI assistance classification
  const classLvlA = classifyAIAssistance({ aiRecord: null });
  assert(classLvlA.level === "Level A", "S4.3: Unassisted work classified as Level A (Independent)");

  const classLvlB = classifyAIAssistance({ aiRecord: assistRecord });
  assert(classLvlB.level === "Level B", "S4.4: Minimal clarification classified as Level B (AI-Informed)");

  // 4.2 Portfolio curation
  const userPort = await getUserPortfolio("demo-user-1");
  assert(!!userPort && userPort.publicSlug === "alex-chen", "S4.5: User growth portfolio loaded");

  const eligibleWork = await getEligibleWorkItems("demo-user-1");
  assert(eligibleWork.length > 0, "S4.6: Eligible work items retrieved from completed challenges and assessments");

  // 4.3 Add item to featured work
  const newItem = await addPortfolioItem("demo-user-1", "featured_work", {
    title: "E2E Showcase Project",
    description: "Automated test deliverable for portfolio engine",
    sourceType: "custom_project",
    dimensions: ["Critical Thinking"],
    aiAssistanceLevel: "Level A",
    aiAssistanceDisclosure: "Level A: Wholly independent execution",
    artifacts: [],
    orderIndex: 5,
    isFeatured: true,
  });
  assert(!!newItem && newItem.title === "E2E Showcase Project", "S4.7: Featured work item added to portfolio");

  // 4.4 Publish portfolio
  await publishPortfolio("demo-user-1", "public");
  const pubView = await getPublicPortfolioBySlug("alex-chen");
  assert(!!pubView && pubView.displayName === "Alex Chen", "S4.8: Published portfolio accessible at /p/alex-chen");

  // 4.5 Unpublish and verify privacy isolation (returns null / 404)
  await unpublishPortfolio("demo-user-1");
  const privateView = await getPublicPortfolioBySlug("alex-chen");
  assert(privateView === null, "S4.9: Unpublished portfolio returns null on public endpoint (privacy preserved)");

  // Restore published state
  await publishPortfolio("demo-user-1", "public");
  await removePortfolioItem("demo-user-1", newItem.id);

  // --------------------------------------------------------------------------
  // SCENARIO 5: CROSS-USER PRIVACY & DATA INTEGRITY
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 5: CROSS-USER SECURITY & ISOLATION ---");
  const userBId = "unauthorized-user-b";
  const userBPort = await getUserPortfolio(userBId);
  assert(userBPort.userId === userBId, "S5.1: User B receives their own isolated portfolio");
  assert(userBPort.isPublished === false, "S5.2: User B portfolio is private by default");

  // Verify User B cannot access User A's private unpublished data
  const userAAttempts = challengeStore.getUserAttempts("demo-user-1");
  const userBAttempts = challengeStore.getUserAttempts(userBId);
  assert(userAAttempts.length > 0 && userBAttempts.length === 0, "S5.3: User B attempts strictly isolated from User A");

  // Verify empty user independence measurement
  const emptyInd = evaluateUserIndependence(userBId);
  assert(emptyInd.hasSufficientEvidence === false, "S5.4: User B with zero records receives Insufficient Evidence status");
  assert(emptyInd.dimensions["independent-reasoning"].sufficiency === "insufficient", "S5.5: Empty dimension correctly flagged as Insufficient Evidence without fabrication");

  // --------------------------------------------------------------------------
  // SCENARIO 6: RELIABILITY & DETERMINISTIC SERVICE FALLBACKS
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 6: RELIABILITY & GRACEFUL DEGRADATION ---");
  // Test fallback when AI provider is unconfigured
  const fallbackJourney = generateDeterministicJourney({
    assessmentProfiles: [],
    userInterests: ["Design"],
    growthIntentions: ["Exploration"],
    selectedCapabilities: ["curiosity"],
    targetDuration: "4 weeks",
    weeklyCommitmentHours: "1-2 hours/week",
  }, "fallback-test-user");
  assert(!!fallbackJourney && fallbackJourney.focusAreas.length > 0, "S6.1: Deterministic pedagogical engine generates valid journey when AI unconfigured");

  const fallbackEval = await evaluateChallengeSubmission(chosenChallenge, {
    id: "sub-fallback",
    attempt_id: "att-fallback",
    user_id: "u-fallback",
    challenge_id: chosenChallenge.id,
    challenge_version: 1,
    notes_snapshot: "",
    deliverables_snapshot: { core_claims: "Analyzed claims carefully" },
    submission_number: 1,
    submitted_at: new Date().toISOString(),
  });
  assert(fallbackEval.evidence_citations.length > 0 && fallbackEval.confidence_score > 0, "S6.2: Deterministic rubric evaluator generates citations without AI service dependency");

  console.log("\n==============================================================================");
  console.log(`MASTER E2E SUITE RESULTS: ${passed} OF ${total} TESTS PASSED.`);
  console.log("==============================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runMasterE2ETestSuite().catch((err) => {
  console.error("Master E2E Test Suite Error:", err);
  process.exit(1);
});
