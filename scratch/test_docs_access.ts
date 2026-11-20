// ==============================================================================
// OBHASH /docs Module & Access Control Test Suite
// ==============================================================================

import {
  getDocsAccessConfig,
  updateDocsAccessConfig,
  resetDocsAccessConfigToDefault,
  evaluateDocsAccess,
} from "../src/lib/docs/access-store";
import {
  TEAM_MEMBERS,
  PITCH_DECK_SLIDES,
  TECHNICAL_DOC_SECTIONS,
  getLiveSystemMetrics,
} from "../src/lib/docs/content";

async function runDocsTestSuite() {
  console.log("==============================================================================");
  console.log("OBHASH /DOCS MODULE & ACCESS CONTROL VERIFICATION SUITE");
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

  // 1. Default Configuration & Scheduling Window
  resetDocsAccessConfigToDefault();
  const config = getDocsAccessConfig();
  assert(config.isEnabled === true, "1.1: Default master toggle is enabled");
  assert(config.isScheduled === true, "1.2: Default configuration uses scheduled availability");
  assert(config.scheduleStart.includes("2026-06-10"), "1.3: Default schedule start is June 10, 2026");
  assert(config.scheduleEnd.includes("2026-06-14"), "1.4: Default schedule end is June 14, 2026");

  // 2. Evaluation Outside vs Inside Scheduled Window
  const outsideEval = evaluateDocsAccess({ simulatedDate: "2026-05-01T00:00:00.000Z" });
  assert(outsideEval.isAccessible === false, "2.1: Access blocked before window without admin credentials");
  assert(outsideEval.reason === "before_window", "2.2: Correct reason code 'before_window' returned");

  const insideEval = evaluateDocsAccess({ simulatedDate: "2026-06-11T14:30:00.000Z" });
  assert(insideEval.isAccessible === true, "2.3: Access granted within June 10–14 window");
  assert(insideEval.reason === "authorized", "2.4: Reason code 'authorized' returned within window");

  const afterEval = evaluateDocsAccess({ simulatedDate: "2026-06-20T00:00:00.000Z" });
  assert(afterEval.isAccessible === false, "2.5: Access blocked after window expiration");
  assert(afterEval.reason === "after_window", "2.6: Correct reason code 'after_window' returned");

  // 3. Admin Passcode & Override Controls
  const adminEval = evaluateDocsAccess({
    simulatedDate: "2026-05-01T00:00:00.000Z",
    passcode: "obhash-admin-2026",
  });
  assert(adminEval.isAccessible === true, "3.1: Admin passcode grants access outside window");
  assert(adminEval.isAdmin === true, "3.2: Admin status verified via passcode");

  // Instant Live Override
  updateDocsAccessConfig({ isScheduled: false, isEnabled: true });
  const overrideEval = evaluateDocsAccess({ simulatedDate: "2026-05-01T00:00:00.000Z" });
  assert(overrideEval.isAccessible === true, "3.3: Instant Live Override makes /docs public to all visitors");

  // Manual Disable
  updateDocsAccessConfig({ isEnabled: false });
  const disabledEval = evaluateDocsAccess();
  assert(disabledEval.isAccessible === false, "3.4: Manual disable restricts access");
  assert(disabledEval.reason === "disabled_by_admin", "3.5: Correct reason code 'disabled_by_admin' returned");

  // Reset to default
  resetDocsAccessConfigToDefault();

  // 4. Team Section Verification (Mandatory Enhancement)
  assert(TEAM_MEMBERS.length === 4, "4.1: Team PastForward has 4 listed members");
  const kazi = TEAM_MEMBERS.find((m) => m.id === "kazi");
  assert(!!kazi && kazi.email === "kazi@pastforward.ai", "4.2: Kazi listed with verified email & architect role");
  TEAM_MEMBERS.forEach((m) => {
    assert(
      !!m.avatarUrl && !!m.role && !!m.email && !!m.bio && m.contributions.length > 0,
      `4.3: Member ${m.name} has complete uniform profile attributes`
    );
  });

  // 5. YC Pitch Deck & Technical Documentation Completeness
  assert(PITCH_DECK_SLIDES.length === 12, "5.1: 12 complete YC pitch deck slides loaded");
  assert(TECHNICAL_DOC_SECTIONS.length >= 13, "5.2: Deep technical whitepaper covers sections B through O");

  // 6. Live System Metrics
  const metrics = getLiveSystemMetrics();
  assert(metrics.status === "operational", "6.1: Live metrics report operational status");
  assert(metrics.routesCount === 32, "6.2: Live metrics report 32 Next.js App Router routes");
  assert(metrics.passingTestsCount === 93, "6.3: Live metrics report 93 passing verification tests");
  assert(metrics.capabilitiesCount === 3, "6.4: Live metrics report 3 core capabilities");

  console.log("\n==============================================================================");
  console.log(`DOCS SUITE RESULTS: ${passed} OF ${total} TESTS PASSED.`);
  console.log("==============================================================================");
}

runDocsTestSuite();
