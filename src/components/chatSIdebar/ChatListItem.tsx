// components/chatSidebar/ChatListItem.tsx
import React from "react";
import type { ChatSummary } from "./useChatStream";
import clsx from "clsx";

interface ChatListItemProps {
  chat: ChatSummary;
  onSelect: (chatId: string) => void;
  isActive?: boolean; // optional highlight for open chat
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  onSelect,
  isActive = false,
}) => {
  // Defensive fallbacks for incomplete Kafka / WS data
  const chatId = chat?.chat_id ?? chat?.session_id ?? "unknown";
  const shortId = typeof chatId === "string" ? chatId.slice(0, 8) : "—";

  const date =
    chat?.ts && !Number.isNaN(chat.ts)
      ? new Date(chat.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "—";

  const preview =
    typeof chat?.preview === "string" && chat.preview.trim().length > 0
      ? chat.preview
      : "No messages yet";

  return (
    <button
      onClick={() => onSelect(chatId)}
      className={clsx(
        "w-full text-left px-4 py-2 rounded-lg transition",
        isActive
          ? "bg-gray-200 dark:bg-gray-700"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Chat {shortId}
        </span>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
        {preview}
      </div>
    </button>
  );
};
