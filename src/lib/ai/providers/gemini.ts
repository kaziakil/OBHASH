import { GoogleGenAI } from "@google/genai";
import type {
  AIProviderAdapter,
  CompletionRequest,
  CompletionResponse,
} from "@/types/ai";
import { AIServiceError } from "@/types/ai";
import { logger } from "@/lib/utils/logger";

export class GeminiProviderAdapter implements AIProviderAdapter {
  readonly provider = "gemini" as const;
  private readonly client: GoogleGenAI;
  private readonly modelName: string;
  private readonly defaultTimeoutMs: number;

  constructor(apiKey: string, modelName: string = "gemini-2.5-flash", defaultTimeoutMs: number = 30000) {
    if (!apiKey) {
      throw new AIServiceError("Gemini API key is required", "CONFIG_ERROR", "gemini");
    }
    this.client = new GoogleGenAI({ apiKey });
    this.modelName = modelName;
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  async generateCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const startTime = Date.now();
    const timeoutMs = request.timeoutMs ?? this.defaultTimeoutMs;

    try {
      const contents = request.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      // Wrap the SDK call in a timeout promise
      const completionPromise = this.client.models.generateContent({
        model: this.modelName,
        contents,
        config: {
          systemInstruction: request.systemInstruction,
          temperature: request.temperature,
          maxOutputTokens: request.maxTokens,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new AIServiceError(
                `Request timed out after ${timeoutMs}ms`,
                "TIMEOUT_ERROR",
                "gemini"
              )
            ),
          timeoutMs
        )
      );

      const response = await Promise.race([completionPromise, timeoutPromise]);
      const durationMs = Date.now() - startTime;
      const text = response.text ?? "";

      return {
        content: text,
        model: this.modelName,
        provider: "gemini",
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount,
          completionTokens: response.usageMetadata?.candidatesTokenCount,
          totalTokens: response.usageMetadata?.totalTokenCount,
        },
        durationMs,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      logger.error("Gemini completion error", error, { durationMs, model: this.modelName });

      if (error instanceof AIServiceError) {
        throw error;
      }

      throw new AIServiceError(
        error instanceof Error ? error.message : "Unknown Gemini API error",
        "PROVIDER_ERROR",
        "gemini",
        error
      );
    }
  }

  async testConnectivity(): Promise<{ success: boolean; latencyMs: number; message: string }> {
    const startTime = Date.now();
    try {
      const result = await this.generateCompletion({
        messages: [{ role: "user", content: "Ping: Respond with single word 'PONG'." }],
        maxTokens: 10,
        timeoutMs: 10000,
      });
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        latencyMs,
        message: `Gemini connectivity verified (${result.model}) in ${latencyMs}ms. Response: ${result.content.trim()}`,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        latencyMs,
        message: error instanceof Error ? error.message : "Failed to connect to Gemini API",
      };
    }
  }
}
