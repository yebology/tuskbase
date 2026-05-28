"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatMessage, Memory } from "@/types";
import { research, mapApiMemoryToMemory, USE_MOCK_DATA } from "@/services/api";
import { UI } from "@/constants";

interface ChatSession {
  id: string;
  query: string;
  messages: ChatMessage[];
  memories: Memory[];
  timestamp: string;
}

/**
 * Hook for managing chat sessions — multiple research threads.
 * Sessions persisted in localStorage so they survive page refresh.
 * Calls real backend API when USE_MOCK_DATA is false.
 */
export function useChat() {
  const defaultSessions: ChatSession[] = [
    {
      id: "session_default",
      query: "New Research",
      messages: [],
      memories: [],
      timestamp: new Date().toISOString(),
    },
  ];

  const [sessions, setSessions] = useState<ChatSession[]>(defaultSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>("session_default");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const savedSessions = localStorage.getItem("tuskbase_sessions");
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
        }
      } catch { /* ignore corrupt data */ }
    }
    const savedActive = localStorage.getItem("tuskbase_active_session");
    if (savedActive) {
      setActiveSessionId(savedActive);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("tuskbase_sessions", JSON.stringify(sessions));
  }, [sessions, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("tuskbase_active_session", activeSessionId);
  }, [activeSessionId, hydrated]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages ?? [];

  /** Total memory count across all sessions */
  const memoryCount = sessions.reduce((sum, s) => sum + s.memories.length, 0);

  /** Create a new empty research session */
  const createSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      query: "New Research",
      messages: [],
      memories: [],
      timestamp: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput("");
  }, []);

  /** Switch to a different session */
  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    setInput("");
  }, []);

  /** Rename a session */
  const renameSession = useCallback((sessionId: string, newQuery: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, query: newQuery } : s
      )
    );
  }, []);

  /** Delete a session */
  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const newSession: ChatSession = {
          id: `session_${Date.now()}`,
          query: "New Research",
          messages: [],
          memories: [],
          timestamp: new Date().toISOString(),
        };
        setActiveSessionId(newSession.id);
        return [newSession];
      }
      if (sessionId === activeSessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeSessionId]);

  /** Send a message in the active session */
  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
      sessionId: activeSessionId,
    };

    // Update session messages and title
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        const updatedMessages = [...s.messages, userMsg];
        const query = s.messages.length === 0 ? trimmed : s.query;
        return { ...s, messages: updatedMessages, query };
      })
    );

    setInput("");
    setIsLoading(true);

    if (USE_MOCK_DATA) {
      // Simulated response
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          role: "assistant",
          content:
            "## 🔍 Demo Mode\n\nThis is a simulated response. Set `USE_MOCK_DATA = false` and connect to the backend for real research.\n\n> 💡 **Key Takeaway:** Real mode searches the web, extracts facts, and stores them on Walrus with verifiable provenance.",
          timestamp: new Date().toISOString(),
          sessionId: activeSessionId,
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSessionId) return s;
            return { ...s, messages: [...s.messages, assistantMsg] };
          })
        );
        setIsLoading(false);
      }, UI.SIMULATED_RESPONSE_DELAY_MS);
    } else {
      // Real API call
      research(trimmed)
        .then((result) => {
          const memories = result.memories.map((m) =>
            mapApiMemoryToMemory(m, activeSessionId)
          );

          const assistantMsg: ChatMessage = {
            id: `msg_${Date.now() + 1}`,
            role: "assistant",
            content: result.summary,
            memories,
            timestamp: new Date().toISOString(),
            sessionId: activeSessionId,
          };

          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== activeSessionId) return s;
              return {
                ...s,
                messages: [...s.messages, assistantMsg],
                memories: [...s.memories, ...memories],
              };
            })
          );
        })
        .catch((error) => {
          const isTimeout = error.message?.includes("timed out");
          const errorMsg: ChatMessage = {
            id: `msg_${Date.now() + 1}`,
            role: "assistant",
            content: isTimeout
              ? "## ⏱️ Request Timed Out\n\nThe research is taking longer than expected. This can happen with complex queries.\n\n> Try a more specific question, or check that the backend is running."
              : `## ❌ Research Failed\n\n**Error:** ${error.message}\n\n> Please check that the backend is running at \`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}\` and all API keys are configured.`,
            timestamp: new Date().toISOString(),
            sessionId: activeSessionId,
          };

          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== activeSessionId) return s;
              return { ...s, messages: [...s.messages, errorMsg] };
            })
          );
        })
        .finally(() => setIsLoading(false));
    }
  }, [input, isLoading, activeSessionId]);

  /** Get all memories across all sessions (for Memories page) */
  const allMemories = sessions.flatMap((s) => s.memories);

  return {
    sessions,
    activeSessionId,
    createSession,
    switchSession,
    renameSession,
    deleteSession,
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    memoryCount,
    allMemories,
  };
}
