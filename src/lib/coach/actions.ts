"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateCoachReply, summarizeCoachingSession } from "@/lib/ai/coach-engine";
import { coachLocalStore } from "./local-store";
import { getUserCapabilityProfiles } from "@/lib/assessments/actions";
import { getActiveGrowthJourney, getGrowthJourneyById } from "@/lib/journeys/actions";
import type { Json } from "@/types/database";
import type {
  CoachingActionResult,
  CoachingMessage,
  CoachingSession,
  CoachingSessionContext,
  CoachingSessionSummary,
  ContextualActionType,
  HintLevel,
  SendMessageParams,
  StartSessionParams,
} from "@/types/coach";
import { revalidatePath } from "next/cache";

/**
 * Initializes a new Socratic coaching session with contextual snapshot.
 */
export async function startCoachingSession(
  params: StartSessionParams
): Promise<CoachingActionResult<{ sessionId: string }>> {
  const supabase = await createServerSupabaseClient();
  let userId = "demo-user";
  let userInterests: string[] = [];
  let growthIntentions: string[] = [];

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      const { data: profile } = await supabase
        .from("profiles")
        .select("interests, growth_intentions")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        userInterests = profile.interests || [];
        growthIntentions = profile.growth_intentions || [];
      }
    }
  }

  // 1. Resolve context snapshot
  const context: CoachingSessionContext = {
    userInterests,
    growthIntentions,
  };

  try {
    const [profiles, activeJourney] = await Promise.all([
      getUserCapabilityProfiles(),
      params.journeyId ? getGrowthJourneyById(params.journeyId) : getActiveGrowthJourney(),
    ]);

    const matchingProfile = profiles.find((p) => p.capabilityKey === params.capabilityKey);
    if (matchingProfile) {
      context.assessmentSummary = {
        capabilityName: matchingProfile.capabilityName,
        overallScore: matchingProfile.overallScore,
        performanceLevel: matchingProfile.performanceLevel,
        strengths: matchingProfile.strengthsSummary,
        opportunities: matchingProfile.opportunitiesSummary,
      };
    }

    if (activeJourney) {
      context.journeySummary = {
        journeyId: activeJourney.id,
        journeyTitle: activeJourney.title,
        targetDuration: activeJourney.targetDuration,
      };

      if (params.goalId) {
        for (const fa of activeJourney.focusAreas) {
          for (const g of fa.goals) {
            if (g.id === params.goalId) {
              context.goalSummary = {
                goalId: g.id,
                goalTitle: g.title,
                dimensionSlug: g.dimensionSlug,
                expectedOutcome: g.expectedOutcome,
                reasonForRecommendation: g.reasonForRecommendation,
              };
              break;
            }
          }
        }
      }
    }
  } catch {
    // Non-fatal if context lookup encounters issues
  }

  const now = new Date().toISOString();
  const sessionId = `coach-sess-${Date.now()}`;
  const defaultTitle =
    params.title ||
    (context.goalSummary
      ? `Coaching: ${context.goalSummary.goalTitle}`
      : `${params.capabilityKey === "critical-thinking" ? "Critical Thinking" : params.capabilityKey === "creative-problem-solving" ? "Creative Problem-Solving" : "Curiosity"} Exploration`);

  // 2. Build initial welcome message
  let welcomeContent = "";
  if (params.capabilityKey === "critical-thinking") {
    welcomeContent = context.goalSummary
      ? `Welcome to your Critical Thinking coaching session. We're focusing on **${context.goalSummary.goalTitle}**.\n\nTo begin: what specific argument, claim, or policy proposal would you like to deconstruct today?`
      : `Welcome. I'm your Critical Thinking Growth Coach. My role isn't to tell you what to believe, but to help you examine claims, isolate assumptions, and weigh evidence.\n\nWhat claim, article, or decision would you like to explore?`;
  } else if (params.capabilityKey === "creative-problem-solving") {
    welcomeContent = context.goalSummary
      ? `Welcome to your Creative Problem-Solving session. We're focusing on **${context.goalSummary.goalTitle}**.\n\nWhat specific friction, bottleneck, or challenge do you want to reframe and generate solutions for?`
      : `Welcome. I'm your Creative Problem-Solving Coach. We'll explore unconventional angles, reframe constraints, and avoid premature convergence on obvious ideas.\n\nWhat problem are you looking to solve?`;
  } else {
    welcomeContent = context.goalSummary
      ? `Welcome to your Curiosity coaching session. We're building towards **${context.goalSummary.goalTitle}**.\n\nWhat puzzling phenomenon, anomaly, or unfamiliar frontier sparked your curiosity recently?`
      : `Welcome. I'm your Curiosity Coach. I help you transform vague wonder into deep, investigable inquiry trees and uncover hidden systemic roots.\n\nWhat is a subject or puzzle you've been curious about?`;
  }

  const initialMessage: CoachingMessage = {
    id: `msg-init-${Date.now()}`,
    sessionId,
    role: "assistant",
    content: welcomeContent,
    responseType: "question",
    hintLevel: 0,
    createdAt: now,
  };

  const newSession: CoachingSession = {
    id: sessionId,
    userId,
    title: defaultTitle,
    capabilityKey: params.capabilityKey,
    journeyId: params.journeyId || null,
    goalId: params.goalId || null,
    status: "active",
    currentHintLevel: 0,
    instructionVersion: "v1.0",
    context,
    messages: [initialMessage],
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
  };

  // 3. Persist session
  if (!supabase) {
    coachLocalStore.saveSession(newSession);
    try {
      revalidatePath("/coach");
    } catch {
      // outside request lifecycle
    }
    return {
      success: true,
      data: { sessionId },
    };
  }

  try {
    const { data: sRow, error: sErr } = await supabase
      .from("coaching_sessions")
      .insert({
        user_id: userId,
        title: defaultTitle,
        capability_key: params.capabilityKey,
        journey_id: params.journeyId || null,
        goal_id: params.goalId || null,
        status: "active",
        current_hint_level: 0,
        instruction_version: "v1.0",
      })
      .select("id")
      .single();

    if (sErr || !sRow) {
      throw new Error(`Failed to create coaching session: ${sErr?.message}`);
    }

    const realSessionId = sRow.id;

    // Save initial message
    await supabase.from("coaching_messages").insert({
      session_id: realSessionId,
      role: "assistant",
      content: welcomeContent,
      response_type: "question",
      hint_level: 0,
    });

    // Save context snapshot
    await supabase.from("coaching_session_context_snapshots").insert({
      session_id: realSessionId,
      assessment_summary: (context.assessmentSummary || {}) as unknown as Json,
      journey_goal_summary: (context.goalSummary || {}) as unknown as Json,
      user_interests: context.userInterests,
    });

    try {
      revalidatePath("/coach");
      revalidatePath(`/coach/${realSessionId}`);
    } catch {
      // ignore
    }

    return {
      success: true,
      data: { sessionId: realSessionId },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initiate coaching session.",
    };
  }
}

