import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // lightweight icons
import { useSession } from "../../context/SessionContext";
import { ChatListItem } from "./ChatListItem";
import { useChatSummaries } from "./useChatSummaries";

interface ChatSidebarMobileProps {
  onSelectChat?: (id: string) => void;
}

export const ChatSidebarMobile: React.FC<ChatSidebarMobileProps> = ({ onSelectChat }) => {
  const { chatId, setChatId } = useSession();
  const { chats, upsert, clear } = useChatSummaries();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectChat = (id: string) => {
    setChatId(id);
    onSelectChat?.(id);
    setIsOpen(false); // close on selection
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
    <div className="relative">
      {/* Burger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-800 dark:text-gray-200"
        aria-label="Toggle chat sidebar"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Flyout drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col animate-slideIn"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Recent Chats
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleNewChat}
                  className="bg-transparent text-chat-item-text dark:text-chat-item-text-dark"
                >
                  + New
                </button>
                <button
                  onClick={clear}
                  className="bg-transparent text-chat-item-text dark:text-chat-item-text-dark"
                  title="Clear all"
                >
                  🗑
                </button>
              </div>
            </div>

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
                    onSelect={handleSelectChat}
                    isActive={chat.chat_id === chatId}
                  />
                ))
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
