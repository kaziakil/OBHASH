# OBHASH — Coaching Database Reference

**Phase:** Phase 5 of 8 (AI Growth Coach)  
**Migration ID:** `20261120040000_phase5_ai_coach.sql`  

---

## 1. Relational Entity-Relationship Diagram

```mermaid
erDiagram
    profiles ||--o{ coaching_sessions : "participates in"
    growth_journeys ||--o{ coaching_sessions : "context for"
    development_goals ||--o{ coaching_sessions : "anchors"
    coaching_sessions ||--o{ coaching_messages : "contains"
    coaching_sessions ||--o| coaching_session_summaries : "generates"
    coaching_sessions ||--o| coaching_session_context_snapshots : "captures"

    coaching_sessions {
        uuid id PK
        uuid user_id FK
        text title
        text capability_key
        uuid journey_id FK
        uuid goal_id FK
        text status
        integer current_hint_level
        text instruction_version
        timestamptz created_at
        timestamptz updated_at
        timestamptz last_message_at
        timestamptz completed_at
    }

    coaching_messages {
        uuid id PK
        uuid session_id FK
        text role
        text content
        text response_type
        integer hint_level
        jsonb metadata
        timestamptz created_at
    }

    coaching_session_summaries {
        uuid id PK
        uuid session_id FK
        text[] explored_topics
        text[] key_questions_considered
        text[] perspectives_developed
        text reasoning_demonstrated
        text[] growth_frontiers
        text[] recommended_next_steps
        timestamptz created_at
    }

    coaching_session_context_snapshots {
        uuid id PK
        uuid session_id FK
        jsonb assessment_summary
        jsonb journey_goal_summary
        text[] user_interests
        timestamptz created_at
    }
```

---

## 2. Row Level Security (RLS) Policies

All tables enforce strict user ownership:
1. `coaching_sessions`: `auth.uid() = user_id` for all operations.
2. `coaching_messages`: Protected via `EXISTS (SELECT 1 FROM coaching_sessions WHERE id = session_id AND user_id = auth.uid())`.
3. `coaching_session_summaries`: Protected via `EXISTS` subquery verifying session ownership.
4. `coaching_session_context_snapshots`: Protected via `EXISTS` subquery verifying session ownership.
