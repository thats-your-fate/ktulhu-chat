import React from "react";
import { Send, Loader2 } from "lucide-react";

export type StatusType = "idle" | "thinking";

interface StatusButtonProps {
  status?: StatusType;
  onClick?: () => void;
}

export const StatusButton: React.FC<StatusButtonProps> = ({
  status = "idle",
  onClick,
}) => {
  const isThinking = status === "thinking";

  return (
    <button
      type="button"
      onClick={!isThinking ? onClick : undefined}
      disabled={isThinking}
      className={`
        flex items-center justify-center
        rounded-md p-2 transition-opacity duration-150
        text-chat-item-text dark:text-chat-item-text-dark
        bg-chat-item-bg dark:bg-chat-item-bg-dark
        ${isThinking ? "opacity-80 cursor-wait" : ""}
      `}
      title={isThinking ? "Generating..." : "Send"}
    >
      {isThinking ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Send className="w-4 h-4" />
      )}
    </button>
  );
};
