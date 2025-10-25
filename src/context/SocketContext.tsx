import React, { createContext, useContext, useRef, useEffect } from "react";
import { useInferSocket } from "../hooks/useInferSocket";
import type { WSStatus } from "../hooks/useInferSocket";

import { getSocketEndpoint } from "../components/lib/getSocketEndpoint";

type SocketContextType = {
  socket: WebSocket | null;
  status: WSStatus; // ✅ use the correct union type
  lastError?: string | null;
  reconnect: () => void;
  sendPrompt: (prompt: string, opts?: any) => void;
  addHandlers: ReturnType<typeof useInferSocket>["addHandlers"];
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const endpoint = getSocketEndpoint();

  const { status, lastError, sendPrompt, cancel, addHandlers } =
    useInferSocket(endpoint);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(endpoint);
    socketRef.current = ws;
    return () => ws.close();
  }, [endpoint]);

  const reconnect = () => {
    socketRef.current?.close();
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        status,
        lastError,
        reconnect,
        sendPrompt,
        addHandlers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx)
    throw new Error("useSocketContext must be used within a SocketProvider");
  return ctx;
}
