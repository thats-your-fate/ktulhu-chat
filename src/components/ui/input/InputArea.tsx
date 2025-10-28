import React, { useRef, useEffect } from "react";
import { StatusButton, FileUploader } from "./index";
export const InputArea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  className?: string;
  RightButton?: React.ReactNode; // 👈 new prop
}> = ({ value, onChange, onKeyDown, placeholder, className = "", RightButton }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = window.innerHeight * 0.4;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <div
      className={`
        relative flex items-end w-full
        border border-gray-300 dark:border-gray-700
        rounded-xl
        focus-within:ring-2 focus-within:ring-blue-500
        transition-all duration-150 ease-in-out
        ${className}
      `}
    >
      {/* Left icon (optional) */}
      <div className="flex-shrink-0 p-2 flex items-end" >
<FileUploader/>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? "Type a message..."}
        rows={1}
        className={`
          flex-1 resize-none rounded-xl p-3 text-base
          bg-transparent text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none
          min-h-[3rem] max-h-[40vh]
          overflow-hidden
          px-2  /* leave space for button */
        `}
        style={{ lineHeight: "1.5" }}
      />

      {/* Right dynamic button (inside textarea area) */}

  <div className="absolute right-2 bottom-2 flex items-center text-sm bg-chat-item-bg text-chat-item-text dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark rounded-md px-2 py-1">
    <StatusButton/>
  </div>

    </div>
  );
};
