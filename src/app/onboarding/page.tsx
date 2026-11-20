"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Stepper } from "@/components/shared/Stepper";
import { saveOnboardingAction } from "@/lib/auth/actions";
import { dictionaries } from "@/lib/i18n/dictionary";

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

export default function OnboardingPage() {
  const router = useRouter();
  // Helper to read initial state safely
  const getDraft = () => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem("obhash_onboarding_draft");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  // Form State initialized lazily
  const [currentStep, setCurrentStep] = useState<number>(() => getDraft()?.currentStep ?? 1);
  const totalSteps = 5;

  const [displayName, setDisplayName] = useState<string>(() => getDraft()?.displayName ?? "");
  const [bio, setBio] = useState<string>(() => getDraft()?.bio ?? "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => getDraft()?.selectedInterests ?? []);
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>(() => getDraft()?.selectedIntentions ?? []);
  const [customIntention, setCustomIntention] = useState<string>(() => getDraft()?.customIntention ?? "");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = dictionaries.en.onboarding;

  // Sync draft state to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "obhash_onboarding_draft",
        JSON.stringify({
          displayName,
          bio,
          selectedInterests,
          selectedIntentions,
          customIntention,
          currentStep,
        })
      );
    } catch {
      // Ignore storage write errors
    }
  }, [displayName, bio, selectedInterests, selectedIntentions, customIntention, currentStep]);

  function toggleInterest(id: string) {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleIntention(id: string) {
    setSelectedIntentions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleNext() {
    setErrorMessage(null);

    // Validation for step 2
    if (currentStep === 2) {
      if (!displayName.trim()) {
        setErrorMessage("Please provide your preferred name to continue.");
        return;
      }
    }

    // Validation for step 3
    if (currentStep === 3) {
      if (selectedInterests.length === 0) {
        setErrorMessage("Please select at least one interest area.");
        return;
      }
    }

    // Validation for step 4
    if (currentStep === 4) {
      if (selectedIntentions.length === 0 && !customIntention.trim()) {
        setErrorMessage("Please select at least one growth intention.");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  async function handleFinish() {
    setIsLoading(true);
    setErrorMessage(null);

    const growthList = [...selectedIntentions];
    if (customIntention.trim()) {
      growthList.push(customIntention.trim());
    }

    try {
      const result = await saveOnboardingAction({
        displayName,
        bio,
        interests: selectedInterests,
        growthIntentions: growthList,
      });

      if (!result.success) {
        setErrorMessage(result.error || "Failed to complete onboarding.");
      } else {
        sessionStorage.removeItem("obhash_onboarding_draft");
        router.push("/dashboard");
      }
    } catch {
      setErrorMessage("An unexpected error occurred while saving profile.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
      <div className="w-full space-y-8">
        {/* Header & Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xl tracking-wider text-zinc-900 dark:text-zinc-50">
              OBHASH
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Onboarding
            </span>
          </div>
          <Stepper currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-xs text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Wizard Step Content */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-10 shadow-sm min-h-[380px] flex flex-col justify-between">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Welcome to OBHASH
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {t.step1.title}
                </h2>
              </div>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.step1.body}
              </p>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-zinc-100">Core Principle:</strong> OBHASH will never simply do your thinking for you. It exists to sharpen your judgment, deepen your inquiry, and help you produce original work.
              </div>
            </div>
          )}

          {/* Step 2: Personal Introduction */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {t.step2.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t.step2.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  id="displayName"
                  label={t.step2.nameLabel}
                  placeholder={t.step2.namePlaceholder}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  autoFocus
                />

                <Textarea
                  id="bio"
                  label={t.step2.bioLabel}
                  placeholder={t.step2.bioPlaceholder}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {t.step3.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t.step3.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map((item) => {
                  const isSelected = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Growth Intentions */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {t.step4.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t.step4.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTENTION_OPTIONS.map((item) => {
                  const isSelected = selectedIntentions.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleIntention(item.id)}
                      className={`text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <Input
                id="customIntention"
                label={t.step4.customLabel}
                placeholder={t.step4.customPlaceholder}
                value={customIntention}
                onChange={(e) => setCustomIntention(e.target.value)}
              />
            </div>
          )}

          {/* Step 5: Completion */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center py-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {t.step5.title}, {displayName || "Explorer"}!
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {t.step5.body}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 text-left max-w-md mx-auto space-y-1">
                <div><strong className="text-zinc-700 dark:text-zinc-300">Name:</strong> {displayName}</div>
                <div><strong className="text-zinc-700 dark:text-zinc-300">Interests Selected:</strong> {selectedInterests.length} areas</div>
                <div><strong className="text-zinc-700 dark:text-zinc-300">Growth Focus:</strong> {selectedIntentions.length + (customIntention ? 1 : 0)} intentions</div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-8 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-6">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" size="md" onClick={handleBack}>
                ← {t.back}
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <Button type="button" variant="primary" size="md" onClick={handleNext}>
                {t.continue} →
              </Button>
            ) : (
              <Button type="button" variant="primary" size="lg" isLoading={isLoading} onClick={handleFinish}>
                {t.step5.cta}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
