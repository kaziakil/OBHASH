"use server";

import type {
  IndependenceDimensionKey,
  IndependenceDimensionSummary,
  IndependenceOverviewData,
  IndependenceObservation,
} from "@/types/independence";
import { evaluateUserIndependence } from "./engine";
import { independenceLocalStore } from "./local-store";

/**
 * Retrieves the comprehensive independence overview for the user.
 * Evaluates observations, sufficiency states, AI patterns, and timeline.
 */
export async function getIndependenceOverview(
  userId = "demo-user-1"
): Promise<IndependenceOverviewData> {
  return evaluateUserIndependence(userId);
}

/**
 * Retrieves detailed evidence and behaviors for a single dimension.
 */
export async function getDimensionDetail(
  dimensionKey: IndependenceDimensionKey,
  userId = "demo-user-1"
): Promise<IndependenceDimensionSummary | null> {
  const overview = evaluateUserIndependence(userId);
  return overview.dimensions[dimensionKey] || null;
}

/**
 * Records a new verifiable observation tied to challenge or assessment evidence.
 */
export async function recordIndependenceObservation(
  observationData: Omit<IndependenceObservation, "id" | "createdAt">
): Promise<IndependenceObservation> {
  const newObs: IndependenceObservation = {
    ...observationData,
    id: `obs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  independenceLocalStore.addObservation(newObs);
  return newObs;
}

/**
 * Resets user evidence for QA and testing empty/insufficient evidence state.
 */
export async function resetEvidenceForTesting(userId: string): Promise<void> {
  independenceLocalStore.clearUserEvidence(userId);
}
