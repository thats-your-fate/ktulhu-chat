import React from "react";

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs bg-gray-100 ${className}`}
    >
      {children}
    </span>
  );
};
