"use client";

import { useState, useMemo, useCallback } from "react";
import type { Memory } from "@/types";
import { MOCK_MEMORIES } from "@/services/mock-data";

/**
 * Hook for managing memory state — search, select, filter.
 * Will connect to MemWal SDK in production.
 */
export function useMemories() {
  const [memories] = useState<Memory[]>(MOCK_MEMORIES);
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_MEMORIES[0]?.id ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return memories;
    const q = searchQuery.toLowerCase();
    return memories.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        m.sourceDomain.toLowerCase().includes(q)
    );
  }, [memories, searchQuery]);

  const selected = useMemo(
    () => memories.find((m) => m.id === selectedId) ?? null,
    [memories, selectedId]
  );

  const select = useCallback(
    (id: string) => setSelectedId(id || null),
    []
  );

  return {
    memories: filtered,
    allCount: memories.length,
    selected,
    select,
    searchQuery,
    setSearchQuery,
  };
}
