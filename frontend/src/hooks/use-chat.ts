"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, Memory } from "@/types";
import { MOCK_CHAT_MESSAGES, MOCK_MEMORIES, MOCK_SESSIONS } from "@/services/mock-data";
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
 * Calls real backend API when USE_MOCK_DATA is false.
 */
export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "session_001",
      query: "Research DeFi protocols on Sui blockchain",
      messages: MOCK_CHAT_MESSAGES,
      memories: MOCK_MEMORIES.filter((m) => m.sessionId === "session_001"),
      timestamp: "2026-05-25T10:29:00Z",
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>("session_001");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
            "I'm researching that topic now. In production, I would search the web, summarize findings, and store each fact on Walrus with verifiable provenance.\n\nThis is a demo — real integration with MemWal, Tatum, and Walrus coming soon.",
          memories: MOCK_MEMORIES.slice(0, 2),
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
          const errorMsg: ChatMessage = {
            id: `msg_${Date.now() + 1}`,
            role: "assistant",
            content: `❌ Research failed: ${error.message}\n\nPlease check that the backend is running and API keys are configured.`,
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
