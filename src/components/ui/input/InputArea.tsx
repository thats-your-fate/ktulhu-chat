import React, { useState, useRef, useEffect } from "react";
import { StatusButton } from "./StatusButton";
import { FileUploader } from "./index";
import { useSocketContext } from "../../../context/SocketContext";


// types.ts
   interface WSMessage {
  token?: string;
  done?: boolean;
  type?: string;
  [key: string]: unknown;
}



export const InputArea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onSend?: (finalPrompt: string) => Promise<void> | void;
  placeholder?: string;
  className?: string;
}> = ({
  value,
  onChange,
  onKeyDown,
  onSend,
  placeholder,
  className = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addHandlers, sendPrompt } = useSocketContext();
  const [hiddenLabels, setHiddenLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "thinking">("idle");

  // Auto-resize textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, window.innerHeight * 0.4)}px`;
  }, [value]);


  // Handle image labels
  const handleLabelsDetected = (labels: string[]) => {
    if (!labels.length) return;
    const appended = `${value.trim()} ${labels.join(", ")}`.trim();
    onChange(appended);
    setHiddenLabels(labels);
  };

  // React to WS stream lifecycle

useEffect(() => {
  const remove = addHandlers({
    onAny: (msg: WSMessage) => {
      if (msg.token) setStatus("thinking");
      if (msg.done) setStatus("idle");
    },
  });
  return remove;
}, [addHandlers]);

  const handleSend = async () => {
    if (!value.trim() || status === "thinking") return;

    setStatus("thinking"); // immediate visual feedback

    let visionContext = "";
    if (hiddenLabels.length > 0) {
      try {
        visionContext = `\n[Vision Context]: ${JSON.stringify({ labels: hiddenLabels })}\n`;
      } catch {
        visionContext = `\n[Vision Context]: labels: ${hiddenLabels.join(", ")}\n`;
      }
    }

    const finalPrompt = `${value.trim()}${visionContext}`;
    try {
      onSend?.(finalPrompt);
      sendPrompt(finalPrompt);
    } finally {
      onChange("");
      setHiddenLabels([]);
      // Fallback reset if WS never sends done
      setTimeout(() => setStatus("idle"), 20000);
    }
  };

  return (
    <div
      className={`
        relative flex items-end w-full border border-gray-300 dark:border-gray-700
        rounded-xl focus-within:ring-2 focus-within:ring-blue-500
        transition-all duration-150 ease-in-out ${className}
      `}
    >
      <div className="flex-shrink-0 p-2 flex items-end">
        <FileUploader onLabelsDetected={handleLabelsDetected} />
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
          onKeyDown?.(e);
        }}
        placeholder={placeholder ?? "Type a message..."}
        rows={1}
        className={`
          flex-1 resize-none rounded-xl p-3 text-base
          bg-transparent text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none
          min-h-[3rem] max-h-[40vh]
          overflow-hidden px-2
        `}
        disabled={status === "thinking"}
      />

      <div className="absolute right-2 bottom-2 flex items-center">
        <StatusButton status={status} onClick={handleSend} />
      </div>
    </div>
  );
};
