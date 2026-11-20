import React from "react";
import { getUserWorkOverviewAction } from "@/lib/challenges/actions";
import { MyWorkClient } from "./MyWorkClient";

export const metadata = {
  title: "My Work & Practice History | OBHASH",
  description: "Track your in-progress challenge drafts, submissions, feedback, and completed reflections.",
};

export default async function MyWorkPage() {
  const userWork = await getUserWorkOverviewAction();

  return <MyWorkClient userWork={userWork} />;
}
