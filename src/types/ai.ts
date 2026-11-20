/**
 * AI Integration Types & Contracts
 */

export type AIProvider = "gemini" | "openai";

export type MessageRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface CompletionRequest {
  messages: ChatMessage[];
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface CompletionResponse {
  content: string;
  model: string;
  provider: AIProvider;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  durationMs: number;
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  modelName: string;
  timeoutMs: number;
}

export interface AIProviderAdapter {
  readonly provider: AIProvider;
  generateCompletion(request: CompletionRequest): Promise<CompletionResponse>;
  testConnectivity(): Promise<{ success: boolean; latencyMs: number; message: string }>;
}

export class AIServiceError extends Error {
  public readonly code: string;
  public readonly provider?: AIProvider;
  public readonly details?: unknown;

  constructor(message: string, code: string = "AI_SERVICE_ERROR", provider?: AIProvider, details?: unknown) {
    super(message);
    this.name = "AIServiceError";
    this.code = code;
    this.provider = provider;
    this.details = details;
  }
}
