import type {
  AIProvider,
  AIProviderAdapter,
  CompletionRequest,
  CompletionResponse,
} from "@/types/ai";
import { AIServiceError } from "@/types/ai";
import { getValidatedEnv } from "@/config/env";
import { logger } from "@/lib/utils/logger";
import { GeminiProviderAdapter } from "./providers/gemini";
import { OpenAIProviderAdapter } from "./providers/openai";

/**
 * Provider-Independent AI Service Module
 *
 * Encapsulates LLM interactions, enforces timeouts, standardizes error structures,
 * and maintains server-only credential security.
 */
export class AIService {
  private adapter: AIProviderAdapter | null = null;
  private readonly provider: AIProvider;
  private readonly modelName: string;
  private readonly timeoutMs: number;

  constructor() {
    const env = getValidatedEnv();
    this.provider = env.AI_PROVIDER;
    this.modelName = env.AI_MODEL_NAME;
    this.timeoutMs = env.AI_TIMEOUT_MS;

    this.initializeAdapter(env);
  }

  private initializeAdapter(env: ReturnType<typeof getValidatedEnv>) {
    try {
      if (this.provider === "gemini") {
        if (env.GEMINI_API_KEY) {
          this.adapter = new GeminiProviderAdapter(env.GEMINI_API_KEY, this.modelName, this.timeoutMs);
        }
      } else if (this.provider === "openai") {
        if (env.OPENAI_API_KEY) {
          this.adapter = new OpenAIProviderAdapter(env.OPENAI_API_KEY, this.modelName, this.timeoutMs);
        }
      }
    } catch (error) {
      logger.error("Failed to initialize AI provider adapter", error, { provider: this.provider });
    }
  }

  /**
   * Returns whether an AI adapter is initialized with valid credentials.
   */
  public isReady(): boolean {
    return this.adapter !== null;
  }

  /**
   * Returns current AI service metadata without revealing secrets.
   */
  public getStatus() {
    return {
      configured: this.isReady(),
      provider: this.provider,
      model: this.modelName,
      timeoutMs: this.timeoutMs,
    };
  }

  /**
   * Generates a text completion using the active provider adapter.
   */
  public async generateCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    if (!this.adapter) {
      throw new AIServiceError(
        `AI Service is unconfigured: missing API credentials for provider '${this.provider}'. Set ${
          this.provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"
        } in .env.local`,
        "UNCONFIGURED_PROVIDER",
        this.provider
      );
    }

    if (!request.messages || request.messages.length === 0) {
      throw new AIServiceError("Request messages cannot be empty", "INVALID_REQUEST", this.provider);
    }

    logger.info("Executing AI completion request", {
      provider: this.provider,
      model: this.modelName,
      messageCount: request.messages.length,
    });

    return this.adapter.generateCompletion(request);
  }

  /**
   * Executes a minimal connectivity verification against the configured provider.
   */
  public async testConnectivity(): Promise<{ success: boolean; latencyMs: number; message: string }> {
    if (!this.adapter) {
      return {
        success: false,
        latencyMs: 0,
        message: `AI credentials not configured for provider '${this.provider}'. Set ${
          this.provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"
        } to enable AI connectivity.`,
      };
    }

    return this.adapter.testConnectivity();
  }
}

// Export singleton instance for server-side usage
export const aiService = new AIService();
