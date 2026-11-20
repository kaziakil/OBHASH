"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  Portfolio,
  EligibleWorkItem,
} from "@/types/portfolio";
import type { AIAssistanceLevel } from "@/types/independence";
import { AI_ASSISTANCE_METADATA } from "@/lib/independence/classifier";
import {
  savePortfolioDraft,
  publishPortfolio,
  unpublishPortfolio,
  updatePublicSlug,
  addPortfolioItem,
  removePortfolioItem,
} from "@/lib/portfolio/actions";

interface Props {
  initialPortfolio: Portfolio;
  eligibleItems: EligibleWorkItem[];
}

export function PortfolioHubClient({ initialPortfolio, eligibleItems }: Props) {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "settings">("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modal for selecting eligible work
  const [showItemModal, setShowItemModal] = useState(false);
  const [targetSectionType, setTargetSectionType] = useState<string>("featured_work");

  // Slug editing
  const [slugInput, setSlugInput] = useState(portfolio.publicSlug);
  const [slugError, setSlugError] = useState<string | null>(null);

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/p/${portfolio.publicSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const saved = await savePortfolioDraft(portfolio);
      setPortfolio(saved);
      setSaveMessage("Draft saved successfully.");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      setSaveMessage("Error saving draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    setIsSaving(true);
    try {
      if (portfolio.isPublished) {
        const unpublished = await unpublishPortfolio(portfolio.userId);
        setPortfolio(unpublished);
        setSaveMessage("Portfolio unpublished and set to private.");
      } else {
        const published = await publishPortfolio(portfolio.userId, "public");
        setPortfolio(published);
        setSaveMessage("Portfolio published! It is now live at your public link.");
      }
      setTimeout(() => setSaveMessage(null), 3500);
    } catch {
      setSaveMessage("Failed to update publication status.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSlug = async () => {
    setSlugError(null);
    const res = await updatePublicSlug(portfolio.userId, slugInput);
    if (!res.success) {
      setSlugError(res.error || "Failed to update public slug");
    } else {
      setPortfolio({ ...portfolio, publicSlug: res.slug });
      setSaveMessage("Public URL updated successfully.");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleAddEligibleItem = async (eligible: EligibleWorkItem) => {
    setIsSaving(true);
    try {
      const newItem = await addPortfolioItem(portfolio.userId, targetSectionType, {
        title: eligible.title,
        description: eligible.subtitle,
        sourceType: eligible.sourceType,
        sourceRecordId: eligible.sourceRecordId,
        capabilityKey: eligible.capabilityKey,
        dimensions: eligible.dimensions,
        userReflection: eligible.reflectionText,
        aiAssistanceLevel: eligible.aiAssistanceLevel,
        aiAssistanceDisclosure: eligible.aiAssistanceSummary,
        artifacts: [
          {
            title: "Summary Deliverable",
            type: "text",
            content: eligible.userContent,
          },
        ],
        orderIndex: 10,
        isFeatured: true,
      });

      // Update local state
      const updatedSections = portfolio.sections.map((sec) => {
        if (sec.sectionType === targetSectionType) {
          return { ...sec, items: [...sec.items, newItem] };
        }
        return sec;
      });
      setPortfolio({ ...portfolio, sections: updatedSections });
      setShowItemModal(false);
      setSaveMessage(`Added "${eligible.title}" to portfolio.`);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      setSaveMessage("Failed to add item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsSaving(true);
    try {
      await removePortfolioItem(portfolio.userId, itemId);
      const updatedSections = portfolio.sections.map((sec) => ({
        ...sec,
        items: sec.items.filter((it) => it.id !== itemId),
      }));
      setPortfolio({ ...portfolio, sections: updatedSections });
      setSaveMessage("Item removed from portfolio.");
      setTimeout(() => setSaveMessage(null), 2500);
    } catch {
      setSaveMessage("Failed to remove item.");
    } finally {
      setIsSaving(false);
    }
  };

  const getAIBadge = (level: AIAssistanceLevel) => {
    const meta = AI_ASSISTANCE_METADATA[level];
    const colors: Record<AIAssistanceLevel, string> = {
      "Level A": "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
      "Level B": "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800",
      "Level C": "bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
      "Level D": "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
      "Level E": "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${colors[level]}`}>
        {level} • {meta.name}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Publication Status Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                portfolio.isPublished
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {portfolio.isPublished ? `Live • ${portfolio.visibility.toUpperCase()}` : "Private Draft"}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              /p/{portfolio.publicSlug}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-50">
            Personal Growth Portfolio
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
            Curate and share authentic evidence of your human capabilities, independent problem-solving projects, and thoughtful AI collaboration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {portfolio.isPublished && (
            <>
              <button
                onClick={handleCopyLink}
                className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5"
              >
                {copiedLink ? "✓ Copied Link!" : "📋 Copy Public Link"}
              </button>
              <Link
                href={`/p/${portfolio.publicSlug}`}
                target="_blank"
                className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
              >
                View Public Page ↗
              </Link>
            </>
          )}

          <button
            onClick={handleTogglePublish}
            disabled={isSaving}
            className={`text-xs font-semibold px-4 py-2 rounded-lg text-white shadow-sm transition-all ${
              portfolio.isPublished
                ? "bg-amber-600 hover:bg-amber-500"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {portfolio.isPublished ? "Unpublish (Make Private)" : "Publish Portfolio"}
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-200 font-medium">
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-sm font-medium gap-8">
        <button
          onClick={() => setActiveTab("editor")}
          className={`pb-3 font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "editor"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Curate & Edit Portfolio
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`pb-3 font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "preview"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Live Preview
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 font-semibold transition-colors border-b-2 -mb-px ${
            activeTab === "settings"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Sharing & Privacy Settings
        </button>
      </div>

      {/* Tab 1: Editor View */}
      {activeTab === "editor" && (
        <div className="space-y-8">
          {/* Card: Author Profile & Philosophy */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>Section 1: Personal Introduction & Philosophy</span>
              <span className="text-xs text-zinc-400 font-normal">Controls how you introduce yourself</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={portfolio.displayName}
                  onChange={(e) => setPortfolio({ ...portfolio, displayName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={portfolio.headline || ""}
                  onChange={(e) => setPortfolio({ ...portfolio, headline: e.target.value })}
                  placeholder="e.g. Systems Thinker & Human-Centered Problem Solver"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                Personal Bio & Introduction
              </label>
              <textarea
                rows={3}
                value={portfolio.personalIntroduction || ""}
                onChange={(e) => setPortfolio({ ...portfolio, personalIntroduction: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                Learning Philosophy & AI Engagement Stance
              </label>
              <textarea
                rows={3}
                value={portfolio.learningPhilosophy || ""}
                onChange={(e) => setPortfolio({ ...portfolio, learningPhilosophy: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                {isSaving ? "Saving..." : "Save Bio Changes"}
              </button>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-6">
            {portfolio.sections
              .filter((sec) => sec.sectionType !== "personal_intro")
              .map((section) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{section.title}</h3>
                      <p className="text-xs text-zinc-500">{section.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTargetSectionType(section.sectionType);
                          setShowItemModal(true);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors flex items-center gap-1"
                      >
                        + Add Evidence from Work
                      </button>
                    </div>
                  </div>

                  {section.items.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-2">
                      <p className="text-xs text-zinc-500">No items featured in this section yet.</p>
                      <button
                        onClick={() => {
                          setTargetSectionType(section.sectionType);
                          setShowItemModal(true);
                        }}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Pick from completed challenges, assessments, or reflections
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                                {getAIBadge(item.aiAssistanceLevel)}
                              </div>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 px-2.5 py-1 rounded border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition-colors"
                            >
                              Remove
                            </button>
                          </div>

                          {item.aiAssistanceDisclosure && (
                            <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] space-y-0.5">
                              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">
                                AI Collaboration Disclosure:
                              </span>
                              <p className="text-zinc-700 dark:text-zinc-300">{item.aiAssistanceDisclosure}</p>
                            </div>
                          )}

                          {item.userReflection && (
                            <div className="p-2.5 rounded bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-[11px] space-y-0.5">
                              <span className="font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                                Personal Reflection:
                              </span>
                              <p className="text-indigo-950 dark:text-indigo-200 italic">&ldquo;{item.userReflection}&rdquo;</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 2: Live Preview */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              This preview matches exactly how your portfolio renders for visitors at <strong>/p/{portfolio.publicSlug}</strong>.
            </span>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
            >
              Print / Save PDF
            </button>
          </div>

          {/* Actual Public Layout Preview */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-12 space-y-12 shadow-sm max-w-4xl mx-auto">
            {/* Header / Intro */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  OBHASH Human Capability Portfolio
                </span>
                <span className="text-xs text-zinc-400 font-mono">• Verified Work</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {portfolio.displayName}
              </h1>
              {portfolio.headline && (
                <p className="text-base text-indigo-700 dark:text-indigo-300 font-semibold">
                  {portfolio.headline}
                </p>
              )}
              {portfolio.personalIntroduction && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  {portfolio.personalIntroduction}
                </p>
              )}

              {portfolio.learningPhilosophy && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Learning Philosophy & AI Ethics
                  </span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                    &ldquo;{portfolio.learningPhilosophy}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Rendered Sections */}
            {portfolio.sections
              .filter((sec) => sec.isVisible && sec.sectionType !== "personal_intro" && sec.items.length > 0)
              .map((section) => (
                <div key={section.id} className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{section.title}</h2>
                    <p className="text-xs text-zinc-500">{section.subtitle}</p>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                          {getAIBadge(item.aiAssistanceLevel)}
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>

                        {item.aiAssistanceDisclosure && (
                          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              AI Assistance Disclosure:
                            </span>
                            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                              {item.aiAssistanceDisclosure}
                            </p>
                          </div>
                        )}

                        {item.userReflection && (
                          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-[11px] space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              Metacognitive Reflection:
                            </span>
                            <p className="text-indigo-950 dark:text-indigo-200 italic leading-relaxed">
                              &ldquo;{item.userReflection}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Settings & Privacy */}
      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Custom Public URL
            </h2>
            <p className="text-xs text-zinc-500">
              Configure your secure, memorable public showcase address.
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">/p/</span>
              <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 font-mono"
              />
              <button
                onClick={handleSaveSlug}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Save Slug
              </button>
            </div>
            {slugError && <p className="text-xs text-red-600">{slugError}</p>}
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Privacy & Showcase Visibility
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={portfolio.visibility === "public"}
                  onChange={() => setPortfolio({ ...portfolio, visibility: "public" })}
                  className="rounded-full text-indigo-600"
                />
                <div>
                  <span className="font-bold block">Public</span>
                  <span className="text-zinc-400">Anyone with the link can view your portfolio showcase.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={portfolio.visibility === "unlisted"}
                  onChange={() => setPortfolio({ ...portfolio, visibility: "unlisted" })}
                  className="rounded-full text-indigo-600"
                />
                <div>
                  <span className="font-bold block">Unlisted</span>
                  <span className="text-zinc-400">Visible only to people who have the exact direct link.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={portfolio.visibility === "private"}
                  onChange={() => setPortfolio({ ...portfolio, visibility: "private" })}
                  className="rounded-full text-indigo-600"
                />
                <div>
                  <span className="font-bold block">Private</span>
                  <span className="text-zinc-400">Completely hidden from public access. Only you can view it.</span>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Update Visibility
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Pick Eligible Work to Feature */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Select Evidence to Feature
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Choose authentic challenge submissions, assessments, or reflections to add to this section.
                </p>
              </div>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {eligibleItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 space-y-2 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{item.title}</span>
                        {getAIBadge(item.aiAssistanceLevel)}
                      </div>
                      <p className="text-[11px] text-zinc-500">{item.subtitle}</p>
                    </div>

                    <button
                      onClick={() => handleAddEligibleItem(item)}
                      disabled={isSaving}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex-shrink-0"
                    >
                      + Add to Portfolio
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.userContent}
                  </p>

                  {item.reflectionText && (
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300 italic">
                      Reflection: &ldquo;{item.reflectionText}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowItemModal(false)}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
