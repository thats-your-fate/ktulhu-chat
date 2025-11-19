import React, { useState, useRef, useEffect } from "react";
import type { ChatSummary } from "../../hooks/useChatSummaries";
import { MoreHorizontal } from "lucide-react";
import clsx from "clsx";

interface ChatListItemProps {
  chat: ChatSummary;
  onSelect: (chatId: string) => void;
  onDelete: (chatId: string) => void;   // <--- add delete handler
  isActive?: boolean;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  onSelect,
  onDelete,
  isActive = false,
}) => {
  const chatId = chat.chat_id ?? "unknown";
  const shortId = chatId.length > 8 ? chatId.slice(0, 8) : chatId;
  const title = chat.summary?.trim() || `Chat ${shortId}`;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

return (
  <div className="relative group">
    
    {/* Main row click area */}
    <button
      onClick={() => onSelect(chatId)}
      className={clsx(
        "w-full text-left px-4 pr-10 py-2",
        "border-none outline-none focus:outline-none",
        "transition-none", // 🔥 remove transitions
        isActive
          ? "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          : "bg-transparent text-gray-800 dark:text-gray-200"
      )}
    >
      <span
        className={clsx(
          "text-sm font-medium truncate",
          !isActive && "opacity-80"
        )}
      >
        {title}
      </span>
    </button>

    {/* 3-dot button (no hover styles) */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
      }}
      className={clsx(
        "absolute right-2 top-2 p-1 rounded-md",
        "opacity-0 group-hover:opacity-100",
        "transition-opacity duration-150",
        "bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent" // 🔥 no tint
      )}
    >
      <MoreHorizontal size={18} />
    </button>

    {/* Popup menu */}
    {menuOpen && (
      <div
        ref={menuRef}
        className="
          absolute right-2 top-8
          w-32 p-2 z-20
          bg-white dark:bg-gray-800
          rounded-md shadow-lg 
          border border-gray-200 dark:border-gray-700
        "
      >

        {/* Delete button (no hover tint) */}
        <button
          className="
            w-full text-left px-2 py-1 text-sm rounded
            bg-transparent
            hover:bg-transparent
            active:bg-transparent
            focus:bg-transparent
          "
          onClick={() => {
            setMenuOpen(false);
            onDelete(chatId);
          }}
        >
          Delete chat
        </button>

        {/* Rename button (no hover tint) */}
        <button
          className="
            w-full text-left px-2 py-1 text-sm rounded
            bg-transparent
            hover:bg-transparent
            active:bg-transparent
            focus:bg-transparent
          "
          onClick={() => {
            setMenuOpen(false);
            alert('Not implemented yet');
          }}
        >
          Rename (TODO)
        </button>

      </div>
    )}
  </div>
);
}
