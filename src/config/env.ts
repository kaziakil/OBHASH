import { z } from "zod";

/**
 * Environment Variables Schema Validation
 */

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const serverEnvSchema = clientEnvSchema.extend({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3000"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  AI_PROVIDER: z.enum(["gemini", "openai"]).default("gemini"),
  AI_MODEL_NAME: z.string().default("gemini-2.5-flash"),
  AI_TIMEOUT_MS: z.coerce.number().default(30000),
  GEMINI_API_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validates and returns the current environment status without crashing the process.
 * This ensures graceful degradation and informative status endpoints when credentials
 * are not yet provisioned.
 */
export function getEnvStatus() {
  const parsed = serverEnvSchema.safeParse(process.env);
  
  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasSupabaseServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const activeProvider = process.env.AI_PROVIDER || "gemini";
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
  const hasActiveAiKey = activeProvider === "gemini" ? hasGeminiKey : hasOpenAIKey;

  return {
    isValid: parsed.success,
    errors: parsed.success ? [] : parsed.error.issues,
    supabase: {
      isConfigured: hasSupabaseUrl && hasSupabaseAnonKey,
      hasServiceKey: hasSupabaseServiceKey,
      url: hasSupabaseUrl ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined,
    },
    ai: {
      isConfigured: hasActiveAiKey,
      provider: activeProvider,
      model: process.env.AI_MODEL_NAME || "gemini-2.5-flash",
      timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 30000,
    },
  };
}

/**
 * Access safe validated environment variables.
 */
export function getValidatedEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    // Return defaults with empty optional keys to avoid build failures
    return {
      NODE_ENV: (process.env.NODE_ENV as "development" | "test" | "production") || "development",
      PORT: process.env.PORT || "3000",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      AI_PROVIDER: (process.env.AI_PROVIDER as "gemini" | "openai") || "gemini",
      AI_MODEL_NAME: process.env.AI_MODEL_NAME || "gemini-2.5-flash",
      AI_TIMEOUT_MS: Number(process.env.AI_TIMEOUT_MS) || 30000,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    };
  }
  return result.data;
}
