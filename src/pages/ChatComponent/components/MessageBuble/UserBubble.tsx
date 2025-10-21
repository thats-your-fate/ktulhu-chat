import React from "react";

interface UserBubbleProps {
  content: string;
}

export const UserBubble: React.FC<UserBubbleProps> = ({ content }) => (
  <div className="flex justify-end">
    <div
      className={`
        max-w-[85%] whitespace-pre-wrap leading-relaxed rounded-2xl px-3 py-2 text-sm 
        bg-message-user-bg text-message-user-text
        dark:bg-message-user-bg-dark dark:text-message-user-text-dark
      `}
    >
      {content}
    </div>
  </div>
);
