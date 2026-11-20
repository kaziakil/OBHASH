import { NextResponse } from "next/server";
import {
  evaluateDocsAccess,
  getDocsAccessConfig,
  updateDocsAccessConfig,
  resetDocsAccessConfigToDefault,
} from "@/lib/docs/access-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passcode = searchParams.get("passcode") || undefined;
  const simulatedDate = searchParams.get("simulatedDate") || undefined;

  const result = evaluateDocsAccess({ passcode, simulatedDate });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, passcode, updates } = body;

    const currentConfig = getDocsAccessConfig();

    // Verify admin passcode
    if (!passcode || passcode !== currentConfig.adminBypassPasscode) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid admin passcode." },
        { status: 401 }
      );
    }

    if (action === "reset") {
      const resetConfig = resetDocsAccessConfigToDefault();
      return NextResponse.json({
        success: true,
        message: "Docs access configuration reset to default (June 10 – June 14, 2026).",
        config: resetConfig,
      });
    }

    if (action === "instant_publish") {
      const updated = updateDocsAccessConfig({
        isEnabled: true,
        isScheduled: false,
      });
      return NextResponse.json({
        success: true,
        message: "Instant Live Override Activated: /docs is now publicly accessible.",
        config: updated,
      });
    }

    if (action === "instant_disable") {
      const updated = updateDocsAccessConfig({
        isEnabled: false,
      });
      return NextResponse.json({
        success: true,
        message: "Instant Disable Activated: /docs is now restricted.",
        config: updated,
      });
    }

    if (action === "update" && updates) {
      const updated = updateDocsAccessConfig(updates);
      return NextResponse.json({
        success: true,
        message: "Docs configuration updated successfully.",
        config: updated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
