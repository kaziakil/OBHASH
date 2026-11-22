import type { DocsAccessConfig } from "@/types/docs";

/**
 * OBHASH v2.0.0 Documentation Access & Publishing Configuration
 * Implements administrative visibility toggling, time-gated scheduling with explicit timezones,
 * and instant override controls.
 */
const DEFAULT_CONFIG: DocsAccessConfig = {
  isEnabled: true,
  isScheduled: false, // Default: Immediate Live Access enabled unless admin explicitly schedules
  scheduleStart: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  scheduleEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  timezone: "UTC",
  allowAdminBypass: true,
  adminBypassPasscode: "obhash-admin-2026",
  publishedVersion: "v2.0.0",
  lastUpdated: new Date().toISOString(),
  announcementBanner: "OBHASH v2.0.0 Official Architecture & Technical Documentation Portal",
};

// In-memory runtime persistence
let runtimeConfig: DocsAccessConfig = { ...DEFAULT_CONFIG };

// Audit log of administrative changes
export interface DocsAuditLogEntry {
  timestamp: string;
  action: string;
  actor: string;
  changes: Partial<DocsAccessConfig>;
}

const auditLogs: DocsAuditLogEntry[] = [
  {
    timestamp: new Date().toISOString(),
    action: "INITIALIZE_V2_CONFIG",
    actor: "System",
    changes: { publishedVersion: "v2.0.0" },
  },
];

export function getDocsAccessConfig(): DocsAccessConfig {
  return { ...runtimeConfig };
}

export function getDocsAuditLogs(): DocsAuditLogEntry[] {
  return [...auditLogs];
}

export function updateDocsAccessConfig(
  updates: Partial<DocsAccessConfig>,
  actor = "Admin"
): DocsAccessConfig {
  runtimeConfig = {
    ...runtimeConfig,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: "UPDATE_CONFIG",
    actor,
    changes: updates,
  });

  return { ...runtimeConfig };
}

export function resetDocsAccessConfigToDefault(actor = "Admin"): DocsAccessConfig {
  runtimeConfig = {
    ...DEFAULT_CONFIG,
    lastUpdated: new Date().toISOString(),
  };

  auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: "RESET_TO_DEFAULT",
    actor,
    changes: DEFAULT_CONFIG,
  });

  return { ...runtimeConfig };
}

export interface AccessCheckResult {
  isAccessible: boolean;
  isAdmin: boolean;
  reason?: "disabled_by_admin" | "before_window" | "after_window" | "invalid_config" | "authorized";
  config: DocsAccessConfig;
  windowInfo?: {
    startFormatted: string;
    endFormatted: string;
    timezone: string;
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

  // 2. Validate configuration dates
  if (config.isScheduled) {
    if (!config.scheduleStart || !config.scheduleEnd) {
      return {
        isAccessible: false,
        isAdmin: false,
        reason: "invalid_config",
        config,
      };
    }

    const now = options?.simulatedDate ? new Date(options.simulatedDate).getTime() : Date.now();
    const start = new Date(config.scheduleStart).getTime();
    const end = new Date(config.scheduleEnd).getTime();

    if (isNaN(start) || isNaN(end) || start >= end) {
      return {
        isAccessible: false,
        isAdmin: false,
        reason: "invalid_config",
        config,
      };
    }

    const isCurrentlyActive = now >= start && now <= end;

    const windowInfo = {
      startFormatted: new Date(config.scheduleStart).toUTCString(),
      endFormatted: new Date(config.scheduleEnd).toUTCString(),
      timezone: config.timezone || "UTC",
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
