"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generatePersonalizedJourney } from "@/lib/ai/journey-generator";
import { journeyLocalStore } from "./local-store";
import type { Json } from "@/types/database";
import type {
  ActivityStatus,
  GoalStatus,
  GrowthJourneyData,
  JourneyActionResult,
  JourneyGenerationResult,
  JourneyPersonalizationInput,
  JourneyStatus,
  MilestoneStatus,
  ProposedCapabilityFocusArea,
  ProposedGoal,
  ProposedMilestone,
  ProposedPlannedActivity,
} from "@/types/journey";
import { revalidatePath } from "next/cache";

/**
 * Generates a candidate personalized journey proposal for user review.
 * Does NOT automatically commit to the database; user must inspect and approve.
 */
export async function generateJourneyProposal(
  input: JourneyPersonalizationInput
): Promise<JourneyActionResult<JourneyGenerationResult>> {
  const supabase = await createServerSupabaseClient();
  let userId = "demo-user";

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    }
  }

  try {
    const result = await generatePersonalizedJourney(input, userId);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate personalized journey proposal.",
    };
  }
}

/**
 * Saves an approved growth journey and its complete child hierarchy.
 */
export async function saveGrowthJourney(
  journeyData: GrowthJourneyData
): Promise<JourneyActionResult<{ journeyId: string }>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    journeyLocalStore.saveJourney(journeyData);
    try {
      revalidatePath("/journey");
      revalidatePath("/dashboard");
    } catch {
      // ignore outside request lifecycle
    }
    return {
      success: true,
      data: { journeyId: journeyData.id },
      message: "Journey saved successfully to local session store.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required to save a growth journey." };
  }

  try {
    // 1. Insert into growth_journeys
    const { data: journeyRow, error: jError } = await supabase
      .from("growth_journeys")
      .insert({
        user_id: user.id,
        assessment_attempt_id: null,
        title: journeyData.title,
        description: journeyData.description,
        status: journeyData.status || "active",
        target_duration: journeyData.targetDuration,
        weekly_commitment_hours: journeyData.weeklyCommitmentHours,
        capability_keys: journeyData.capabilityKeys,
        primary_priorities: journeyData.primaryPriorities,
        personalization_snapshot: journeyData as unknown as Json,
      })
      .select("id")
      .single();

    if (jError || !journeyRow) {
      throw new Error(`Failed to save growth journey header: ${jError?.message || "Unknown error"}`);
    }

    const realJourneyId = journeyRow.id;

    // 2. Insert focus areas, goals, milestones, and activities
    for (const fa of journeyData.focusAreas) {
      const { data: faRow, error: faError } = await supabase
        .from("journey_capability_focus_areas")
        .insert({
          journey_id: realJourneyId,
          capability_key: fa.capabilityKey,
          capability_name: fa.capabilityName,
          rationale: fa.rationale,
          selected_dimensions: fa.selectedDimensions,
          intended_outcomes: fa.intendedOutcomes,
          priority: fa.priority,
          status: fa.status || "active",
        })
        .select("id")
        .single();

      if (faError || !faRow) {
        throw new Error(`Failed to save focus area ${fa.capabilityKey}: ${faError?.message}`);
      }

      for (const goal of fa.goals) {
        const { data: goalRow, error: gError } = await supabase
          .from("development_goals")
          .insert({
            journey_id: realJourneyId,
            focus_area_id: faRow.id,
            capability_key: goal.capabilityKey,
            dimension_slug: goal.dimensionSlug || null,
            title: goal.title,
            description: goal.description,
            reason_for_recommendation: goal.reasonForRecommendation,
            expected_outcome: goal.expectedOutcome,
            priority: goal.priority,
            status: goal.status || "not_started",
            order_index: goal.orderIndex,
          })
          .select("id")
          .single();

        if (gError || !goalRow) {
          throw new Error(`Failed to save goal ${goal.title}: ${gError?.message}`);
        }

        for (const ms of goal.milestones) {
          const { data: msRow, error: msError } = await supabase
            .from("journey_milestones")
            .insert({
              journey_id: realJourneyId,
              goal_id: goalRow.id,
              title: ms.title,
              description: ms.description,
              expected_outcome: ms.expectedOutcome,
              suggested_period: ms.suggestedPeriod,
              status: ms.status || "not_started",
              order_index: ms.orderIndex,
            })
            .select("id")
            .single();

          if (msError || !msRow) {
            throw new Error(`Failed to save milestone ${ms.title}: ${msError?.message}`);
          }

          for (const act of ms.activities) {
            const { error: actError } = await supabase.from("planned_activities").insert({
              journey_id: realJourneyId,
              goal_id: goalRow.id,
              milestone_id: msRow.id,
              capability_key: act.capabilityKey,
              title: act.title,
              description: act.description,
              purpose: act.purpose,
              estimated_minutes: act.estimatedMinutes,
              suggested_order: act.suggestedOrder,
              status: act.status || "not_started",
            });

            if (actError) {
              throw new Error(`Failed to save activity ${act.title}: ${actError.message}`);
            }
          }
        }
      }
    }

    // 3. Record generation record
    if (journeyData.generationMetadata) {
      await supabase.from("journey_generation_records").insert({
        journey_id: realJourneyId,
        user_id: user.id,
        provider: journeyData.generationMetadata.provider,
        model_name: journeyData.generationMetadata.modelName,
        generation_type: journeyData.generationMetadata.generationType,
        input_snapshot: {
          capabilities: journeyData.capabilityKeys,
          priorities: journeyData.primaryPriorities,
        } as unknown as Json,
      });
    }

    try {
      revalidatePath("/journey");
      revalidatePath(`/journey/${realJourneyId}`);
      revalidatePath("/dashboard");
    } catch {
      // outside request context
    }

    return {
      success: true,
      data: { journeyId: realJourneyId },
      message: "Growth journey saved successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to persist growth journey.",
    };
  }
}

