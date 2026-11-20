# OBHASH Challenge System Architecture

**Phase:** Phase 6 of 8 (Challenge & Reflection Workspace)  
**Status:** Complete & Active  
**Philosophy:** Human-Centered Intelligence ("The goal is not to produce better AI-assisted answers. The goal is to help people become better thinkers, creators, and explorers.")

---

## 1. System Overview

The **Challenge & Reflection Workspace** transforms OBHASH from a platform that assesses, plans, and coaches into an active practice environment where users tackle substantive real-world scenarios, document independent reasoning, consult the AI Growth Coach for guidance, receive evidence-grounded rubric evaluations, and reflect metacognitively on their development.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CHALLENGE LIFECYCLE                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
       1. Discovery & Recommendation (`/challenges`)
          • Personalized scoring from Phase 3 Baselines & Phase 4 Goals
          • Multi-parameter filtering (Capability, Difficulty, Time)
                                    │
                                    ▼
       2. Challenge Deep Dive (`/challenges/[challengeId]`)
          • Scenario context, learning objectives, deliverable requirements
                                    │
                                    ▼
       3. Execution Workspace (`/workspace/[attemptId]`)
          • Context & instructions panel
          • Deliverables structured editor & informal scratchpad
          • Continuous debounced autosave (1500ms) with visible status
          • Contextual AI Growth Coach side drawer (Socratic guidance)
                                    │
                                    ▼
       4. Submission Preview & Authorship Certification
          • Preview of all rendered deliverables
          • User certification of independent authorship
          • Audit of AI coach consultations
                                    │
                                    ▼
       5. Evidence-Grounded Rubric Evaluation (`/workspace/.../evaluation`)
          • Server-side AI evaluation with prompt injection isolation
          • Quotes extracted from actual submission deliverables
          • 4-level rubric indicators for relevant capability dimensions
                                    │
                                    ▼
       6. Metacognitive Reflection (`/workspace/.../reflection`)
          • Tailored reflection questions on reasoning & AI usage
          • Consolidation of insights into persistent developmental evidence
                                    │
                                    ▼
       7. Personal Work Management (`/my-work`)
          • Unified tracking of drafts, submissions, feedback, and reflections
```

---

## 2. Component Inventory

| Route | Component | Purpose |
|---|---|---|
| `/challenges` | `ChallengeDiscoveryClient.tsx` | Catalog browsing, search, capability/difficulty filtering, personalized recommendation cards, bookmarks |
| `/challenges/[challengeId]` | `ChallengeDetailClient.tsx` | Full challenge preview, scenario brief, thinking steps, mental models, start/resume triggers |
| `/workspace/[attemptId]` | `WorkspaceClient.tsx` | Split-pane challenge editor, autosave state manager, Socratic coach panel, submission modal |
| `/workspace/[attemptId]/evaluation` | `EvaluationClient.tsx` | Detailed rubric evaluation, strengths, growth opportunities, citations, alternative perspectives |
| `/workspace/[attemptId]/reflection` | `ReflectionClient.tsx` | Structured reflection workspace with prompt persistence and completion transition |
| `/my-work` | `MyWorkClient.tsx` | Aggregate user practice portfolio, in-progress drafts, status metrics, and bookmarked challenges |

---

## 3. Draft Persistence & Autosave Mechanics

To ensure learners never lose their cognitive work during extended thinking sessions:
1. **Debounced Autosave (1500ms)**: User keystrokes in notes or deliverable textareas update local state immediately and schedule a background server call to `saveDraftAction()`.
2. **Explicit Manual Save**: A dedicated "Save" button allows instant forced synchronization.
3. **Save Status Indicator**: A real-time status pill displays:
   - `Saving...` with an animated pulse during network transit.
   - `Saved at HH:MM:SS` upon confirmed persistence.
   - `Unsaved changes` if a draft modification is pending.
4. **Resilience**: Even if the user refreshes, navigates away, or closes the browser, re-opening `/workspace/[attemptId]` restores their exact notes and deliverables from the database.

---

## 4. Integration Touchpoints

- **Phase 3 Assessment Integration**: Baseline scores and identified developmental opportunities feed the recommendation engine, prioritizing challenges that exercise emerging dimensions.
- **Phase 4 Growth Journey Integration**: Users can launch practice challenges directly from active journey goals (`/journey/[journeyId]/goals/[goalId]`). When a linked challenge is submitted, the corresponding planned activity is automatically marked as completed.
- **Phase 5 AI Growth Coach Integration**: The workspace incorporates the Phase 5 coach via a slide-out assistant panel, passing scenario context and user drafts while strictly preserving independent user authorship.
