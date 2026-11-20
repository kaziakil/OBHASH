/**
 * Local In-Memory Fallback Store for AI Growth Coach
 * Supports offline development, tests, and standby environments.
 */

import type {
  CoachingSession,
  CoachingMessage,
  CoachingSessionSummary,
  CoachingSessionContext,
  HintLevel,
  CoachingSessionStatus,
} from "@/types/coach";

class CoachLocalStore {
  private sessions: Map<string, CoachingSession> = new Map();

  constructor() {
    this.seedDemoSessions();
  }

  private seedDemoSessions() {
    const demoId = "demo-coach-session-1";
    const now = new Date().toISOString();
    const demoSession: CoachingSession = {
      id: demoId,
      userId: "demo-user",
      title: "Analyzing Causal Claims in Public Transit",
      capabilityKey: "critical-thinking",
      journeyId: "demo-journey-1",
      goalId: "goal-ct-1",
      status: "active",
      currentHintLevel: 1,
      instructionVersion: "v1.0",
      context: {
        assessmentSummary: {
          capabilityName: "Critical Thinking",
          overallScore: 3.25,
          performanceLevel: "Strongly Demonstrating",
          strengths: ["Analytical decomposition", "Premise evaluation"],
          opportunities: ["Audit confounding factors in observational studies"],
        },
        goalSummary: {
          goalId: "goal-ct-1",
          goalTitle: "Discern Confounding Variables in Complex Arguments",
          dimensionSlug: "evidence-evaluation",
          expectedOutcome: "Identify potential confounders in empirical reports.",
          reasonForRecommendation: "Strengthen correlation vs causation discernment.",
        },
        userInterests: ["Urban Systems", "Technology"],
        growthIntentions: ["Think more clearly", "Evaluate evidence rigorously"],
      },
      messages: [
        {
          id: "msg-1",
          sessionId: demoId,
          role: "assistant",
          content:
            "Welcome to your Critical Thinking coaching session. We're focusing on discerning confounding variables, building upon your goal to evaluate complex public transit claims.\n\nTo start: what specific claim or article would you like to examine today?",
          responseType: "question",
          hintLevel: 0,
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          id: "msg-2",
          sessionId: demoId,
          role: "user",
          content:
            "A city pilot reported that adding free transit passes increased downtown economic activity by 28% in 3 months.",
          responseType: "dialogue",
          createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        },
        {
          id: "msg-3",
          sessionId: demoId,
          role: "assistant",
          content:
            "A 28% jump in three months is substantial. Before concluding that the free passes caused that economic boost, let's explore what else might have happened during those exact three months.\n\nWhat other local factors or seasonal patterns could influence downtown activity during that timeframe?",
          responseType: "question",
          hintLevel: 0,
          createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
        },
      ],
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    };

    this.sessions.set(demoId, demoSession);
  }

  public getSession(sessionId: string): CoachingSession | null {
    return this.sessions.get(sessionId) || null;
  }

  public getUserSessions(userId: string): CoachingSession[] {
    return Array.from(this.sessions.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  public saveSession(session: CoachingSession): CoachingSession {
    const updated = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
    this.sessions.set(session.id, updated);
    return updated;
  }

  public addMessage(sessionId: string, message: CoachingMessage): boolean {
    const s = this.sessions.get(sessionId);
    if (!s) return false;
    s.messages.push(message);
    s.lastMessageAt = message.createdAt;
    s.updatedAt = new Date().toISOString();
    return true;
  }

  public updateHintLevel(sessionId: string, level: HintLevel): boolean {
    const s = this.sessions.get(sessionId);
    if (!s) return false;
    s.currentHintLevel = level;
    s.updatedAt = new Date().toISOString();
    return true;
  }

  public updateStatus(sessionId: string, status: CoachingSessionStatus): boolean {
    const s = this.sessions.get(sessionId);
    if (!s) return false;
    s.status = status;
    s.updatedAt = new Date().toISOString();
    if (status === "completed") {
      s.completedAt = new Date().toISOString();
    }
    return true;
  }

  public saveSummary(sessionId: string, summary: CoachingSessionSummary): boolean {
    const s = this.sessions.get(sessionId);
    if (!s) return false;
    s.summary = summary;
    s.updatedAt = new Date().toISOString();
    return true;
  }

  public saveContext(sessionId: string, context: CoachingSessionContext): boolean {
    const s = this.sessions.get(sessionId);
    if (!s) return false;
    s.context = context;
    s.updatedAt = new Date().toISOString();
    return true;
  }

  public updateTitle(sessionId: string, title: string): boolean {
    const s = this.sessions.get(sessionId);
    if (!s) return false;
    s.title = title;
    s.updatedAt = new Date().toISOString();
    return true;
  }

  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }
}

export const coachLocalStore = new CoachLocalStore();
