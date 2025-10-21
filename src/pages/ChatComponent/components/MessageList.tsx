
import React from "react";
import { MessageBubble } from "./ChatMessageBuble";

export const MessageList: React.FC<{ history: { id: string; role: string; content: string }[] }> = ({
  history,
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Start a conversation. Your messages stay in this browser only.
      </div>
    );
  }
  return (
    <div className="space-y-3">
{history.map((m) =>
  m.role === "user" ? (
    <div key={m.id} className="flex justify-end">
      <MessageBubble role={m.role} content={m.content} />
    </div>
  ) : (
    // No wrapper → full-width markdown can expand
    <MessageBubble key={m.id} role={m.role} content={m.content} />
  )
)}

    </div>
  );
};
