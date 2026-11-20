import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAttemptContextAction } from "@/lib/challenges/actions";
import { EvaluationClient } from "./EvaluationClient";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { attemptId } = await params;
  const context = await getAttemptContextAction(attemptId);

  if (!context) {
    return { title: "Evaluation Not Found | OBHASH" };
  }

  return {
    title: `Evaluation: ${context.challenge.title} | OBHASH`,
    description: "Evidence-grounded capability evaluation feedback",
  };
}

export default async function EvaluationPage({ params }: PageProps) {
  const { attemptId } = await params;
  const context = await getAttemptContextAction(attemptId);

  if (!context) {
    notFound();
  }

  if (!context.evaluation) {
    redirect(`/workspace/${attemptId}`);
  }

  return (
    <EvaluationClient
      attempt={context.attempt}
      challenge={context.challenge}
      submission={context.submission}
      evaluation={context.evaluation}
      reflection={context.reflection}
      aiAssistance={context.aiAssistance}
    />
  );
}
