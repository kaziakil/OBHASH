import React from "react";
import { cn } from "@/lib/utils/cn";

export interface StatusBadgeProps {
  status: "operational" | "configured" | "unconfigured" | "healthy" | "degraded" | "error" | "connected" | "unconnected";
  label?: string;
  className?: string;
}

const statusStyles: Record<StatusBadgeProps["status"], { bg: string; text: string; dot: string; defaultLabel: string }> = {
  operational: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    defaultLabel: "Operational",
  },
  healthy: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    defaultLabel: "Healthy",
  },
  connected: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    defaultLabel: "Connected",
  },
  configured: {
    bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
    defaultLabel: "Configured",
  },
  degraded: {
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    defaultLabel: "Setup Pending",
  },
  unconfigured: {
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    defaultLabel: "Pending Config",
  },
  unconnected: {
    bg: "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700",
    text: "text-zinc-600 dark:text-zinc-400",
    dot: "bg-zinc-400",
    defaultLabel: "Standby",
  },
  error: {
    bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    defaultLabel: "Error",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const current = statusStyles[status] || statusStyles.unconfigured;
  const displayLabel = label ?? current.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        current.bg,
        current.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", current.dot)} />
      {displayLabel}
    </span>
  );
}
