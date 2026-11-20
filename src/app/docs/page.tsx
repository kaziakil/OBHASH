"use client";

import React, { useState } from "react";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsRestrictedView } from "@/components/docs/DocsRestrictedView";
import { AdminControlPanel } from "@/components/docs/AdminControlPanel";
import { PitchDeckView } from "@/components/docs/PitchDeckView";
import { TechnicalDocView } from "@/components/docs/TechnicalDocView";
import { LiveSystemView } from "@/components/docs/LiveSystemView";
import {
  evaluateDocsAccess,
  getDocsAccessConfig,
  updateDocsAccessConfig,
  resetDocsAccessConfigToDefault,
} from "@/lib/docs/access-store";
import { PITCH_DECK_SLIDES, TECHNICAL_DOC_SECTIONS, TEAM_MEMBERS } from "@/lib/docs/content";
import type { DocsTabMode, DocsAccessConfig } from "@/types/docs";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<DocsTabMode>("pitch");
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
    let md = `# OBHASH — Master Documentation & YC Pitch Deck\n`;
    md += `**Team:** PastForward\n**Philosophy:** Human-Centered Intelligence ("Become more capable. Not more dependent.")\n**Version:** ${config.publishedVersion}\n**Export Date:** ${new Date().toUTCString()}\n\n---\n\n`;

    md += `## PART 1: Y COMBINATOR–STYLE PITCH DECK\n\n`;
    PITCH_DECK_SLIDES.forEach((slide) => {
      md += `### Slide ${slide.order}: ${slide.title}\n`;
      md += `*${slide.tagline}*\n\n`;
      md += `${slide.content.lead}\n\n`;
      slide.content.points.forEach((p) => {
        md += `- **${p.headline}:** ${p.description} ${p.metric ? `[${p.metric}]` : ""}\n`;
      });
      if (slide.content.callout) {
        md += `\n> ${slide.content.callout}\n`;
      }
      md += `\n---\n\n`;
    });

    md += `### Team PastForward\n\n`;
    TEAM_MEMBERS.forEach((m) => {
      md += `- **${m.name}** (${m.role}) — ${m.email}\n  *${m.bio}*\n`;
    });
    md += `\n---\n\n`;

    md += `## PART 2: TECHNICAL SPECIFICATION & ARCHITECTURE\n\n`;
    TECHNICAL_DOC_SECTIONS.forEach((sec) => {
      md += `### Section ${sec.code}: ${sec.title}\n`;
      md += `*Category: ${sec.category}*\n\n`;
      md += `> ${sec.summary}\n\n`;
      sec.body.forEach((b) => {
        md += `- ${b}\n`;
      });
      if (sec.codeSnippet) {
        md += `\n\`\`\`text\n${sec.codeSnippet}\n\`\`\`\n`;
      }
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OBHASH_Documentation_PitchDeck_${new Date().toISOString().slice(0, 10)}.md`;
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

  return (
    <div className="flex-1 flex flex-col bg-[#F7F7FA] dark:bg-[#0E0D14] transition-colors">
      {/* Sticky Header with Mode Switcher & Search */}
      <DocsHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        config={config}
        onOpenAdmin={() => setAdminPanelOpen(true)}
        onExportMarkdown={handleExportMarkdown}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {activeTab === "pitch" && <PitchDeckView searchQuery={searchQuery} />}
        {activeTab === "technical" && <TechnicalDocView searchQuery={searchQuery} />}
        {activeTab === "live-system" && <LiveSystemView />}
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
