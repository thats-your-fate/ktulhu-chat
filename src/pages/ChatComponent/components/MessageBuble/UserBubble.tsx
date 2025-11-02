import React from "react";

interface UserBubbleProps {
  content: string;
}

export const UserBubble: React.FC<UserBubbleProps> = ({ content }) => {
  let displayText = content;

  // ✅ 1️⃣ Try to parse JSON if it looks like a JSON string
  if (typeof content === "string" && content.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(content);
      console.log(parsed)
      if (parsed?.text) {
        displayText = parsed.text;
      }
    } catch {
      /* ignore invalid JSON — just render as-is */
    }
  }

  // ✅ 2️⃣ Optionally hide [Vision Context] metadata from visible text
  if (typeof displayText === "string") {
    displayText = displayText.replace(/\[Vision Context\]:.*$/s, "").trim();
  }

  return (
    <div className="flex justify-end">
      <div
        className={`
          max-w-[85%] whitespace-pre-wrap leading-relaxed rounded-2xl px-3 py-2 text-sm
          bg-message-user-bg text-message-user-text
          dark:bg-message-user-bg-dark dark:text-message-user-text-dark
        `}
      >
        {displayText}
      </div>
    </div>
  );
};
