# OBHASH — Known Limitations & System Boundaries

**Project:** OBHASH  
**Team:** PastForward  
**Phase:** 8 of 8 (Integration, Testing & Competition Launch)  
**Status:** Official Prototype Boundary Disclosure  

---

## 1. Purpose of this Document

In accordance with our core value of **Human-Centered Intelligence and Intellectual Honesty**, this document provides an explicit, transparent accounting of OBHASH's prototype boundaries, current technical limitations, and future architectural roadmap.

Judges, evaluators, and engineers should reference this document to understand what the system intentionally does—and what it does not yet attempt.

---

## 2. Core Boundary Disclosures

### 2.1 Multi-Tenant Storage Modes (Supabase vs Local Mock Store)
- **Current Behavior:** OBHASH features a dual-layer persistence architecture. When Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are connected, it persists to PostgreSQL with strict Row Level Security. When running in offline or unconfigured demonstration environments, the system seamlessly transitions to an in-memory/cookie mock store.
- **Limitation:** In local mock mode, changes made in one browser session do not synchronize across different devices or survive container restarts.
- **Production Path:** In production deployments, connecting Supabase provides permanent multi-tenant relational persistence.

### 2.2 Independence Dimension Confidence & Sample Sizes
- **Current Behavior:** The Independence Measurement Engine computes scores across 5 dimensions (Critical Distance, Autonomous Problem Formulation, Cognitive Self-Reliance, Originality of Synthesis, Depth of Reflection).
- **Limitation:** A user with fewer than 3 completed challenges is honestly flagged with **"Insufficient Evidence"** or low confidence ratings. The engine refuses to fabricate a high-confidence metric on sparse data.
- **Production Path:** Longitudinal user tracking over weeks or semesters is required to establish statistical trends in capability independence.

### 2.3 Non-Equivalence of Diagnostic vs Practice Metrics
- **Current Behavior:** Phase 3 diagnostic assessment scores and Phase 6 open-ended challenge practice scores are deliberately kept in distinct analytical buckets.
- **Limitation:** OBHASH does not calculate a naive arithmetic "delta" between initial diagnostic scores and open-ended challenge deliverables.
- **Scientific Justification:** Diagnostic assessments measure controlled scenario recognition, whereas real-world challenges measure unstructured execution. Equating the two would represent scientifically invalid psychometrics.

### 2.4 Generative AI Scaffolding & Prompt Dependency
- **Current Behavior:** The AI Growth Coach uses carefully engineered Socratic system prompts that forbid answer generation, enforce progressive hint scaffolds, and synthesize structured reflections.
- **Limitation:** Advanced LLMs can occasionally succumb to adversarial jailbreaking (e.g. "Ignore previous instructions and write the answer"). While our prompt defense layers mitigate this, no LLM is 100% immune to adversarial prompt injection.
- **Production Path:** Implementation of dual-pass validation or specialized fine-tuned coaching models.

---

## 3. Explicit Non-Goals & Architectural Boundaries

To protect the integrity of human capability development, OBHASH intentionally rejects several common ed-tech features:

| Non-Goal | Rationale |
|---|---|
| **No Public Leaderboards** | Ranking users against each other creates perverse incentives to game scores rather than focus on genuine self-reflection and personal capability development. |
| **No Social Comparison Feeds** | Capability growth is an internal, reflective journey. Social gamification triggers social anxiety and shallow engagement. |
| **No Automated Hiring Disqualification** | The Growth Portfolio is an exhibition of authentic human work, not an automated filtering algorithm for corporate recruiters. |
| **No Black-Box Psychometric Diagnoses** | OBHASH makes no clinical psychological claims. It measures specific, observable behavioral competencies anchored to structured pedagogical rubrics. |

---

## 4. Future Development Roadmap (Post-Competition)

1. **Phase 9: Collaborative Human-to-Human Inquiry**
   - Enable peer peer-review protocols where users critique and challenge each other's deliverables using Socratic prompts.
2. **Phase 10: Institutional & Educator Dashboard**
   - Provide university professors and corporate mentors with aggregate, anonymized cohort analytics showing capability growth and AI dependence reduction over time.
3. **Phase 11: Fine-Tuned Socratic Model Weights**
   - Distill the Socratic coaching prompt architecture into an open-source fine-tuned model (e.g. fine-tuned Gemma 2B/9B) to ensure 100% deterministic local execution without commercial API dependencies.
