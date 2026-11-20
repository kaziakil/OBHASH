import { apiSuccess } from "@/lib/utils/response";
import { getEnvStatus } from "@/config/env";
import { aiService } from "@/lib/ai/service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { HealthStatus } from "@/types/api";

const startTime = Date.now();

export async function GET() {
  const env = getEnvStatus();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  // Check Supabase status
  let supabaseStatus: HealthStatus["services"]["supabase"]["status"] = "unconfigured";
  let supabaseMessage = "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set.";

  if (env.supabase.isConfigured) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        // Attempt a lightweight query to verify connectivity
        const { error } = await supabase.from("capabilities").select("count").limit(0);
        if (error) {
          supabaseStatus = "configured";
          supabaseMessage = `Supabase client configured with URL. Database query reported: ${error.message}`;
        } else {
          supabaseStatus = "operational";
          supabaseMessage = "Supabase database connection established successfully.";
        }
      }
    } catch (err) {
      supabaseStatus = "error";
      supabaseMessage = `Error initializing Supabase client: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  // Check AI Service status
  const aiStatusMetadata = aiService.getStatus();
  const aiStatus: HealthStatus["services"]["ai"]["status"] = aiStatusMetadata.configured
    ? "configured"
    : "unconfigured";
  const aiMessage = aiStatusMetadata.configured
    ? `AI Service configured for provider '${aiStatusMetadata.provider}' with model '${aiStatusMetadata.model}'.`
    : `AI credentials not detected for provider '${aiStatusMetadata.provider}'. Set ${
        aiStatusMetadata.provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"
      } in .env.local to activate.`;

  const isDegraded = supabaseStatus === "unconfigured" || aiStatus === "unconfigured";

  const healthData: HealthStatus = {
    status: isDegraded ? "degraded" : "healthy",
    uptimeSeconds,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    services: {
      nextjs: {
        status: "operational",
        version: "16.4.6",
      },
      supabase: {
        status: supabaseStatus,
        configured: env.supabase.isConfigured,
        message: supabaseMessage,
      },
      ai: {
        status: aiStatus,
        configured: aiStatusMetadata.configured,
        provider: aiStatusMetadata.provider,
        model: aiStatusMetadata.model,
        message: aiMessage,
      },
    },
  };

  return apiSuccess(healthData, 200);
}
