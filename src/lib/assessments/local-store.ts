import type { CapabilityBaselineProfile, SingleEvaluationResult, UserResponsePayload } from "@/types/assessment";

interface LocalAttemptRecord {
  id: string;
  userId: string;
  moduleSlug: string;
  status: "in-progress" | "completed";
  responses: Record<string, UserResponsePayload>;
  evaluations: SingleEvaluationResult[];
  profile?: CapabilityBaselineProfile;
  startedAt: string;
  completedAt?: string;
}

// In-memory cache for development sessions when Supabase is unconfigured
const localAttemptsMap = new Map<string, LocalAttemptRecord>();
const localProfilesMap = new Map<string, CapabilityBaselineProfile[]>();

export const localStore = {
  createAttempt(id: string, userId: string, moduleSlug: string): LocalAttemptRecord {
    const record: LocalAttemptRecord = {
      id,
      userId,
      moduleSlug,
      status: "in-progress",
      responses: {},
      evaluations: [],
      startedAt: new Date().toISOString(),
    };
    localAttemptsMap.set(id, record);
    return record;
  },

  getAttempt(id: string): LocalAttemptRecord | undefined {
    return localAttemptsMap.get(id);
  },

  saveResponse(attemptId: string, itemId: string, payload: UserResponsePayload) {
    let attempt = localAttemptsMap.get(attemptId);
    if (!attempt) {
      attempt = this.createAttempt(attemptId, "anonymous-user", "critical-thinking");
    }
    attempt.responses[itemId] = payload;
  },

  completeAttempt(
    attemptId: string,
    evaluations: SingleEvaluationResult[],
    profile: CapabilityBaselineProfile
  ) {
    const attempt = localAttemptsMap.get(attemptId);
    if (attempt) {
      attempt.status = "completed";
      attempt.evaluations = evaluations;
      attempt.profile = profile;
      attempt.completedAt = new Date().toISOString();

      const existingProfiles = localProfilesMap.get(attempt.userId) || [];
      const updated = existingProfiles.filter((p) => p.capabilityKey !== profile.capabilityKey);
      updated.push(profile);
      localProfilesMap.set(attempt.userId, updated);
    }
  },

  getUserProfiles(userId: string): CapabilityBaselineProfile[] {
    return localProfilesMap.get(userId) || [];
  },
};
