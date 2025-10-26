import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "../context/SessionContext";

export type WSStatus = "idle" | "connecting" | "open" | "closed" | "error";

type HandlerSet = {
  onToken?: (t: string) => void;
  onDone?: () => void;
  onAny?: (data: any) => void;
};

export function useInferSocket(endpoint: string) {
  const { deviceHash, sessionId, chatId } = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const inflightId = useRef<string | null>(null);

  // 🧩 Maintain multiple listeners instead of one
  const listeners = useRef<Set<HandlerSet>>(new Set());
  // Hot-reload safety: ensure listeners.current is a Set
if (!(listeners.current instanceof Set)) {
  listeners.current = new Set();
}

  const reconnectBackoff = useRef(500);
  const reconnecting = useRef(false);

  const connect = useCallback(() => {
    if (reconnecting.current) return;
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING))
      return;

    try {
      reconnecting.current = true;
      setStatus("connecting");
      const ws = new WebSocket(endpoint);
      wsRef.current = ws;

      
      ws.onopen = () => {
        reconnecting.current = false;
        setStatus("open");
        setLastError(null);
        reconnectBackoff.current = 500;
 ws.send(JSON.stringify({
  type: "register",
   device_hash: deviceHash,
  session_id: sessionId,
  chat_id: chatId, // ✅ tell backend what thread this socket belongs to
}));
      };

      ws.onmessage = (ev) => {
        const data = ev.data;
        let msg: any;

        if (typeof data === "string" && data[0] !== "{") {
          for (const h of listeners.current) h.onToken?.(data);
          return;
        }

        try {
          msg = JSON.parse(data);
        } catch {
          console.warn("Bad JSON:", data);
          return;
        }

        for (const h of listeners.current) {
          h.onAny?.(msg);
          if (msg.token) h.onToken?.(msg.token);
          if (msg.done) h.onDone?.();
        }
      };

      ws.onerror = () => {
        setStatus("error");
        setLastError("WebSocket error");
      };

      ws.onclose = () => {
        setStatus("closed");
        reconnecting.current = false;
        setTimeout(connect, reconnectBackoff.current);
        reconnectBackoff.current = Math.min(reconnectBackoff.current * 2, 8000);
      };
    } catch (e: any) {
      reconnecting.current = false;
      setStatus("error");
      setLastError(e?.message ?? "Failed to connect");
    }
  }, [endpoint, deviceHash,chatId]);

  useEffect(() => {
    connect();
      return () => wsRef.current?.close();
    return () => wsRef.current?.close();
  }, [connect,chatId]);

  const sendPrompt = useCallback(
    (prompt: string, opts?: { model?: string; convoId?: string }) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error("Socket not open");

      const id = uuidv4();
      inflightId.current = id;
      const payload = {
        id,
        session_id: sessionId,
        chat_id: chatId,
        device_hash: deviceHash,
        text: prompt,
        model: opts?.model ?? "mistral-7b-lora",
      };
      ws.send(JSON.stringify(payload));
      return id;
    },
    [sessionId, chatId, deviceHash]
  );

  const cancel = useCallback(() => {
    const id = inflightId.current;
    if (!id) return;
    try {
      wsRef.current?.send(JSON.stringify({ type: "cancel", id }));
    } catch {}
    inflightId.current = null;
  }, []);

  // ✅ New registration-based API
  const addHandlers = useCallback((h: HandlerSet) => {
    listeners.current.add(h);
    return () => listeners.current.delete(h); // cleanup function
  }, []);

return { status, lastError, sendPrompt, cancel, addHandlers, wsRef } as const;
}
