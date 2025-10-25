import React from "react";
import { Badge } from "../../../components/ui/Badge";

export const ChatStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    idle: "bg-gray-100",
    connecting: "bg-yellow-100",
    open: "bg-green-100",
    closed: "bg-gray-200",
    error: "bg-red-100",
      connected: "bg-green-100",
  disconnected: "bg-red-100",
  };

  return <Badge className={`${map[status]} ml-2`}>{status}</Badge>;
};
