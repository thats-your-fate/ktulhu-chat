import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type WSStatus = "idle" | "connecting" | "open" | "closed" | "error";

export function useInferSocket(endpoint: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const inflightId = useRef<string | null>(null);
  const listeners = useRef<{
    onToken?: (t: string) => void;
    onDone?: () => void;
    onAny?: (data: any) => void;
  }>({});
  const reconnectBackoff = useRef(500);

  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    )
      return;

    try {
      setStatus("connecting");
      const ws = new WebSocket(endpoint);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("open");
        setLastError(null);
        reconnectBackoff.current = 500;
      };

      ws.onmessage = (ev) => { 
        
        try {
          // Direct JSON per message
          const msg = JSON.parse(ev.data);
          listeners.current.onAny?.(msg);
          if (typeof msg.token === "string") listeners.current.onToken?.(msg.token);
          if (msg.done) listeners.current.onDone?.();
        } catch (err) {
          console.warn("Bad JSON message:", ev.data);
        }
      };

      ws.onerror = (err) => {
        console.warn("WebSocket error", err);
        setStatus("error");
        setLastError("WebSocket error");
      };

      ws.onclose = () => {
        setStatus("closed");
        // Reconnect with exponential backoff
        setTimeout(connect, reconnectBackoff.current);
        reconnectBackoff.current = Math.min(reconnectBackoff.current * 2, 8000);
      };
    } catch (e: any) {
      setStatus("error");
      setLastError(e?.message ?? "Failed to connect");
    }
  }, [endpoint]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const sendPrompt = useCallback((prompt: string, opts?: { model?: string; convoId?: string }) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
      throw new Error("Socket not open");

    const id = uuidv4();
    inflightId.current = id;
    const payload: any = { id, text: prompt, model: opts?.model ?? "mistral-7b-lora" };
    wsRef.current.send(JSON.stringify(payload));
    return id;
  }, []);

  const cancel = useCallback(() => {
    const id = inflightId.current;
    if (!id) return;
    try {
      wsRef.current?.send(JSON.stringify({ type: "cancel", id }));
    } catch {}
    inflightId.current = null;
  }, []);

  const setHandlers = useCallback((h: typeof listeners.current) => {
    listeners.current = h;
  }, []);

  return { status, lastError, sendPrompt, cancel, setHandlers } as const;
}
