/**
 * OBHASH System Constants
 */

export const APP_METADATA = {
  name: "OBHASH",
  tagline: "Human-Centered Intelligence",
  description:
    "An AI-powered human capability development platform dedicated to strengthening human creativity, curiosity, and critical thinking.",
  team: "PastForward",
  phase: "Phase 1: Foundation & Project Setup",
  version: "0.1.0",
} as const;

export const CORE_CAPABILITIES = [
  {
    id: "critical-thinking",
    title: "Critical Thinking",
    description: "Evaluating arguments, discerning evidence, identifying cognitive biases, and formulating objective judgments.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "creative-problem-solving",
    title: "Creative Problem-Solving",
    description: "Divergent thinking, synthesizing novel connections, framing unstructured challenges, and prototyping inventive solutions.",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "curiosity",
    title: "Curiosity",
    description: "Active inquiry, exploratory questioning, cross-disciplinary exploration, and continuous drive for discovery.",
    color: "from-emerald-500 to-teal-600",
  },
] as const;

export const DEFAULT_AI_CONFIG = {
  timeoutMs: 30000,
  fallbackModel: "gemini-2.5-flash",
} as const;
