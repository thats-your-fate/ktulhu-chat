import React from "react";
import { MessageBubble } from "./MessageBuble";

export interface Message {
  id: string;
  role: "assistant" | "user" | "system" | "summary";
  content: string;
}

interface MessageListProps {
  history: Message[];
}

/**
 *  MessageList
 * Displays chat messages in correct order.
 * Uses stable keys and minimal re-renders.
 */
export const MessageList: React.FC<MessageListProps> = ({ history }) => {
  if (!history?.length) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 select-none overflow-hidden">
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
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
        {history.map((m) => (
          <div
            key={m.id}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <MessageBubble role={m.role} content={m.content} />
          </div>
        ))}
      </div>
    </div>
  );
};
