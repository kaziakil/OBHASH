import React from "react";
import { getActiveGrowthJourney, getUserGrowthJourneys } from "@/lib/journeys/actions";
import { getUserCapabilityProfiles } from "@/lib/assessments/actions";
import { JourneyHubClient } from "./JourneyHubClient";

export default async function JourneyPage() {
  const [activeJourney, allJourneys, capabilityProfiles] = await Promise.all([
    getActiveGrowthJourney(),
    getUserGrowthJourneys(),
    getUserCapabilityProfiles(),
  ]);

  return (
    <JourneyHubClient
      activeJourney={activeJourney}
      allJourneys={allJourneys}
      capabilityProfiles={capabilityProfiles}
    />
  );
}
