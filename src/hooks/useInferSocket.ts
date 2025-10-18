import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type WSStatus = "idle" | "connecting" | "open" | "closed" | "error";

export function useInferSocket(endpoint: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const inflightId = useRef<string | null>(null);
  const listeners = useRef<{ onToken?: (t: string) => void; onDone?: () => void; onAny?: (data: any) => void }>({});
  const backoffRef = useRef(500);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) return;
    try {
      setStatus("connecting");
      const ws = new WebSocket(endpoint);
      wsRef.current = ws;
      ws.onopen = () => {
        setStatus("open");
        setLastError(null);
        backoffRef.current = 500;
      };
      ws.onmessage = (ev) => {
        const raw = ev.data;
        try {
          const msg = JSON.parse(raw);
          listeners.current.onAny?.(msg);
          if (typeof msg?.token === "string") listeners.current.onToken?.(msg.token);
          if (msg?.done === true) listeners.current.onDone?.();
        } catch {
          listeners.current.onToken?.(String(raw));
        }
      };
      ws.onerror = () => {
        setStatus("error");
        setLastError("WebSocket error");
      };
      ws.onclose = () => {
        setStatus("closed");
        setTimeout(connect, backoffRef.current);
        backoffRef.current = Math.min(backoffRef.current * 2, 8000);
      };
    } catch (e: any) {
      setStatus("error");
      setLastError(e?.message ?? "Failed to connect");
    }
  }, [endpoint]);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);

  const sendPrompt = useCallback((prompt: string, opts?: { model?: string; convoId?: string }) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) throw new Error("Socket not open");
    const id = uuidv4();
    inflightId.current = id;
    const payload: any = { type: "chat", id, prompt };
    if (opts?.model) payload.model = opts.model;
    if (opts?.convoId) payload.conversation_id = opts.convoId;
    wsRef.current.send(JSON.stringify(payload));
    return id;
  }, []);

  const cancel = useCallback(() => {
    const id = inflightId.current;
    if (!id) return;
    try { wsRef.current?.send(JSON.stringify({ type: "cancel", id })); } catch {}
    inflightId.current = null;
  }, []);

  const setHandlers = useCallback((h: typeof listeners.current) => { listeners.current = h; }, []);

  return { status, lastError, sendPrompt, cancel, setHandlers } as const;
}
