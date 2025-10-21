import React from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AssistantBubbleProps {
  content: string;
}

export const AssistantBubble: React.FC<AssistantBubbleProps> = ({ content }) => {
  const containsCode = content.includes("`");

  return (
    <div
      id="model-answer"
      className={`
        w-full text-base leading-relaxed px-2 md:px-6 py-3
        prose prose-sm max-w-none dark:prose-invert
        text-message-assistant-text dark:text-message-assistant-text-dark
        space-y-4
      `}
    >
      {containsCode ? (
        <MarkdownRenderer content={content} />
      ) : (
        <p className="whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
};
