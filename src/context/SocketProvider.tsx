import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "./SessionContext";
import { getSocketEndpoint } from "../utils/getSocketEndpoint";

type WSStatus = "idle" | "connecting" | "open" | "closed" | "error";

type HandlerSet = {
  onToken?: (t: string) => void;
  onDone?: () => void;
  onAny?: (data: any) => void;
    onSystem?: (msg: any) => void;
};

type SocketContextType = {
  wsRef: React.MutableRefObject<WebSocket | null>;
  status: WSStatus;
  lastError?: string | null;
  sendPrompt: (text: string, opts?: any) => string | void;
  addHandlers: (h: HandlerSet) => () => void;
  cancel: () => void;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceHash, sessionId, chatId } = useSession();

  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const listeners = useRef<Set<HandlerSet>>(new Set());
  const reconnecting = useRef(false);
  const reconnectBackoff = useRef(500);
  const inflightId = useRef<string | null>(null);

  // Make sure listeners stays a Set (for hot reload)
  if (!(listeners.current instanceof Set)) {
    listeners.current = new Set();
  }

  const connect = useCallback(() => {
    if (reconnecting.current) return;

    const ws = wsRef.current;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING))
      return;

    reconnecting.current = true;
    setStatus("connecting");

    const socket = new WebSocket(getSocketEndpoint());
    wsRef.current = socket;

    socket.onopen = () => {
      reconnecting.current = false;
      setStatus("open");
      setLastError(null);
      reconnectBackoff.current = 500;

      // Send register on each open
      socket.send(JSON.stringify({
        type: "register",
        device_hash: deviceHash,
        session_id: sessionId,
        chat_id: chatId,
      }));
    };

socket.onmessage = (ev) => {
  const raw = ev.data;
  let msg: any;

  // FIX: accept JSON even if preceded by whitespace/newlines
  if (typeof raw === "string" && !raw.trim().startsWith("{")) {
    for (const h of listeners.current) h.onToken?.(raw);
    return;
  }

  try {
    msg = JSON.parse(raw);
  } catch {
    console.warn("Bad JSON:", raw);
    return;
  }

  for (const h of listeners.current) {
    h.onAny?.(msg);

    if (msg.type === "system") {
      h.onSystem?.(msg);
    }

    if (msg.token) {
      h.onToken?.(msg.token);
    }

    if (msg.done) {
      h.onDone?.();
    }
  }
};


    socket.onerror = () => {
      setStatus("error");
      setLastError("WebSocket error");
    };

    socket.onclose = () => {
      setStatus("closed");
      reconnecting.current = false;
      setTimeout(connect, reconnectBackoff.current);
      reconnectBackoff.current = Math.min(reconnectBackoff.current * 2, 8000);
    };
  }, [deviceHash, sessionId, chatId]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  const sendPrompt = useCallback(
    (text: string, opts?: any) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error("WS not open");
        return;
      }

      const id = uuidv4();
      inflightId.current = id;

      ws.send(JSON.stringify({
        id,
        text,
        device_hash: deviceHash,
        session_id: sessionId,
        chat_id: chatId,
        ...opts,
      }));

      return id;
    },
    [chatId, sessionId, deviceHash]
  );

  const cancel = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    if (inflightId.current) {
      ws.send(JSON.stringify({ type: "cancel", id: inflightId.current }));
      inflightId.current = null;
    }
  }, []);

  const addHandlers = useCallback((h: HandlerSet) => {
    listeners.current.add(h);
    return () => listeners.current.delete(h);
  }, []);

  return (
    <SocketContext.Provider value={{ wsRef, status, lastError, sendPrompt, addHandlers, cancel }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketContext must be used within SocketProvider");
  return ctx;
}
