import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAttemptContextAction } from "@/lib/challenges/actions";
import { ReflectionClient } from "./ReflectionClient";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { attemptId } = await params;
  const context = await getAttemptContextAction(attemptId);

  if (!context) {
    return { title: "Reflection Not Found | OBHASH" };
  }

  return {
    title: `Reflection: ${context.challenge.title} | OBHASH`,
    description: "Structured reflection on capability development",
  };
}

export default async function ReflectionPage({ params }: PageProps) {
  const { attemptId } = await params;
  const context = await getAttemptContextAction(attemptId);

  if (!context) {
    notFound();
  }

  // Must have submitted to reach reflection
  if (context.attempt.status === "in_progress" || context.attempt.status === "not_started") {
    redirect(`/workspace/${attemptId}`);
  }

  return (
    <ReflectionClient
      attempt={context.attempt}
      challenge={context.challenge}
      initialReflection={context.reflection}
      aiAssistance={context.aiAssistance}
    />
  );
}
