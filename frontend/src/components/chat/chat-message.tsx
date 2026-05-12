import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTrustLabel, formatTimestamp } from "@/lib/formatters";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

/** Single chat message bubble with optional memory references */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {message.memories && message.memories.length > 0 && (
          <MemoryReferences memories={message.memories} />
        )}

        <p className="text-[10px] opacity-50 mt-2">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function MemoryReferences({
  memories,
}: {
  memories: NonNullable<ChatMessageType["memories"]>;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
      <p className="text-xs font-medium opacity-70">
        📚 Sources stored on Walrus:
      </p>
      {memories.map((mem) => {
        const trust = getTrustLabel(mem.trustScore);
        return (
          <div
            key={mem.id}
            className="flex items-center gap-2 text-xs bg-background/50 rounded-md px-2 py-1.5"
          >
            <span className={trust.color}>●</span>
            <span className="truncate flex-1">{mem.sourceDomain}</span>
            <Badge variant="secondary" className="text-[10px]">
              Trust: {mem.trustScore}/10
            </Badge>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </div>
        );
      })}
    </div>
  );
}
