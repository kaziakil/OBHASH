import type {
  AIProviderAdapter,
  CompletionRequest,
  CompletionResponse,
} from "@/types/ai";
import { AIServiceError } from "@/types/ai";
import { logger } from "@/lib/utils/logger";

export class OpenAIProviderAdapter implements AIProviderAdapter {
  readonly provider = "openai" as const;
  private readonly apiKey: string;
  private readonly modelName: string;
  private readonly defaultTimeoutMs: number;
  private readonly baseUrl: string;

  constructor(
    apiKey: string,
    modelName: string = "gpt-4o-mini",
    defaultTimeoutMs: number = 30000,
    baseUrl: string = "https://api.openai.com/v1"
  ) {
    if (!apiKey) {
      throw new AIServiceError("OpenAI API key is required", "CONFIG_ERROR", "openai");
    }
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.defaultTimeoutMs = defaultTimeoutMs;
    this.baseUrl = baseUrl;
  }

  async generateCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const startTime = Date.now();
    const timeoutMs = request.timeoutMs ?? this.defaultTimeoutMs;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const formattedMessages = [
        ...(request.systemInstruction
          ? [{ role: "system", content: request.systemInstruction }]
          : []),
        ...request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: formattedMessages,
          temperature: request.temperature,
          max_tokens: request.maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AIServiceError(
          `OpenAI API request failed: ${response.status} ${response.statusText}`,
          "HTTP_ERROR",
          "openai",
          errorData
        );
      }

      const data = await response.json();
      const durationMs = Date.now() - startTime;
      const content = data.choices?.[0]?.message?.content ?? "";

      return {
        content,
        model: data.model ?? this.modelName,
        provider: "openai",
        usage: {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
        },
        durationMs,
      };
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const durationMs = Date.now() - startTime;

      if (error instanceof Error && error.name === "AbortError") {
        throw new AIServiceError(
          `Request timed out after ${timeoutMs}ms`,
          "TIMEOUT_ERROR",
          "openai"
        );
      }

      logger.error("OpenAI completion error", error, { durationMs, model: this.modelName });

      if (error instanceof AIServiceError) {
        throw error;
      }

      throw new AIServiceError(
        error instanceof Error ? error.message : "Unknown OpenAI error",
        "PROVIDER_ERROR",
        "openai",
        error
      );
    }
  }

  async testConnectivity(): Promise<{ success: boolean; latencyMs: number; message: string }> {
    const startTime = Date.now();
    try {
      const result = await this.generateCompletion({
        messages: [{ role: "user", content: "Ping: Respond with 'PONG'." }],
        maxTokens: 5,
        timeoutMs: 10000,
      });
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        latencyMs,
        message: `OpenAI connectivity verified (${result.model}) in ${latencyMs}ms. Response: ${result.content.trim()}`,
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        latencyMs,
        message: error instanceof Error ? error.message : "Failed to connect to OpenAI API",
      };
    }
  }
}