/**
 * Sends a message in a coaching session and streams/generates the coach response.
 */
export async function sendCoachingMessage(
  params: SendMessageParams
): Promise<
  CoachingActionResult<{
    userMessage?: CoachingMessage;
    assistantMessage: CoachingMessage;
    newHintLevel: HintLevel;
  }>
> {
  const session = await getCoachingSession(params.sessionId);
  if (!session) {
    return { success: false, error: "Coaching session not found." };
  }

  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();
  let userMessage: CoachingMessage | undefined = undefined;

  // 1. If user provided content, record user message
  if (params.content.trim()) {
    userMessage = {
      id: `msg-u-${Date.now()}`,
      sessionId: params.sessionId,
      role: "user",
      content: params.content.trim(),
      responseType: "dialogue",
      createdAt: now,
    };

    if (!supabase) {
      coachLocalStore.addMessage(params.sessionId, userMessage);
    } else {
      await supabase.from("coaching_messages").insert({
        session_id: params.sessionId,
        role: "user",
        content: userMessage.content,
        response_type: "dialogue",
      });
    }
  }

  // 2. Generate coach reply
  const updatedHistory = userMessage ? [...session.messages, userMessage] : session.messages;

  const coachResult = await generateCoachReply({
    capabilityKey: session.capabilityKey,
    context: session.context,
    messages: updatedHistory,
    currentHintLevel: session.currentHintLevel,
    actionType: params.actionType,
    userPrompt: params.content,
  });

  const assistantMessage: CoachingMessage = {
    id: `msg-a-${Date.now()}`,
    sessionId: params.sessionId,
    role: "assistant",
    content: coachResult.replyContent,
    responseType: coachResult.responseType,
    hintLevel: coachResult.hintLevel,
    createdAt: new Date().toISOString(),
  };

  // 3. Persist assistant message & update hint level
  if (!supabase) {
    coachLocalStore.addMessage(params.sessionId, assistantMessage);
    coachLocalStore.updateHintLevel(params.sessionId, coachResult.newHintLevel);
  } else {
    await supabase.from("coaching_messages").insert({
      session_id: params.sessionId,
      role: "assistant",
      content: assistantMessage.content,
      response_type: assistantMessage.responseType,
      hint_level: assistantMessage.hintLevel,
      metadata: {
        provider: coachResult.provider,
        model: coachResult.modelName,
        durationMs: coachResult.durationMs,
      } as unknown as Json,
    });

    await supabase
      .from("coaching_sessions")
      .update({
        current_hint_level: coachResult.newHintLevel,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.sessionId);
  }

  try {
    revalidatePath(`/coach/${params.sessionId}`);
  } catch {
    // ignore
  }

  return {
    success: true,
    data: {
      userMessage,
      assistantMessage,
      newHintLevel: coachResult.newHintLevel,
    },
  };
}

/**
 * Retrieves a coaching session by ID with messages and summary.
 */
export async function getCoachingSession(sessionId: string): Promise<CoachingSession | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return coachLocalStore.getSession(sessionId);
  }

  try {
    const { data: sRow } = await supabase
      .from("coaching_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (!sRow) {
      return coachLocalStore.getSession(sessionId);
    }

    // Retrieve messages
    const { data: msgRows } = await supabase
      .from("coaching_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    // Retrieve summary if any
    const { data: summaryRow } = await supabase
      .from("coaching_session_summaries")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    // Retrieve context snapshot
    const { data: contextRow } = await supabase
      .from("coaching_session_context_snapshots")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    const messages: CoachingMessage[] = (msgRows || []).map((m) => ({
      id: m.id,
      sessionId: m.session_id,
      role: m.role as CoachingMessage["role"],
      content: m.content,
      responseType: m.response_type as CoachingMessage["responseType"],
      hintLevel: m.hint_level as HintLevel | null,
      metadata: m.metadata as Record<string, unknown>,
      createdAt: m.created_at,
    }));

    let summary: CoachingSessionSummary | null = null;
    if (summaryRow) {
      summary = {
        id: summaryRow.id,
        sessionId: summaryRow.session_id,
        exploredTopics: summaryRow.explored_topics,
        keyQuestionsConsidered: summaryRow.key_questions_considered,
        perspectivesDeveloped: summaryRow.perspectives_developed,
        reasoningDemonstrated: summaryRow.reasoning_demonstrated,
        growthFrontiers: summaryRow.growth_frontiers,
        recommendedNextSteps: summaryRow.recommended_next_steps,
        createdAt: summaryRow.created_at,
      };
    }

    const context: CoachingSessionContext = {
      assessmentSummary: contextRow?.assessment_summary as unknown as CoachingSessionContext["assessmentSummary"],
      goalSummary: contextRow?.journey_goal_summary as unknown as CoachingSessionContext["goalSummary"],
      userInterests: contextRow?.user_interests || [],
      growthIntentions: [],
    };

    return {
      id: sRow.id,
      userId: sRow.user_id,
      title: sRow.title,
      capabilityKey: sRow.capability_key as CoachingSession["capabilityKey"],
      journeyId: sRow.journey_id,
      goalId: sRow.goal_id,
      status: sRow.status as CoachingSession["status"],
      currentHintLevel: sRow.current_hint_level as HintLevel,
      instructionVersion: sRow.instruction_version,
      context,
      messages,
      summary,
      createdAt: sRow.created_at,
      updatedAt: sRow.updated_at,
      lastMessageAt: sRow.last_message_at,
      completedAt: sRow.completed_at,
    };
  } catch {
    return coachLocalStore.getSession(sessionId);
  }
}

