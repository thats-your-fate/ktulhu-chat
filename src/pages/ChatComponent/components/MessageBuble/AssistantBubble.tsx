import React from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AssistantBubbleProps {
  content: string;
}

export const AssistantBubble: React.FC<AssistantBubbleProps> = ({ content }) => {
console.log("ASSISTANT BUBBLE CONTENT:", JSON.stringify(content));
  return (
    <div

      className={`
        model-answer w-full text-base leading-relaxed px-2 md:px-6 py-3
        prose prose-sm max-w-none dark:prose-invert
        text-message-assistant-text dark:text-message-assistant-text-dark
        space-y-4
      `}
    >
        <MarkdownRenderer key={content.length} content={content} />

    </div>
  );
};
