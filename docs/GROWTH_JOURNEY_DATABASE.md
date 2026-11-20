# OBHASH — Growth Journey Database Reference

**Phase:** Phase 4 of 8 (Personalized Growth Journey)  
**Migration ID:** `20261120030000_phase4_growth_journeys.sql`  

---

## 1. Relational Entity-Relationship Diagram

```mermaid
erDiagram
    profiles ||--o{ growth_journeys : "owns"
    assessment_attempts ||--o{ growth_journeys : "informs"
    growth_journeys ||--o{ journey_capability_focus_areas : "contains"
    growth_journeys ||--o{ development_goals : "contains"
    journey_capability_focus_areas ||--o{ development_goals : "groups"
    growth_journeys ||--o{ journey_milestones : "tracks"
    development_goals ||--o{ journey_milestones : "breaks into"
    growth_journeys ||--o{ planned_activities : "schedules"
    development_goals ||--o{ planned_activities : "implements"
    journey_milestones ||--o{ planned_activities : "contains"
    growth_journeys ||--o{ journey_generation_records : "logs"

    growth_journeys {
        uuid id PK
        uuid user_id FK
        uuid assessment_attempt_id FK
        text title
        text description
        text status
        text target_duration
        text weekly_commitment_hours
        text[] capability_keys
        text[] primary_priorities
        jsonb personalization_snapshot
        timestamptz created_at
        timestamptz updated_at
        timestamptz completed_at
    }

    journey_capability_focus_areas {
        uuid id PK
        uuid journey_id FK
        text capability_key
        text capability_name
        text rationale
        text[] selected_dimensions
        text[] intended_outcomes
        integer priority
        text status
        timestamptz created_at
    }

    development_goals {
        uuid id PK
        uuid journey_id FK
        uuid focus_area_id FK
        text capability_key
        text dimension_slug
        text title
        text description
        text reason_for_recommendation
        text expected_outcome
        text priority
        date target_date
        text status
        integer order_index
        timestamptz created_at
        timestamptz updated_at
    }

    journey_milestones {
        uuid id PK
        uuid journey_id FK
        uuid goal_id FK
        text title
        text description
        text expected_outcome
        text suggested_period
        text status
        integer order_index
        timestamptz created_at
    }

    planned_activities {
        uuid id PK
        uuid journey_id FK
        uuid goal_id FK
        uuid milestone_id FK
        text capability_key
        text title
        text description
        text purpose
        integer estimated_minutes
        integer suggested_order
        text status
        timestamptz created_at
    }

    journey_generation_records {
        uuid id PK
        uuid journey_id FK
        uuid user_id FK
        text provider
        text model_name
        text generation_type
        integer prompt_tokens
        integer completion_tokens
        jsonb input_snapshot
        timestamptz created_at
    }
```

---

## 2. Row Level Security (RLS) Policies

All tables in Phase 4 enforce PostgreSQL Row Level Security:

1. `growth_journeys`:
   - `auth.uid() = user_id` for all operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
2. `journey_capability_focus_areas`, `development_goals`, `journey_milestones`, `planned_activities`:
   - Protected via `EXISTS` subqueries verifying that the associated `growth_journeys.user_id = auth.uid()`.
3. `journey_generation_records`:
   - `auth.uid() = user_id` for `SELECT`.
