// ChatSidebar.tsx
import React from "react";
import { useSession } from "../../context/SessionContext";
import { useChatSummaries } from "../../hooks/useChatSummaries";
import { ChatList } from "./ChatList";

export const ChatSidebar: React.FC<{ onSelectChat?: (id: string) => void }> = ({ onSelectChat }) => {
  const { chatId, setChatId } = useSession();
  const { chats, upsert } = useChatSummaries();

  const handleSelectChat = (id: string) => {
    setChatId(id);
    onSelectChat?.(id);
  };

  const handleNewChat = () => {
    const id = crypto.randomUUID();
    upsert({ chat_id: id, summary: "New chat", ts: Date.now() });
    handleSelectChat(id);
  };

  return (
    <aside className="w-72 px-4 bg-white dark:bg-gray-900  border-gray-200 dark:border-gray-700">
      <ChatList
        chats={chats}
        chatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
    </aside>
  );
};
