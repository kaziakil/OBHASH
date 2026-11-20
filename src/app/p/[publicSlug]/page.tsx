import React from "react";
import { notFound } from "next/navigation";
import { getPublicPortfolioBySlug } from "@/lib/portfolio/actions";
import { PublicPortfolioClient } from "./PublicPortfolioClient";

interface Props {
  params: Promise<{
    publicSlug: string;
  }>;
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { publicSlug } = await params;
  const portfolio = await getPublicPortfolioBySlug(publicSlug);

  if (!portfolio) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      <PublicPortfolioClient portfolio={portfolio} />
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500">
        <p>Built with <span className="font-bold text-zinc-700 dark:text-zinc-300">OBHASH</span> — Human-Centered Intelligence Platform</p>
      </footer>
    </div>
  );
}
