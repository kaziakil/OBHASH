import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

/**
 * Generates a standardized successful API JSON response.
 */
export function apiSuccess<T>(data: T, status: number = 200, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message ? { message } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Generates a standardized error API JSON response.
 */
export function apiError(
  error: string,
  status: number = 500,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
