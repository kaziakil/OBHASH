import { apiSuccess, apiError } from "@/lib/utils/response";
import { aiService } from "@/lib/ai/service";

/**
 * AI Integration Connectivity Test Endpoint
 * Tests provider communication without triggering coaching logic.
 */
export async function GET() {
  try {
    const result = await aiService.testConnectivity();
    const status = aiService.getStatus();

    return apiSuccess({
      connectivity: result.success ? "connected" : "unconnected",
      provider: status.provider,
      model: status.model,
      latencyMs: result.latencyMs,
      details: result.message,
    });
  } catch (error) {
    return apiError(
      "AI connectivity test encountered an error",
      500,
      error instanceof Error ? error.message : String(error)
    );
  }
}
