import React from "react";
import { ChatStatusBadge } from "./ChatStatusBadge";

export const ChatHeader: React.FC<{ status: string; lastError?: string }> = ({
  status,
  lastError,
}) => (
  <div className="mt-4 flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <h1 className="text-xl font-semibold">Ktulhu Chat</h1>
      <ChatStatusBadge status={status} />
      {lastError && <span className="text-xs text-red-600 ml-2">{lastError}</span>}
    </div>
  </div>
);
