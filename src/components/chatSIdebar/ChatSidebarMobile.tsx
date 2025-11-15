// ChatSidebarMobile.tsx
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { useChatSummaries } from "../../hooks/useChatSummaries";
import { ChatList } from "./ChatList";

export const ChatSidebarMobile: React.FC<{ onSelectChat?: (id: string) => void }> = ({
  onSelectChat,
}) => {
  const { chatId, setChatId } = useSession();
  const { chats, upsert } = useChatSummaries();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectChat = (id: string) => {
    setChatId(id);
    onSelectChat?.(id);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    const id = crypto.randomUUID();
    upsert({ chat_id: id, summary: "New chat", ts: Date.now() });
    handleSelectChat(id);
  };

  return (
    <div className="relative">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-800 dark:text-gray-200"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay + drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl animate-slideIn flex flex-col"
          >
            <ChatList
              chats={chats}
              chatId={chatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
            />
          </aside>
        </div>
      )}
    </div>
  );
};
