// ChatList.tsx
import React from "react";
import { ChatListItem } from "./ChatListItem";
import type { ChatSummary } from "../../hooks/useChatSummaries";

export const ChatList: React.FC<{
  chats: ChatSummary[];
  chatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;   // <-- ADD THIS
}> = ({ chats, chatId, onSelectChat, onNewChat, onDeleteChat }) => {

  return (
    <div className="flex flex-col h-full">
      {/* New Chat button */}
      <button
        onClick={onNewChat}
        className="w-full text-left px-4 pr-2 py-2
        border-none outline-none focus:outline-none focus:ring-0
        appearance-none select-none bg-transparent"
      >
        + New Chat
      </button>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 p-4">
            No chats yet.
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.chat_id}
              chat={chat}
            isActive={chat.chat_id === chatId}
            onSelect={() => onSelectChat(chat.chat_id)}
            onDelete={() => onDeleteChat(chat.chat_id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
