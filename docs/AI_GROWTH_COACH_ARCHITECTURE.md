# OBHASH — AI Growth Coach Architecture

**Phase:** Phase 5 of 8 (AI Growth Coach)  
**System:** Socratic Mentorship & Guided Thinking Engine  
**Philosophy:** Human-Centered Intelligence  

---

## 1. Architectural Overview

The AI Growth Coach is OBHASH's core conversational thinking partner. Unlike conventional AI chatbots designed to produce quick answers or complete cognitive work for users, the Growth Coach is engineered to **strengthen the learner's own reasoning ability**.

The system separates conversational coaching into distinct operational layers:
1. **Context Ingestion:** Securely retrieves the learner's assessment baseline, active growth journey, and targeted goals.
2. **Coaching Mode Selection:** Applies specialized Socratic instructions tailored to *Critical Thinking*, *Creative Problem-Solving*, or *Curiosity*.
3. **Progressive Hint Engine:** Tracks and delivers 4-tier progressive hints (Levels 0 to 3) without prematurely giving away solutions.
4. **Contextual Action Dispatcher:** Handles explicit user metacognitive actions (`hint`, `explain`, `perspective`, `challenge`, `summarize`).
5. **Grounded Session Synthesizer:** Compiles structured post-session summaries derived strictly from observable discussion transcripts.

```mermaid
flowchart TD
    subgraph Inputs["Context Sources"]
        C1["Assessment Baseline Profile<br/>(Scores, Strengths, Opportunities)"]
        C2["Active Growth Journey & Goal<br/>(Goal Title, Expected Outcome)"]
        C3["Profile Preferences<br/>(Interests & Intentions)"]
    end

    subgraph CoreEngine["AI Growth Coach Engine"]
        direction TB
        E1["Context Ingestion & Sanitization<br/>(&lt;learner_context&gt; Delimiters)"]
        E2["Mode Selection<br/>(Critical Thinking / Creative / Curiosity)"]
        E3["Sliding Window History Manager<br/>(Last 10 turns context)"]
        E4{"AIService Available?<br/>(Gemini / OpenAI API)"}
        E5["LLM Socratic Generator<br/>(System Instructions & Safety Guards)"]
        E6["Deterministic Socratic Fallback<br/>(Pedagogical Guidance Templates)"]
        E7["Progressive Hint State Machine<br/>(Level 0 -> Level 1 -> Level 2 -> Level 3)"]
    end

    subgraph Storage["Persistence Layer (Supabase & Local)"]
        DB1["coaching_sessions"]
        DB2["coaching_messages"]
        DB3["coaching_session_summaries"]
        DB4["coaching_session_context_snapshots"]
    end

    subgraph UI["Interactive Coaching Interfaces"]
        U1["/coach (Coach Hub & Capability Selector)"]
        U2["/coach/[sessionId] (Interactive Socratic Room)"]
        U3["Contextual Action Bar (Hint, Explain, Perspective, Challenge)"]
        U4["Summary Modal (Grounded Reflection)"]
    end

    Inputs --> E1
    E1 --> E2
    E2 --> E3
    E3 --> E4
    E4 -- Yes --> E5
    E4 -- No / Error --> E6
    E5 --> E7
    E6 --> E7
    E7 --> Storage
    Storage --> UI
```

---

## 2. Interaction Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner
    participant UI as Coaching Room UI (/coach/[sessionId])
    participant Action as Server Action (sendCoachingMessage)
    participant Engine as Coach Engine (AIService)
    participant Fallback as Deterministic Fallback
    participant DB as Supabase DB (with RLS)

    Learner->>UI: Submits response or clicks Contextual Action (e.g. "Challenge")
    UI->>Action: sendCoachingMessage(sessionId, content, actionType)
    Action->>DB: Record user message
    Action->>Engine: generateCoachReply(messages, context, hintLevel, actionType)
    alt AI Service Ready
        Engine->>Engine: Build Socratic prompt with prompt injection defenses
        Engine-->>Action: Return Socratic question / hint / perspective
    else Unconfigured or API Error
        Engine->>Fallback: Trigger deterministic pedagogical template
        Fallback-->>Action: Return structured Socratic guidance
    end
    Action->>DB: Record assistant message & update hint level
    Action-->>UI: Return updated message stream
    UI->>Learner: Display coach response with type badge
```

---

## 3. Strict Scope Isolation

- **Phase 5 Delivers:** Socratic dialogue, progressive hints, capability modes, contextual actions, and grounded session summaries.
- **Phase 6 (Challenge Workspace):** Will provide interactive simulation environments for executing planned challenges.
- **Phase 7 (Growth Portfolio):** Will quantify independent performance growth deltas.
