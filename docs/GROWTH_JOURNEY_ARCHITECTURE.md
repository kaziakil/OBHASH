# OBHASH — Growth Journey Architecture

**Phase:** Phase 4 of 8 (Personalized Growth Journey)  
**System:** Personalized Capability Development Engine  
**Philosophy:** Human-Centered Intelligence  

---

## 1. Architectural Overview

The Growth Journey Engine is the foundational system responsible for translating raw capability assessment evidence and user preferences into a structured, achievable, and adaptable development roadmap.

Unlike conventional AI tools that produce generic advice or prescribe static curricular checklists, the OBHASH Growth Journey Engine adheres to three architectural imperatives:

1. **Evidence-Informed Personalization:** Recommendations are grounded in demonstrated performance across the 15 capability dimensions evaluated in Phase 3.
2. **Strength-Based Growth:** Development goals leverage existing strengths as cognitive anchors to support adjacent developmental opportunities, rather than merely punishing low scores.
3. **User Agency and Co-Creation:** The user reviews, customizes, refines, and explicitly confirms proposed journeys before activation.

```mermaid
flowchart TD
    subgraph Inputs["Personalization Inputs"]
        A1["Baseline Capability Profiles<br/>(Scores, Strengths, Opportunities, Evidence)"]
        A2["Onboarding Profile<br/>(Interests & Growth Intentions)"]
        A3["User Parameters<br/>(Duration, Weekly Commitment, Topic Notes)"]
    end

    subgraph Engine["Personalization Engine (Dual Architecture)"]
        direction TB
        E1["Sanitization & Context Wrapping<br/>(&lt;user_context&gt; Delimiters)"]
        E2{"AIService Ready?<br/>(API Key Configured)"}
        E3["LLM Journey Contextualizer<br/>(Gemini / OpenAI Adapter)"]
        E4["Strict Zod Schema Validation<br/>(JourneyAiResponseSchema)"]
        E5["Pedagogical Rule Engine<br/>(Deterministic Fallback)"]
    end

    subgraph Storage["Persistence & State Layer"]
        DB1["Supabase PostgreSQL<br/>(6 Relational Tables with RLS)"]
        DB2["Local Fallback Store<br/>(In-Memory Standby Cache)"]
    end

    subgraph Experience["User Experience Routes"]
        R1["/journey/create<br/>(Interactive Design & Customization)"]
        R2["/journey<br/>(Journey Hub & Overview)"]
        R3["/journey/[journeyId]<br/>(Journey Details & Hierarchy)"]
        R4["/journey/[journeyId]/goals/[goalId]<br/>(Goal Deep Dive)"]
        R5["/dashboard<br/>(Active Journey Integration)"]
    end

    Inputs --> E1
    E1 --> E2
    E2 -- Yes --> E3
    E3 --> E4
    E4 -- Valid --> Storage
    E4 -- Invalid / Error --> E5
    E2 -- No --> E5
    E5 --> Storage
    Storage --> Experience
```

---

## 2. Component Interactions & Sequence

The journey creation and lifecycle workflow operates through modern Next.js Server Actions:

```mermaid
sequenceDiagram
    autonumber
    actor User as Learner
    participant UI as Journey Create UI (/journey/create)
    participant Action as Server Action (generateJourneyProposal)
    participant AI as Journey Generator (LLM / Rules)
    participant SaveAction as Server Action (saveGrowthJourney)
    participant DB as Supabase DB (with RLS)

    User->>UI: Selects focus capabilities, duration, commitment
    UI->>Action: generateJourneyProposal(input)
    Action->>AI: generatePersonalizedJourney(input)
    AI-->>Action: Proposed GrowthJourneyData (draft)
    Action-->>UI: Return proposal for review
    Note over User, UI: Learner customizes title, edits goals, removes focus areas
    User->>UI: Clicks "Confirm & Activate Journey"
    UI->>SaveAction: saveGrowthJourney(customizedJourney)
    SaveAction->>DB: Insert growth_journeys (header)
    SaveAction->>DB: Insert journey_capability_focus_areas
    SaveAction->>DB: Insert development_goals
    SaveAction->>DB: Insert journey_milestones
    SaveAction->>DB: Insert planned_activities
    SaveAction->>DB: Record journey_generation_records
    SaveAction-->>UI: Return journeyId
    UI->>User: Redirects to /journey/[journeyId]
```

---

## 3. Scope Boundaries & Future Phase Isolation

- **Phase 4 Delivers:** Structured journey plans, hierarchy, milestones, planned activities, recommendation reasoning, and status tracking (`not_started`, `in_progress`, `completed`, `skipped`).
- **Phase 5 (AI Growth Coach):** Will integrate conversational coaching into goals and activities.
- **Phase 6 (Challenge Workspace):** Will provide interactive execution environments for planned activities.
- **Phase 7 (Growth Portfolio):** Will calculate evidence-based longitudinal improvement deltas.
