import React from "react";
import { notFound } from "next/navigation";
import { getAssessmentModule } from "@/lib/assessments/content";
import { AssessmentRunnerClient } from "./AssessmentRunnerClient";

export default async function AssessmentModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleSlug } = await params;
  const moduleData = getAssessmentModule(moduleSlug);

  if (!moduleData) {
    notFound();
  }

  return <AssessmentRunnerClient moduleData={moduleData} />;
}
