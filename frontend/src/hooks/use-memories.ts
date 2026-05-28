"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Memory, ResearchSession } from "@/types";

/**
 * Hook for managing memory state — reads from localStorage (shared with use-chat).
 * Memories are grouped by research session.
 */
export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load memories from localStorage (shared with use-chat)
  useEffect(() => {
    const raw = localStorage.getItem("tuskbase_sessions");
    if (!raw) return;

    try {
      const chatSessions = JSON.parse(raw) as Array<{
        id: string;
        query: string;
        memories: Memory[];
        timestamp: string;
      }>;

      // Extract all memories from all sessions
      const allMemories: Memory[] = [];
      const allSessions: ResearchSession[] = [];

      for (const session of chatSessions) {
        if (session.memories && session.memories.length > 0) {
          allMemories.push(...session.memories);
          allSessions.push({
            id: session.id,
            query: session.query,
            timestamp: session.timestamp,
            memoryCount: session.memories.length,
          });
        }
      }

      setMemories(allMemories);
      setSessions(allSessions);

      // Auto-select first session if available
      if (allSessions.length > 0 && !selectedSessionId) {
        setSelectedSessionId(allSessions[0].id);
      }
    } catch {
      // Ignore corrupt localStorage
    }
  }, []);

  /** Memories filtered by selected session and search query */
  const filtered = useMemo(() => {
    let result = memories;

    if (selectedSessionId) {
      result = result.filter((m) => m.sessionId === selectedSessionId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.content.toLowerCase().includes(q) ||
          m.sourceDomain.toLowerCase().includes(q)
      );
    }

    return result;
  }, [memories, selectedSessionId, searchQuery]);

  const selected = useMemo(
    () => memories.find((m) => m.id === selectedId) ?? null,
    [memories, selectedId]
  );

  const select = useCallback((id: string) => setSelectedId(id || null), []);

  const selectSession = useCallback(
    (id: string | null) => {
      setSelectedSessionId(id);
      setSelectedId(null);
    },
    []
  );

  return {
    memories: filtered,
    allCount: memories.length,
    sessions,
    selectedSessionId,
    selectSession,
    selected,
    select,
    searchQuery,
    setSearchQuery,
  };
}
