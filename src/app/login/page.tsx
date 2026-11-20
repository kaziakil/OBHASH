"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { signInAction } from "@/lib/auth/actions";
import { dictionaries } from "@/lib/i18n/dictionary";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const verifiedNotice = searchParams.get("verified");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = dictionaries.en.auth;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.append("redirectTo", redirectTo);

    try {
      const result = await signInAction(formData);
      if (!result.success) {
        setErrorMessage(result.error || "Failed to sign in. Please try again.");
      } else if (result.redirectTo) {
        router.push(result.redirectTo);
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
            {t.loginTitle}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t.loginSubtitle}
          </p>
        </div>

        {verifiedNotice === "pending" && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 text-xs text-blue-700 dark:text-blue-300">
            Registration received. If email verification is enabled on your project, please verify your email before logging in.
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-xs text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-sm">
          <Input
            id="email"
            name="email"
            type="email"
            label={t.emailLabel}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <div className="space-y-1">
            <Input
              id="password"
              name="password"
              type="password"
              label={t.passwordLabel}
              placeholder="••••••••"
              showPasswordToggle
              autoComplete="current-password"
              required
            />
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium"
              >
                {t.forgotPasswordLink}
              </Link>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            {t.signInButton}
          </Button>

          <div className="text-center pt-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.dontHaveAccount}{" "}
              <Link
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
