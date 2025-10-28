import React from "react";
import type { ChatSummary } from "./useChatSummaries";
import clsx from "clsx";

interface ChatListItemProps {
  chat: ChatSummary;
  onSelect: (chatId: string) => void;
  isActive?: boolean;
}

/**
 * 💬 Clean, borderless chat list item with theme colors and slightly bolder font.
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
      : "";

  const title = chat.summary?.trim() || `Chat ${shortId}`;

return (
   <button onClick={() => onSelect(chatId)} className={clsx(
     "w-full text-left px-4 py-2 rounded-md transition-colors duration-150",
     "border border-transparent outline-none ",
     isActive ? "bg-transparent text-black dark:bg-gray-600 dark:text-white" : "bg-transparent text-chat-item-text dark:text-chat-item-text-dark"
   )}>
     <div className="flex justify-between items-center">
       <span className={clsx(
         "text-sm font-semibold truncate",
         !isActive && "opacity-70"
       )}>
         {title}
       </span>
       {time && (
         <span className={clsx(
           "text-xs",
           isActive ? "text-white/80" : "opacity-70"
         )}>
           {time}
         </span>
       )}
     </div>
   </button>
 );
};