/**
 * Lists all coaching sessions for user.
 */
export async function getUserCoachingSessions(): Promise<CoachingSession[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return coachLocalStore.getUserSessions("demo-user");
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return coachLocalStore.getUserSessions("demo-user");
    }

    const { data: rows } = await supabase
      .from("coaching_sessions")
      .select("id")
      .eq("user_id", user.id)
      .order("last_message_at", { ascending: false });

    if (!rows) return [];

    const sessions: CoachingSession[] = [];
    for (const r of rows) {
      const full = await getCoachingSession(r.id);
      if (full) sessions.push(full);
    }
    return sessions;
  } catch {
    return coachLocalStore.getUserSessions("demo-user");
  }
}

/**
 * Triggers a contextual action (hint, explain, perspective, challenge, summarize).
 */
export async function executeContextualAction(
  sessionId: string,
  action: ContextualActionType
): Promise<CoachingActionResult<{ assistantMessage: CoachingMessage; newHintLevel: HintLevel }>> {
  const res = await sendCoachingMessage({
    sessionId,
    content: "",
    actionType: action,
  });

  if (!res.success || !res.data) {
    return { success: false, error: res.error || "Failed to execute contextual action." };
  }

  return {
    success: true,
    data: {
      assistantMessage: res.data.assistantMessage,
      newHintLevel: res.data.newHintLevel,
    },
  };
}

