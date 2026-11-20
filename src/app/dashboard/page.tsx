import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CORE_CAPABILITIES, APP_METADATA } from "@/config/constants";
import { getUserCapabilityProfiles } from "@/lib/assessments/actions";
import { DashboardClientView } from "./DashboardClientView";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  let user = null;
  let profile = null;
  const isSupabaseConfigured = Boolean(supabase);

  if (supabase) {
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      profile = profileData;
    }
  }

  // Retrieve user's capability baselines
  const capabilityProfiles = await getUserCapabilityProfiles();

  // Fallback display values if unconfigured or profile loading
  const displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Explorer";
  const email = user?.email || "user@example.com";
  const interests = profile?.interests || [];
  const growthIntentions = profile?.growth_intentions || [];

  return (
    <DashboardClientView
      displayName={displayName}
      email={email}
      interests={interests}
      growthIntentions={growthIntentions}
      isSupabaseConfigured={isSupabaseConfigured}
      capabilities={CORE_CAPABILITIES}
      appName={APP_METADATA.name}
      capabilityProfiles={capabilityProfiles}
    />
  );
}
