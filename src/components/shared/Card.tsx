import React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "highlight";
}

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  const variantStyles = {
    default: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
    muted: "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/80",
    highlight: "bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-zinc-900 border-indigo-200 dark:border-indigo-900/50",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-sm transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}