/**
 * Retrieves the currently active growth journey for the user.
 */
export async function getActiveGrowthJourney(): Promise<GrowthJourneyData | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return journeyLocalStore.getActiveJourney("demo-user");
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return journeyLocalStore.getActiveJourney("demo-user");
    }

    const { data: journeyRow } = await supabase
      .from("growth_journeys")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!journeyRow) return null;

    return getGrowthJourneyById(journeyRow.id);
  } catch {
    return journeyLocalStore.getActiveJourney("demo-user");
  }
}

/**
 * Retrieves a complete growth journey by ID with all child entities.
 */
export async function getGrowthJourneyById(journeyId: string): Promise<GrowthJourneyData | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return journeyLocalStore.getJourney(journeyId);
  }

  try {
    const { data: jRow } = await supabase
      .from("growth_journeys")
      .select("*")
      .eq("id", journeyId)
      .maybeSingle();

    if (!jRow) {
      return journeyLocalStore.getJourney(journeyId);
    }

    // Retrieve focus areas
    const { data: faRows } = await supabase
      .from("journey_capability_focus_areas")
      .select("*")
      .eq("journey_id", journeyId)
      .order("priority", { ascending: true });

    // Retrieve goals
    const { data: goalRows } = await supabase
      .from("development_goals")
      .select("*")
      .eq("journey_id", journeyId)
      .order("order_index", { ascending: true });

    // Retrieve milestones
    const { data: msRows } = await supabase
      .from("journey_milestones")
      .select("*")
      .eq("journey_id", journeyId)
      .order("order_index", { ascending: true });

    // Retrieve activities
    const { data: actRows } = await supabase
      .from("planned_activities")
      .select("*")
      .eq("journey_id", journeyId)
      .order("suggested_order", { ascending: true });

    // Assemble hierarchy
    const focusAreas: ProposedCapabilityFocusArea[] = (faRows || []).map((fa) => {
      const matchingGoals = (goalRows || []).filter((g) => g.focus_area_id === fa.id);

      const goals: ProposedGoal[] = matchingGoals.map((g) => {
        const matchingMs = (msRows || []).filter((m) => m.goal_id === g.id);

        const milestones: ProposedMilestone[] = matchingMs.map((m) => {
          const matchingActs = (actRows || []).filter((a) => a.milestone_id === m.id);

          const activities: ProposedPlannedActivity[] = matchingActs.map((a) => ({
            id: a.id,
            goalId: a.goal_id,
            milestoneId: a.milestone_id || undefined,
            capabilityKey: a.capability_key as ProposedPlannedActivity["capabilityKey"],
            title: a.title,
            description: a.description,
            purpose: a.purpose,
            estimatedMinutes: a.estimated_minutes,
            suggestedOrder: a.suggested_order,
            status: a.status as ActivityStatus,
          }));

          return {
            id: m.id,
            goalId: m.goal_id,
            title: m.title,
            description: m.description,
            expectedOutcome: m.expected_outcome,
            suggestedPeriod: m.suggested_period,
            status: m.status as MilestoneStatus,
            orderIndex: m.order_index,
            activities,
          };
        });

        // unassigned activities for this goal
        const unassignedActs = (actRows || []).filter((a) => a.goal_id === g.id && !a.milestone_id);
        const goalActivities: ProposedPlannedActivity[] = unassignedActs.map((a) => ({
          id: a.id,
          goalId: a.goal_id,
          capabilityKey: a.capability_key as ProposedPlannedActivity["capabilityKey"],
          title: a.title,
          description: a.description,
          purpose: a.purpose,
          estimatedMinutes: a.estimated_minutes,
          suggestedOrder: a.suggested_order,
          status: a.status as ActivityStatus,
        }));

        return {
          id: g.id,
          focusAreaId: g.focus_area_id || undefined,
          capabilityKey: g.capability_key as ProposedGoal["capabilityKey"],
          dimensionSlug: g.dimension_slug || undefined,
          title: g.title,
          description: g.description,
          reasonForRecommendation: g.reason_for_recommendation,
          expectedOutcome: g.expected_outcome,
          priority: g.priority as ProposedGoal["priority"],
          status: g.status as GoalStatus,
          orderIndex: g.order_index,
          milestones,
          activities: goalActivities,
        };
      });

      return {
        id: fa.id,
        capabilityKey: fa.capability_key as ProposedCapabilityFocusArea["capabilityKey"],
        capabilityName: fa.capability_name,
        rationale: fa.rationale,
        selectedDimensions: fa.selected_dimensions,
        intendedOutcomes: fa.intended_outcomes,
        priority: fa.priority,
        status: fa.status as ProposedCapabilityFocusArea["status"],
        goals,
      };
    });

    return {
      id: jRow.id,
      userId: jRow.user_id,
      assessmentAttemptId: jRow.assessment_attempt_id,
      title: jRow.title,
      description: jRow.description,
      status: jRow.status as JourneyStatus,
      targetDuration: jRow.target_duration,
      weeklyCommitmentHours: jRow.weekly_commitment_hours,
      capabilityKeys: jRow.capability_keys as GrowthJourneyData["capabilityKeys"],
      primaryPriorities: jRow.primary_priorities,
      focusAreas,
      createdAt: jRow.created_at,
      updatedAt: jRow.updated_at,
      completedAt: jRow.completed_at,
    };
  } catch {
    return journeyLocalStore.getJourney(journeyId);
  }
}

