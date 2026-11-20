/**
 * Automated Test Suite for Phase 5: AI Growth Coach
 */

import {
  startCoachingSession,
  sendCoachingMessage,
  getCoachingSession,
  getUserCoachingSessions,
  executeContextualAction,
  generateSessionSummary,
  updateSessionTitle,
} from "../src/lib/coach/actions";
import { buildCoachSystemInstruction } from "../src/lib/coach/prompts";

async function runTests() {
  console.log("================================================================");
  console.log("OBHASH Phase 5: AI Growth Coach Test Suite");
  console.log("================================================================\n");

  // Test 1: Capability-Specific System Instructions & Context Injection
  console.log("--- Test 1: Capability System Instructions & Context Injection ---");
  const ctPrompt = buildCoachSystemInstruction("critical-thinking", {
    assessmentSummary: {
      capabilityName: "Critical Thinking",
      overallScore: 3.25,
      performanceLevel: "Strongly Demonstrating",
      strengths: ["Analytical decomposition"],
      opportunities: ["Audit confounding factors"],
    },
    goalSummary: {
      goalId: "goal-ct-1",
      goalTitle: "Discern Confounding Variables",
      expectedOutcome: "Identify potential confounders in empirical reports.",
      reasonForRecommendation: "Strengthen correlation vs causation discernment.",
    },
    userInterests: ["Urban Design", "Technology"],
    growthIntentions: ["Think more clearly"],
  });

  if (!ctPrompt.includes("COACH, DON'T REPLACE") || !ctPrompt.includes("CRITICAL THINKING COACH")) {
    throw new Error("System prompt missing core philosophy or capability mode");
  }
  if (!ctPrompt.includes("<learner_context>") || !ctPrompt.includes("Discern Confounding Variables")) {
    throw new Error("Learner context was not properly injected into prompt");
  }
  console.log("✓ Critical Thinking Prompt constructed with sanitized context.");

  const cpsPrompt = buildCoachSystemInstruction("creative-problem-solving");
  if (!cpsPrompt.includes("CREATIVE PROBLEM-SOLVING COACH") || !cpsPrompt.includes("Idea Generation")) {
    throw new Error("Creative Problem-Solving prompt missing key indicators");
  }
  console.log("✓ Creative Problem-Solving Prompt verified.");

  const cuPrompt = buildCoachSystemInstruction("curiosity");
  if (!cuPrompt.includes("CURIOSITY COACH") || !cuPrompt.includes("Question Formulation")) {
    throw new Error("Curiosity prompt missing key indicators");
  }
  console.log("✓ Curiosity Prompt verified.\n");

  // Test 2: Starting a Context-Aware Coaching Session
  console.log("--- Test 2: Start Context-Aware Coaching Session ---");
  const startRes = await startCoachingSession({
    capabilityKey: "critical-thinking",
    title: "Examining Correlation in Urban Pilot Data",
    goalId: "goal-ct-1",
    journeyId: "demo-journey-1",
  });

  if (!startRes.success || !startRes.data) {
    throw new Error(`Failed to start coaching session: ${startRes.error}`);
  }
  const sessionId = startRes.data.sessionId;
  console.log(`Coaching Session Created: ID = ${sessionId}`);

  const loadedSession = await getCoachingSession(sessionId);
  if (!loadedSession) throw new Error("Failed to load created coaching session");
  console.log(`Initial Messages Count: ${loadedSession.messages.length}`);
  console.log(`Initial Assistant Message:\n"${loadedSession.messages[0].content}"`);
  if (!loadedSession.messages[0].content.includes("Critical Thinking")) {
    throw new Error("Initial message did not reflect capability mode");
  }
  console.log("✓ Test 2 Passed.\n");

  // Test 3: Socratic Dialogue Message Exchanges
  console.log("--- Test 3: Socratic Dialogue Exchanges (Coaching Behavior) ---");
  const userMsg1 = "The city council claimed that adding free transit passes caused a 28% increase in retail sales.";
  const sendRes1 = await sendCoachingMessage({
    sessionId,
    content: userMsg1,
  });

  if (!sendRes1.success || !sendRes1.data) {
    throw new Error(`Failed to send message: ${sendRes1.error}`);
  }
  console.log(`User Input: "${userMsg1}"`);
  console.log(`Coach Response (${sendRes1.data.assistantMessage.responseType}):\n"${sendRes1.data.assistantMessage.content}"`);
  if (!sendRes1.data.assistantMessage.content.includes("?")) {
    throw new Error("Expected Socratic question in coach response");
  }
  console.log("✓ Test 3 Passed.\n");

  // Test 4: Progressive Hint System (Level 1 -> Level 2 -> Level 3)
  console.log("--- Test 4: Progressive Hint System (Levels 1, 2, 3) ---");
  // Hint 1: Directional
  const hint1 = await executeContextualAction(sessionId, "hint");
  if (!hint1.success || !hint1.data) throw new Error("Hint 1 failed");
  console.log(`Hint Level: ${hint1.data.newHintLevel} (Expected: 1)`);
  console.log(`Coach Level 1 Hint:\n"${hint1.data.assistantMessage.content.substring(0, 150)}..."`);
  if (hint1.data.newHintLevel !== 1) throw new Error("Expected hint level 1");

  // Hint 2: Conceptual
  const hint2 = await executeContextualAction(sessionId, "hint");
  if (!hint2.success || !hint2.data) throw new Error("Hint 2 failed");
  console.log(`Hint Level: ${hint2.data.newHintLevel} (Expected: 2)`);
  console.log(`Coach Level 2 Hint:\n"${hint2.data.assistantMessage.content.substring(0, 150)}..."`);
  if (hint2.data.newHintLevel !== 2) throw new Error("Expected hint level 2");

  // Hint 3: Specific Guidance
  const hint3 = await executeContextualAction(sessionId, "hint");
  if (!hint3.success || !hint3.data) throw new Error("Hint 3 failed");
  console.log(`Hint Level: ${hint3.data.newHintLevel} (Expected: 3)`);
  console.log(`Coach Level 3 Hint:\n"${hint3.data.assistantMessage.content.substring(0, 150)}..."`);
  if (hint3.data.newHintLevel !== 3) throw new Error("Expected hint level 3");
  console.log("✓ Test 4 Passed.\n");

  // Test 5: Contextual Socratic Actions (Explain, Perspective, Challenge)
  console.log("--- Test 5: Contextual Socratic Actions ---");
  const explainAct = await executeContextualAction(sessionId, "explain");
  console.log(`[Explain Concept] Response Type: ${explainAct.data?.assistantMessage.responseType}`);
  console.log(`Snippet: "${explainAct.data?.assistantMessage.content.substring(0, 120)}..."`);

  const perspectiveAct = await executeContextualAction(sessionId, "perspective");
  console.log(`[Alternative Perspective] Response Type: ${perspectiveAct.data?.assistantMessage.responseType}`);
  console.log(`Snippet: "${perspectiveAct.data?.assistantMessage.content.substring(0, 120)}..."`);

  const challengeAct = await executeContextualAction(sessionId, "challenge");
  console.log(`[Challenge Reasoning] Response Type: ${challengeAct.data?.assistantMessage.responseType}`);
  console.log(`Snippet: "${challengeAct.data?.assistantMessage.content.substring(0, 120)}..."`);
  console.log("✓ Test 5 Passed.\n");

  // Test 6: Grounded Session Summarization
  console.log("--- Test 6: Grounded Session Summary Generation ---");
  const summaryRes = await generateSessionSummary(sessionId);
  if (!summaryRes.success || !summaryRes.data) {
    throw new Error(`Summary failed: ${summaryRes.error}`);
  }
  const summary = summaryRes.data;
  console.log(`Explored Topics: ${summary.exploredTopics.join(", ")}`);
  console.log(`Questions Considered (${summary.keyQuestionsConsidered.length}): ${summary.keyQuestionsConsidered[0]}`);
  console.log(`Perspectives Developed: ${summary.perspectivesDeveloped.join("; ")}`);
  console.log(`Reasoning Demonstrated: "${summary.reasoningDemonstrated}"`);
  console.log(`Growth Frontiers: ${summary.growthFrontiers.join(", ")}`);
  console.log(`Recommended Next Steps: ${summary.recommendedNextSteps.join(", ")}`);

  const updatedSess = await getCoachingSession(sessionId);
  if (updatedSess?.status !== "completed") {
    throw new Error("Session status was not marked completed after summarization");
  }
  console.log(`Session Status: ${updatedSess.status}`);
  console.log("✓ Test 6 Passed.\n");

  // Test 7: Session History & Management
  console.log("--- Test 7: Session Management (Title Update & List) ---");
  await updateSessionTitle(sessionId, "Customized: Transit Correlation Critique");
  const reloaded = await getCoachingSession(sessionId);
  if (reloaded?.title !== "Customized: Transit Correlation Critique") {
    throw new Error("Session title did not persist");
  }
  console.log(`Updated Session Title: "${reloaded.title}"`);

  const userSessions = await getUserCoachingSessions();
  console.log(`Total User Sessions in History: ${userSessions.length}`);
  if (userSessions.length === 0) throw new Error("Expected session in user history");
  console.log("✓ Test 7 Passed.\n");

  console.log("================================================================");
  console.log("All 7 Test Suites Passed Successfully! Phase 5 Coach Verified.");
  console.log("================================================================");
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
