import React from "react";
import { getUserCoachingSessions } from "@/lib/coach/actions";
import { getActiveGrowthJourney } from "@/lib/journeys/actions";
import { getUserCapabilityProfiles } from "@/lib/assessments/actions";
import { CoachHubClient } from "./CoachHubClient";

export default async function CoachPage() {
  const [sessions, activeJourney, capabilityProfiles] = await Promise.all([
    getUserCoachingSessions(),
    getActiveGrowthJourney(),
    getUserCapabilityProfiles(),
  ]);

  return (
    <CoachHubClient
      initialSessions={sessions}
      activeJourney={activeJourney}
      capabilityProfiles={capabilityProfiles}
    />
  );
}
