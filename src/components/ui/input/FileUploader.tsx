import React, { useState, useRef, useEffect } from "react";
import { SvgIcon } from "../../../components/ui/SvgIcon";
import { analyzeImage } from "../../../utils/visionClient";

export const FileUploader: React.FC<{
  onLabelsDetected?: (labels: string[]) => void;
}> = ({ onLabelsDetected }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentType, setCurrentType] = useState<
    "image" | "video" | "document" | null
  >(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileClick = (type: "image" | "video" | "document") => {
    if (!inputRef.current) return;
    setCurrentType(type);
    switch (type) {
      case "image":
        inputRef.current.accept = "image/*";
        break;
      case "video":
        inputRef.current.accept = "video/*";
        break;
      case "document":
        inputRef.current.accept =
          ".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,application/*";
        break;
    }
    inputRef.current.value = "";
    inputRef.current.click();
    setOpen(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`Selected ${currentType}:`, file.name);

    if (currentType === "image") {
      try {
        setLoading(true);
        const data = await analyzeImage(file);
        const labels =
          data.responses?.[0]?.labelAnnotations?.map(
            (l: any) => l.description
          ) || [];
        console.log("Detected labels:", labels);
        onLabelsDetected?.(labels);
      } catch (err) {
        console.error("Vision API error:", err);
        alert("Failed to analyze image");
      } finally {
        setLoading(false);
      }
    } else if (currentType === "video") {
      alert(`Selected video: ${file.name} (not analyzed yet)`);
    } else if (currentType === "document") {
      alert(`Selected document: ${file.name}`);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className={`
          w-9 h-9 flex items-center justify-center
          rounded-md text-sm
          bg-chat-item-bg text-chat-item-text
          dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark
          hover:bg-chat-item-bg-hover dark:hover:bg-chat-item-bg-hover-dark
          transition-all duration-150
        `}
        title="Upload"
      >
        {loading ? (
          <SvgIcon name="loading" size={18} color="currentColor" />
        ) : (
          <SvgIcon name="plus" size={18} color="currentColor" />
        )}
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 z-20 bg-chat-item-bg text-chat-item-text dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark rounded-lg shadow-md border border-gray-200 dark:border-gray-700 py-1 text-sm w-44">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
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
            <li
              className="px-3 py-2 hover:bg-muted dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2"
              onClick={() => handleFileClick("document")}
            >
              <SvgIcon name="document" size={16} color="currentColor" />
              <span>Upload File</span>
            </li>
          </ul>
        </div>
      )}

      <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />
    </div>
  );
};
