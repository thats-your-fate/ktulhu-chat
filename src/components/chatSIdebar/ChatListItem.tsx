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
 */
export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  onSelect,
  isActive = false,
}) => {
  const chatId = chat.chat_id ?? "unknown";
  const shortId =
    chatId.length > 8 ? chatId.slice(0, 8) : chatId;

  const time =
    chat.ts && !Number.isNaN(chat.ts)
      ? new Date(chat.ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  // 🧠 Pick a safe preview text
  const preview = chat.preview?.trim() || "No messages yet";

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
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          Chat {shortId}
        </span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
        {preview}
      </div>
    </button>
  );
};
