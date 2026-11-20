import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAttemptContextAction } from "@/lib/challenges/actions";
import { WorkspaceClient } from "./WorkspaceClient";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { attemptId } = await params;
  const context = await getAttemptContextAction(attemptId);

  if (!context) {
    return { title: "Workspace Not Found | OBHASH" };
  }

  return {
    title: `Workspace: ${context.challenge.title} | OBHASH`,
    description: context.challenge.short_description,
  };
}

export default async function WorkspacePage({ params }: PageProps) {
  const { attemptId } = await params;
  const context = await getAttemptContextAction(attemptId);

  if (!context) {
    notFound();
  }

  // If already submitted and evaluated, redirect to evaluation view unless user explicitly revisits
  if (context.attempt.status === "completed" || context.attempt.status === "evaluated" || context.attempt.status === "reflection_pending") {
    // If they have not completed reflection, allow navigation to reflection or evaluation
    if (context.attempt.status === "reflection_pending") {
      redirect(`/workspace/${attemptId}/evaluation`);
    }
  }

  return (
    <WorkspaceClient
      attempt={context.attempt}
      challenge={context.challenge}
      initialDraft={context.draft}
      initialAIAssistance={context.aiAssistance}
    />
  );
}
