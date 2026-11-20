"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAssessmentModule, ASSESSMENT_MODULES } from "./content";
import { evaluateAssessmentResponse } from "@/lib/ai/assessment-evaluator";
import { aggregateAssessmentResults } from "./scoring";
import { localStore } from "./local-store";
import type { Json } from "@/types/database";
import type {
  AssessmentCapabilityKey,
  CapabilityBaselineProfile,
  SingleEvaluationResult,
  UserResponsePayload,
} from "@/types/assessment";
import { revalidatePath } from "next/cache";

export interface AssessmentActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Initiates or resumes an assessment attempt for a given capability module
 */
export async function startAssessmentAttempt(
  moduleSlug: string
): Promise<AssessmentActionResult<{ attemptId: string; isResumed: boolean }>> {
  const moduleData = getAssessmentModule(moduleSlug);
  if (!moduleData) {
    return { success: false, error: `Invalid assessment module: ${moduleSlug}` };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    // Local development mode when Supabase credentials are in standby
    const localAttemptId = `local-attempt-${moduleSlug}-${Date.now()}`;
    localStore.createAttempt(localAttemptId, "demo-user", moduleSlug);
    return {
      success: true,
      data: { attemptId: localAttemptId, isResumed: false },
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required to begin an assessment." };
  }

  try {
    // 1. Ensure the module exists in assessment_modules
    let { data: modRecord } = await supabase
      .from("assessment_modules")
      .select("id")
      .eq("slug", moduleSlug)
      .maybeSingle();

    if (!modRecord) {
      const { data: insertedMod } = await supabase
        .from("assessment_modules")
        .insert({
          slug: moduleSlug,
          name: moduleData.name,
          description: moduleData.description,
          capability_key: moduleSlug,
          estimated_minutes: moduleData.estimatedMinutes,
        })
        .select("id")
        .single();
      modRecord = insertedMod;
    }

    if (!modRecord) {
      return { success: false, error: "Failed to resolve assessment module in database." };
    }

    // 2. Check for an existing in-progress attempt to resume
    const { data: existingAttempt } = await supabase
      .from("assessment_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("module_id", modRecord.id)
      .eq("status", "in-progress")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingAttempt) {
      return {
        success: true,
        data: { attemptId: existingAttempt.id, isResumed: true },
      };
    }

    // 3. Create fresh attempt
    const { data: newAttempt, error: insertError } = await supabase
      .from("assessment_attempts")
      .insert({
        user_id: user.id,
        module_id: modRecord.id,
        status: "in-progress",
        evaluation_status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !newAttempt) {
      return { success: false, error: insertError?.message || "Could not create attempt." };
    }

    return {
      success: true,
      data: { attemptId: newAttempt.id, isResumed: false },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unexpected database error starting assessment.",
    };
  }
}

/**
 * Saves a single activity response draft
 */
export async function saveAssessmentResponse(
  attemptId: string,
  itemId: string,
  payload: UserResponsePayload
): Promise<AssessmentActionResult<void>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase || attemptId.startsWith("local-")) {
    localStore.saveResponse(attemptId, itemId, payload);
    return { success: true };
  }

  // Supabase persistence
  try {
    const { data: attempt } = await supabase
      .from("assessment_attempts")
      .select("id, module_id")
      .eq("id", attemptId)
      .single();

    if (!attempt) {
      return { success: false, error: "Attempt not found." };
    }

    // Resolve or insert assessment_item
    let { data: dbItem } = await supabase
      .from("assessment_items")
      .select("id")
      .eq("module_id", attempt.module_id)
      .eq("title", itemId)
      .maybeSingle();

    if (!dbItem) {
      // Find item in content bank
      let itemData = null;
      for (const m of ASSESSMENT_MODULES) {
        const found = m.items.find((i) => i.id === itemId);
        if (found) {
          itemData = found;
          break;
        }
      }

      if (itemData) {
        const { data: insertedItem } = await supabase
          .from("assessment_items")
          .insert({
            module_id: attempt.module_id,
            activity_type: itemData.activityType,
            title: itemData.title,
            scenario: itemData.scenario,
            instructions: itemData.instructions,
            response_type: itemData.responseType,
            rubric: itemData.rubric as unknown as Json,
            order_index: itemData.orderIndex,
          })
          .select("id")
          .single();
        dbItem = insertedItem;
      }
    }

    if (dbItem) {
      await supabase.from("assessment_responses").upsert({
        attempt_id: attemptId,
        item_id: dbItem.id,
        response_data: payload as unknown as Json,
        submitted_at: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error saving response.",
    };
  }
}

/**
 * Submits the full assessment, executes rubric evaluation, and persists capability profile
 */
export async function submitAssessmentAttempt(
  attemptId: string,
  moduleSlug: string,
  responsesMap: Record<string, UserResponsePayload>
): Promise<AssessmentActionResult<CapabilityBaselineProfile>> {
  const moduleData = getAssessmentModule(moduleSlug);
  if (!moduleData) {
    return { success: false, error: `Invalid assessment module: ${moduleSlug}` };
  }

  // 1. Evaluate all responses in the module
  const evaluations: SingleEvaluationResult[] = [];

  for (const item of moduleData.items) {
    const payload = responsesMap[item.id] || { textResponse: "" };
    const evaluation = await evaluateAssessmentResponse(item, payload);
    evaluations.push(evaluation);
  }

  // 2. Aggregate dimension scores into a comprehensive baseline profile
  const baselineProfile = aggregateAssessmentResults(
    moduleSlug as AssessmentCapabilityKey,
    moduleData,
    evaluations
  );

  const supabase = await createServerSupabaseClient();

  if (!supabase || attemptId.startsWith("local-")) {
    localStore.completeAttempt(attemptId, evaluations, baselineProfile);
    try {
      revalidatePath("/dashboard");
      revalidatePath(`/assessment/results/${attemptId}`);
    } catch {
      // Ignored outside Next.js request context
    }
    return { success: true, data: baselineProfile };
  }

  // 3. Supabase persistence
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to submit assessment." };
    }

    // Update attempt
    await supabase
      .from("assessment_attempts")
      .update({
        status: "completed",
        evaluation_status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", attemptId);

    // Save capability profile
    await supabase.from("capability_profiles").upsert({
      user_id: user.id,
      attempt_id: attemptId,
      capability_key: moduleSlug,
      overall_score: baselineProfile.overallScore,
      performance_level: baselineProfile.performanceLevel,
      dimension_results: baselineProfile.dimensionResults as unknown as Json,
      evidence_summary: baselineProfile.evidenceSummary,
      strengths_summary: baselineProfile.strengthsSummary,
      opportunities_summary: baselineProfile.opportunitiesSummary,
      baseline_version: "1.0.0",
      updated_at: new Date().toISOString(),
    });

    try {
      revalidatePath("/dashboard");
      revalidatePath(`/assessment/results/${attemptId}`);
    } catch {
      // Ignored outside Next.js request context
    }

    return { success: true, data: baselineProfile };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error submitting assessment to database.",
    };
  }
}

/**
 * Retrieves assessment results for a specific attempt
 */
export async function getAssessmentAttemptResults(
  attemptId: string
): Promise<AssessmentActionResult<{
  profile: CapabilityBaselineProfile;
  evaluations: SingleEvaluationResult[];
  moduleSlug: string;
}>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase || attemptId.startsWith("local-")) {
    const local = localStore.getAttempt(attemptId);
    if (!local || !local.profile) {
      // If not yet evaluated, create a realistic demonstration baseline
      const moduleData = getAssessmentModule(local?.moduleSlug || "critical-thinking")!;
      const dummyProfile = aggregateAssessmentResults(
        (local?.moduleSlug as AssessmentCapabilityKey) || "critical-thinking",
        moduleData,
        []
      );
      return {
        success: true,
        data: {
          profile: dummyProfile,
          evaluations: [],
          moduleSlug: local?.moduleSlug || "critical-thinking",
        },
      };
    }
    return {
      success: true,
      data: {
        profile: local.profile,
        evaluations: local.evaluations,
        moduleSlug: local.moduleSlug,
      },
    };
  }

  try {
    const { data: attempt } = await supabase
      .from("assessment_attempts")
      .select("id, status, module_id, assessment_modules(slug)")
      .eq("id", attemptId)
      .single();

    if (!attempt) {
      return { success: false, error: "Assessment attempt not found." };
    }

    const moduleSlug =
      (attempt.assessment_modules as unknown as { slug: string })?.slug || "critical-thinking";

    const { data: dbProfile } = await supabase
      .from("capability_profiles")
      .select("*")
      .eq("attempt_id", attemptId)
      .maybeSingle();

    if (dbProfile) {
      const profile: CapabilityBaselineProfile = {
        capabilityKey: dbProfile.capability_key as AssessmentCapabilityKey,
        capabilityName:
          getAssessmentModule(dbProfile.capability_key)?.name || "Capability",
        overallScore: Number(dbProfile.overall_score),
        performanceLevel: dbProfile.performance_level as CapabilityBaselineProfile["performanceLevel"],
        dimensionResults: dbProfile.dimension_results as unknown as CapabilityBaselineProfile["dimensionResults"],
        strengthsSummary: dbProfile.strengths_summary,
        opportunitiesSummary: dbProfile.opportunities_summary,
        evidenceSummary: dbProfile.evidence_summary,
        assessedAt: dbProfile.created_at,
      };

      return {
        success: true,
        data: {
          profile,
          evaluations: [],
          moduleSlug,
        },
      };
    }

    return { success: false, error: "Results not yet compiled for this attempt." };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error retrieving assessment results.",
    };
  }
}

/**
 * Retrieves all capability baseline profiles for the authenticated user
 */
export async function getUserCapabilityProfiles(): Promise<CapabilityBaselineProfile[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return localStore.getUserProfiles("demo-user");
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
      .from("capability_profiles")
      .select("*")
      .eq("user_id", user.id);

    if (!data) return [];

    return data.map((row) => ({
      capabilityKey: row.capability_key as AssessmentCapabilityKey,
      capabilityName: getAssessmentModule(row.capability_key)?.name || row.capability_key,
      overallScore: Number(row.overall_score),
      performanceLevel: row.performance_level as CapabilityBaselineProfile["performanceLevel"],
      dimensionResults: row.dimension_results as unknown as CapabilityBaselineProfile["dimensionResults"],
      strengthsSummary: row.strengths_summary,
      opportunitiesSummary: row.opportunities_summary,
      evidenceSummary: row.evidence_summary,
      assessedAt: row.created_at,
    }));
  } catch {
    return [];
  }
}
