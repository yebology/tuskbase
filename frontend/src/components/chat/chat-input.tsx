import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

/** Chat input with send button and keyboard shortcut */
export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="border-t border-border px-4 lg:px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask me to research any topic..."
          className="min-h-[48px] max-h-32 resize-none flex-1"
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          size="icon"
          disabled={isLoading || !value.trim()}
          onClick={onSubmit}
          className="shrink-0 h-10 w-10"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="max-w-3xl mx-auto text-[10px] text-muted-foreground mt-2 text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
