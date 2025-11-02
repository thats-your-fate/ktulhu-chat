import React from "react";
import { MessageBubble } from "./MessageBuble";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  history: Message[];
}

/**
 * 💬 MessageList
 * Displays chat messages in correct order.
 * Uses stable keys and minimal re-renders.
 */
export const MessageList: React.FC<MessageListProps> = ({ history }) => {
  if (!history?.length) {
    return (
      <div className="flex items-center justify-center h-[60vh] select-none">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-base font-medium mb-1">Start a conversation</p>
          <p className="text-sm opacity-75">
            Your messages stay in this browser only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((m) => (
        <div
          key={m.id} // ✅ stable key based on message id
          className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
        >
          <MessageBubble role={m.role} content={m.content} />
        </div>
      ))}
    </div>
  );
};
