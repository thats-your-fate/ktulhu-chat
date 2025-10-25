// components/shell/ShellMobileSidebar.tsx
import React from "react";
import { ChatSidebar } from "../../chatSIdebar";

type ShellMobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat?: (chatId: string) => void;
};

export const ShellMobileSidebar: React.FC<ShellMobileSidebarProps> = ({
  isOpen,
  onClose,
  onSelectChat,
}) => {
  return (
    <>
      {/* Dim background overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-in drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chats
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <ChatSidebar onSelectChat={(id) => {
          onSelectChat?.(id);
          onClose(); // auto-close on selection
        }} />
      </div>
    </>
  );
};
