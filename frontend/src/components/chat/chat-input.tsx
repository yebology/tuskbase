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
    <div className="min-h-[60px] border-t border-border px-3 lg:px-4 flex items-center">
      <div className="max-w-3xl mx-auto flex items-end gap-2 w-full">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask me to research any topic..."
          className="min-h-[44px] max-h-32 resize-none"
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          size="icon"
          disabled={isLoading || !value.trim()}
          onClick={onSubmit}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
