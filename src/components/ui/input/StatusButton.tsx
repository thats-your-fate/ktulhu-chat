import React from "react";
import { SvgIcon } from "../SvgIcon";

export type StatusType = "idle" | "thinking";

interface StatusButtonProps {
  status?: StatusType;
  onClick?: () => void;
  /** optional overrides if your icon names differ */
  icons?: {
    idle?: string;      // default: "petir"
    thinking?: string;  // default: "loader" (falls back to "petir" if missing)
  };
}

export const StatusButton: React.FC<StatusButtonProps> = ({
  status = "idle",
  onClick,
  icons,
}) => {
  const isThinking = status === "thinking";

  const idleIcon = icons?.idle ?? "petir";
  const thinkingIcon = icons?.thinking ?? "loader";

  // if you don't have a "loader" icon, we'll spin the old one
  const useFallbackSpin = thinkingIcon === "loader" ? false : true;

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
      <SvgIcon
        name={isThinking ? thinkingIcon : idleIcon}
        size={18}
        color="currentColor"
        className={isThinking ? (useFallbackSpin ? "animate-spin" : "") : ""}
      />
    </button>
  );
};
