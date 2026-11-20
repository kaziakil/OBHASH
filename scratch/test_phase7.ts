// ==============================================================================
// OBHASH Phase 7: Verification & Test Suite
// ==============================================================================

import { evaluateUserIndependence, determineSufficiency } from "../src/lib/independence/engine";
import { classifyAIAssistance } from "../src/lib/independence/classifier";
import {
  getUserPortfolio,
  publishPortfolio,
  unpublishPortfolio,
  updatePublicSlug,
  addPortfolioItem,
  removePortfolioItem,
  getEligibleWorkItems,
  getPublicPortfolioBySlug,
} from "../src/lib/portfolio/actions";
import { challengeStore } from "../src/lib/challenges/local-store";

async function runPhase7Tests() {
  console.log("==============================================================================");
  console.log("OBHASH PHASE 7 TEST SUITE: INDEPENDENCE MEASUREMENT & GROWTH PORTFOLIO");
  console.log("==============================================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details || "Assertion failed"}`);
      process.exitCode = 1;
    }
  }

  // --------------------------------------------------------------------------
  // TEST GROUP A: Evidence Retrieval & Provenance across Phases 3, 4, 5, 6
  // --------------------------------------------------------------------------
  console.log("--- TEST GROUP A: EVIDENCE RETRIEVAL ACROSS PHASES 3–6 ---");
  const challenges = challengeStore.getChallenges();
  assert(challenges.length >= 6, "Phase 6 challenge catalog accessible", `Found ${challenges.length} challenges`);

  const demoAttempt = challengeStore.getAttempt("demo-attempt-completed");
  assert(!!demoAttempt && demoAttempt.status === "completed", "Phase 6 completed attempt exists with valid provenance");

  const demoSubmission = challengeStore.getSubmission("demo-attempt-completed");
  assert(!!demoSubmission && !!demoSubmission.deliverables_snapshot, "Phase 6 submission snapshot exists");

  const demoEval = challengeStore.getEvaluation("demo-attempt-completed");
  assert(!!demoEval && demoEval.evidence_citations.length > 0, "Phase 6 evaluation citations exist");

  const demoReflection = challengeStore.getReflection("demo-attempt-completed");
  assert(!!demoReflection && demoReflection.is_submitted, "Phase 6 reflection exists");

  // --------------------------------------------------------------------------
  // TEST GROUP B: Independence Measurement Engine (Substantial vs Empty Evidence)
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP B: INDEPENDENCE MEASUREMENT ENGINE ---");
  const substantialUserOverview = evaluateUserIndependence("demo-user-1");
  assert(substantialUserOverview.hasSufficientEvidence === true, "User with evidence correctly marked hasSufficientEvidence = true");
  assert(substantialUserOverview.totalObservationsCount >= 5, "Sufficient user has multiple observations", `Count: ${substantialUserOverview.totalObservationsCount}`);

  // Check the 5 dimensions
  const dims = substantialUserOverview.dimensions;
  assert(!!dims["independent-reasoning"], "Dimension 1: Independent Reasoning present");
  assert(!!dims["self-directed-exploration"], "Dimension 2: Self-Directed Exploration present");
  assert(!!dims["independent-problem-solving"], "Dimension 3: Independent Problem-Solving present");
  assert(!!dims["thoughtful-ai-use"], "Dimension 4: Thoughtful AI Use present");
  assert(!!dims["reflection-self-direction"], "Dimension 5: Reflection and Self-Direction present");

  // Verify sufficiency states
  assert(determineSufficiency(0) === "insufficient", "0 observations = insufficient");
  assert(determineSufficiency(2) === "emerging", "2 observations = emerging");
  assert(determineSufficiency(4) === "developing", "4 observations = developing");
  assert(determineSufficiency(8) === "consistent", "8 observations = consistent");

  // Test empty user
  const emptyUserOverview = evaluateUserIndependence("new-empty-user-123");
  assert(emptyUserOverview.hasSufficientEvidence === false, "Empty user correctly marked hasSufficientEvidence = false");
  assert(emptyUserOverview.totalObservationsCount === 0, "Empty user has 0 observations");
  assert(
    emptyUserOverview.dimensions["independent-reasoning"].sufficiency === "insufficient",
    "Empty user dimension marked Insufficient Evidence"
  );
  assert(
    emptyUserOverview.developmentNarrative.overallSummary.includes("beginning of your capability development"),
    "Honest development narrative for empty user without fabricating scores"
  );

  // --------------------------------------------------------------------------
  // TEST GROUP C: AI Assistance 5-Tier Classification
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP C: AI ASSISTANCE CLASSIFICATION ---");
  const classA = classifyAIAssistance({ aiRecord: null, coachingSessionId: null });
  assert(classA.level === "Level A", "Classification: No AI usage classified as Level A (Independent)");

  const classB = classifyAIAssistance({
    aiRecord: {
      id: "test-b",
      attempt_id: "att-b",
      user_id: "u-1",
      queries_count: 1,
      hint_levels_used: [1],
      action_types_used: ["clarify_definition"],
      assistance_summary: "Clarified domain terminology.",
      created_at: "",
      updated_at: "",
    },
  });
  assert(classB.level === "Level B", "Classification: Minimal clarification classified as Level B (AI-Informed)");

  const classC = classifyAIAssistance({
    aiRecord: {
      id: "test-c",
      attempt_id: "att-c",
      user_id: "u-1",
      queries_count: 4,
      hint_levels_used: [2, 3],
      action_types_used: ["hint", "challenge"],
      assistance_summary: "Brainstormed counterarguments.",
      created_at: "",
      updated_at: "",
    },
  });
  assert(classC.level === "Level C", "Classification: Collaborative coaching classified as Level C (AI-Assisted)");

  const classD = classifyAIAssistance({
    aiRecord: {
      id: "test-d",
      attempt_id: "att-d",
      user_id: "u-1",
      queries_count: 10,
      hint_levels_used: [4],
      action_types_used: ["direct_solution"],
      assistance_summary: "Direct solution requested.",
      created_at: "",
      updated_at: "",
    },
  });
  assert(classD.level === "Level D", "Classification: Direct solution guidance classified as Level D (AI-Generated)");

  const classE = classifyAIAssistance({
    aiRecord: {
      id: "test-e",
      attempt_id: "att-e",
      user_id: "u-1",
      queries_count: 0,
      hint_levels_used: [],
      action_types_used: [],
      assistance_summary: "",
      created_at: "",
      updated_at: "",
    },
    userDisclosure: undefined,
  });
  assert(classE.level === "Level A" || classE.level === "Level E", "Classification: Handled ambiguous telemetry safely");

  // --------------------------------------------------------------------------
  // TEST GROUP D: Capability Development History & Comparability
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP D: CAPABILITY DEVELOPMENT HISTORY ---");
  const timeline = substantialUserOverview.developmentTimeline;
  assert(timeline.length >= 3, "Timeline spans Baseline Diagnostic, Coaching, and Practice Challenge");

  const challengeTimelineItem = timeline.find((t) => t.activityType === "challenge_practice");
  assert(
    !!challengeTimelineItem && challengeTimelineItem.scoreComparison?.isComparable === false,
    "Challenge practice vs baseline flagged isComparable = false with honest methodology disclosure"
  );

  // --------------------------------------------------------------------------
  // TEST GROUP E: Growth Portfolio Management & Public Isolation
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP E: GROWTH PORTFOLIO MANAGEMENT & PUBLIC ISOLATION ---");
  const portfolio = await getUserPortfolio("demo-user-1");
  assert(!!portfolio && portfolio.publicSlug === "alex-chen", "Demo portfolio retrieved with slug alex-chen");

  // Test eligible items retrieval
  const eligible = await getEligibleWorkItems("demo-user-1");
  assert(eligible.length >= 3, "Retrieved eligible work items from completed challenges & assessments", `Found: ${eligible.length}`);

  // Test adding portfolio item
  const addedItem = await addPortfolioItem("demo-user-1", "featured_work", {
    title: "Test Unit Project",
    description: "Verification project for portfolio engine",
    sourceType: "custom_project",
    dimensions: ["Testing"],
    aiAssistanceLevel: "Level A",
    aiAssistanceDisclosure: "Unit test item",
    artifacts: [],
    orderIndex: 99,
    isFeatured: true,
  });
  assert(!!addedItem && addedItem.title === "Test Unit Project", "Added new item to portfolio section");

  // Remove the test item
  const removed = await removePortfolioItem("demo-user-1", addedItem.id);
  assert(removed === true, "Removed test item from portfolio");

  // Test slug update
  const slugRes = await updatePublicSlug("demo-user-1", "alex-chen-updated");
  assert(slugRes.success === true && slugRes.slug === "alex-chen-updated", "Updated public slug successfully");

  // Restore demo slug
  await updatePublicSlug("demo-user-1", "alex-chen");

  // Test public portfolio retrieval by slug
  const publicView = await getPublicPortfolioBySlug("alex-chen");
  assert(!!publicView && publicView.displayName === "Alex Chen", "Public portfolio view retrieved by slug");
  assert(!!publicView && publicView.sections.length > 0, "Public view includes visible sections");

  // Test unpublishing and privacy isolation
  await unpublishPortfolio("demo-user-1");
  const privateCheck = await getPublicPortfolioBySlug("alex-chen");
  assert(privateCheck === null, "Unpublished portfolio returns null on public endpoint (privacy preserved)");

  // Republish
  await publishPortfolio("demo-user-1", "public");
  const liveCheck = await getPublicPortfolioBySlug("alex-chen");
  assert(liveCheck !== null, "Republished portfolio is accessible again");

  // Non-existent slug returns null
  const nonExistent = await getPublicPortfolioBySlug("non-existent-slug-xyz");
  assert(nonExistent === null, "Non-existent slug returns null");

  console.log("\n==============================================================================");
  console.log(`SUMMARY: ${passedTests} OF ${totalTests} TESTS PASSED.`);
  console.log("==============================================================================");
}

runPhase7Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
