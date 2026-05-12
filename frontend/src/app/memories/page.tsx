"use client";

import { Search, Database, ArrowLeft, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemoryCard } from "@/components/memory/memory-card";
import { MemoryDetail } from "@/components/memory/memory-detail";
import { useMemories } from "@/hooks/use-memories";
import { cn } from "@/lib/utils";

/** Memory explorer — browse sessions and inspect stored memories */
export default function MemoriesPage() {
  const {
    memories,
    allCount,
    sessions,
    selectedSessionId,
    selectSession,
    selected,
    select,
    searchQuery,
    setSearchQuery,
  } = useMemories();

  return (
    <div className="flex h-full">
      {/* Left panel — sessions + memory list */}
      <div
        className={`w-full lg:w-[400px] border-r border-border flex flex-col overflow-hidden ${
          selected ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Session tabs */}
        <div className="p-3 border-b border-border">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => selectSession(null)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                selectedSessionId === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              All ({allCount})
            </button>
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => selectSession(session.id)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 max-w-[200px]",
                  selectedSessionId === session.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <FolderOpen className="w-3 h-3 shrink-0" />
                <span className="truncate">{session.query}</span>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1 py-0 shrink-0"
                >
                  {session.memoryCount}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border">
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

        {/* Memory list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {memories.length > 0 ? (
            memories.map((mem) => (
              <MemoryCard
                key={mem.id}
                memory={mem}
                isSelected={mem.id === selected?.id}
                onClick={() => select(mem.id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p className="text-sm">No memories found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="min-h-[44px] px-4 flex items-center border-t border-border">
          <p className="text-[10px] text-muted-foreground">
            {memories.length} of {allCount} memories
          </p>
        </div>
      </div>

      {/* Right panel — detail */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          selected ? "flex" : "hidden lg:flex"
        }`}
      >
        {selected ? (
          <>
            <div className="lg:hidden p-3 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => select("")}
                className="gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
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
        <p className="text-xs mt-1">
          Each memory has verifiable provenance on-chain
        </p>
      </div>
    </div>
  );
}
