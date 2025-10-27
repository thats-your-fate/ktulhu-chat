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
 * Supports "New chat" placeholder state until a real summary/text arrives.
 */
export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  onSelect,
  isActive = false,
}) => {
  const chatId = chat.chat_id ?? "unknown";
  const shortId = chatId.length > 8 ? chatId.slice(0, 8) : chatId;

  // 🕒 Format time safely
  const time =
    chat.ts && !Number.isNaN(chat.ts)
      ? new Date(chat.ts).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  // 🧠 Determine if this is a placeholder (no summary or text yet)
  const isPlaceholder =
    (!chat.summary || chat.summary.trim() === "") &&
    (!chat.text || chat.text.trim() === "");

  // 🧾 Display logic
  const summary = chat.summary?.trim() || "";
  const text = chat.text?.trim() || "";
  const title = isPlaceholder ? "New chat…" : summary || `Chat ${shortId}`;
  const subtext = isPlaceholder
    ? "Waiting for model summary…"
    : text
    ? text.length > 100
      ? text.slice(0, 100) + "…"
      : text
    : summary || "No messages yet";

  return (
    <button
      onClick={() => onSelect(chatId)}
      className={clsx(
        "rounded-none w-full text-left px-4 py-2 border-b last:border-b-0 transition-colors duration-150",
        "border-app-bg-dark/20 dark:border-app-bg/20",
        isActive
          ? "bg-indigo-600 text-white"
          : "bg-chat-item-bg text-chat-item-text dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark hover:bg-app-bg/80 dark:hover:bg-app-bg-dark/80"
      )}
    >
      <div className="flex justify-between items-center mb-0.5">
        <span
          className={clsx(
            "text-sm font-medium truncate",
            isPlaceholder && "italic opacity-70"
          )}
        >
          {title}
        </span>
        <span className="text-xs opacity-70">{time}</span>
      </div>

      <div
        className={clsx(
          "text-xs truncate",
          isPlaceholder ? "italic opacity-60" : "opacity-80"
        )}
      >
        {subtext}
      </div>
    </button>
  );
};
