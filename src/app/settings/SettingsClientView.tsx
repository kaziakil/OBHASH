"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { updateProfileSettingsAction, signOutAction } from "@/lib/auth/actions";
import { dictionaries } from "@/lib/i18n/dictionary";

interface SettingsClientViewProps {
  initialProfile: {
    displayName: string;
    email: string;
    bio: string;
    interests: string[];
    growthIntentions: string[];
    preferredLanguage: string;
    createdAt: string;
  };
  isSupabaseConfigured: boolean;
}

const INTEREST_OPTIONS = [
  { id: "technology", label: "Technology & Computing" },
  { id: "science", label: "Science & Nature" },
  { id: "arts", label: "Arts & Creative Expression" },
  { id: "entrepreneurship", label: "Entrepreneurship & Innovation" },
  { id: "society", label: "Society & Culture" },
  { id: "education", label: "Education & Learning" },
  { id: "environment", label: "Environment & Sustainability" },
  { id: "personal-development", label: "Personal Development & Philosophy" },
  { id: "other", label: "Other Explorations" },
];

const INTENTION_OPTIONS = [
  { id: "critical-thinking", label: "Thinking more critically" },
  { id: "creative-problem-solving", label: "Solving problems creatively" },
  { id: "curiosity", label: "Becoming more curious" },
  { id: "self-understanding", label: "Understanding myself better" },
  { id: "independence", label: "Becoming more independent" },
  { id: "possibilities", label: "Exploring new possibilities" },
];

export function SettingsClientView({ initialProfile, isSupabaseConfigured }: SettingsClientViewProps) {
  const [displayName, setDisplayName] = useState(initialProfile.displayName);
  const [bio, setBio] = useState(initialProfile.bio);
  const [interests, setInterests] = useState<string[]>(initialProfile.interests);
  const [growthIntentions, setGrowthIntentions] = useState<string[]>(initialProfile.growthIntentions);
  const [preferredLanguage, setPreferredLanguage] = useState(initialProfile.preferredLanguage);

  const [isLoading, setIsLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const t = dictionaries.en.settings;

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function toggleIntention(id: string) {
    setGrowthIntentions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const result = await updateProfileSettingsAction({
        displayName,
        bio,
        interests,
        growthIntentions,
        preferredLanguage,
      });

      if (!result.success) {
        setStatusMessage({ type: "error", text: result.error || "Failed to update profile." });
      } else {
        setStatusMessage({ type: "success", text: t.savedSuccess });
      }
    } catch {
      setStatusMessage({ type: "error", text: "An unexpected error occurred while saving." });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOutAction();
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Settings Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {t.subtitle}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {!isSupabaseConfigured && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 text-xs text-amber-800 dark:text-amber-200">
          <strong>Database Notice:</strong> Supabase credentials are not set in .env.local. Profile settings updates will be active once live credentials are provided.
        </div>
      )}

      {statusMessage && (
        <div
          className={`rounded-lg p-4 text-xs font-medium border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Profile Section */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 space-y-5 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            {t.profileSection}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="displayName"
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <Input
              id="email"
              label="Email Address (Account)"
              value={initialProfile.email}
              disabled
              helperText="Account email cannot be modified directly"
            />
          </div>

          <Textarea
            id="bio"
            label="Personal Introduction / Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A brief sentence about your background and interests..."
          />

          <div className="max-w-xs space-y-1.5 text-left">
            <label htmlFor="language" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t.languageLabel}
            </label>
            <select
              id="language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="en">English (Default)</option>
              <option value="bn">বাংলা (Bangla — Preview)</option>
            </select>
          </div>
        </div>

        {/* Learning & Growth Preferences */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            {t.preferencesSection}
          </h3>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Interests Explored
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = interests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Growth Intentions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {INTENTION_OPTIONS.map((item) => {
                const isSelected = growthIntentions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleIntention(item.id)}
                    className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
            {t.saveChanges}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            isLoading={isSigningOut}
            onClick={handleSignOut}
            className="text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
          >
            {t.signOut}
          </Button>
        </div>
      </form>
    </div>
  );
}
