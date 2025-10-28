import React, { useState, useRef, useEffect } from "react";
import { SvgIcon } from "../../../components/ui/SvgIcon"; // your inline SVG loader

export const FileUploader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileClick = (type: string) => {
    if (inputRef.current) {
      inputRef.current.value = ""; // allow reselecting same file
      inputRef.current.click();
    }
    setOpen(false);
    console.log(`Uploading ${type}...`);
  };

  const handleButtonClick = () => {
    setOpen((v) => !v);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleButtonClick}
        className={`
          w-9 h-9 flex items-center justify-center
          rounded-md
          text-sm
          bg-chat-item-bg text-chat-item-text
          dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark
          hover:bg-chat-item-bg-hover dark:hover:bg-chat-item-bg-hover-dark
          transition-all duration-150
        `}
        title="Upload"
      >
        <SvgIcon name="plus" size={18} color="currentColor" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className={`
            absolute bottom-12 left-0 z-20
            bg-chat-item-bg text-chat-item-text
            dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark
            rounded-lg shadow-md border border-gray-200 dark:border-gray-700
            py-1 text-sm w-44
          `}
        >
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li
              className="px-3 py-2 hover:bg-muted dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2"
              onClick={() => handleFileClick("file")}
            >
              <SvgIcon name="document" size={16} color="currentColor" />
              <span>Upload File</span>
            </li>

            <li
              className="px-3 py-2 hover:bg-muted dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2"
              onClick={() => handleFileClick("image")}
            >
              <SvgIcon name="picture" size={16} color="currentColor" />
              <span>Upload Image</span>
            </li>

            <li
              className="px-3 py-2 hover:bg-muted dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2"
              onClick={() => handleFileClick("video")}
            >
              <SvgIcon name="video" size={16} color="currentColor" />
              <span>Upload Video</span>
            </li>
          </ul>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) alert(`Selected: ${file.name}`);
        }}
      />
    </div>
  );
};
