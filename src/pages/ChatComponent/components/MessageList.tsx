import React from "react";
import { MessageBubble } from "./MessageBuble";

interface Message {
  id: string;
  role: string;
  content: string;
}

interface MessageListProps {
  history: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Start a conversation. Your messages stay in this browser only.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((m) => {
        // 👇 this ensures React remounts MarkdownRenderer when message text changes
        const key = `${m.id}-${m.content.length}`;

        return m.role === "user" ? (
          <div key={key} className="flex justify-end">
            <MessageBubble role={m.role} content={m.content} />
          </div>
        ) : (
          <MessageBubble key={key} role={m.role} content={m.content} />
        );
      })}
    </div>
  );
};

