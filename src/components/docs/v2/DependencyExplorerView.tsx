"use client";

import React, { useState, useMemo } from "react";
import {
  DEPENDENCY_NODES,
  DEPENDENCY_EDGES,
  getConnectedDependencies,
} from "@/lib/docs/dependency-graph";
import type { DependencyCategory } from "@/types/docs";

interface DependencyExplorerViewProps {
  searchQuery?: string;
}

export function DependencyExplorerView({ searchQuery = "" }: DependencyExplorerViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("app-01");

  const query = searchQuery.trim().toLowerCase();

  const categories: ("All" | DependencyCategory)[] = [
    "All",
    "Application",
    "Engine",
    "Component",
    "API",
    "DataEntity",
    "WorkPackage",
  ];

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return DEPENDENCY_NODES.filter((node) => {
      const matchesCategory =
        selectedCategory === "All" || node.category === selectedCategory;
      const matchesQuery =
        !query ||
        node.name.toLowerCase().includes(query) ||
        node.code.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query) ||
        node.owner.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, query]);

  // Active connected node inspection
  const connectedDetail = useMemo(
    () => getConnectedDependencies(selectedNodeId),
    [selectedNodeId]
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* 1. HEADER */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Interactive Architecture Explorer • Multi-Tier Dependency Graph
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          System Interoperability & Dependency Matrix
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Explore verified architectural relationships connecting Applications, Core Engines,
          Subsystem Components, REST APIs, Prisma Data Entities, and Roadmap Work Packages. Only verified and approved relationships are rendered.
        </p>

        {/* Legend Banner */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Total Entities:</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
              {DEPENDENCY_NODES.length} Nodes
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
              {DEPENDENCY_EDGES.length} Verified Edges
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            ● Strict Verified-Relationships-Only Policy Enforced
          </span>
        </div>
      </div>

      {/* 2. CATEGORY SELECTOR */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-white dark:bg-[#161421] text-[#5B3BFF] dark:text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. SPLIT PANE: NODES GRID & ACTIVE INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filtered Node Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Select a Node to Inspect Verified Dependencies ({filteredNodes.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl text-left border transition-all space-y-2 ${
                    isSelected
                      ? "bg-purple-50/60 dark:bg-purple-950/20 border-[#5B3BFF] shadow-md ring-1 ring-[#5B3BFF]"
                      : "bg-white dark:bg-[#161421] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {node.code}
                    </span>
                    <span className="text-[10px] font-semibold text-[#5B3BFF] dark:text-[#9D86FF]">
                      {node.category}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-zinc-900 dark:text-white">
                    {node.name}
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>Owner: {node.owner.split(" ")[0]}</span>
                    <span className="text-emerald-600 font-semibold">● {node.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Inspector (Sticky) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-[#161421] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
            {/* Inspector Header */}
            <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#5B3BFF]/10 text-[#5B3BFF]">
                  {connectedDetail.node.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {connectedDetail.node.category}
                </span>
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                {connectedDetail.node.name}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {connectedDetail.node.description}
              </p>
              <div className="text-[11px] text-zinc-500">
                <strong>Subsystem Lead:</strong> {connectedDetail.node.owner}
              </div>
            </div>

            {/* Upstream Dependencies (What this node consumes/depends on) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                <span>Upstream Dependencies</span>
                <span className="font-mono text-[10px]">
                  ({connectedDetail.upstream.length})
                </span>
              </h4>

              {connectedDetail.upstream.length === 0 ? (
                <div className="text-xs text-zinc-400 italic p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40">
                  Root infrastructure entity — no upstream dependencies.
                </div>
              ) : (
                <div className="space-y-2">
                  {connectedDetail.upstream.map((dep, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {dep.node.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200/60 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                          {dep.node.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5B3BFF] dark:text-[#9D86FF]">
                        Relationship: {dep.relationship}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Downstream Consumers (What consumes/points to this node) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                <span>Downstream Dependents & Consumers</span>
                <span className="font-mono text-[10px]">
                  ({connectedDetail.downstream.length})
                </span>
              </h4>

              {connectedDetail.downstream.length === 0 ? (
                <div className="text-xs text-zinc-400 italic p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40">
                  Leaf entity — no downstream consumers.
                </div>
              ) : (
                <div className="space-y-2">
                  {connectedDetail.downstream.map((dep, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {dep.node.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-200/60 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold">
                          {dep.node.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
                        Consumption: {dep.relationship}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
