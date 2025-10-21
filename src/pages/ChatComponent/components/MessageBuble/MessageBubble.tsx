import React from "react";
import { UserBubble } from "./UserBubble";
import { AssistantBubble } from "./AssistantBubble";

export interface MessageBubbleProps {
  role: string;
  content: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ role, content }) => {
    if (role === "user") {
      return <UserBubble content={content} />;
    }
    return <AssistantBubble content={content} />;
  }
);
