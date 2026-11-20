/**
 * AI Growth Coach Conversation Engine
 * Phase 5: AI Growth Coach
 *
 * Implements Socratic dialogue generation, progressive hint state management,
 * prompt sanitization, sliding context windows, and deterministic fallback.
 */

import { z } from "zod";
import { AIService } from "./service";
import {
  buildCoachSystemInstruction,
  buildContextualActionPrompt,
} from "@/lib/coach/prompts";
import { logger } from "@/lib/utils/logger";
import type {
  CoachingCapabilityKey,
  CoachingMessage,
  CoachingResponseType,
  CoachingSession,
  CoachingSessionContext,
  CoachingSessionSummary,
  ContextualActionType,
  HintLevel,
} from "@/types/coach";

const SessionSummarySchema = z.object({
  exploredTopics: z.array(z.string()).min(1),
  keyQuestionsConsidered: z.array(z.string()).min(1),
  perspectivesDeveloped: z.array(z.string()).min(1),
  reasoningDemonstrated: z.string().min(15),
  growthFrontiers: z.array(z.string()).min(1),
  recommendedNextSteps: z.array(z.string()).min(1),
});

export interface CoachGenerationResult {
  replyContent: string;
  responseType: CoachingResponseType;
  hintLevel?: HintLevel | null;
  newHintLevel: HintLevel;
  provider: string;
  modelName: string;
  durationMs: number;
}

/**
 * Generates an AI Growth Coach response using AIService with fallback to deterministic Socratic templates.
 */
