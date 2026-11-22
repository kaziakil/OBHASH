import type { DocsAccessConfig, DocsVersionRecord } from "@/types/docs";

/**
 * OBHASH v2.0.0 Documentation Access & Publishing Configuration
 * Implements administrative visibility toggling, draft/published lifecycle,
 * version history snapshots, rollback capabilities, and role-based access.
 */
const INITIAL_VERSION_HISTORY: DocsVersionRecord[] = [
  {
    versionId: "ver-v2-0-0",
    versionName: "v2.0.0",
    releaseDate: "2026-11-22T00:00:00.000Z",
    publishState: "published",
    author: "Kazi (Lead Architect)",
    notes: "Official OBHASH v2.0.0 ecosystem release: 5 applications, 6 shared engines, 8 stages, 25 phases, 10 interactive SVG diagrams.",
    isCurrent: true,
  },
  {
    versionId: "ver-v1-9-0-rc1",
    versionName: "v1.9.0-rc1",
    releaseDate: "2026-11-20T18:00:00.000Z",
    publishState: "archived",
    author: "Elena Rostova (Lead AI Systems)",
    notes: "Release Candidate 1: Integration of Socratic prompt architecture and multi-app co-design preview.",
    isCurrent: false,
  },
  {
    versionId: "ver-v1-0-0",
    versionName: "v1.0.0",
    releaseDate: "2026-11-15T12:00:00.000Z",
    publishState: "archived",
    author: "PastForward Team",
    notes: "Initial launch prototype specification and YC pitch deck.",
    isCurrent: false,
  },
];

const DEFAULT_CONFIG: DocsAccessConfig = {
  isEnabled: true,
  publishState: "published", // "published" | "draft" | "archived"
  isScheduled: false, // Default: Immediate Live Access enabled unless admin explicitly schedules
  scheduleStart: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  scheduleEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  timezone: "UTC",
  allowAdminBypass: true,
  adminBypassPasscode: "obhash-admin-2026",
  superAdminPasscode: "obhash-superadmin-2026",
  publishedVersion: "v2.0.0",
  versionHistory: INITIAL_VERSION_HISTORY,
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
    changes: { publishedVersion: "v2.0.0", publishState: "published" },
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
    versionHistory: [...INITIAL_VERSION_HISTORY],
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

/**
 * Creates a new version snapshot in the version history stack
 */
export function createNewVersionSnapshot(
  versionName: string,
  notes: string,
  publishState: "published" | "draft" | "archived" = "published",
  actor = "Admin"
): DocsAccessConfig {
  const newVersion: DocsVersionRecord = {
    versionId: `ver-${versionName.replace(/\./g, "-")}-${Date.now().toString(36)}`,
    versionName,
    releaseDate: new Date().toISOString(),
    publishState,
    author: actor,
    notes,
    isCurrent: publishState === "published",
  };

  const updatedHistory = runtimeConfig.versionHistory.map((v) => ({
    ...v,
    isCurrent: publishState === "published" ? false : v.isCurrent,
  }));

  updatedHistory.unshift(newVersion);

  return updateDocsAccessConfig(
    {
      publishedVersion: publishState === "published" ? versionName : runtimeConfig.publishedVersion,
      publishState,
      versionHistory: updatedHistory,
    },
    actor
  );
}

/**
 * Rolls back configuration and published version to a historical snapshot
 */
export function rollbackToVersion(versionId: string, actor = "Admin"): DocsAccessConfig {
  const target = runtimeConfig.versionHistory.find((v) => v.versionId === versionId);
  if (!target) {
    throw new Error(`Version ID ${versionId} not found in history`);
  }

  const updatedHistory = runtimeConfig.versionHistory.map((v) => ({
    ...v,
    isCurrent: v.versionId === versionId,
  }));

  const updated = updateDocsAccessConfig(
    {
      publishedVersion: target.versionName,
      publishState: target.publishState,
      versionHistory: updatedHistory,
    },
    `${actor} (Rollback to ${target.versionName})`
  );

  auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: "ROLLBACK_VERSION",
    actor,
    changes: {
      publishedVersion: target.versionName,
      publishState: target.publishState,
    },
  });

  return updated;
}

export interface AccessCheckResult {
  isAccessible: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  reason?: "disabled_by_admin" | "draft_mode" | "before_window" | "after_window" | "invalid_config" | "authorized";
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
  isSuperAdmin?: boolean;
  passcode?: string;
  simulatedDate?: string;
}): AccessCheckResult {
  const config = getDocsAccessConfig();
  const trimmedPass = options?.passcode?.trim() || "";

  const isSuperAdmin =
    options?.isSuperAdmin === true ||
    (!!trimmedPass && trimmedPass === config.superAdminPasscode);

  const isAdmin =
    isSuperAdmin ||
    options?.isAdmin === true ||
    (!!trimmedPass && trimmedPass === config.adminBypassPasscode);

  // Admins & Super Admins always have access
  if (isAdmin) {
    return {
      isAccessible: true,
      isAdmin: true,
      isSuperAdmin,
      reason: "authorized",
      config,
    };
  }

  // 1. Check if manually disabled
  if (!config.isEnabled) {
    return {
      isAccessible: false,
      isAdmin: false,
      isSuperAdmin: false,
      reason: "disabled_by_admin",
      config,
    };
  }

  // 2. Check draft state (Draft requires admin sign-in)
  if (config.publishState === "draft") {
    return {
      isAccessible: false,
      isAdmin: false,
      isSuperAdmin: false,
      reason: "draft_mode",
      config,
    };
  }

  // 3. Validate configuration dates if scheduled
  if (config.isScheduled) {
    if (!config.scheduleStart || !config.scheduleEnd) {
      return {
        isAccessible: false,
        isAdmin: false,
        isSuperAdmin: false,
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
        isSuperAdmin: false,
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
        isSuperAdmin: false,
        reason: "before_window",
        config,
        windowInfo,
      };
    }

    if (now > end) {
      return {
        isAccessible: false,
        isAdmin: false,
        isSuperAdmin: false,
        reason: "after_window",
        config,
        windowInfo,
      };
    }
  }

  return {
    isAccessible: true,
    isAdmin: false,
    isSuperAdmin: false,
    reason: "authorized",
    config,
  };
}
