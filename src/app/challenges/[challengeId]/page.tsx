import React from "react";
import { notFound } from "next/navigation";
import { getChallengeByIdAction, getUserWorkOverviewAction } from "@/lib/challenges/actions";
import { ChallengeDetailClient } from "./ChallengeDetailClient";

interface PageProps {
  params: Promise<{ challengeId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { challengeId } = await params;
  const challenge = await getChallengeByIdAction(challengeId);

  if (!challenge) {
    return { title: "Challenge Not Found | OBHASH" };
  }

  return {
    title: `${challenge.title} | OBHASH Challenges`,
    description: challenge.short_description,
  };
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { challengeId } = await params;
  const challenge = await getChallengeByIdAction(challengeId);

  if (!challenge) {
    notFound();
  }

  const userWork = await getUserWorkOverviewAction();
  const existingItem = userWork.items.find((item) => item.challenge.id === challenge.id);

  return (
    <ChallengeDetailClient
      challenge={challenge}
      existingItem={existingItem}
    />
  );
}
