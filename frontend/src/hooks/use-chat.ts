"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/types";
import { MOCK_CHAT_MESSAGES, MOCK_MEMORIES } from "@/services/mock-data";
import { UI } from "@/constants";

/**
 * Hook for managing chat state — messages, input, loading.
 * Will connect to AI service + MemWal in production.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response — will be replaced with real agent logic
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content:
          "I'm researching that topic now. In production, I would search the web, summarize findings, and store each fact on Walrus with verifiable provenance.\n\nThis is a demo — real integration with MemWal, Tatum MCP, and Walrus coming soon.",
        memories: MOCK_MEMORIES.slice(0, 2),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, UI.SIMULATED_RESPONSE_DELAY_MS);
  }, [input, isLoading]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    memoryCount: MOCK_MEMORIES.length,
  };
}
