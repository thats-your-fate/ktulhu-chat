import React from "react";
import { Textarea } from "../../../components/ui/Textarea";
import { Button } from "../../../components/ui/Button";

interface Props {
  input: string;
  setInput: (v: string) => void;
  handleSend: () => void;
  isSending: boolean;
  cancel: () => void;
  clear: () => void;
}

export const ChatInput: React.FC<Props> = ({
  input,
  setInput,
  handleSend,
  isSending,
  cancel,
  clear,
}) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <Textarea
        rows={2}
        placeholder="Ask anything…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="flex flex-col gap-2 w-28">
        <Button onClick={handleSend} disabled={isSending || !input.trim()}>
          Send
        </Button>
        <Button variant="outline" onClick={cancel} disabled={!isSending}>
          Stop
        </Button>
        <Button variant="ghost" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
};
