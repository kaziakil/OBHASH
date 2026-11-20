# AI Assistance Integration & Authorship Transparency

**Phase:** Phase 6 of 8 (Challenge & Reflection Workspace)  
**Status:** Complete & Active  
**Philosophy:** Human-Centered Intelligence ("Coach, don't replace.")

---

## 1. Principles of AI Assistance in Practice

In conventional AI applications, AI acts as a ghostwriter—generating essays, drafting code, or answering questions on the user's behalf. This fosters cognitive atrophy and creates a false sense of personal capability.

In OBHASH, the AI Growth Coach integrates into the challenge workspace as a **thinking partner**, not a ghostwriter.

### Core Boundaries
1. **No Silent Ghostwriting**: The AI never generates or automatically fills in text for the user's deliverables.
2. **Dedicated Drawer Architecture**: AI coach responses are restricted to a dedicated side drawer. The user must actively read, process, and independently synthesize their own deliverables.
3. **Socratic Guidance**: If the user asks the coach to write an answer, the coach follows its Phase 5 philosophy: it asks calibrating questions, unpacks hidden premises, or provides structural scaffolds.
4. **Complete Metadata Audit**: The number of consultations, hint levels unlocked (Level 1, 2, or 3), and action types (e.g. challenge, alternative perspective) are recorded in `challenge_ai_assistance_records` and attached to the submission.
5. **Authorship Certification**: Before submitting, the user explicitly reviews their AI consultation log and certifies: *"I certify that this submission represents my own independent thinking, analysis, and decisions."*

---

## 2. In-Workspace Socratic Action Triggers

Inside `/workspace/[attemptId]`, the user has access to 5 specialized micro-coaching actions:

| Action Trigger | Pedagogical Intent | AI Behavior |
|---|---|---|
| **💡 Get Progressive Hint** | Prevent cognitive dead ends without spoiling solutions | Delivers tiered guidance (Level 1: Directional, Level 2: Conceptual heuristic, Level 3: Structural outline with blank conclusion). |
| **📖 Explain Heuristic** | Clarify foundational concepts or frameworks | Concisely explains relevant heuristics (e.g. Goodhart's Law, Omitted Variable Bias, Nudge Theory). |
| **👁️ Alt Perspective** | Break cognitive fixation and tunnel vision | Presents an opposing stakeholder viewpoint or cross-disciplinary analogy. |
| **⚡ Challenge My Logic** | Counteract confirmation bias | Pressure-tests the user's draft notes and asks disconfirming questions. |
| **❓ Guiding Question** | Reframe the problem | Asks a calibrating question targeting the core developmental dimension. |

---

## 3. Context Transfer Protocol

When a user triggers an action in the workspace, the system constructs a context payload:
```
You are the AI Growth Coach acting inside an active Challenge Workspace.
The learner is working on the challenge: "[Title]".
Scenario summary: [Scenario]
Relevant capability dimensions: [Dimensions]
Learner's current draft notes / answers: [Draft Content]

Action requested by learner: [Action]
[User Question]

CRITICAL INSTRUCTIONS:
- Guide the learner Socratically.
- DO NOT WRITE THEIR ANSWER FOR THEM.
- DO NOT GHOSTWRITE THEIR DELIVERABLES.
- If they ask for a hint, provide a progressive hint (Level X).
```

This ensures the coach has immediate situational context while strictly enforcing the Human-Centered Intelligence boundary.