/**
 * Lists all growth journeys for the authenticated user (history view).
 */
export async function getUserGrowthJourneys(): Promise<GrowthJourneyData[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return journeyLocalStore.getUserJourneys("demo-user");
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return journeyLocalStore.getUserJourneys("demo-user");
    }

    const { data } = await supabase
      .from("growth_journeys")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!data) return [];

    const journeys: GrowthJourneyData[] = [];
    for (const item of data) {
      const full = await getGrowthJourneyById(item.id);
      if (full) journeys.push(full);
    }
    return journeys;
  } catch {
    return journeyLocalStore.getUserJourneys("demo-user");
  }
}

/**
 * Updates status of a journey (e.g. active, paused, completed, archived).
 */
export async function updateJourneyStatus(
  journeyId: string,
  status: JourneyStatus
): Promise<JourneyActionResult<{ status: JourneyStatus }>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    journeyLocalStore.updateJourneyStatus(journeyId, status);
    return { success: true, data: { status } };
  }

  try {
    const updatePayload: {
      status: string;
      updated_at: string;
      completed_at?: string | null;
    } = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (status === "completed") {
      updatePayload.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("growth_journeys")
      .update(updatePayload)
      .eq("id", journeyId);

    if (error) throw error;

    try {
      revalidatePath("/journey");
      revalidatePath(`/journey/${journeyId}`);
      revalidatePath("/dashboard");
    } catch {
      // ignore
    }

    return { success: true, data: { status } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update journey status",
    };
  }
}

