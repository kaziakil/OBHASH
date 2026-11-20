/**
 * Standard API Response Structures
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  message?: string;
  timestamp: string;
}

export type ServiceStatus = "operational" | "configured" | "unconfigured" | "error";

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  uptimeSeconds: number;
  environment: string;
  timestamp: string;
  services: {
    nextjs: {
      status: ServiceStatus;
      version: string;
    };
    supabase: {
      status: ServiceStatus;
      configured: boolean;
      message: string;
    };
    ai: {
      status: ServiceStatus;
      configured: boolean;
      provider?: string;
      model?: string;
      message: string;
    };
  };
}
