import React from "react";
import { useSession } from "../../context/SessionContext";
import { ChatListItem } from "./ChatListItem";
import { useChatSummaries } from "./useChatSummaries";

interface ChatSidebarProps {
  onSelectChat?: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat }) => {
  const { chatId, setChatId } = useSession();
  const { chats, upsert, clear } = useChatSummaries();

  const handleSelectChat = (id: string) => {
    setChatId(id);
    onSelectChat?.(id);
  };

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    handleSelectChat(newId);
    upsert({
      chat_id: newId,
      summary: "New chat",
      ts: Date.now(),
    });
  };

  return (
    <aside className="w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Recent Chats
        </h2>
        <button
          onClick={clear}
          className="text-sm bg-chat-item-bg text-chat-item-text dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark rounded-md px-2 py-1"
          title="Clear all"
        >
          Clear All
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {/* ➕ Full-width New Chat button */}
        <button
          onClick={handleNewChat}
          className={`
            text-left w-full bg-transparent text-chat-item-text dark:text-chat-item-text-dark
          `}
        >
          + New Chat
        </button>

        {chats.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 p-4">
            No chats yet.
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.chat_id}
              chat={chat}
              onSelect={handleSelectChat}
              isActive={chat.chat_id === chatId}
            />
          ))
        )}
      </div>
    </aside>
  );
};
