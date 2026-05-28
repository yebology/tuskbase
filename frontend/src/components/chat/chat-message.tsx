import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, User, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTrustLabel } from "@/lib/formatters";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

/** Single chat message with avatar, markdown rendering, and memory references */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar — assistant only */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 mt-0.5">
          <Brain className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm dark:prose-invert prose-p:my-2 prose-headings:my-3 prose-headings:text-base prose-ul:my-2 prose-li:my-0.5 prose-strong:text-foreground prose-table:my-3 prose-th:px-3 prose-th:py-1.5 prose-td:px-3 prose-td:py-1.5 prose-table:text-xs max-w-none [&>*:first-child]:mt-0">
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          </div>
        )}

        {message.memories && message.memories.length > 0 && (
          <MemoryReferences memories={message.memories} />
        )}
      </div>

      {/* Avatar — user only */}
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}

function MemoryReferences({
  memories,
}: {
  memories: NonNullable<ChatMessageType["memories"]>;
}) {
  // Deduplicate sources by domain
  const uniqueSources = memories.reduce(
    (acc, mem) => {
      if (!acc.find((s) => s.sourceDomain === mem.sourceDomain)) {
        acc.push(mem);
      }
      return acc;
    },
    [] as typeof memories
  );

  return (
    <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5">
      <p className="text-[11px] font-medium opacity-60">
        Sources stored on Walrus:
      </p>
      {uniqueSources.map((mem) => {
        const trust = getTrustLabel(mem.trustScore);
        return (
          <div
            key={mem.id}
            className="flex items-center gap-2 text-xs bg-background/40 rounded-md px-2.5 py-1.5"
          >
            <span className={`${trust.color} text-[10px]`}>●</span>
            <span className="truncate flex-1 opacity-80">
              {mem.sourceDomain}
            </span>
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
              {mem.trustScore}/10
            </Badge>
            <a
              href={mem.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        );
      })}
    </div>
  );
}
