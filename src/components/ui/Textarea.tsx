import React from "react";

export const Textarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className = "", ...props }) => {
  return (
    <textarea
      {...props}
      className={`
        h-full w-full resize-none rounded-xl p-3 text-base transition 
        bg-textarea-bg text-textarea-text placeholder-textarea-placeholder 
        border border-textarea-border 
        focus:outline-none focus:ring-2 focus:ring-textarea-ring
        hover:border-textarea-border-hover
        dark:bg-textarea-bg-dark dark:text-textarea-text-dark dark:placeholder-textarea-placeholder-dark 
        dark:border-textarea-border-dark dark:hover:border-textarea-border-hover-dark 
        dark:focus:ring-textarea-ring-dark
        ${className}
      `}
    />
  );
};
