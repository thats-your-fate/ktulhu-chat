import React, { useRef, useEffect } from "react";

export const Textarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className = "", value, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    // Reset height first to allow shrink
    el.style.height = "auto";

    const maxHeight = window.innerHeight * 0.4; // 40vh in px
    const newHeight = Math.min(el.scrollHeight, maxHeight);

    el.style.height = `${newHeight}px`;
    el.style.overflow = "hidden";
  };

  // Recalculate on mount + whenever value changes externally
  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      value={value}
      onInput={(e) => {
        autoResize();
        props.onInput?.(e);
      }}
      className={`
        block w-full resize-none rounded-xl p-3 text-base transition-[height]
        duration-150 ease-in-out
        bg-textarea-bg text-textarea-text placeholder-textarea-placeholder 
        border border-textarea-border 
        focus:outline-none focus:ring-2 focus:ring-textarea-ring
        hover:border-textarea-border-hover
        dark:bg-textarea-bg-dark dark:text-textarea-text-dark dark:placeholder-textarea-placeholder-dark 
        dark:border-textarea-border-dark dark:hover:border-textarea-border-hover-dark 
        dark:focus:ring-textarea-ring-dark
        min-h-[6rem] max-h-[40vh]
        ${className}
      `}
      style={{ overflow: "hidden" }}
    />
  );
};
