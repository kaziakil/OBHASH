"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
  message?: string;
}

/**
 * Handles new user registration with Supabase Auth
 */
export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const displayName = (formData.get("displayName") as string)?.trim() || email?.split("@")[0];

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: "Authentication service is unconfigured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable live registration.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // If session is returned immediately (email confirmation disabled in Supabase)
  if (data.session && data.user) {
    // Ensure profile row exists
    await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        email: data.user.email!,
        display_name: displayName,
        onboarding_completed: false,
      })
      .select()
      .maybeSingle();

    revalidatePath("/", "layout");
    return { success: true, redirectTo: "/onboarding" };
  }

  // If email confirmation is required
  return {
    success: true,
    message: "Registration successful! Please check your email to verify your account before logging in.",
    redirectTo: "/login?verified=pending",
  };
}

/**
 * Handles user login with Supabase Auth
 */
export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectToParam = (formData.get("redirectTo") as string)?.trim();

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: "Authentication service is unconfigured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable live login.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: "Unable to sign in. Please verify your credentials." };
  }

  // Check onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", data.user.id)
    .maybeSingle();

  revalidatePath("/", "layout");

  if (redirectToParam && redirectToParam.startsWith("/")) {
    return { success: true, redirectTo: redirectToParam };
  }

  if (profile && !profile.onboarding_completed) {
    return { success: true, redirectTo: "/onboarding" };
  }

  return { success: true, redirectTo: "/dashboard" };
}

/**
 * Handles user sign out
 */
export async function signOutAction(): Promise<AuthActionResult> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  return { success: true, redirectTo: "/login" };
}

/**
 * Initiates password recovery email
 */
export async function resetPasswordForEmailAction(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: "Authentication service is unconfigured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    };
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "If an account exists with this email, a password recovery link has been sent.",
  };
}

/**
 * Updates password for an authenticated session (e.g. from recovery link)
 */
export async function updatePasswordAction(formData: FormData): Promise<AuthActionResult> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: "Authentication service is unconfigured.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Your password has been updated successfully.",
    redirectTo: "/dashboard",
  };
}

/**
 * Saves onboarding data to user profile
 */
export async function saveOnboardingAction(payload: {
  displayName: string;
  bio?: string;
  interests: string[];
  growthIntentions: string[];
}): Promise<AuthActionResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: "Database service is unconfigured. Credentials required to persist profile.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required to save profile." };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email!,
      display_name: payload.displayName.trim() || user.email!.split("@")[0],
      bio: payload.bio?.trim() || null,
      interests: payload.interests,
      growth_intentions: payload.growthIntentions,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true, redirectTo: "/dashboard" };
}

/**
 * Updates user profile settings
 */
export async function updateProfileSettingsAction(payload: {
  displayName: string;
  bio?: string;
  interests: string[];
  growthIntentions: string[];
  preferredLanguage?: string;
}): Promise<AuthActionResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Database service unconfigured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: payload.displayName.trim() || user.email!.split("@")[0],
      bio: payload.bio?.trim() || null,
      interests: payload.interests,
      growth_intentions: payload.growthIntentions,
      preferred_language: payload.preferredLanguage || "en",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true, message: "Profile settings saved successfully." };
}
