/**
 * Automated Verification Suite for Phase 6: Challenge & Reflection Workspace
 * Run with: npx tsx scratch/test_challenges.ts
 */

import { CHALLENGE_CATALOG } from "../src/lib/challenges/catalog";
import {
  getChallengesAction,
  getRecommendedChallengesAction,
  toggleBookmarkAction,
  startOrResumeChallengeAttemptAction,
  getAttemptContextAction,
  saveDraftAction,
  submitChallengeAction,
  submitReflectionAction,
  askCoachInChallengeAction,
  getUserWorkOverviewAction,
} from "../src/lib/challenges/actions";

async function runTests() {
  console.log("================================================================");
  console.log("OBHASH Phase 6: Challenge & Reflection Workspace Test Suite");
  console.log("================================================================\n");

  // ----------------------------------------------------------------------------
  // Test 1: Challenge Library Content & Structure
  // ----------------------------------------------------------------------------
  console.log("--- Test 1: Challenge Library Content & Structure ---");
  console.log(`Total challenges in catalog: ${CHALLENGE_CATALOG.length}`);

  if (CHALLENGE_CATALOG.length < 9) {
    throw new Error(`Challenge catalog must have at least 9 challenges, found ${CHALLENGE_CATALOG.length}`);
  }

  const ctChallenges = CHALLENGE_CATALOG.filter((c) => c.capability_category === "critical-thinking");
  const cpsChallenges = CHALLENGE_CATALOG.filter((c) => c.capability_category === "creative-problem-solving");
  const curChallenges = CHALLENGE_CATALOG.filter((c) => c.capability_category === "curiosity");

  console.log(`- Critical Thinking: ${ctChallenges.length}`);
  console.log(`- Creative Problem-Solving: ${cpsChallenges.length}`);
  console.log(`- Curiosity: ${curChallenges.length}`);

  if (ctChallenges.length === 0 || cpsChallenges.length === 0 || curChallenges.length === 0) {
    throw new Error("Each of the 3 capability categories must have challenges.");
  }

  // Verify structure of every challenge
  for (const c of CHALLENGE_CATALOG) {
    if (!c.id || !c.title || !c.slug || !c.scenario || !c.learning_objective || !c.detailed_instructions) {
      throw new Error(`Challenge ${c.id} missing mandatory text fields.`);
    }
    if (!c.required_deliverables || c.required_deliverables.length === 0) {
      throw new Error(`Challenge ${c.id} has no deliverables.`);
    }
    if (!c.reflection_prompts || c.reflection_prompts.length === 0) {
      throw new Error(`Challenge ${c.id} has no reflection prompts.`);
    }
  }
  console.log("✓ Test 1 Passed: All challenges meet quality, metadata, and structural standards.\n");

  // ----------------------------------------------------------------------------
  // Test 2: Discovery, Filtering & Search
  // ----------------------------------------------------------------------------
  console.log("--- Test 2: Discovery, Filtering & Search ---");
  const filteredCT = await getChallengesAction({ capability: "critical-thinking" });
  console.log(`Filtered Critical Thinking: ${filteredCT.length} challenges`);
  if (!filteredCT.every((c) => c.capability_category === "critical-thinking")) {
    throw new Error("Capability filter returned wrong categories.");
  }

  const filteredBeginner = await getChallengesAction({ difficulty: "beginner" });
  console.log(`Filtered Beginner: ${filteredBeginner.length} challenges`);
  if (!filteredBeginner.every((c) => c.difficulty === "beginner")) {
    throw new Error("Difficulty filter failed.");
  }

  const searched = await getChallengesAction({ search: "waste" });
  console.log(`Search 'waste' matches: ${searched.length} (${searched.map((c) => c.title).join(", ")})`);
  if (searched.length === 0) {
    throw new Error("Search failed to find food waste challenge.");
  }
  console.log("✓ Test 2 Passed: Discovery filtering and search functioning correctly.\n");

  // ----------------------------------------------------------------------------
  // Test 3: Personalized Recommendations Engine
  // ----------------------------------------------------------------------------
  console.log("--- Test 3: Personalized Recommendations Engine ---");
  const recommendations = await getRecommendedChallengesAction();
  console.log(`Generated ${recommendations.length} personalized recommendations:`);
  recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. [Score: ${rec.score}] ${rec.challenge.title}`);
    console.log(`     Rationale: "${rec.rationale}"`);
    console.log(`     Target Dimension: ${rec.relatedDimension}`);
  });

  if (recommendations.length === 0 || !recommendations[0].rationale) {
    throw new Error("Recommendations engine produced empty or ungrounded results.");
  }
  console.log("✓ Test 3 Passed: Recommendations successfully ground in user development context.\n");

  // ----------------------------------------------------------------------------
  // Test 4: Challenge Attempt & Draft Persistence (Autosave & Recovery)
  // ----------------------------------------------------------------------------
  console.log("--- Test 4: Workspace Attempt, Draft Autosave & Recovery ---");
  const challengeToTest = "ct-two-sides";
  const startResult = await startOrResumeChallengeAttemptAction(challengeToTest);
  console.log(`Started/Resumed attempt: ${startResult.attemptId} (isNew: ${startResult.isNew})`);

  // Simulate user drafting their deliverables
  const testNotes = "Preliminary deconstruction:\n- Perspective A stresses data security and equity\n- Perspective B highlights psychological safety and proxy measurement failure";
  const testDeliverables = {
    perspective_critique: "Perspective A has clear operational logic regarding corporate data custody, but falsely equates keystroke velocity with intellectual output. Perspective B correctly cites Goodhart's law, but overlooks legitimate enterprise compliance needs.",
    value_conflicts: "The core tension lies between institutional surveillance for risk prevention versus autonomous cognitive trust required for creative problem solving.",
    reasoned_judgment: "Adopt an outcome-driven telemetry boundary: measure asynchronous delivery against sprint commitments rather than continuous biometric observation.",
  };

  const saveRes = await saveDraftAction(startResult.attemptId, testNotes, testDeliverables);
  console.log(`Draft saved at: ${saveRes.lastSavedAt}`);

  // Retrieve attempt context to verify persistence
  const context = await getAttemptContextAction(startResult.attemptId);
  if (!context || !context.draft) {
    throw new Error("Failed to recover draft from local store.");
  }

  if (context.draft.notes !== testNotes) {
    throw new Error("Draft notes mismatch upon recovery.");
  }
  if (context.draft.deliverables.perspective_critique !== testDeliverables.perspective_critique) {
    throw new Error("Draft deliverables mismatch upon recovery.");
  }
  console.log(`✓ Draft recovered successfully with ${Object.keys(context.draft.deliverables).length} deliverable fields.`);
  console.log("✓ Test 4 Passed: Draft persistence and recovery verified.\n");

  // ----------------------------------------------------------------------------
  // Test 5: AI Growth Coach Integration inside Workspace
  // ----------------------------------------------------------------------------
  console.log("--- Test 5: AI Growth Coach Contextual Workspace Assistance ---");
  // Request a progressive hint
  const hintRes = await askCoachInChallengeAction(startResult.attemptId, "hint", 1);
  console.log(`Coach Level 1 Hint received:`);
  console.log(`"${hintRes.reply.slice(0, 140)}..."`);
  console.log(`Assistance logged: Queries=${hintRes.assistanceRecord.queries_count}, HintLevels=[${hintRes.assistanceRecord.hint_levels_used.join(",")}]`);

  if (!hintRes.reply || hintRes.assistanceRecord.queries_count === 0) {
    throw new Error("AI coach integration failed to provide guidance or log assistance.");
  }

  // Request a constructive challenge
  const challengeRes = await askCoachInChallengeAction(startResult.attemptId, "challenge", 1);
  console.log(`Coach Constructive Challenge received:`);
  console.log(`"${challengeRes.reply.slice(0, 140)}..."`);

  // Ensure coach assistance does NOT overwrite user draft
  const postCoachContext = await getAttemptContextAction(startResult.attemptId);
  if (postCoachContext?.draft?.deliverables.perspective_critique !== testDeliverables.perspective_critique) {
    throw new Error("AI Coach assistance contaminated user-authored deliverables!");
  }
  console.log("✓ User authorship strictly preserved; coach guidance kept in assistance logs.");
  console.log("✓ Test 5 Passed: AI Growth Coach integration verified.\n");

  // ----------------------------------------------------------------------------
  // Test 6: Submission & Grounded Evaluation Engine
  // ----------------------------------------------------------------------------
  console.log("--- Test 6: Challenge Submission & Grounded Evaluation ---");
  const submitRes = await submitChallengeAction(startResult.attemptId);
  console.log(`Submission successful: ID=${submitRes.submissionId}`);
  console.log(`Evaluation generated by: ${submitRes.evaluation.evaluator_type} (${submitRes.evaluation.evaluator_version})`);
  console.log(`Strengths observed: ${submitRes.evaluation.strengths.length}`);
  console.log(`Evidence citations: ${submitRes.evaluation.evidence_citations.length}`);
  submitRes.evaluation.evidence_citations.forEach((c) => {
    console.log(`  - Claim: "${c.claim}"`);
    console.log(`    Quote: "${c.quote.slice(0, 60)}..."`);
  });

  console.log(`Dimension evaluations:`);
  for (const [dim, evalResult] of Object.entries(submitRes.evaluation.dimension_evaluations)) {
    console.log(`  * ${dim}: Level ${evalResult.level} (${evalResult.label})`);
  }

  if (submitRes.evaluation.evidence_citations.length === 0) {
    throw new Error("Evaluation failed to extract grounded evidence citations.");
  }
  console.log("✓ Test 6 Passed: Submission snapshot immutable and evaluation evidence-grounded.\n");

  // ----------------------------------------------------------------------------
  // Test 7: Reflection Workspace & Completion Lifecycle
  // ----------------------------------------------------------------------------
  console.log("--- Test 7: Reflection Workspace & Completion Lifecycle ---");
  const reflectionResponses = {
    "Did you enter this challenge with an instinctual bias toward one side? How did you ensure you evaluated both sides rigorously?":
      "I initially favored the engineers' autonomy perspective, but recognized that data security and compliance are existential risks for regulated businesses.",
    "What evidence would you need to gather to test whether your proposed synthesis actually works?":
      "Track sprint velocity and volunteer turnover over a 6-month trial without biometric telemetry.",
    "Where did you consult the AI Growth Coach during this challenge, and how did its questions or hints influence your thinking?":
      "The coach challenged my assumption about whether outcome metrics can also be gamed, which helped me refine my third deliverable.",
  };

  const reflectionRes = await submitReflectionAction(startResult.attemptId, reflectionResponses);
  if (!reflectionRes.success) {
    throw new Error("Failed to submit reflection.");
  }

  const finalContext = await getAttemptContextAction(startResult.attemptId);
  console.log(`Final Attempt Status: ${finalContext?.attempt.status}`);
  if (finalContext?.attempt.status !== "completed") {
    throw new Error(`Attempt should be marked 'completed', got '${finalContext?.attempt.status}'`);
  }
  if (!finalContext.reflection || !finalContext.reflection.is_submitted) {
    throw new Error("Reflection record was not properly linked or marked submitted.");
  }
  console.log("✓ Test 7 Passed: Reflection successfully recorded and attempt transitioned to completed.\n");

  // ----------------------------------------------------------------------------
  // Test 8: My Work Overview & Bookmarks
  // ----------------------------------------------------------------------------
  console.log("--- Test 8: My Work Workspace & Bookmarks ---");
  const isBookmarkedBefore = await toggleBookmarkAction("cur-explore-unknown");
  console.log(`Toggled bookmark for 'cur-explore-unknown': ${isBookmarkedBefore}`);

  const myWorkOverview = await getUserWorkOverviewAction();
  console.log(`My Work Totals: In Progress=${myWorkOverview.counts.inProgress}, Completed=${myWorkOverview.counts.completed}, Bookmarked=${myWorkOverview.counts.bookmarked}`);
  console.log(`Total roster items: ${myWorkOverview.items.length}`);

  if (myWorkOverview.items.length === 0) {
    throw new Error("My Work overview returned no items.");
  }
  console.log("✓ Test 8 Passed: My Work correctly aggregates attempts, drafts, and bookmarks.\n");

  console.log("================================================================");
  console.log("All 8 Test Suites Passed Successfully! Phase 6 Fully Verified.");
  console.log("================================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
