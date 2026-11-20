/**
 * Local In-Memory Fallback Store for Growth Journeys
 * Enables seamless offline and standby development when Supabase credentials are pending.
 */

import type {
  GrowthJourneyData,
  JourneyStatus,
  GoalStatus,
  MilestoneStatus,
  ActivityStatus,
} from "@/types/journey";

class JourneyLocalStore {
  private journeys: Map<string, GrowthJourneyData> = new Map();

  constructor() {
    this.seedDemoJourney();
  }

  private seedDemoJourney() {
    const demoId = "demo-journey-1";
    const now = new Date().toISOString();
    const demoJourney: GrowthJourneyData = {
      id: demoId,
      userId: "demo-user",
      title: "Evidence-Informed Inquiry & Creative Synthesis",
      description:
        "A balanced development journey focused on strengthening evidence discernment in critical thinking while expanding exploratory inquiry across complex problem domains.",
      status: "active",
      targetDuration: "8 weeks",
      weeklyCommitmentHours: "3-4 hours/week",
      capabilityKeys: ["critical-thinking", "curiosity"],
      primaryPriorities: ["Evidence Evaluation", "Question Formulation"],
      createdAt: now,
      updatedAt: now,
      focusAreas: [
        {
          id: "fa-ct-1",
          capabilityKey: "critical-thinking",
          capabilityName: "Critical Thinking",
          rationale:
            "Your assessment demonstrated strong analytical reasoning (3.00), providing a solid foundation to strengthen evidence evaluation (2.00) under contradictory data streams.",
          selectedDimensions: ["analytical-reasoning", "evidence-evaluation"],
          intendedOutcomes: [
            "Consistently isolate unstated assumptions in technical arguments",
            "Identify confounding variables before reaching conclusive judgments",
          ],
          priority: 1,
          status: "active",
          goals: [
            {
              id: "goal-ct-1",
              focusAreaId: "fa-ct-1",
              capabilityKey: "critical-thinking",
              dimensionSlug: "evidence-evaluation",
              title: "Discern Confounding Variables in Complex Arguments",
              description:
                "Build systematic habits to question methodology, assess sample validity, and detect unstated corporate or institutional bias.",
              reasonForRecommendation:
                "Based on your Critical Thinking assessment where you identified primary claims but noted difficulty disentangling correlation from causation in pilot data.",
              expectedOutcome:
                "Ability to construct a 3-point evidentiary critique of empirical claims within 15 minutes.",
              priority: "high",
              status: "in_progress",
              orderIndex: 0,
              milestones: [
                {
                  id: "ms-ct-1",
                  goalId: "goal-ct-1",
                  title: "Methodological Audit Practice",
                  description: "Deconstruct research summaries and public policy briefs for sample selection biases.",
                  expectedOutcome: "Identify at least two potential confounders in any popular science claim.",
                  suggestedPeriod: "Weeks 1-2",
                  status: "in_progress",
                  orderIndex: 0,
                  activities: [
                    {
                      id: "act-ct-1",
                      goalId: "goal-ct-1",
                      milestoneId: "ms-ct-1",
                      capabilityKey: "critical-thinking",
                      title: "Analyze the Five Flaws in Correlation Reports",
                      description:
                        "Review a curated summary of a public policy study and write down the top 3 unaddressed external factors.",
                      purpose: "Strengthen instinct to separate correlation from true causal mechanisms.",
                      estimatedMinutes: 25,
                      suggestedOrder: 0,
                      status: "completed",
                    },
                    {
                      id: "act-ct-2",
                      goalId: "goal-ct-1",
                      milestoneId: "ms-ct-1",
                      capabilityKey: "critical-thinking",
                      title: "Spot the Missing Baseline",
                      description:
                        "Examine comparative transit metrics and locate what baseline numbers are omitted from the executive summary.",
                      purpose: "Prevent falling victim to deceptive percentage-based claims.",
                      estimatedMinutes: 20,
                      suggestedOrder: 1,
                      status: "in_progress",
                    },
                  ],
                },
                {
                  id: "ms-ct-2",
                  goalId: "goal-ct-1",
                  title: "Counter-Argument Formulation",
                  description: "Articulate the strongest possible objection to your own preferred stance before deciding.",
                  expectedOutcome: "Produce steel-man counter-arguments without dismissing rival perspectives.",
                  suggestedPeriod: "Weeks 3-4",
                  status: "not_started",
                  orderIndex: 1,
                  activities: [
                    {
                      id: "act-ct-3",
                      goalId: "goal-ct-1",
                      milestoneId: "ms-ct-2",
                      capabilityKey: "critical-thinking",
                      title: "Construct an Uncomfortable Steel-Man",
                      description:
                        "Pick an opinion you strongly hold on remote work or urban policy and draft a 200-word justification for the opposite view.",
                      purpose: "Break cognitive confirmation bias and expand intellectual empathy.",
                      estimatedMinutes: 30,
                      suggestedOrder: 2,
                      status: "not_started",
                    },
                  ],
                },
              ],
              activities: [],
            },
          ],
        },
        {
          id: "fa-cu-1",
          capabilityKey: "curiosity",
          capabilityName: "Curiosity",
          rationale:
            "Your curiosity baseline demonstrated high intellectual openness (3.00). Directing this openness toward structured question hierarchies will deepen inquiry depth.",
          selectedDimensions: ["question-formulation", "intellectual-openness"],
          intendedOutcomes: [
            "Formulate multi-layered causal questions rather than surface queries",
            "Synthesize cross-disciplinary analogies to explore anomalies",
          ],
          priority: 2,
          status: "active",
          goals: [
            {
              id: "goal-cu-1",
              focusAreaId: "fa-cu-1",
              capabilityKey: "curiosity",
              dimensionSlug: "question-formulation",
              title: "Formulate High-Leverage Second-Order Questions",
              description:
                "Shift from asking 'What happened?' to asking 'What system conditions allowed this to emerge and persist?'",
              reasonForRecommendation:
                "Your assessment response to the pollinator collapse exercise revealed strong intuitive interest that can be elevated with systematic inquiry trees.",
              expectedOutcome:
                "Habit of generating 5 distinct diagnostic angles before settling on an investigative path.",
              priority: "medium",
              status: "not_started",
              orderIndex: 1,
              milestones: [
                {
                  id: "ms-cu-1",
                  goalId: "goal-cu-1",
                  title: "Inquiry Tree Construction",
                  description: "Practice building 3-tier question trees for ambiguous events.",
                  expectedOutcome: "Map root causes, proximate triggers, and systemic feedback loops.",
                  suggestedPeriod: "Weeks 5-6",
                  status: "not_started",
                  orderIndex: 0,
                  activities: [
                    {
                      id: "act-cu-1",
                      goalId: "goal-cu-1",
                      milestoneId: "ms-cu-1",
                      capabilityKey: "curiosity",
                      title: "The 5-Why Systems Mapping Exercise",
                      description:
                        "Take a recent technological failure and trace back five iterative layers of cause and effect.",
                      purpose: "Uncover deep systemic roots rather than fixing surface symptoms.",
                      estimatedMinutes: 25,
                      suggestedOrder: 0,
                      status: "not_started",
                    },
                  ],
                },
              ],
              activities: [],
            },
          ],
        },
      ],
    };

    this.journeys.set(demoId, demoJourney);
  }

