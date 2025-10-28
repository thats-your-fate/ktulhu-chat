import React from "react";
import { InputArea } from "../../../components/ui/input";
import { Button } from "../../../components/ui/Button";
import { SvgIcon } from "../../../components/ui/SvgIcon"; // uses your inline SVG loader

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
      if (isSending) cancel();
      else handleSend();
    }
  };

  const onMainButtonClick = () => {
    if (isSending) cancel();
    else handleSend();
  };

  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0
        flex items-end gap-3
        bg-app-bg/95 dark:bg-app-bg-dark/95
        backdrop-blur-sm
        px-3 py-3
      `}
    >
      {/* InputArea with embedded send/stop/mic button */}
<InputArea
  value={input}
  onChange={setInput}
  onKeyDown={onKeyDown}
  className="w-full"

/>

    </div>
  );
};
