import React from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { getUserPortfolio, getEligibleWorkItems } from "@/lib/portfolio/actions";
import { PortfolioHubClient } from "./PortfolioHubClient";

export default async function PortfolioPage() {
  const portfolio = await getUserPortfolio("demo-user-1");
  const eligibleItems = await getEligibleWorkItems("demo-user-1");

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header />
      <main className="flex-1">
        <PortfolioHubClient initialPortfolio={portfolio} eligibleItems={eligibleItems} />
      </main>
      <Footer />
    </div>
  );
}