  public saveJourney(journey: GrowthJourneyData): GrowthJourneyData {
    const updated = {
      ...journey,
      updatedAt: new Date().toISOString(),
    };
    this.journeys.set(journey.id, updated);
    return updated;
  }

  public getJourney(id: string): GrowthJourneyData | null {
    return this.journeys.get(id) || null;
  }

  public getActiveJourney(userId: string): GrowthJourneyData | null {
    const userJourneys = Array.from(this.journeys.values()).filter(
      (j) => j.userId === userId && j.status === "active"
    );
    if (userJourneys.length === 0) return null;
    // return most recently updated active journey
    return userJourneys.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
  }

  public getUserJourneys(userId: string): GrowthJourneyData[] {
    return Array.from(this.journeys.values())
      .filter((j) => j.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public updateJourneyStatus(id: string, status: JourneyStatus): boolean {
    const j = this.journeys.get(id);
    if (!j) return false;
    j.status = status;
    j.updatedAt = new Date().toISOString();
    if (status === "completed") {
      j.completedAt = new Date().toISOString();
    }
    return true;
  }

  public updateGoalStatus(journeyId: string, goalId: string, status: GoalStatus): boolean {
    const j = this.journeys.get(journeyId);
    if (!j) return false;
    for (const fa of j.focusAreas) {
      for (const goal of fa.goals) {
        if (goal.id === goalId) {
          goal.status = status;
          j.updatedAt = new Date().toISOString();
          return true;
        }
      }
    }
    return false;
  }

  public updateMilestoneStatus(
    journeyId: string,
    milestoneId: string,
    status: MilestoneStatus
  ): boolean {
    const j = this.journeys.get(journeyId);
    if (!j) return false;
    for (const fa of j.focusAreas) {
      for (const goal of fa.goals) {
        for (const ms of goal.milestones) {
          if (ms.id === milestoneId) {
            ms.status = status;
            j.updatedAt = new Date().toISOString();
            return true;
          }
        }
      }
    }
    return false;
  }

  public updateActivityStatus(
    journeyId: string,
    activityId: string,
    status: ActivityStatus
  ): boolean {
    const j = this.journeys.get(journeyId);
    if (!j) return false;
    for (const fa of j.focusAreas) {
      for (const goal of fa.goals) {
        // check goal-level activities
        for (const act of goal.activities) {
          if (act.id === activityId) {
            act.status = status;
            j.updatedAt = new Date().toISOString();
            return true;
          }
        }
        // check milestone-level activities
        for (const ms of goal.milestones) {
          for (const act of ms.activities) {
            if (act.id === activityId) {
              act.status = status;
              j.updatedAt = new Date().toISOString();
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}

export const journeyLocalStore = new JourneyLocalStore();
