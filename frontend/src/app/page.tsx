"use client";

import {
  Loader2,
  Brain,
  Search,
  Sparkles,
  Globe,
  Plus,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  { icon: Globe, text: "Research DeFi protocols on Sui" },
  { icon: Sparkles, text: "What is Walrus decentralized storage?" },
  { icon: Search, text: "Compare Sui vs Solana architecture" },
];

/** Research page — chat interface with session management */
export default function ResearchPage() {
  const {
    sessions,
    activeSessionId,
    createSession,
    switchSession,
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    memoryCount,
  } = useChat();

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full">
      {/* Session list — integrated panel */}
      <div className="hidden lg:flex w-[200px] border-r border-border flex-col shrink-0 bg-muted/30">
        <div className="p-3">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 text-xs"
            onClick={createSession}
          >
            <Plus className="w-3.5 h-3.5" />
            New Research
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => switchSession(session.id)}
              className={cn(
                "w-full text-left px-2.5 py-2 rounded-md transition-colors",
                session.id === activeSessionId
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3 h-3 shrink-0 opacity-50" />
                <span className="text-xs truncate">{session.query}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ResearchHeader
          memoryCount={memoryCount}
          onNewSession={createSession}
        />

        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
          {hasMessages ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && <LoadingIndicator />}
            </div>
          ) : (
            <WelcomeState
              onPromptClick={(text) => {
                setInput(text);
              }}
            />
          )}
        </div>

        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function ResearchHeader({
  memoryCount,
  onNewSession,
}: {
  memoryCount: number;
  onNewSession: () => void;
}) {
  return (
    <header className="border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
      <div>
        <h2 className="font-semibold tracking-tight text-sm">Research Agent</h2>
        <p className="text-[11px] text-muted-foreground">
          Findings stored with verifiable provenance on Walrus
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-[10px] gap-1">
          <Brain className="w-3 h-3" />
          {memoryCount}
        </Badge>
        {/* Mobile new session button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onNewSession}
          aria-label="New research"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}

function WelcomeState({
  onPromptClick,
}: {
  onPromptClick: (text: string) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
        <Brain className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight mb-2">
        What would you like to research?
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        I&apos;ll search the web, summarize findings, and store every fact on
        Walrus with cryptographic proof of its source.
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <Button
            key={prompt.text}
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            onClick={() => onPromptClick(prompt.text)}
          >
            <prompt.icon className="w-3.5 h-3.5" />
            {prompt.text}
          </Button>
        ))}
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Researching...</span>
      </div>
    </div>
  );
}
