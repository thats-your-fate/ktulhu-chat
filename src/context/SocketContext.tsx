import React, { useEffect, createContext, useContext } from "react";
import { useInferSocket } from "../hooks/useInferSocket";
import type { WSStatus } from "../hooks/useInferSocket";
import { getSocketEndpoint } from "../components/lib/getSocketEndpoint";

type SocketContextType = {
  wsRef: React.MutableRefObject<WebSocket | null>; // 👈 direct access
  status: WSStatus;
  lastError?: string | null;
  sendPrompt: (prompt: string, opts?: any) => void;
  cancel: () => void;
  addHandlers: ReturnType<typeof useInferSocket>["addHandlers"];
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const endpoint = getSocketEndpoint();

  
  const { wsRef, status, lastError, sendPrompt, cancel, addHandlers } =
    useInferSocket(endpoint); // 👈 single source of truth

useEffect(() => {
  if (!wsRef.current) return;
  console.log("🔌 WebSocket reference from useInferSocket:", wsRef.current);
  wsRef.current.addEventListener("message", (e) => {
    console.log("📨 Global WS message seen in context:", e.data);
  });
}, [wsRef]);

    
  return (
    <SocketContext.Provider
      value={{
        wsRef,
        status,
        lastError,
        sendPrompt,
        cancel,
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
