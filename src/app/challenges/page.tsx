import React from "react";
import { getChallengesAction, getRecommendedChallengesAction, getUserWorkOverviewAction } from "@/lib/challenges/actions";
import { ChallengeDiscoveryClient } from "./ChallengeDiscoveryClient";

export const metadata = {
  title: "Challenge Library | OBHASH",
  description: "Discover and practice rigorous capability-building challenges designed to strengthen human agency, problem-solving, and curiosity.",
};

export default async function ChallengesPage() {
  const [challenges, recommendations, userWork] = await Promise.all([
    getChallengesAction(),
    getRecommendedChallengesAction(),
    getUserWorkOverviewAction(),
  ]);

  return (
    <ChallengeDiscoveryClient
      initialChallenges={challenges}
      recommendations={recommendations}
      userWork={userWork}
    />
  );
}
