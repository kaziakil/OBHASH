import React from "react";
import { notFound } from "next/navigation";
import { getGrowthJourneyById } from "@/lib/journeys/actions";
import { JourneyDetailsClient } from "./JourneyDetailsClient";

interface JourneyDetailsPageProps {
  params: Promise<{
    journeyId: string;
  }>;
}

export default async function JourneyDetailsPage({ params }: JourneyDetailsPageProps) {
  const { journeyId } = await params;
  const journey = await getGrowthJourneyById(journeyId);

  if (!journey) {
    notFound();
  }

  return <JourneyDetailsClient initialJourney={journey} />;
}