/**
 * Generates and saves a session summary and marks session as completed.
 */
export async function generateSessionSummary(
  sessionId: string
): Promise<CoachingActionResult<CoachingSessionSummary>> {
  const session = await getCoachingSession(sessionId);
  if (!session) {
    return { success: false, error: "Coaching session not found." };
  }

  try {
    const summary = await summarizeCoachingSession(session);
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      coachLocalStore.saveSummary(sessionId, summary);
      coachLocalStore.updateStatus(sessionId, "completed");
    } else {
      await supabase.from("coaching_session_summaries").upsert({
        session_id: sessionId,
        explored_topics: summary.exploredTopics,
        key_questions_considered: summary.keyQuestionsConsidered,
        perspectives_developed: summary.perspectivesDeveloped,
        reasoning_demonstrated: summary.reasoningDemonstrated,
        growth_frontiers: summary.growthFrontiers,
        recommended_next_steps: summary.recommendedNextSteps,
      });

      await supabase
        .from("coaching_sessions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    try {
      revalidatePath(`/coach/${sessionId}`);
      revalidatePath("/coach");
    } catch {
      // ignore
    }

    return {
      success: true,
      data: summary,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to compile session summary.",
    };
  }
}

/**
 * Updates a coaching session's title.
 */
export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<CoachingActionResult<void>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    coachLocalStore.updateTitle(sessionId, title);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from("coaching_sessions")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", sessionId);

    if (error) throw error;
    try {
      revalidatePath(`/coach/${sessionId}`);
      revalidatePath("/coach");
    } catch {
      // ignore
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update session title",
    };
  }
}

/**
 * Deletes a coaching session.
 */
export async function deleteCoachingSession(sessionId: string): Promise<CoachingActionResult<void>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    coachLocalStore.deleteSession(sessionId);
    return { success: true };
  }

  try {
    const { error } = await supabase.from("coaching_sessions").delete().eq("id", sessionId);
    if (error) throw error;

    try {
      revalidatePath("/coach");
    } catch {
      // ignore
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete coaching session",
    };
  }
}
