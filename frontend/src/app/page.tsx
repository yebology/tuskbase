"use client";

import { Loader2, Brain, Search, Sparkles, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { useChat } from "@/hooks/use-chat";

const SUGGESTED_PROMPTS = [
  { icon: Globe, text: "Research DeFi protocols on Sui" },
  { icon: Sparkles, text: "What is Walrus decentralized storage?" },
  { icon: Search, text: "Compare Sui vs Solana architecture" },
];

/** Research page — main chat interface for the AI agent */
export default function ResearchPage() {
  const { messages, input, setInput, isLoading, sendMessage, memoryCount } =
    useChat();

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      <ResearchHeader memoryCount={memoryCount} />

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
  );
}

function ResearchHeader({ memoryCount }: { memoryCount: number }) {
  return (
    <header className="border-b border-border px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="font-semibold tracking-tight">Research Agent</h2>
        <p className="text-xs text-muted-foreground">
          Ask me to research any topic — findings stored with verifiable
          provenance on Walrus
        </p>
      </div>
      <Badge variant="outline" className="text-xs gap-1.5">
        <Brain className="w-3 h-3" />
        {memoryCount} memories
      </Badge>
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
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
        <Brain className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight mb-2">
        What would you like to research?
      </h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-md">
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
