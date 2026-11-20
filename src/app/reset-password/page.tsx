"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { updatePasswordAction } from "@/lib/auth/actions";
import { dictionaries } from "@/lib/i18n/dictionary";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const t = dictionaries.en.auth;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await updatePasswordAction(formData);
      if (!result.success) {
        setErrorMessage(result.error || "Failed to update password.");
      } else {
        setSuccessMessage(result.message || "Password updated.");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-extrabold text-2xl tracking-wider text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 transition-colors">
              OBHASH
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {t.resetTitle}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t.resetSubtitle}
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-xs text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-xs text-emerald-700 dark:text-emerald-300">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-sm">
          <Input
            id="password"
            name="password"
            type="password"
            label="New Password"
            placeholder="••••••••"
            helperText={t.passwordMinLength}
            showPasswordToggle
            autoComplete="new-password"
            required
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label={t.confirmPasswordLabel}
            placeholder="••••••••"
            showPasswordToggle
            autoComplete="new-password"
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            {t.updatePassword}
          </Button>
        </form>
      </div>
    </div>
  );
}