export async function generateCoachReply({
  capabilityKey,
  context,
  messages,
  currentHintLevel,
  actionType,
  userPrompt,
}: {
  capabilityKey: CoachingCapabilityKey;
  context?: CoachingSessionContext;
  messages: CoachingMessage[];
  currentHintLevel: HintLevel;
  actionType?: ContextualActionType;
  userPrompt?: string;
}): Promise<CoachGenerationResult> {
  const startTime = Date.now();
  const aiService = new AIService();

  // Determine hint level updates if an action was triggered
  let effectivePrompt = userPrompt || "";
  let targetHintLevel = currentHintLevel;
  let responseType: CoachingResponseType = "dialogue";

  if (actionType) {
    const actionData = buildContextualActionPrompt(actionType, currentHintLevel);
    effectivePrompt = actionData.prompt;
    if (actionData.targetHintLevel !== undefined) {
      targetHintLevel = actionData.targetHintLevel;
    }
    if (actionType === "hint") responseType = "hint";
    else if (actionType === "explain") responseType = "explanation";
    else if (actionType === "perspective") responseType = "perspective";
    else if (actionType === "challenge") responseType = "challenge";
    else if (actionType === "summarize") responseType = "summary";
  } else if (effectivePrompt.endsWith("?")) {
    responseType = "dialogue";
  }

  // Fallback to deterministic Socratic guidance if AI is unconfigured
  if (!aiService.isReady()) {
    logger.info("AI service unconfigured; generating Socratic coaching reply using deterministic engine");
    const fallback = generateDeterministicCoachReply({
      capabilityKey,
      context,
      messages,
      hintLevel: targetHintLevel,
      actionType,
      userPrompt: effectivePrompt,
    });
    return {
      replyContent: fallback.content,
      responseType: fallback.responseType,
      hintLevel: targetHintLevel > 0 ? targetHintLevel : null,
      newHintLevel: targetHintLevel,
      provider: "deterministic-socratic",
      modelName: "obhash-coach-v1",
      durationMs: Date.now() - startTime,
    };
  }

  try {
    const systemInstruction = buildCoachSystemInstruction(capabilityKey, context);

    // Sliding window: keep up to last 10 messages for conversation continuity
    const historySlice = messages.slice(-10);
    const chatMessages = historySlice.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    if (effectivePrompt) {
      chatMessages.push({
        role: "user",
        content: effectivePrompt,
      });
    }

    const completion = await aiService.generateCompletion({
      systemInstruction,
      messages: chatMessages,
      temperature: 0.4,
      maxTokens: 800,
      timeoutMs: 25000,
    });

    const reply = completion.content.trim();

    return {
      replyContent: reply,
      responseType,
      hintLevel: targetHintLevel > 0 ? targetHintLevel : null,
      newHintLevel: targetHintLevel,
      provider: completion.provider,
      modelName: completion.model,
      durationMs: Date.now() - startTime,
    };
  } catch (error) {
    logger.error("AI Growth Coach completion error; reverting to deterministic Socratic guidance", error);
    const fallback = generateDeterministicCoachReply({
      capabilityKey,
      context,
      messages,
      hintLevel: targetHintLevel,
      actionType,
      userPrompt: effectivePrompt,
    });
    return {
      replyContent: fallback.content,
      responseType: fallback.responseType,
      hintLevel: targetHintLevel > 0 ? targetHintLevel : null,
      newHintLevel: targetHintLevel,
      provider: "deterministic-socratic-fallback",
      modelName: "obhash-coach-v1",
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * Generates structured session summary grounded in real conversation messages.
 */
export async function summarizeCoachingSession(
  session: CoachingSession
): Promise<CoachingSessionSummary> {
  const aiService = new AIService();
  const now = new Date().toISOString();

  // If unconfigured, build grounded summary deterministically
  if (!aiService.isReady()) {
    return generateDeterministicSummary(session);
  }

  try {
    const conversationTranscript = session.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const prompt = `Synthesize a grounded developmental summary of this completed coaching session.
CAPABILITY: ${session.capabilityKey}
SESSION TITLE: ${session.title}

CONVERSATION TRANSCRIPT:
<transcript>
${conversationTranscript}
</transcript>

INSTRUCTIONS:
1. Base the summary strictly on what was actually discussed in the transcript.
2. Do not invent achievements or claim numerical capability increases.
3. Return pure JSON matching this schema:
{
  "exploredTopics": string[],
  "keyQuestionsConsidered": string[],
  "perspectivesDeveloped": string[],
  "reasoningDemonstrated": string,
  "growthFrontiers": string[],
  "recommendedNextSteps": string[]
}`;

    const completion = await aiService.generateCompletion({
      systemInstruction:
        "You are the OBHASH Capability Evaluation Synthesizer. Produce only valid JSON adhering to the specified schema without markdown formatting.",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      maxTokens: 1000,
    });

    const cleanedText = completion.content
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = SessionSummarySchema.safeParse(JSON.parse(cleanedText));

    if (!parsed.success) {
      logger.warn("Summary AI output schema validation failed; using deterministic synthesizer", {
        errors: parsed.error.issues,
      });
      return generateDeterministicSummary(session);
    }

    return {
      id: `summary-${session.id}`,
      sessionId: session.id,
      ...parsed.data,
      createdAt: now,
    };
  } catch (err) {
    logger.error("Error generating AI session summary; falling back to deterministic synthesizer", err);
    return generateDeterministicSummary(session);
  }
}

/**
 * Deterministic Socratic guidance engine ensuring intelligent, non-trivial coaching when AI is offline.
 */
function generateDeterministicCoachReply({
  capabilityKey,
  context,
  messages,
  hintLevel,
  actionType,
}: {
  capabilityKey: CoachingCapabilityKey;
  context?: CoachingSessionContext;
  messages: CoachingMessage[];
  hintLevel: HintLevel;
  actionType?: ContextualActionType;
  userPrompt?: string;
}): { content: string; responseType: CoachingResponseType } {
  const goalTitle = context?.goalSummary?.goalTitle || "your active development focus";

  // Action-specific responses
  if (actionType === "hint") {
    if (hintLevel === 1) {
      return {
        content: `**Directional Hint (Level 1):**\n\nTake a step back from the specific details. Ask yourself: *What unstated assumption must be true for this entire claim or idea to hold together?* Where might that premise be vulnerable?`,
        responseType: "hint",
      };
    } else if (hintLevel === 2) {
      return {
        content: `**Conceptual Hint (Level 2):**\n\nConsider applying the concept of **Confounding Variables & Reverse Causality** (or **Analogical Inversion**). When two things occur together, ask whether an external third factor drove both, or if the causal arrow runs in the opposite direction.`,
        responseType: "hint",
      };
    } else {
      return {
        content: `**Specific Guidance (Level 3):**\n\nTry a two-step critique:\n1. Write down the primary observed outcome.\n2. List two distinct alternate mechanisms that could explain that outcome without relying on the original premise.\n\nWhich of those two alternatives seems most plausible to test?`,
        responseType: "hint",
      };
    }
  }

  if (actionType === "explain") {
    return {
      content: `**Conceptual Overview:**\n\nIn capability development, rigorous reasoning requires separating **observational data** (what was physically measured) from **inferential narratives** (the story we construct to explain the data).\n\nConnecting this back to our discussion: in the scenario you just described, what part is the undeniable raw observation, and what part is the interpretation?`,
      responseType: "explanation",
    };
  }

  if (actionType === "perspective") {
    return {
      content: `**Alternative Perspective to Consider:**\n\nImagine an adversary or skeptical auditor who disagrees with your premise. They might argue: *"This trend isn't driven by intrinsic capability or policy changes at all; it's simply a temporary artifact of self-selection bias or external market incentives."*\n\nHow would you defend your reasoning against that critique without dismissing their skepticism?`,
      responseType: "perspective",
    };
  }

  if (actionType === "challenge") {
    return {
      content: `**Constructive Challenge:**\n\nLet's pressure-test that assertion. If your initial conclusion were 100% correct, what counter-intuitive consequence would we expect to see that isn't currently appearing in the real world?\n\nWhere is the potential blind spot in how you are framing this problem?`,
      responseType: "challenge",
    };
  }

  if (actionType === "summarize") {
    return {
      content: `**Discussion Summary So Far:**\n\nWe have been examining the core assumptions in your problem, focusing on ${goalTitle}. You articulated the initial claim and identified several practical nuances.\n\nThe most important open frontier now is: *what concrete evidence would decisively validate or refute your primary hypothesis?*`,
      responseType: "summary",
    };
  }

  // Capability-specific Socratic conversational patterns
  if (capabilityKey === "critical-thinking") {
    if (messages.length <= 1) {
      return {
        content: `You've framed an interesting proposition. To help deconstruct it: what specific observation or evidence first led you to this perspective, and what would it take to convince you that the opposite might be true?`,
        responseType: "question",
      };
    }
    return {
      content: `That is a helpful clarification. Notice that your conclusion links several points together. If we isolate the strongest link from the weakest link, which piece of that argument relies on direct evidence versus personal intuition?`,
      responseType: "question",
    };
  }

  if (capabilityKey === "creative-problem-solving") {
    if (messages.length <= 1) {
      return {
        content: `Let's avoid converging on the most obvious solution too early. If you were completely prohibited from using the standard industry approach, what are two unconventional ways you could tackle this constraint?`,
        responseType: "question",
      };
    }
    return {
      content: `That second concept introduces an intriguing angle. How could you combine that idea with an unrelated mechanism—for instance, borrowed from natural ecosystems or distributed networks—to make it more practical?`,
      responseType: "question",
    };
  }

  // Curiosity
  return {
    content: `That touches on a deeper systemic question. What do you think are the underlying historical or structural conditions that allowed this situation to emerge in the first place? What second-order question should we investigate next?`,
    responseType: "question",
  };
}

/**
 * Deterministic session summary generator grounded in real conversation messages.
 */
function generateDeterministicSummary(session: CoachingSession): CoachingSessionSummary {
  const userMessages = session.messages.filter((m) => m.role === "user");
  const coachMessages = session.messages.filter((m) => m.role === "assistant");

  const topics = [
    session.title,
    `Independent inquiry in ${session.capabilityKey.replace("-", " ")}`,
  ];

  const questions = coachMessages
    .filter((m) => m.content.includes("?"))
    .slice(0, 3)
    .map((m) => {
      const match = m.content.match(/([A-Z][^?]*\?)/);
      return match ? match[1].trim() : "How can this reasoning be validated?";
    });

  if (questions.length === 0) {
    questions.push("What underlying assumptions govern this scenario?");
  }

  return {
    id: `summary-${session.id}`,
    sessionId: session.id,
    exploredTopics: topics,
    keyQuestionsConsidered: questions,
    perspectivesDeveloped: [
      "Distinguished core observations from interpretative assumptions",
      "Examined systemic constraints and alternative hypotheses",
    ],
    reasoningDemonstrated:
      userMessages.length > 0
        ? `Engaged across ${userMessages.length} exchanges, articulating initial claims and considering alternative angles under Socratic guidance.`
        : "Initial session established with active inquiry focus.",
    growthFrontiers: [
      "Deepen evidentiary critique before arriving at final judgments",
      "Structure multi-tier question hierarchies for complex problems",
    ],
    recommendedNextSteps: [
      "Apply this thinking framework to a concrete everyday challenge",
      "Revisit the active growth journey milestone practice",
    ],
    createdAt: new Date().toISOString(),
  };
}
