import React from "react";
import { notFound } from "next/navigation";
import { getCoachingSession } from "@/lib/coach/actions";
import { CoachingRoomClient } from "./CoachingRoomClient";

interface CoachingRoomPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function CoachingRoomPage({ params }: CoachingRoomPageProps) {
  const { sessionId } = await params;
  const session = await getCoachingSession(sessionId);

  if (!session) {
    notFound();
  }

  return <CoachingRoomClient initialSession={session} />;
}
