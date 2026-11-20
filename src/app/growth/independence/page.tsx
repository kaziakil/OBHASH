import React from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { getIndependenceOverview } from "@/lib/independence/actions";
import { IndependenceDashboardClient } from "./IndependenceDashboardClient";

export default async function IndependencePage() {
  const overview = await getIndependenceOverview("demo-user-1");

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header />
      <main className="flex-1">
        <IndependenceDashboardClient initialData={overview} />
      </main>
      <Footer />
    </div>
  );
}
