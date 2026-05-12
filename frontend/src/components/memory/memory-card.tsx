import { Badge } from "@/components/ui/badge";
import { getTrustLabel, formatTimestamp } from "@/lib/formatters";
import type { Memory } from "@/types";
import { cn } from "@/lib/utils";

interface MemoryCardProps {
  memory: Memory;
  isSelected?: boolean;
  onClick?: () => void;
}

/** Compact memory card for list views */
export function MemoryCard({ memory, isSelected, onClick }: MemoryCardProps) {
  const trust = getTrustLabel(memory.trustScore);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg transition-colors",
        isSelected
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-muted"
      )}
    >
      <p className="text-sm line-clamp-2">{memory.content}</p>
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="secondary" className="text-[10px]">
          {memory.sourceDomain}
        </Badge>
        <span className={`text-[10px] ${trust.color}`}>● {trust.label}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {formatTimestamp(memory.timestamp)}
        </span>
      </div>
    </button>
  );
}