/**
 * Updates status of an individual development goal.
 */
export async function updateGoalStatus(
  journeyId: string,
  goalId: string,
  status: GoalStatus
): Promise<JourneyActionResult<{ status: GoalStatus }>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    journeyLocalStore.updateGoalStatus(journeyId, goalId, status);
    return { success: true, data: { status } };
  }

  try {
    const { error } = await supabase
      .from("development_goals")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", goalId);

    if (error) throw error;

    try {
      revalidatePath(`/journey/${journeyId}`);
    } catch {
      // ignore
    }

    return { success: true, data: { status } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update goal status",
    };
  }
}

/**
 * Updates status of a milestone.
 */
export async function updateMilestoneStatus(
  journeyId: string,
  milestoneId: string,
  status: MilestoneStatus
): Promise<JourneyActionResult<{ status: MilestoneStatus }>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    journeyLocalStore.updateMilestoneStatus(journeyId, milestoneId, status);
    return { success: true, data: { status } };
  }

  try {
    const { error } = await supabase
      .from("journey_milestones")
      .update({ status })
      .eq("id", milestoneId);

    if (error) throw error;

    try {
      revalidatePath(`/journey/${journeyId}`);
    } catch {
      // ignore
    }

    return { success: true, data: { status } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update milestone status",
    };
  }
}

/**
 * Updates status of a planned activity.
 */
export async function updateActivityStatus(
  journeyId: string,
  activityId: string,
  status: ActivityStatus
): Promise<JourneyActionResult<{ status: ActivityStatus }>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    journeyLocalStore.updateActivityStatus(journeyId, activityId, status);
    return { success: true, data: { status } };
  }

  try {
    const { error } = await supabase
      .from("planned_activities")
      .update({ status })
      .eq("id", activityId);

    if (error) throw error;

    try {
      revalidatePath(`/journey/${journeyId}`);
      revalidatePath("/dashboard");
    } catch {
      // ignore
    }

    return { success: true, data: { status } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update activity status",
    };
  }
}

/**
 * Updates editable journey details (title, description).
 */
export async function updateJourneyDetails(
  journeyId: string,
  updates: { title?: string; description?: string }
): Promise<JourneyActionResult<void>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    const j = journeyLocalStore.getJourney(journeyId);
    if (j) {
      if (updates.title) j.title = updates.title;
      if (updates.description) j.description = updates.description;
      journeyLocalStore.saveJourney(j);
    }
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from("growth_journeys")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", journeyId);

    if (error) throw error;

    try {
      revalidatePath("/journey");
      revalidatePath(`/journey/${journeyId}`);
    } catch {
      // ignore
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update journey details",
    };
  }
}
