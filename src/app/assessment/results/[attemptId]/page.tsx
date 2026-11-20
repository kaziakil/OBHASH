import React from "react";
import { notFound } from "next/navigation";
import { getAssessmentAttemptResults } from "@/lib/assessments/actions";
import { AssessmentResultsClient } from "./AssessmentResultsClient";

export default async function AssessmentResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const result = await getAssessmentAttemptResults(attemptId);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <AssessmentResultsClient
      attemptId={attemptId}
      profile={result.data.profile}
      evaluations={result.data.evaluations}
    />
  );
}
