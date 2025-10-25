// components/chatSidebar/useChatStream.ts
import { useEffect, useState } from "react";
import type { WSStatus } from "../../hooks/useInferSocket";

export interface ChatSummary {
  chat_id: string;
  session_id: string;
  device_hash: string;
  preview: string;
  ts: number;
}

interface ChatStreamHookArgs {
  status?: WSStatus | null;
  addHandlers?: (
    handlers: { onAny?: (data: any) => void }
  ) => () => void;
  currentDevice?: string;
}


/**
 * Subscribes to `chat_summary` or Kafka relay messages for the current device.
 * Keeps a sorted list of recent chats (newest first).
 */
export function useChatStream(args?: ChatStreamHookArgs | null) {
  const status = args?.status ?? "idle";
  const addHandlers = args?.addHandlers;
  const currentDevice = args?.currentDevice;
  const [chats, setChats] = useState<ChatSummary[]>([]);

  useEffect(() => {
    if (status !== "open" || typeof addHandlers !== "function") return;

    const handleIncoming = (msg: any) => {
      // Handle both "chat_summary" and Kafka-style payloads
      let data: any = null;
      if (msg?.type === "chat_summary") {
        data = msg.data;
      } else if (msg?.message && msg?.message?.chat_id) {
        // Kafka relay message schema
        data = msg.message;
        msg.ts = msg.ts ?? Date.now();
      }

      if (!data || !data.chat_id) return;
      if (currentDevice && data.device_hash !== currentDevice) return; // show only current device chats

      const chat: ChatSummary = {
        chat_id: data.chat_id,
        session_id: data.session_id ?? "unknown",
        device_hash: data.device_hash ?? "unknown",
        preview: data.text ?? data.preview ?? "",
        ts: msg.ts ?? Date.now(),
      };

      setChats((prev) => {
        const idx = prev.findIndex((c) => c.chat_id === chat.chat_id);
        let updated: ChatSummary[];

        if (idx !== -1) {
          updated = prev.map((c, i) =>
            i === idx ? { ...c, preview: chat.preview, ts: chat.ts } : c
          );
        } else {
          updated = [chat, ...prev];
        }

        return updated.sort((a, b) => b.ts - a.ts);
      });
    };

    // Register handler using addHandlers (multi-listener safe)
    const remove = addHandlers({
      onAny: (msg: any) => {
        try {
          handleIncoming(msg);
        } catch (err) {
          console.warn("useChatStream handler error:", err);
        }
      },
    });

    // Cleanup on unmount or reconnect
    return () => {
      remove?.();
      setChats([]);
    };
  }, [status, addHandlers, currentDevice]);

  return chats;
}
