import React from "react";
import type { ChatSummary } from "./useChatSummaries";
import clsx from "clsx";

interface ChatListItemProps {
  chat: ChatSummary;
  onSelect: (chatId: string) => void;
  isActive?: boolean;
}

/**
 * 💬 Displays a single chat summary in the sidebar list.
 * Flat layout with divider, keeping chat-item colors.
 */
export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  onSelect,
  isActive = false,
}) => {
  const chatId = chat.chat_id ?? "unknown";
  const shortId = chatId.length > 8 ? chatId.slice(0, 8) : chatId;

  const time =
    chat.ts && !Number.isNaN(chat.ts)
      ? new Date(chat.ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const preview = chat.preview?.trim() || "No messages yet";

  return (
    <button
      onClick={() => onSelect(chatId)}
      className={clsx(
        // Layout & divider
        "rounded-none w-full text-left px-4 py-2 border-b last:border-b-0 transition-colors duration-150",
        // Divider colors
        "border-app-bg-dark/20 dark:border-app-bg/20",
        // Background and text (keep chat-item scheme)
        isActive
          ? "bg-chat-item-bg text-chat-item-text dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark"
          : "bg-chat-item-bg text-chat-item-text dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark hover:bg-app-bg/80 dark:hover:bg-app-bg-dark/80"
      )}
    >
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-sm font-medium truncate">
          Chat {shortId}
        </span>
        <span className="text-xs opacity-70">{time}</span>
      </div>

      <div className="text-xs opacity-80 truncate">{preview}</div>
    </button>
  );
};
