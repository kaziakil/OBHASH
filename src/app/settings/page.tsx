import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SettingsClientView } from "./SettingsClientView";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  let user = null;
  let profile = null;

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

  const initialProfile = {
    displayName: profile?.display_name || user?.user_metadata?.display_name || user?.email?.split("@")[0] || "",
    email: user?.email || "user@example.com",
    bio: profile?.bio || "",
    interests: profile?.interests || [],
    growthIntentions: profile?.growth_intentions || [],
    preferredLanguage: profile?.preferred_language || "en",
    createdAt: profile?.created_at || "2026-11-20T00:00:00.000Z",
  };

  return <SettingsClientView initialProfile={initialProfile} isSupabaseConfigured={Boolean(supabase)} />;
}
