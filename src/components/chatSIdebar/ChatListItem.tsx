import React from "react";
import type { ChatSummary } from "../../hooks/useChatSummaries";
import clsx from "clsx";

interface ChatListItemProps {
  chat: ChatSummary;
  onSelect: (chatId: string) => void;
  isActive?: boolean;
}

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
      : "";

  const title = chat.summary?.trim() || `Chat ${shortId}`;

  return (
    <button
      onClick={() => onSelect(chatId)}
      className={clsx(
        // BASE BUTTON RESET — removes all borders/outlines
        "w-full text-lg  text-left px-4 pr-2 py-2",
        "border-none outline-none focus:outline-none focus:ring-0",
        "appearance-none select-none",

        // COLORS
        isActive
          ? "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          : "bg-transparent text-gray-800 dark:text-gray-200",

        // HOVER
        !isActive && "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none",

        // TRANSITION
        "transition-colors duration-150"
      )}
    >
      <div className="flex justify-between items-center">
        <span
          className={clsx(
            "text-sm font-medium truncate",
            !isActive && "opacity-80"
          )}
        >
          {title}
        </span>

        {time && (
          <span
            className={clsx(
              "text-xs whitespace-nowrap",
              isActive ? "opacity-100" : "opacity-70"
            )}
          >
            {time}
          </span>
        )}
      </div>
    </button>
  );
};
