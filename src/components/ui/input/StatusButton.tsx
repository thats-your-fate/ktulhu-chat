import React from "react";
import { SvgIcon } from "../SvgIcon";

interface StatusButtonProps {
  /** Whether the system is currently recording audio */
  isRecording?: boolean;
  /** Whether the system is currently processing or busy */
  isProcessing?: boolean;
  /** Callback when clicked */
  onClick?: () => void;
}

export const StatusButton: React.FC<StatusButtonProps> = ({
  isRecording = false,
  isProcessing = false,
  onClick,
}) => {
  // Decide which icon to show
  let iconName = "petir";
  let bgClass =
    "text-sm bg-chat-item-bg text-chat-item-text dark:bg-chat-item-bg-dark dark:text-chat-item-text-dark rounded-md px-0 py-1";

  if (isRecording) {
    iconName = "stop";
    bgClass =
      "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600";
  } else if (isProcessing) {
    iconName = "mic"; // use airplane while "sending" or processing
    bgClass =
      "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center justify-center
        rounded-md p-2 transition-colors duration-150
        text-white ${bgClass}
      `}
      title={
        isRecording ? "Stop recording" : isProcessing ? "Sending..." : "Start recording"
      }
    >
      <SvgIcon name={iconName} size={18} color="white" />
    </button>
  );
};
