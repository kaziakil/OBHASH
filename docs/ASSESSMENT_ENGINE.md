# OBHASH Assessment Engine Architecture

**Phase:** 3 of 8  
**Scope:** Technical Execution, Evaluation Pipeline & Score Aggregation  

---

## 1. End-to-End Evaluation Architecture

```
User Response (Browser)
      │
      ▼
Server Action: submitAssessmentAttempt()
      │
      ├───────────────────────────────────────────────────────┐
      ▼                                                       ▼
[AI Service Ready?]                                     [AI Service Standby]
      │                                                       │
      ├─ YES ────────► AI Assessment Evaluator                └─ NO ──► Deterministic Rubric
      │                • System Prompt Isolation                        • Structural Depth
      │                • Untrusted Content Boundaries                   • Criterion Keywords
      │                • Zod Schema JSON Parse                          • Evidence Excerpting
      │                                                       ┌───────┘
      │◄──────────────────────────────────────────────────────┘
      │
      ▼
Score Aggregation Engine (scoring.ts)
      • Calculate dimension scores (1.00 – 4.00)
      • Calculate capability overall score
      • Map performance tier (Emerging, Developing, Demonstrating, Strongly Demonstrating)
      • Synthesize evidence, strengths, and growth opportunities
      │
      ▼
Persistence & Revalidation
      • Update assessment_attempts (status: completed)
      • Insert assessment_evaluations
      • Upsert capability_profiles
      • Revalidate /dashboard and /assessment/results/[attemptId]
```

---

## 2. Prompt Injection & Evaluation Safeguards

1. **Untrusted Data Isolation**:
   The user's response is wrapped within an isolated XML tag:
   ```xml
   <user_response>
   ${responseText}
   </user_response>
   ```
2. **Explicit Evaluator Role**:
   The system prompt explicitly commands the model to act as an objective evaluator, to ignore any user directives to change scoring rules, and to cite real evidence directly from the user's text.
3. **Structured Validation**:
   Outputs must conform strictly to `EvaluationOutputSchema` (score 1-4, performance level, evidence, strengths, opportunities, confidence).
4. **Resilient Fallback**:
   If the LLM returns invalid JSON or times out, the system automatically routes to `evaluateDeterministic()`, guaranteeing zero runtime crashes and consistent rubric scoring.

---

## 3. Aggregation Algorithm

1. **Dimension Score**:
   Arithmetic average of all activity scores mapped to that dimension:
   $$\text{Score}_{\text{dimension}} = \frac{1}{N} \sum_{i=1}^{N} \text{Score}_i$$
2. **Overall Capability Score**:
   Transparent arithmetic average of all dimensions in the module, rounded to 2 decimal places:
   $$\text{Score}_{\text{overall}} = \frac{1}{D} \sum_{d=1}^{D} \text{Score}_d$$
3. **Performance Tier Thresholds**:
   - `1.00 - 1.74`: **Emerging**
   - `1.75 - 2.50`: **Developing**
   - `2.51 - 3.40`: **Demonstrating**
   - `3.41 - 4.00`: **Strongly Demonstrating**
