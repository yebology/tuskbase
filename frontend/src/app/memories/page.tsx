"use client";

import { Search, Database, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemoryCard } from "@/components/memory/memory-card";
import { MemoryDetail } from "@/components/memory/memory-detail";
import { useMemories } from "@/hooks/use-memories";

/** Memory explorer — browse, search, and inspect stored memories */
export default function MemoriesPage() {
  const { memories, allCount, selected, select, searchQuery, setSearchQuery } =
    useMemories();

  return (
    <div className="flex h-full">
      {/* List panel — always visible on desktop, hidden when detail shown on mobile */}
      <div
        className={`w-full lg:w-[400px] border-r border-border flex flex-col overflow-hidden ${
          selected ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold mb-3">Memory Explorer</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {memories.map((mem) => (
            <MemoryCard
              key={mem.id}
              memory={mem}
              isSelected={mem.id === selected?.id}
              onClick={() => select(mem.id)}
            />
          ))}
        </div>

        <div className="min-h-[60px] px-4 flex items-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            {memories.length} of {allCount} memories • Namespace: defi-research
          </p>
        </div>
      </div>

      {/* Detail panel — always visible on desktop, replaces list on mobile */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          selected ? "flex" : "hidden lg:flex"
        }`}
      >
        {selected ? (
          <>
            {/* Back button on mobile */}
            <div className="lg:hidden p-3 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => select("")}
                className="gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to list
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <MemoryDetail memory={selected} />
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <Database className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a memory to view details</p>
      </div>
    </div>
  );
}
