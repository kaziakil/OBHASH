import React from "react";
import { notFound } from "next/navigation";
import { getGrowthJourneyById } from "@/lib/journeys/actions";
import { GoalDetailsClient } from "./GoalDetailsClient";
import type { ProposedGoal } from "@/types/journey";

interface GoalDetailsPageProps {
  params: Promise<{
    journeyId: string;
    goalId: string;
  }>;
}

export default async function GoalDetailsPage({ params }: GoalDetailsPageProps) {
  const { journeyId, goalId } = await params;
  const journey = await getGrowthJourneyById(journeyId);

  if (!journey) {
    notFound();
  }

  // Find target goal in journey
  let targetGoal: ProposedGoal | null = null;
  let capabilityName = "";

  for (const fa of journey.focusAreas) {
    for (const g of fa.goals) {
      if (g.id === goalId) {
        targetGoal = g;
        capabilityName = fa.capabilityName;
        break;
      }
    }
    if (targetGoal) break;
  }

  if (!targetGoal) {
    notFound();
  }

  return (
    <GoalDetailsClient
      journeyId={journey.id}
      journeyTitle={journey.title}
      capabilityName={capabilityName}
      initialGoal={targetGoal}
    />
  );
}
