# OBHASH — Growth Journey Framework

**Phase:** Phase 4 of 8 (Personalized Growth Journey)  
**System:** Capability Hierarchy & Status Lifecycle Specification  

---

## 1. Growth Journey Hierarchy

OBHASH structures personal development into a six-tier hierarchy:

```
User (Learner)
 └── Growth Journey
      └── Capability Focus Areas (1 to 3 Capabilities)
           └── Development Goals (Specific, Measurable Targets)
                └── Journey Milestones (Sequential Chronological Stages)
                     └── Planned Activities (Actionable 15–30 min Exercises)
```

### Hierarchy Definitions

1. **Growth Journey:**
   - The overarching container representing a committed development cycle (e.g. 4, 8, or 12 weeks).
   - Contains high-level themes, weekly time commitment, and status.
2. **Capability Focus Areas:**
   - Anchored directly to one of the three core capabilities: *Critical Thinking*, *Creative Problem-Solving*, or *Curiosity*.
   - Documents the assessment context and intended cognitive outcomes.
3. **Development Goals:**
   - Targeted cognitive capabilities mapped to specific dimensions (e.g., *Evidence Evaluation*, *Idea Generation*, *Question Formulation*).
   - Every goal provides a transparent explanation of why it was selected.
4. **Journey Milestones:**
   - Concrete sequential stages (e.g. "Weeks 1–2", "Weeks 3–4") describing observable behavioral progress.
5. **Planned Activities:**
   - Bite-sized, self-directed practice exercises (15–30 minutes) designed to test and exercise the target cognitive muscle.

---

## 2. Status Lifecycle State Machine

Every entity in the journey hierarchy maintains an explicit status state machine:

### 2.1 Growth Journey Statuses
- `draft` — Created proposal currently undergoing user review; not yet active.
- `active` — Currently in progress and displayed on the user dashboard.
- `paused` — Temporarily halted by the learner without losing progress.
- `completed` — All primary goals marked completed or duration reached.
- `archived` — Preserved in user history for long-term review.

### 2.2 Development Goal Statuses
- `not_started` — Planned target not yet actively underway.
- `in_progress` — Active exercises currently in progress.
- `completed` — Demonstrated satisfactory mastery of target outcome.
- `paused` — Temporarily deprioritized in favor of other goals.

### 2.3 Milestone Statuses
- `not_started` — Upcoming developmental stage.
- `in_progress` — Current stage under active practice.
- `completed` — Stage successfully achieved.
- `skipped` — Bypassed by user preference.

### 2.4 Planned Activity Statuses
- `not_started` — Scheduled exercise.
- `in_progress` — Exercise started.
- `completed` — Exercise completed by the learner.
- `skipped` — Exercise omitted.

---

## 3. Human-Centered Status Principles

> [!IMPORTANT]
> **No Fake Percentages:** Marking activities or milestones complete does NOT artificially inflate assessment baseline scores or manufacture arbitrary percentage bars. Genuine capability development is evaluated through independent demonstration tasks in Phase 7.
