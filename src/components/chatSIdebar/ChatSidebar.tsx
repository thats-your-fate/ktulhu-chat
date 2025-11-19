// ChatSidebar.tsx
import React from "react";
import { useSession } from "../../context/SessionContext";
import { useChatSummaries } from "../../hooks/useChatSummaries";
import { ChatList } from "./ChatList";
import { deleteChatThread, createNewChat } from "./utils/chatActions";

interface ChatSidebarProps {
  onSelectChat?: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat }) => {
  const { chatId, setChatId } = useSession();
  const { chats, upsert, remove } = useChatSummaries();

  /* ---------------------------------------------
     SELECT CHAT
  --------------------------------------------- */
  const handleSelectChat = (id: string) => {
    setChatId(id);
    onSelectChat?.(id);
  };

  /* ---------------------------------------------
     DELETE CHAT
  --------------------------------------------- */
  const handleDeleteChat = (id: string) => {
    deleteChatThread(id, { remove });
  };

  /* ---------------------------------------------
     NEW CHAT
  --------------------------------------------- */
  const handleNewChat = () => {
    const id = createNewChat({ upsert });
    setChatId(id);
  };

  return (
    <aside className="w-72 px-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <ChatList
        chats={chats}
        chatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
    </aside>
  );
};
