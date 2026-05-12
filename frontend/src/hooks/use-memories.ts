"use client";

import { useState, useMemo, useCallback } from "react";
import type { Memory, ResearchSession } from "@/types";
import { MOCK_MEMORIES, MOCK_SESSIONS } from "@/services/mock-data";

/**
 * Hook for managing memory state — sessions, search, select.
 * Memories are grouped by research session (one query = one session).
 */
export function useMemories() {
  const [memories] = useState<Memory[]>(MOCK_MEMORIES);
  const [sessions] = useState<ResearchSession[]>(MOCK_SESSIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    MOCK_SESSIONS[0]?.id ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");

  /** Memories filtered by selected session and search query */
  const filtered = useMemo(() => {
    let result = memories;

    // Filter by session
    if (selectedSessionId) {
      result = result.filter((m) => m.sessionId === selectedSessionId);
    }

    // Filter by search query
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
      setSelectedId(null); // Deselect memory when switching session
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
