// components/chatSidebar/ChatSidebar.tsx
import React from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useSession } from "../../context/SessionContext";
import { useChatStream } from "./useChatStream";
import { ChatListItem } from "./ChatListItem";

interface ChatSidebarProps {
  onSelectChat?: (id: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat }) => {
const { status, addHandlers } = useSocketContext();
const { deviceHash } = useSession();
const chats = useChatStream({ status, addHandlers, currentDevice: deviceHash });


  return (
    <aside className="w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col ">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Recent Chats
        </h2>
      </div>

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
              onSelect={onSelectChat || (() => {})}
            />
          ))
        )}
      </div>
    </aside>
  );
};
