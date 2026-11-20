"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_METADATA } from "@/config/constants";

const NAV_LINKS = [
  { href: "/challenges", label: "Challenges" },
  { href: "/coach", label: "Growth Coach" },
  { href: "/journey", label: "Journey" },
  { href: "/growth/independence", label: "Independence" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/docs", label: "Docs / Deck" },
  { href: "/dashboard", label: "Dashboard" },
];

function HeaderContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Brand Logo & Tagline */}
      <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3BFF] rounded-lg p-1 -ml-1">
        <div className="w-9 h-9 rounded-xl bg-[#17151F] text-white dark:bg-white dark:text-[#17151F] flex items-center justify-center font-black tracking-widest text-base shadow-sm ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-105 transition-transform">
          <span className="text-[#5B3BFF] dark:text-[#5B3BFF]">O</span>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-base text-[#17151F] dark:text-zinc-100 group-hover:text-[#5B3BFF] transition-colors">
            {APP_METADATA.name}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-tight -mt-0.5">
            Human-Centered Intelligence
          </span>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-800 text-[#17151F] dark:text-white font-bold"
                  : "hover:text-[#17151F] dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right CTA Actions & Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/login"
          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#17151F] dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-lg bg-[#5B3BFF] hover:bg-[#4829E6] text-white shadow-sm shadow-[#5B3BFF]/25 hover:shadow-md hover:shadow-[#5B3BFF]/30 active:scale-98 transition-all"
        >
          Get Started
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#5B3BFF]"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111019] px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-lg flex items-center justify-between ${
                  pathname === link.href
                    ? "bg-[#5B3BFF]/10 text-[#5B3BFF] font-bold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{link.label}</span>
                <span className="text-zinc-400">→</span>
              </Link>
            ))}
          </div>
          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/assessment"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200"
            >
              Diagnostic
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold bg-[#5B3BFF] text-white hover:bg-[#4829E6]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#111019]/90 backdrop-blur-md transition-colors">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#17151F] text-white flex items-center justify-center font-black">
                <span className="text-[#5B3BFF]">O</span>
              </div>
              <span className="font-extrabold text-base text-[#17151F] dark:text-white">
                {APP_METADATA.name}
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-xs font-semibold px-3 py-1.5">
                Sign In
              </Link>
              <Link href="/signup" className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#5B3BFF] text-white">
                Get Started
              </Link>
            </div>
          </div>
        }
      >
        <HeaderContent />
      </Suspense>
    </header>
  );
}
