import { AssessmentModuleData } from "@/types/assessment";

export const ASSESSMENT_MODULES: AssessmentModuleData[] = [
  // ============================================================================
  // MODULE 1: CRITICAL THINKING
  // ============================================================================
  {
    slug: "critical-thinking",
    name: "Critical Thinking",
    tagline: "Evaluating arguments, discerning evidence, and formulating defensible judgments.",
    description:
      "This module evaluates how you dissect complex claims, separate verified evidence from unstated assumptions, compare conflicting sources, and construct objective conclusions without cognitive bias.",
    estimatedMinutes: 10,
    dimensions: [
      {
        slug: "analytical-reasoning",
        name: "Analytical Reasoning",
        description: "Deconstructing complex arguments into foundational premises, evidence, and logical links.",
      },
      {
        slug: "evidence-evaluation",
        name: "Evidence Evaluation",
        description: "Differentiating empirical data from speculation, correlation from causation, and spotting missing evidence.",
      },
      {
        slug: "logical-reasoning",
        name: "Logical Reasoning",
        description: "Detecting fallacies, non sequiturs, inconsistencies, and valid deductive or inductive reasoning.",
      },
      {
        slug: "perspective-evaluation",
        name: "Perspective Evaluation",
        description: "Examining competing viewpoints, alternative explanations, and potential biases.",
      },
      {
        slug: "judgment",
        name: "Judgment",
        description: "Formulating proportionate, well-reasoned, and defensible conclusions under uncertainty.",
      },
    ],
    items: [
      {
        id: "ct-item-1",
        moduleSlug: "critical-thinking",
        dimensionSlug: "evidence-evaluation",
        dimensionName: "Evidence Evaluation",
        activityType: "argument-evaluation",
        orderIndex: 1,
        title: "Activity 1: Evaluate an Argument",
        scenario: `A corporate leadership memo issued by a major tech consultancy states:

"After analyzing our quarterly internal performance reviews, we observed that employees working on-site filed 25% more internal project patents than fully remote employees. Furthermore, 78% of managers in our voluntary monthly feedback poll stated that teams collaborating in the office generate more creative breakthroughs. 

Therefore, remote work directly stifles innovation. To restore our competitive edge and ensure our future market leadership, we must immediately terminate all remote work arrangements and require mandatory five-day in-office attendance."`,
        instructions:
          "Carefully examine the claims, data points, and recommendations presented in the memo. Break down the argument by answering each structured section below.",
        responseType: "structured-reasoning",
        structuredSections: [
          {
            id: "claim",
            prompt: "1. What is the central causal claim of the memo?",
            placeholder: "State the primary assertion the author is making...",
            required: true,
          },
          {
            id: "evidence_vs_assumption",
            prompt: "2. What evidence is provided, and what unstated assumptions does the author rely upon?",
            placeholder: "Differentiate between the presented numbers and the unproven assumptions...",
            required: true,
          },
          {
            id: "missing_info",
            prompt: "3. What critical counter-evidence or confounding variables are missing from this analysis?",
            placeholder: "Identify missing control groups, patent quality metrics, response rates, etc...",
            required: true,
          },
          {
            id: "evaluation",
            prompt: "4. Is the author's final conclusion and mandatory policy justified by the evidence presented? Defend your verdict.",
            placeholder: "Explain whether the recommendation logically follows from the premises...",
            required: true,
          },
        ],
        rubric: {
          dimensionSlug: "evidence-evaluation",
          dimensionName: "Evidence Evaluation",
          criteria: [
            "Clear distinction between correlation and causation",
            "Identification of selection bias (voluntary manager poll, patent filing volume vs quality)",
            "Detection of unstated assumptions (patent quantity = total innovation)",
            "Formulation of a nuanced, evidence-based judgment",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Accepts the argument at face value or rejects it based on personal preference without analyzing evidence.",
              indicators: [
                "Merely repeats the prompt without critical breakdown",
                "Does not identify flaws in the voluntary manager poll or patent volume metric",
                "Confuses correlation with direct causation",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Identifies that the conclusion is hasty, but focuses on superficial issues rather than underlying evidential gaps.",
              indicators: [
                "Notices that managers might be biased, but misses the selection bias in patent filings",
                "Points out that 25% might be small, but does not identify confounding factors",
                "Offers alternative opinion without fully deconstructing the memo's logic",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Clearly differentiates empirical data from assumptions and explains missing confounding variables.",
              indicators: [
                "Distinguishes between patent filing count and actual commercial innovation value",
                "Highlights that voluntary manager surveys represent subjective perception rather than verified output",
                "Articulates why correlation does not establish causation in workplace productivity",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Provides a rigorous, multi-layered critique addressing selection bias, confounding variables, and disproportionate policy mandates.",
              indicators: [
                "Pinpoints specific confounding variables (e.g., seniority, department type, patent incentives, sample sizes)",
                "Critiques the logical leap from quarterly variance to permanent five-day mandatory mandates",
                "Constructs a balanced alternative approach to measuring genuine collaborative innovation",
              ],
            },
          },
        },
      },
      {
        id: "ct-item-2",
        moduleSlug: "critical-thinking",
        dimensionSlug: "perspective-evaluation",
        dimensionName: "Perspective Evaluation",
        activityType: "conflicting-sources",
        orderIndex: 2,
        title: "Activity 2: Analyze Conflicting Information",
        scenario: `Consider two competing reports evaluating the introduction of electric scooters in a dense metropolitan area:

SOURCE A (Municipal Transportation Board Report):
"Since the deployment of 5,000 shared electric scooters six months ago, short-distance vehicular taxi trips have dropped by 14% in the downtown commercial core, reducing estimated carbon emissions by 42 metric tons. Commuters report faster first-and-last-mile connections to subway stations. The micro-mobility initiative is a demonstrable sustainability success."

SOURCE B (Metropolitan Emergency Healthcare & Pedestrian Safety Coalition):
"Over the past six months, emergency department admissions involving sidewalk micromobility collisions surged by 68%, with 41% of injuries affecting non-riding elderly pedestrians. Furthermore, municipal maintenance logs indicate that abandoned scooters obstruct over 30% of downtown ADA wheelchair ramps daily. The initiative represents an uncontrolled public safety and accessibility hazard."`,
        instructions:
          "Analyze the conflicting reports. Synthesize the competing findings by addressing each section below.",
        responseType: "structured-reasoning",
        structuredSections: [
          {
            id: "synthesis",
            prompt: "1. What are the key points of agreement, divergence, and potential bias between Source A and Source B?",
            placeholder: "Compare metrics, institutional agendas, and data scopes...",
            required: true,
          },
          {
            id: "reliability",
            prompt: "2. How reliable is the evidence presented in each source? What metrics might be selectively highlighted?",
            placeholder: "Evaluate relative percentages vs absolute figures, time horizons, etc...",
            required: true,
          },
          {
            id: "missing_evidence",
            prompt: "3. What independent, empirical data would you need before determining whether the scooter initiative is beneficial overall?",
            placeholder: "Identify objective safety rates per rider-mile, total traffic counts, net environmental lifecycles...",
            required: true,
          },
        ],
        rubric: {
          dimensionSlug: "perspective-evaluation",
          dimensionName: "Perspective Evaluation",
          criteria: [
            "Recognition of institutional incentives and selective reporting",
            "Scrutiny of statistical framing (percentages vs absolute base rates)",
            "Identification of trade-offs between transit efficiency and pedestrian safety",
            "Proposal of rigorous multi-variable empirical verification",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Takes one source as completely true and dismisses the other, failing to synthesize competing data.",
              indicators: [
                "Chooses one side based purely on prior intuition",
                "Fails to recognize that both sources may be presenting factual but partial subsets of reality",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Acknowledges both perspectives exist, but treats them as irreconcilable or merely averages their claims.",
              indicators: [
                "Notes that one talks about green transit while the other talks about accidents",
                "Does not analyze statistical framing (e.g., 68% increase from what base number?)",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Systematically compares the conflicting metrics, identifies selective framing, and specifies objective verification requirements.",
              indicators: [
                "Identifies that Source A focuses exclusively on transit speed/emissions while ignoring infrastructure friction",
                "Identifies that Source B reports percentage injury surges without normalizing for total rider miles or prior baseline",
                "Proposes concrete data needed (e.g., accidents per 100k rides, lifecycle carbon footprint, economic accessibility)",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Exhibits sophisticated synthesis, recognizing systemic trade-offs, regulatory levers, and evidentiary criteria.",
              indicators: [
                "Deconstructs institutional framing and methodological blind spots of both reports",
                "Recommends targeted policy experiments (e.g., geo-fencing, designated parking corrals) to test hypotheses",
                "Maintains analytical neutrality while synthesizing competing public values (sustainability vs physical accessibility)",
              ],
            },
          },
        },
      },
      {
        id: "ct-item-3",
        moduleSlug: "critical-thinking",
        dimensionSlug: "judgment",
        dimensionName: "Judgment",
        activityType: "reasoning-scenario",
        orderIndex: 3,
        title: "Activity 3: Reasoning Under Uncertainty",
        scenario: `You are on the executive committee of a regional non-profit that provides technology education to underprivileged young adults (ages 18–25). 

A major donor has just pledged a $1,000,000 grant with an expiration window of 14 days to decide on one of two mutually exclusive deployment paths:

OPTION 1: The Direct Cohort Expansion
Fund immediate 10-month intensive coding and data bootcamps for 250 high-need students this year. Historical data from your past smaller cohorts indicates an 82% graduate employment rate within 6 months. However, once the grant is spent, funding ends and no permanent capacity is built.

OPTION 2: The Open Learning Infrastructure
Invest the entire $1,000,000 into developing a localized, open-access, self-guided curriculum and community mentorship platform in regional languages. It will serve an estimated 10,000+ self-directed learners annually for at least five years with low marginal maintenance costs. However, completion rates for voluntary open-access platforms historically hover around 6% to 8%, and no guaranteed job placement infrastructure exists.`,
        instructions:
          "Formulate and justify a defensible strategic decision under conflicting trade-offs and incomplete certainty.",
        responseType: "long-text",
        rubric: {
          dimensionSlug: "judgment",
          dimensionName: "Judgment",
          criteria: [
            "Clear articulation of the decision and core trade-offs (depth and certainty vs breadth and scale)",
            "Systematic examination of risk factors and unstated assumptions for both options",
            "Exploration of hybrid options or mitigation strategies",
            "Logical consistency between values, evidence, and conclusions",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Selects an option impulsively with minimal reasoning or justification.",
              indicators: [
                "States a choice without addressing the significant drawbacks of that choice",
                "Ignores historical data provided in the prompt",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Identifies basic trade-offs (e.g. 250 people vs 10,000 people), but provides shallow justification.",
              indicators: [
                "Repeats numbers from prompt without evaluating the quality of outcomes (high impact vs low completion)",
                "Fails to propose any risk-mitigation measures",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Delivers a defensible, well-reasoned decision that systematically balances high-depth certainty against broad-reach scalability.",
              indicators: [
                "Quantifies expected outcomes (e.g., 205 employed students vs ~600-800 completers with uncertain employment)",
                "Addresses sustainability and organizational mission alignment",
                "Suggests realistic mitigation strategies for the chosen option's weaknesses",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Exhibits superior strategic judgment, analyzing structural sustainability, outcome compounding, and creative risk hedging.",
              indicators: [
                "Evaluates second-order effects (e.g., alumni donor pipelines, employer partnerships, platform network effects)",
                "Analyzes whether the grant terms permit blended execution or pilot gating",
                "Formulates a robust contingency framework tied to demonstrable milestone checkpoints",
              ],
            },
          },
        },
      },
    ],
  },

  // ============================================================================
  // MODULE 2: CREATIVE PROBLEM-SOLVING
  // ============================================================================
  {
    slug: "creative-problem-solving",
    name: "Creative Problem-Solving",
    tagline: "Generating divergent ideas, reframing constraints, and crafting inventive solutions.",
    description:
      "This module evaluates how you navigate ambiguous challenges, generate novel yet viable possibilities, break out of conventional framing, and iterate on flawed systems.",
    estimatedMinutes: 10,
    dimensions: [
      {
        slug: "idea-generation",
        name: "Idea Generation",
        description: "Fluency in producing diverse, non-obvious candidate approaches to an open challenge.",
      },
      {
        slug: "originality",
        name: "Originality",
        description: "Synthesizing unconventional connections and novel angles rather than boilerplate ideas.",
      },
      {
        slug: "flexibility",
        name: "Flexibility",
        description: "Switching conceptual paradigms and reframing the core challenge from fresh angles.",
      },
      {
        slug: "practical-reasoning",
        name: "Practical Reasoning",
        description: "Balancing inventive novelty with feasibility, physics, human incentives, and constraints.",
      },
      {
        slug: "iterative-thinking",
        name: "Iterative Thinking",
        description: "Critiquing first-draft concepts, anticipating unintended consequences, and refining solutions.",
      },
    ],
    items: [
      {
        id: "cps-item-1",
        moduleSlug: "creative-problem-solving",
        dimensionSlug: "originality",
        dimensionName: "Originality & Idea Generation",
        activityType: "possibility-generation",
        orderIndex: 1,
        title: "Activity 1: Generate Possibilities",
        scenario: `In urban student residential districts, approximately 35% of fresh grocery food purchased by students spoils and gets discarded weekly. Conventional solutions—such as basic reminder apps or generic recipe sites—have failed to alter behavior because students experience erratic academic schedules, shared cramped refrigerators, and fatigue after study sessions.`,
        instructions:
          "Generate divergent approaches to tackle this problem at its root. Provide distinct concepts and detail one genuinely unconventional solution.",
        responseType: "structured-reasoning",
        structuredSections: [
          {
            id: "divergent_ideas",
            prompt: "1. Brainstorm three fundamentally different approaches (e.g., social/cooperative, architectural/hardware, logistical/behavioral) to eliminate fresh food spoilage among students.",
            placeholder: "Describe three approaches that address completely different root causes...",
            required: true,
          },
          {
            id: "unconventional_solution",
            prompt: "2. Select or propose one genuinely unconventional solution that challenges normal assumptions about student food management. How does it work?",
            placeholder: "Explain an inventive, non-obvious concept...",
            required: true,
          },
          {
            id: "feasibility_and_tradeoffs",
            prompt: "3. What are the key feasibility constraints and potential human resistance points to your unconventional solution, and how would you address them?",
            placeholder: "Address hygiene, social trust, cost, inertia...",
            required: true,
          },
        ],
        rubric: {
          dimensionSlug: "originality",
          dimensionName: "Originality",
          criteria: [
            "Diversity of generated paradigms (hardware, community contracts, micro-logistics, behavioural nudges)",
            "Originality and non-obviousness of the selected solution",
            "Clear awareness of human psychological resistance and practical constraints",
            "Demonstrated ability to reframe the problem beyond 'another mobile app'",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Proposes only obvious or cliché solutions (e.g., 'send push notifications' or 'buy less food').",
              indicators: [
                "All ideas belong to the same predictable category",
                "Fails to address the underlying causes stated in the prompt",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Generates multiple ideas, but they remain derivative of common market apps with little novel variation.",
              indicators: [
                "Proposes familiar ideas with slight cosmetic tweaks",
                "Addresses feasibility only superficially",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Generates distinct conceptual approaches spanning different domains and articulates a viable, creative solution.",
              indicators: [
                "Approaches span multiple categories (e.g., physical fridge shelf redesign, cooperative kitchen prep, micro-barter)",
                "Details a creative mechanism with clear behavioral alignment",
                "Addresses social friction and economic incentives thoughtfully",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Reframes the problem with high originality, designing an elegant system combining inventive mechanics with rigorous feasibility awareness.",
              indicators: [
                "Reframes waste from an individual failure into a community resource loop or sensory design intervention",
                "Anticipates subtle failure points (free-rider problems, sensory fatigue) and builds in self-correcting incentives",
                "Exhibits exceptional lateral thinking connecting disparate systems",
              ],
            },
          },
        },
      },
      {
        id: "cps-item-2",
        moduleSlug: "creative-problem-solving",
        dimensionSlug: "practical-reasoning",
        dimensionName: "Practical Reasoning Under Constraints",
        activityType: "constraint-solving",
        orderIndex: 2,
        title: "Activity 2: Solve Under Severe Constraints",
        scenario: `A severe regional cyclone has collapsed electrical power grids and cellular towers across a student campus region for an anticipated 10-day period. 

Local students (1,200 individuals scattered across a 4-kilometer radius) need to coordinate vital safety check-ins, water distribution notices, and academic continuity updates. 

CONSTRAINTS:
- ZERO cellular data and internet connectivity.
- ZERO fuel for generators.
- A total emergency budget of under $100.
- All equipment must rely on manual energy, ambient daylight, or pre-existing low-tech items commonly found in student housing.`,
        instructions:
          "Design a functional, reliable communication and coordination system that strictly respects every constraint.",
        responseType: "long-text",
        rubric: {
          dimensionSlug: "practical-reasoning",
          dimensionName: "Practical Reasoning",
          criteria: [
            "Strict adherence to all stated physical and budgetary constraints",
            "Inventive repurposing of common everyday items (bicycles, mirrors, paper bulletins, relay runners, whistles, solar watches)",
            "Systemic operational design (message verification, hub-and-spoke routing, redundancy)",
            "Resilience against human confusion or fatigue over a 10-day span",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Violates core constraints (e.g., assumes WiFi works or purchases expensive satellite equipment).",
              indicators: [
                "Relies on powered digital technology despite stated outage",
                "Fails to present an operable logistical mechanism",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Respects constraints but offers a rudimentary or brittle concept (e.g., 'shout with megaphones' or 'one person walks around').",
              indicators: [
                "Does not account for the 4-kilometer scale or 1,200 people density",
                "Lacks verification protocols to prevent false rumors",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Constructs a realistic, creative low-tech communication protocol using available physical resources.",
              indicators: [
                "Establishes a structured network (e.g., bicycle dispatch relays, timed bulletin hubs at water points, semaphore flags)",
                "Includes message verification and timestamping to prevent dangerous miscommunication",
                "Remains strictly within the zero-electricity and $100 budget limit",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Engineers a resilient, highly sophisticated asynchronous human mesh protocol with redundancy and incentive alignment.",
              indicators: [
                "Leverages existing predictable human routines (e.g., morning water collection points as natural message exchange nodes)",
                "Designs protocol for message authentication, return confirmations, and emergency prioritization",
                "Demonstrates exceptional engineering resourcefulness under extreme deprivation",
              ],
            },
          },
        },
      },
      {
        id: "cps-item-3",
        moduleSlug: "creative-problem-solving",
        dimensionSlug: "iterative-thinking",
        dimensionName: "Iterative Thinking & Improvement",
        activityType: "solution-improvement",
        orderIndex: 3,
        title: "Activity 3: Improve an Existing Solution",
        scenario: `A university introduced an automated peer-mentorship platform aimed at helping struggling first-year students. 

CURRENT DESIGN:
An algorithm matches each first-year student with a senior student based on shared academic major and hobbies. The system sends an automated email introducing them and encourages them to "find time to meet on campus."

THE PROBLEM:
Platform telemetry reveals that while 94% of matches send a polite first greeting email, 82% of pairs never meet in person, and 76% of partnerships become completely silent by Week 3. Exit surveys report: "Neither of us knew what to talk about," "It felt awkward and artificial," and "We both got busy."`,
        instructions:
          "Analyze the structural weaknesses of the existing system and redesign the experience to convert artificial matches into genuine, sustained peer collaboration.",
        responseType: "structured-reasoning",
        structuredSections: [
          {
            id: "diagnosis",
            prompt: "1. What are the root psychological and structural causes of the 82% drop-off in the current design?",
            placeholder: "Deconstruct why 'find time to meet' creates social friction and cognitive load...",
            required: true,
          },
          {
            id: "redesign",
            prompt: "2. Redesign the mentorship mechanism. What specific new interactions, shared artifacts, or micro-rituals replace the awkward generic email?",
            placeholder: "Detail the step-by-step experience that anchors the relationship...",
            required: true,
          },
          {
            id: "unintended_consequences",
            prompt: "3. What unintended negative behavior might your redesign introduce, and how will your system prevent it?",
            placeholder: "Anticipate gaming, mentor burnout, or unequal effort...",
            required: true,
          },
        ],
        rubric: {
          dimensionSlug: "iterative-thinking",
          dimensionName: "Iterative Thinking",
          criteria: [
            "Accurate diagnosis of psychological inertia, coordination friction, and lack of shared purpose",
            "Creation of concrete, low-stakes micro-collaborations rather than open-ended expectations",
            "Anticipation of unintended second-order effects",
            "Iterative refinement addressing both student anxiety and senior mentor incentives",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Offers superficial changes such as 'send more reminder emails' or 'give gift cards'.",
              indicators: [
                "Does not identify the social friction inherent in open-ended invitations",
                "Believes extrinsic rewards alone fix an awkward interpersonal structure",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Diagnoses the awkwardness but proposes heavy administrative requirements that increase burden on participants.",
              indicators: [
                "Requires mandatory weekly logs or long formal forms that senior students will resent",
                "Does not test for unintended consequences",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Redesigns the interaction into structured, low-friction shared micro-challenges with natural conversational scaffolding.",
              indicators: [
                "Replaces open-ended meetings with concrete collaborative tasks (e.g., 15-minute course survival guide, campus scavenger checklist)",
                "Reduces initial social awkwardness through asynchronous low-stakes collaboration",
                "Identifies and addresses potential mentor fatigue",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Delivers an elegant structural overhaul blending behavioral economics, psychological safety, and reciprocal incentives.",
              indicators: [
                "Transforms one-way mentoring into reciprocal exchange (senior gets leadership credit/portfolio artifacts, junior gets guidance)",
                "Designs gradual escalation from low-threat async rituals to high-trust spontaneous meetups",
                "Demonstrates sophisticated iterative systems thinking with pre-emptive failure safeguards",
              ],
            },
          },
        },
      },
    ],
  },

  // ============================================================================
  // MODULE 3: CURIOSITY
  // ============================================================================
  {
    slug: "curiosity",
    name: "Curiosity",
    tagline: "Formulating deep questions, investigating uncertainty, and exploring cross-domain connections.",
    description:
      "This module evaluates your active drive for inquiry, your ability to distinguish deep mechanistic questions from superficial queries, your approach to investigating controversial claims, and your capacity to discover hidden connections between disparate disciplines.",
    estimatedMinutes: 10,
    dimensions: [
      {
        slug: "question-formulation",
        name: "Question Formulation",
        description: "Formulating generative, multi-layered questions that unlock root mechanisms rather than superficial facts.",
      },
      {
        slug: "exploration",
        name: "Exploration",
        description: "Willingness to explore unfamiliar territories, question initial intuitions, and seek out edge cases.",
      },
      {
        slug: "information-seeking",
        name: "Information Seeking",
        description: "Strategically identifying high-value, primary, and cross-disciplinary sources to investigate claims.",
      },
      {
        slug: "intellectual-openness",
        name: "Intellectual Openness",
        description: "Receptivity to counter-intuitive findings and willingness to revise premises when presented with new evidence.",
      },
      {
        slug: "investigative-reasoning",
        name: "Investigative Reasoning",
        description: "Structuring systematic, hypothesis-driven lines of inquiry rather than aimless browsing.",
      },
    ],
    items: [
      {
        id: "cur-item-1",
        moduleSlug: "curiosity",
        dimensionSlug: "question-formulation",
        dimensionName: "Question Formulation",
        activityType: "questioning-phenomenon",
        orderIndex: 1,
        title: "Activity 1: Question the Unknown",
        scenario: `Marine biologists exploring a deep-sea hydrothermal vent trench at 3,800 meters depth discover an undocumented colony of translucent sea worms. 

Every evening at exactly 21:00 UTC, the entire colony simultaneously pulses with a bright cyan bioluminescent wave for 12 minutes, despite living in perpetual pitch-black darkness with zero exposure to sunlight, seasonal tidal variations, or external day/night cycles.`,
        instructions:
          "Formulate an investigative inquiry into this unexplained phenomenon. Demonstrate your ability to distinguish superficial questions from deep mechanistic ones.",
        responseType: "structured-reasoning",
        structuredSections: [
          {
            id: "initial_questions",
            prompt: "1. Formulate five distinct questions you would ask to investigate this phenomenon. Ensure they probe different levels of reality (e.g., biological clocks, chemical triggers, evolutionary purpose, environmental signals).",
            placeholder: "List five precise, investigative questions...",
            required: true,
          },
          {
            id: "deep_vs_superficial",
            prompt: "2. From your questions above, select what you consider the single most critical mechanistic question and contrast it with a common superficial question. Why is it more generative?",
            placeholder: "Explain what makes your chosen question capable of unlocking the underlying mechanism...",
            required: true,
          },
          {
            id: "investigation_plan",
            prompt: "3. If you had access to a deep-sea research submersible for 48 hours, what initial controlled experiment would you run to test your lead hypothesis?",
            placeholder: "Outline an experimental intervention that isolates variables...",
            required: true,
          },
        ],
        rubric: {
          dimensionSlug: "question-formulation",
          dimensionName: "Question Formulation",
          criteria: [
            "Depth and diversity of questions (biochemical, physiological, evolutionary, environmental)",
            "Clear distinction between descriptive questions ('what color is it?') and mechanistic/causal questions ('what synchronizes the pace?')",
            "Falsifiable hypothesis generation and targeted experimental design",
            "Intellectual curiosity probing unexpected anomalies",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Asks only basic descriptive questions that can be answered with simple facts or observation.",
              indicators: [
                "Questions focus on obvious physical features ('how big are they?', 'what do they eat?')",
                "Does not question the mechanism of synchronization across the colony",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Asks relevant questions but stays within familiar biological templates without investigating unique anomaly.",
              indicators: [
                "Mentions biological clocks, but does not explore how time is maintained in perpetual darkness",
                "Proposes generic observation rather than a controlled variable test",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Formulates deep, multi-layered mechanistic questions and articulates a viable experimental test.",
              indicators: [
                "Probes potential zeitgebers (thermal vent pulsings, seismic micro-frequencies, quorum sensing chemical cascades)",
                "Differentiates between descriptive inquiry and generative causality",
                "Outlines an experiment that isolates an environmental variable (e.g., sound, chemical barriers, thermal shielding)",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Demonstrates exceptional epistemic curiosity, formulating profound cross-disciplinary hypotheses spanning physics, chemistry, and evolutionary biology.",
              indicators: [
                "Explores non-obvious coupling mechanisms (e.g., geomagnetic rhythms, cosmic muon flux, microbial symbiont oscillations)",
                "Designs an elegant, elegant falsification experiment addressing confounding variables",
                "Exhibits a genuine appetite for unraveling the unknown with scientific rigor",
              ],
            },
          },
        },
      },
      {
        id: "cur-item-2",
        moduleSlug: "curiosity",
        dimensionSlug: "intellectual-openness",
        dimensionName: "Intellectual Openness & Claim Investigation",
        activityType: "claim-investigation",
        orderIndex: 2,
        title: "Activity 2: Investigate an Extraordinary Claim",
        scenario: `A widely circulated science-tech article claims:

"Breakthrough research from a stealth neurotech startup demonstrates that wearing a calibrated 40Hz acoustic stimulation headband during deep sleep enhances complex problem-solving ability by 45% the following afternoon. Over 100,000 users have already purchased the $299 device, with social media influencers reporting dramatic mental clarity."`,
        instructions:
          "Investigate this extraordinary claim with an inquisitive, rigorous mindset. Detail how you would investigate the assertion without succumbing to either blind belief or cynical dismissal.",
        responseType: "structured-reasoning",
        structuredSections: [
          {
            id: "verification_targets",
            prompt: "1. What specific scientific claims in this article demand rigorous empirical verification?",
            placeholder: "Identify the measurement tools, statistical baselines, peer review status, etc...",
            required: true,
          },
          {
            id: "source_investigation",
            prompt: "2. Where would you search for authoritative, unbiased evidence, and what potential conflicts of interest would you scrutinize?",
            placeholder: "List independent databases, clinical trial registries, funding sources...",
            required: true,
          },
          {
            id: "falsifiability",
            prompt: "3. What specific experimental finding or evidence would convince you that the device is genuinely effective? What finding would prove it is merely a placebo or marketing illusion?",
            placeholder: "Define the exact evidentiary threshold that would change your mind in either direction...",
            required: true,
          },
        ],
        rubric: {
          dimensionSlug: "intellectual-openness",
          dimensionName: "Intellectual Openness",
          criteria: [
            "Avoidance of both naive credulity and dismissive cynicism",
            "Clear understanding of double-blind sham-controlled clinical trial standards",
            "Identification of commercial conflicts of interest vs peer-reviewed independent replication",
            "Definition of precise falsification criteria (what evidence shifts one's perspective)",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Either gullibly accepts the claim based on popularity ('100,000 users can't be wrong') or reflexively scoffs without investigation.",
              indicators: [
                "Relies on testimonial validity or influencer hype",
                "Dismisses the claim out of hand without articulating evidentiary grounds",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Recognizes the marketing red flags, but offers only generic skepticism ('I'd Google it' or 'show me studies').",
              indicators: [
                "Does not specify clinical trial requirements (double-blind, sham headband control)",
                "Vague about what specific data would change their mind",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Demonstrates active scientific curiosity, identifying rigorous trial standards and defining explicit falsification thresholds.",
              indicators: [
                "Demands randomized sham-controlled double-blind trials with objective cognitive battery tests",
                "Identifies conflicts of interest (startup-funded trials vs independent academic neurology labs)",
                "Articulates balanced criteria that would legitimately substantiate or debunk the claim",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Exhibits superior intellectual curiosity and scientific literacy, exploring the underlying neuroscience of 40Hz gamma oscillations while maintaining rigorous epistemic standards.",
              indicators: [
                "Distinguishes between genuine neurobiological mechanisms (gamma entrainment in Alzheimer's models) and commercial extrapolation",
                "Evaluates effect sizes, publication bias, and p-hacking in commercial wellness tech",
                "Demonstrates authentic intellectual humility: prepared to embrace the finding if independent replication withstands scrutiny",
              ],
            },
          },
        },
      },
      {
        id: "cur-item-3",
        moduleSlug: "curiosity",
        dimensionSlug: "exploration",
        dimensionName: "Cross-Disciplinary Exploration",
        activityType: "connecting-concepts",
        orderIndex: 3,
        title: "Activity 3: Explore Unexpected Connections",
        scenario: `Consider two seemingly unrelated domains:

DOMAIN A: Subterranean Fungal Mycelium Networks
Underground fungal threads connect trees and plants across entire forests. They dynamically allocate nutrients, relay biochemical stress warnings between trees under pest attack, and route resources around severed pathways through decentralized, leaderless chemical gradient exchanges.

DOMAIN B: Decentralized Resilient Cloud Computing Protocols
Distributed peer-to-peer computing systems (e.g., BitTorrent, IPFS, distributed ledgers) where autonomous computer nodes communicate, store redundant data, and route network packets without any centralized server or authoritative controller.`,
        instructions:
          "Explore deep conceptual connections between these two domains. Propose an inventive insight, application, or research question born from their intersection.",
        responseType: "long-text",
        rubric: {
          dimensionSlug: "exploration",
          dimensionName: "Exploration & Connecting Concepts",
          criteria: [
            "Depth of cross-domain structural parallels (resource allocation, failure resilience, incentive signaling)",
            "Avoidance of purely poetic or superficial metaphors in favor of algorithmic and mechanistic insight",
            "Formulation of a novel application or testable research inquiry inspired by the synthesis",
            "Demonstrated intellectual curiosity in exploring non-traditional intersections",
          ],
          levels: {
            1: {
              level: 1,
              name: "Emerging",
              description: "Offers only a superficial, poetic remark ('both are like webs' or 'nature is like computers').",
              indicators: [
                "Fails to identify specific shared mechanics or structural parallels",
                "No tangible synthesis or novel application proposed",
              ],
            },
            2: {
              level: 2,
              name: "Developing",
              description: "Identifies basic structural similarities (decentralized, no boss, network nodes) without deep exploration.",
              indicators: [
                "Restates the prompt's descriptions side by side without generating a new insight",
                "Application remains generic ('use nature to design better computers')",
              ],
            },
            3: {
              level: 3,
              name: "Demonstrating",
              description: "Draws substantive mechanistic parallels (e.g., self-healing routing, chemical gradient vs latency routing, multi-species resource trading) and proposes a concrete concept.",
              indicators: [
                "Compares biological cost/benefit resource routing to congestion-aware packet delivery",
                "Formulates a practical algorithm idea (e.g., bio-inspired adaptive peer weighting)",
                "Demonstrates genuine exploratory enthusiasm for interdisciplinary learning",
              ],
            },
            4: {
              level: 4,
              name: "Strongly Demonstrating",
              description: "Synthesizes profound algorithmic and ecological principles, creating an original conceptual framework with immense investigative potential.",
              indicators: [
                "Examines how mycelial networks prevent 'tragedy of the commons' or parasitic nodes, mapping it to Byzantine fault tolerance or Sybil attacks",
                "Proposes a concrete research simulation modeling biological chemical gradient decay as a replacement for centralized routing tables",
                "Displays exceptional intellectual daring, lateral thinking, and deep intellectual curiosity",
              ],
            },
          },
        },
      },
    ],
  },
];

export function getAssessmentModule(slug: string): AssessmentModuleData | undefined {
  return ASSESSMENT_MODULES.find((m) => m.slug === slug);
}
