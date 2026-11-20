import React from "react";
import { getUserCapabilityProfiles } from "@/lib/assessments/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CreateJourneyClient } from "./CreateJourneyClient";

export default async function CreateJourneyPage() {
  const supabase = await createServerSupabaseClient();
  let userInterests: string[] = [];
  let growthIntentions: string[] = [];

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("interests, growth_intentions")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        userInterests = profile.interests || [];
        growthIntentions = profile.growth_intentions || [];
      }
    }
  }

  // Retrieve user's capability baselines
  const capabilityProfiles = await getUserCapabilityProfiles();

  return (
    <CreateJourneyClient
      initialProfiles={capabilityProfiles}
      initialInterests={userInterests}
      initialIntentions={growthIntentions}
    />
  );
}
