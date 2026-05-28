"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Brain,
  Search,
  Sparkles,
  Globe,
  Plus,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ConnectWallet } from "@/components/layout/connect-wallet";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants";

const SUGGESTED_PROMPTS = [
  { icon: Globe, text: "What is Walrus decentralized storage and how does it work?" },
  { icon: Sparkles, text: "Explain the Sui blockchain architecture and its advantages" },
  { icon: Search, text: "What are the latest developments in decentralized AI agents?" },
];

/** Single-page research app — header + session sidebar + chat */
export default function ResearchPage() {
  const {
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
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen">
      {/* Top header bar */}
      <header className="h-13 border-b border-border px-4 flex items-center justify-between shrink-0 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sessions"
            className="text-muted-foreground"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight leading-none">
                {APP_NAME}
              </h1>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Verifiable AI Research
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground px-2 py-1 rounded-md bg-muted/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sui Devnet
          </div>
          <ConnectWallet />
          <ThemeToggle />
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Session sidebar */}
        <aside
          className={cn(
            "border-r border-border bg-muted/30 flex flex-col shrink-0 transition-all duration-200",
            sidebarOpen ? "w-56" : "w-0 overflow-hidden border-r-0"
          )}
        >
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
              <SessionItem
                key={session.id}
                query={session.query}
                isActive={session.id === activeSessionId}
                onClick={() => switchSession(session.id)}
                onRename={(name) => renameSession(session.id, name)}
                onDelete={() => deleteSession(session.id)}
              />
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
            {hasMessages ? (
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && <LoadingIndicator />}
              </div>
            ) : (
              <WelcomeState onPromptClick={(text) => setInput(text)} />
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
    </div>
  );
}

function SessionItem({
  query,
  isActive,
  onClick,
  onRename,
  onDelete,
}: {
  query: string;
  isActive: boolean;
  onClick: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [editValue, setEditValue] = useState(query);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== query) {
      onRename(trimmed);
    }
    setRenameOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md transition-colors",
          isActive
            ? "bg-background shadow-sm border border-border"
            : "hover:bg-background/50"
        )}
      >
        <button
          onClick={onClick}
          className="flex-1 text-left px-2.5 py-2 min-w-0"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3 h-3 shrink-0 opacity-50" />
            <span
              className={cn(
                "text-xs truncate",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {query}
            </span>
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded hover:bg-muted shrink-0">
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => {
                setEditValue(query);
                setRenameOpen(true);
              }}
            >
              <Pencil className="w-3.5 h-3.5 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleRename}>
            <DialogHeader>
              <DialogTitle>Rename Session</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Session name"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRenameOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!editValue.trim()}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function WelcomeState({
  onPromptClick,
}: {
  onPromptClick: (text: string) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold tracking-tight mb-2">
        What would you like to research?
      </h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        I&apos;ll search 20+ sources, extract key facts, and deliver a
        verifiable PDF report stored on Walrus with on-chain proof.
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <Button
            key={prompt.text}
            variant="outline"
            size="sm"
            className="gap-2 text-xs hover:border-primary/50 hover:bg-primary/5 transition-all"
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
  const [step, setStep] = useState(0);
  const steps = [
    "🔍 Searching 20+ sources...",
    "🤖 Extracting key facts...",
    "🧠 Storing in memory...",
    "📄 Generating PDF report...",
    "🐋 Storing on Walrus...",
    "🔗 Recording on Sui...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">{steps[step]}</span>
      </div>
    </div>
  );
}
