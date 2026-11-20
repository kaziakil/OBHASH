import type { DocsAccessConfig } from "@/types/docs";

/**
 * Default Configuration specified in Master Requirement:
 * Public availability: June 10 (00:00) → June 14 (23:59)
 * With instant Admin override controls.
 */
const DEFAULT_CONFIG: DocsAccessConfig = {
  isEnabled: true,
  isScheduled: true,
  scheduleStart: "2026-06-10T00:00:00.000Z",
  scheduleEnd: "2026-06-14T23:59:59.000Z",
  allowAdminBypass: true,
  adminBypassPasscode: "obhash-admin-2026",
  publishedVersion: "1.0.0-launch",
  lastUpdated: new Date().toISOString(),
  announcementBanner: "International Competition Evaluation Window: June 10 (00:00) – June 14 (23:59), 2026",
};

// In-memory runtime state for server instances
let runtimeConfig: DocsAccessConfig = { ...DEFAULT_CONFIG };

export function getDocsAccessConfig(): DocsAccessConfig {
  return { ...runtimeConfig };
}

export function updateDocsAccessConfig(updates: Partial<DocsAccessConfig>): DocsAccessConfig {
  runtimeConfig = {
    ...runtimeConfig,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  return { ...runtimeConfig };
}

export function resetDocsAccessConfigToDefault(): DocsAccessConfig {
  runtimeConfig = { ...DEFAULT_CONFIG, lastUpdated: new Date().toISOString() };
  return { ...runtimeConfig };
}

export interface AccessCheckResult {
  isAccessible: boolean;
  isAdmin: boolean;
  reason?: "disabled_by_admin" | "before_window" | "after_window" | "authorized";
  config: DocsAccessConfig;
  windowInfo?: {
    startFormatted: string;
    endFormatted: string;
    isCurrentlyActive: boolean;
  };
}

export function evaluateDocsAccess(options?: {
  isAdmin?: boolean;
  passcode?: string;
  simulatedDate?: string;
}): AccessCheckResult {
  const config = getDocsAccessConfig();
  const isAdmin =
    options?.isAdmin === true ||
    (!!options?.passcode && options.passcode.trim() === config.adminBypassPasscode);

  // Admins always have access
  if (isAdmin) {
    return {
      isAccessible: true,
      isAdmin: true,
      reason: "authorized",
      config,
    };
  }

  // 1. Check if manually disabled
  if (!config.isEnabled) {
    return {
      isAccessible: false,
      isAdmin: false,
      reason: "disabled_by_admin",
      config,
    };
  }

  // 2. Check scheduled window if scheduling is active
  if (config.isScheduled) {
    const now = options?.simulatedDate ? new Date(options.simulatedDate).getTime() : Date.now();
    const start = new Date(config.scheduleStart).getTime();
    const end = new Date(config.scheduleEnd).getTime();

    const isCurrentlyActive = now >= start && now <= end;

    const windowInfo = {
      startFormatted: new Date(config.scheduleStart).toUTCString(),
      endFormatted: new Date(config.scheduleEnd).toUTCString(),
      isCurrentlyActive,
    };

    if (now < start) {
      return {
        isAccessible: false,
        isAdmin: false,
        reason: "before_window",
        config,
        windowInfo,
      };
    }

    if (now > end) {
      return {
        isAccessible: false,
        isAdmin: false,
        reason: "after_window",
        config,
        windowInfo,
      };
    }
  }

  return {
    isAccessible: true,
    isAdmin: false,
    reason: "authorized",
    config,
  };
}
