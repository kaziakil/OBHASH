"use client";

import React, { useState } from "react";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsRestrictedView } from "@/components/docs/DocsRestrictedView";
import { AdminControlPanel } from "@/components/docs/AdminControlPanel";
import { ProductView } from "@/components/docs/v2/ProductView";
import { EngineeringView } from "@/components/docs/v2/EngineeringView";
import { RoadmapView } from "@/components/docs/v2/RoadmapView";
import { TransparencyView } from "@/components/docs/v2/TransparencyView";
import {
  evaluateDocsAccess,
  getDocsAccessConfig,
  updateDocsAccessConfig,
  resetDocsAccessConfigToDefault,
} from "@/lib/docs/access-store";
import {
  V2_APPLICATIONS,
  V2_SHARED_ENGINES,
  V2_ROADMAP_STAGES,
  V2_TEAM_MEMBERS,
  V2_DOCUMENTATION_SECTIONS,
  V2_IMPLEMENTATION_INVENTORY,
  getV2LiveSystemMetrics,
} from "@/lib/docs/v2-content";
import type { DocsTabMode, DocsAccessConfig } from "@/types/docs";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<DocsTabMode>("product");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [config, setConfig] = useState<DocsAccessConfig>(() => getDocsAccessConfig());
  const [accessResult, setAccessResult] = useState(() => evaluateDocsAccess());

  const handleAuthorizeAdmin = (passcode: string) => {
    const res = evaluateDocsAccess({ passcode });
    if (res.isAdmin) {
      setIsAdminAuthorized(true);
      setAccessResult(res);
    }
  };

  const handleInstantBypass = () => {
    setIsAdminAuthorized(true);
    setAccessResult({
      isAccessible: true,
      isAdmin: true,
      reason: "authorized",
      config,
    });
  };

  const handleUpdateConfig = (updates: Partial<DocsAccessConfig>) => {
    const updated = updateDocsAccessConfig(updates);
    setConfig(updated);
    const res = evaluateDocsAccess({ isAdmin: isAdminAuthorized });
    setAccessResult(res);
  };

  const handleResetToDefault = () => {
    const reset = resetDocsAccessConfigToDefault();
    setConfig(reset);
    const res = evaluateDocsAccess({ isAdmin: isAdminAuthorized });
    setAccessResult(res);
  };

  const handleExportMarkdown = () => {
    const metrics = getV2LiveSystemMetrics();
    let md = `# OBHASH Documentation & Transparency Whitepaper (v2.0.0)\n\n`;
    md += `**Document:** Official OBHASH v2.0.0 Ecosystem Specification & Technical Whitepaper\n`;
    md += `**Core Philosophy:** Human-Centered Intelligence ("Become more capable. Not more dependent.")\n`;
    md += `**Team:** PastForward (Kazi, Elena Rostova, Marcus Vance, Aria Chen)\n`;
    md += `**Published Version:** ${config.publishedVersion}\n`;
    md += `**Export Generated (UTC):** ${new Date().toUTCString()}\n`;
    md += `**Repository Status:** ${metrics.status.toUpperCase()} (${metrics.passingTestsCount}/${metrics.totalTestsCount} Passing Tests)\n\n`;
    md += `---\n\n`;

    md += `## 1. EXECUTIVE VISION & ECOSYSTEM OVERVIEW\n\n`;
    md += `OBHASH is an AI-powered human capability development platform. Rather than replacing human thinking or automating cognitive tasks, OBHASH uses guided inquiry, diagnostic challenges, structured reflection, and unassisted performance measurement to build genuine human autonomy.\n\n`;
    md += `### Architectural Pillars\n`;
    md += `- **One Integrated Platform:** A single sign-on capability ecosystem.\n`;
    md += `- **Five Applications (APP-01 to APP-05):** Engineered simultaneously sharing common foundational modules.\n`;
    md += `- **Six Shared Core Engines (ENG-01 to ENG-06):** Reusable intelligence, assessment, and analytics infrastructure.\n`;
    md += `- **Governed Master Roadmap:** 8 stages and 25 phases with verifiable approval gates.\n\n`;
    md += `---\n\n`;

    md += `## 2. TEAM PASTFORWARD\n\n`;
    V2_TEAM_MEMBERS.forEach((m) => {
      md += `### ${m.name} — ${m.role} (${m.title})\n`;
      md += `- **Email:** ${m.email}\n`;
      md += `- **Bio:** ${m.bio}\n`;
      md += `- **Responsibilities:** ${(m.responsibilities || []).join(", ")}\n`;
      md += `- **Core Contributions:**\n`;
      m.contributions.forEach((c) => (md += `  - ${c}\n`));
      md += `\n`;
    });
    md += `---\n\n`;

    md += `## 3. THE FIVE OBHASH APPLICATIONS (SIMULTANEOUS SUITE)\n\n`;
    V2_APPLICATIONS.forEach((app) => {
      md += `### [${app.code}] ${app.name}\n`;
      md += `*${app.tagline}*\n\n`;
      md += `- **Target Audience:** ${app.targetUsers}\n`;
      md += `- **Implementation Status:** ${app.implementationStatus}\n`;
      md += `- **Overview:** ${app.overview}\n`;
      md += `- **Purpose:** ${app.purpose}\n\n`;
      md += `#### Core Features\n`;
      app.coreFeatures.forEach((f) => {
        md += `- **${f.name}** [${f.status}]: ${f.description}\n`;
      });
      md += `\n#### Capability Dimensions\n`;
      app.capabilityFramework.forEach((cf) => {
        md += `- **${cf.dimension}:** ${cf.description} (Competencies: ${cf.competencies.join(", ")})\n`;
      });
      md += `\n#### Validated User Journeys\n`;
      app.userJourneys.forEach((uj) => {
        md += `- **${uj.persona}:** ${uj.journey} → *Outcome: ${uj.outcome}*\n`;
      });
      md += `\n---\n\n`;
    });

    md += `## 4. THE SIX SHARED CORE ENGINES\n\n`;
    V2_SHARED_ENGINES.forEach((eng) => {
      md += `### [${eng.code}] ${eng.name}\n`;
      md += `*${eng.tagline}*\n\n`;
      md += `- **Purpose:** ${eng.purpose}\n`;
      md += `- **Status:** ${eng.implementationStatus}\n\n`;
      md += `#### Internal Components\n`;
      eng.internalComponents.forEach((c) => {
        md += `- **${c.name}:** ${c.responsibility}\n`;
      });
      md += `\n#### Application Level Utilization\n`;
      eng.applicationLevelUtilization.forEach((au) => {
        md += `- **${au.appName}:** ${au.usage}\n`;
      });
      md += `\n---\n\n`;
    });

    md += `## 5. MASTER DEVELOPMENT ROADMAP (8 STAGES, 25 PHASES)\n\n`;
    md += `> **Simultaneous Multi-App Development:** All 5 applications advance together across all phases.\n\n`;
    V2_ROADMAP_STAGES.forEach((stage) => {
      md += `### STAGE 0${stage.stageNumber}: ${stage.stageName}\n`;
      md += `*${stage.description}*\n\n`;
      stage.phases.forEach((p) => {
        md += `#### [${p.phaseCode}] ${p.title} (${p.status})\n`;
        md += `- **Focus:** ${p.focus}\n`;
        md += `- **Simultaneous Scope:** ${p.simultaneousAppScope}\n`;
        md += `- **Approval Gate:** ${p.approvalGate}\n`;
        md += `- **Deliverables:** ${p.deliverables.join("; ")}\n\n`;
      });
      md += `---\n\n`;
    });

    md += `## 6. TECHNICAL SPECIFICATIONS (SECTIONS A THROUGH Q)\n\n`;
    V2_DOCUMENTATION_SECTIONS.forEach((sec) => {
      md += `### Section ${sec.code}: ${sec.title}\n`;
      md += `*Category: ${sec.category} | Target Audience: ${sec.targetAudience}*\n\n`;
      md += `> ${sec.summary}\n\n`;
      sec.content.forEach((paragraph) => {
        md += `${paragraph}\n\n`;
      });
      if (sec.subsections) {
        sec.subsections.forEach((sub) => {
          md += `#### ${sub.title}\n\n`;
          sub.content.forEach((sp) => (md += `${sp}\n\n`));
          if (sub.codeSnippet) {
            md += `\`\`\`typescript\n${sub.codeSnippet}\n\`\`\`\n\n`;
          }
        });
      }
      md += `---\n\n`;
    });

    md += `## 7. IMPLEMENTATION INVENTORY & AUDIT LOGS\n\n`;
    md += `| Component | Type | Status | Version | Source File |\n`;
    md += `|---|---|---|---|---|\n`;
    V2_IMPLEMENTATION_INVENTORY.forEach((inv) => {
      md += `| ${inv.name} | ${inv.type} | ${inv.status} | ${inv.version} | \`${inv.source}\` |\n`;
    });
    md += `\n`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OBHASH_v2.0.0_Documentation_Whitepaper.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // If outside access window and not authorized as admin, display restricted state
  if (!accessResult.isAccessible && !isAdminAuthorized) {
    return (
      <div className="flex-1 bg-[#F7F7FA] dark:bg-[#0E0D14]">
        <DocsRestrictedView
          config={config}
          reason={accessResult.reason}
          onAuthorizeAdmin={handleAuthorizeAdmin}
          onInstantBypass={handleInstantBypass}
        />
      </div>
    );
  }

  // Normalize legacy tab names
  const normalizedTab =
    activeTab === "pitch"
      ? "product"
      : activeTab === "technical"
      ? "engineering"
      : activeTab === "live-system"
      ? "transparency"
      : activeTab;

  return (
    <div className="flex-1 flex flex-col bg-[#F7F7FA] dark:bg-[#0E0D14] transition-colors">
      {/* Sticky Header with Mode Switcher & Search */}
      <DocsHeader
        activeTab={normalizedTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        config={config}
        onOpenAdmin={() => setAdminPanelOpen(true)}
        onExportMarkdown={handleExportMarkdown}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {normalizedTab === "product" && (
          <ProductView
            searchQuery={searchQuery}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}
        {normalizedTab === "engineering" && (
          <EngineeringView searchQuery={searchQuery} />
        )}
        {normalizedTab === "roadmap" && (
          <RoadmapView searchQuery={searchQuery} />
        )}
        {normalizedTab === "transparency" && (
          <TransparencyView searchQuery={searchQuery} />
        )}
      </main>

      {/* Admin Control Drawer / Modal */}
      <AdminControlPanel
        config={config}
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        onUpdateConfig={handleUpdateConfig}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
