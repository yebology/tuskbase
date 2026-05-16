"use client";

import { Search, Database, ArrowLeft, FolderOpen } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemoryCard } from "@/components/memory/memory-card";
import { MemoryDetail } from "@/components/memory/memory-detail";
import { useMemories } from "@/hooks/use-memories";
import type { Memory, ResearchSession } from "@/types";
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

  const selectedId = selected?.id ?? null;

  return (
    <div className="flex h-full">
      {/* Mobile view */}
      <div className="flex flex-col w-full lg:hidden">
        {selected ? (
          <>
            <div className="p-3 border-b border-border">
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
          <>
            <SessionTabs
              sessions={sessions}
              allCount={allCount}
              selectedSessionId={selectedSessionId}
              selectSession={selectSession}
            />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <MemoryList
              memories={memories}
              selectedId={null}
              onSelect={select}
            />
            <Footer count={memories.length} allCount={allCount} hasSession={!!selectedSessionId} />
          </>
        )}
      </div>

      {/* Desktop resizable view */}
      <PanelGroup direction="horizontal" className="hidden lg:flex h-full">
        <Panel defaultSize={35} minSize={25} maxSize={50}>
          <div className="flex flex-col h-full border-r border-border">
            <SessionTabs
              sessions={sessions}
              allCount={allCount}
              selectedSessionId={selectedSessionId}
              selectSession={selectSession}
            />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <MemoryList
              memories={memories}
              selectedId={selectedId}
              onSelect={select}
            />
            <Footer count={memories.length} allCount={allCount} hasSession={!!selectedSessionId} />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1.5 bg-border/50 hover:bg-primary/30 transition-colors cursor-col-resize" />

        <Panel defaultSize={65} minSize={40}>
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {selected ? (
              <div className="flex-1 overflow-y-auto p-6">
                <MemoryDetail memory={selected} />
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

function SessionTabs({
  sessions,
  allCount,
  selectedSessionId,
  selectSession,
}: {
  sessions: Array<{ id: string; query: string; memoryCount: number }>;
  allCount: number;
  selectedSessionId: string | null;
  selectSession: (id: string | null) => void;
}) {
  return (
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
              "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 max-w-[180px]",
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
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="p-3 border-b border-border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search memories..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}

function MemoryList({
  memories,
  selectedId,
  onSelect,
}: {
  memories: Memory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {memories.length > 0 ? (
        memories.map((mem) => (
          <MemoryCard
            key={mem.id}
            memory={mem}
            isSelected={mem.id === selectedId}
            onClick={() => onSelect(mem.id)}
          />
        ))
      ) : (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <p className="text-sm">No memories found</p>
        </div>
      )}
    </div>
  );
}

function Footer({
  count,
  allCount,
  hasSession,
}: {
  count: number;
  allCount: number;
  hasSession: boolean;
}) {
  return (
    <div className="min-h-[44px] px-4 flex items-center border-t border-border">
      <p className="text-[10px] text-muted-foreground">
        {count} of {allCount} memories
        {hasSession && " in this session"}
      </p>
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
