"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, ResearchSession } from "@/types";
import { MOCK_CHAT_MESSAGES, MOCK_MEMORIES, MOCK_SESSIONS } from "@/services/mock-data";
import { UI } from "@/constants";

interface ChatSession {
  id: string;
  query: string;
  messages: ChatMessage[];
  timestamp: string;
}

/**
 * Hook for managing chat sessions — multiple research threads.
 * Each session = one research topic with its own message history.
 */
export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "session_001",
      query: "Research DeFi protocols on Sui blockchain",
      messages: MOCK_CHAT_MESSAGES,
      timestamp: "2026-05-25T10:29:00Z",
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>("session_001");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages ?? [];

  /** Create a new empty research session */
  const createSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      query: "New Research",
      messages: [],
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

    // Update session messages and title (use first message as title)
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

    // Simulated AI response
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content:
          "I'm researching that topic now. In production, I would search the web, summarize findings, and store each fact on Walrus with verifiable provenance.\n\nThis is a demo — real integration with MemWal, Tatum MCP, and Walrus coming soon.",
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
  }, [input, isLoading, activeSessionId]);

  return {
    // Session management
    sessions,
    activeSessionId,
    createSession,
    switchSession,
    // Chat state
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    memoryCount: MOCK_MEMORIES.length,
  };
}
