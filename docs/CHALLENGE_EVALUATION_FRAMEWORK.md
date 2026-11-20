# OBHASH Challenge Evaluation Framework

**Phase:** Phase 6 of 8 (Challenge & Reflection Workspace)  
**Status:** Complete & Active  
**Philosophy:** Human-Centered Intelligence

---

## 1. Evaluation Philosophy

In OBHASH, evaluation is not a grading machine or a ranking system. Its sole objective is to help learners understand the quality, rigor, and depth of their thinking and identify actionable developmental frontiers.

The evaluation engine adheres to seven core rules:
1. **Evidence-Grounded**: Every strength and developmental opportunity must be backed by observable citations extracted directly from the user's submitted deliverables.
2. **Anti-Hallucination**: The evaluator never fabricates praise, quotes non-existent sentences, or assumes claims the user did not make.
3. **Selective Dimension Mapping**: Only dimensions explicitly exercised by the challenge are evaluated. Irrelevant capability dimensions are excluded.
4. **No Single Metric**: The system never aggregates scores into an overall IQ or percentile rank. Single numerical scores reduce complex human thinking to a commodity.
5. **Constructive Growth Focus**: Every critique is paired with an alternative angle or actionable next step.
6. **Prompt Injection Defense**: User submission content is isolated within `<untrusted_learner_submission>` XML envelopes. Any attempt to alter the evaluator persona or override instructions is neutralized.
7. **Zero-Downtime Deterministic Fallback**: If an external LLM is offline, unconfigured, or times out, the deterministic evaluation engine analyzes text structure, deliverable coverage, and capability rubrics to generate grounded feedback without interruption.

---

## 2. Evaluation Dimensions

The evaluation engine measures observable evidence against the 15 Phase 3 capability dimensions:

### Critical Thinking Dimensions
- **Analytical Reasoning**: Breaking down arguments into claims, premises, and logical deductions.
- **Evidence Evaluation**: Assessing sample sizes, confounding variables, and baseline comparison data.
- **Logical Reasoning**: Checking for formal validity, non-sequiturs, and internal consistency.
- **Perspective Evaluation**: Charitably examining opposing viewpoints and recognizing core value tensions.
- **Judgment**: Arriving at well-calibrated, defensible conclusions under conditions of uncertainty.

### Creative Problem-Solving Dimensions
- **Idea Generation**: Producing multiple viable solution paths.
- **Originality**: Developing non-obvious, inventive concepts that push past conventional solutions.
- **Cognitive Flexibility**: Shifting between behavioral, technological, and economic paradigms.
- **Practical Reasoning**: Anticipating human adoption frictions, feasibility barriers, and failure modes.
- **Iterative Thinking**: Refining and adapting ideas in response to constraints.

### Curiosity Dimensions
- **Question Formulation**: Converting surface inquiries into progressive question hierarchies.
- **Exploration**: Venturing into unfamiliar technical, mathematical, or scientific domains.
- **Information Seeking**: Cross-checking claims against primary literature and empirical evidence.
- **Intellectual Openness**: Welcoming surprising counter-examples and adopting epistemic humility.
- **Investigative Reasoning**: Connecting underlying mechanisms and tracing structural analogies across domains.

---

## 3. Four-Level Rubric Indicators

When rubric levels are displayed:
- **Level 1 (Beginning)**: Limited or superficial demonstration; key causal links or required deliverables omitted.
- **Level 2 (Developing)**: Foundational demonstration with noticeable analytical gaps or reliance on obvious defaults.
- **Level 3 (Proficient)**: Competent, well-supported demonstration directly grounded in scenario realities.
- **Level 4 (Mastery / Exemplary)**: Exceptional depth, original synthesis, nuanced handling of trade-offs, and clear systemic insight.

Each indicator reports an **Evidence Sufficiency** flag (`sufficient`, `partial`, or `insufficient`) and a **Confidence Score** (0.0 to 1.0).

---

## 4. Structured Output Format

```json
{
  "strengths": [
    "Clear recognition of confounding variables in the pilot co-intervention."
  ],
  "growth_opportunities": [
    "Further examine whether subjective productivity reflects physiological deep focus."
  ],
  "evidence_citations": [
    {
      "claim": "Identified co-intervention as a primary confounder",
      "quote": "The guided morning meditation alone could easily account for a 40%+ perceived focus boost",
      "analysis": "Directly isolates an uncontrolled second variable that invalidates single-cause attribution."
    }
  ],
  "alternative_perspectives": [
    "Consider an ecological perspective where focus is treated as an environmental affordance rather than an internal neural switch."
  ],
  "recommended_next_steps": [
    "Engage with 'The Constraint Challenge' to test engineering feasibility reasoning."
  ],
  "dimension_evaluations": {
    "Evidence Evaluation": {
      "dimension": "Evidence Evaluation",
      "level": 3,
      "label": "Proficient",
      "evidence": "Identified lack of control group and self-selection bias.",
      "guidance": "Strengthen study design by specifying sample randomization protocols."
    }
  },
  "confidence_score": 0.94,
  "evidence_sufficiency": "sufficient"
}
```
