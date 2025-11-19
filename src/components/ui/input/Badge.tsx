import React from "react";

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs 
        bg-badge-bg text-badge-text 
        dark:bg-badge-bg-dark dark:text-badge-text-dark 
        ${className}`}
    >
      {children}
    </span>
  );
};
