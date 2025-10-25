import { useEffect, useRef, useState } from "react";

export interface ChatSummary {
  chat_id: string;
  session_id?: string | null;
  device_hash?: string | null;
  preview?: string | null;
  ts: number;
}

interface UseChatSummariesOptions {
  baseUrl?: string; // e.g. http://localhost:8080
}

export function useChatSummaries({ baseUrl = "" }: UseChatSummariesOptions = {}) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitial = async () => {
      try {
        const res = await fetch(`${baseUrl}/chat-summary/last`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (isMounted && Array.isArray(data?.chats)) {
          // ✅ Deduplicate by chat_id (keep latest ts)
          const dedupedMap = new Map<string, ChatSummary>();
          for (const chat of data.chats) {
            const existing = dedupedMap.get(chat.chat_id);
            if (!existing || chat.ts > existing.ts) {
              dedupedMap.set(chat.chat_id, chat);
            }
          }

          const deduped = Array.from(dedupedMap.values())
            .sort((a, b) => b.ts - a.ts);

          setChats(deduped);
        }
      } catch (err) {
        console.error("Failed to load chat summaries:", err);
      }
    };

    loadInitial();

    // 🌐 WebSocket for new updates
    const wsUrl = `${baseUrl.replace(/^http/, "ws")}/chat-summary/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("📡 Connected to chat-summary WebSocket");

    ws.onmessage = (event) => {
      try {
        const summary: ChatSummary = JSON.parse(event.data);
        setChats((prev) => {
          const existing = prev.find((c) => c.chat_id === summary.chat_id);
          const updated = existing
            ? prev.map((c) => (c.chat_id === summary.chat_id ? summary : c))
            : [summary, ...prev];
          // ✅ Sort by timestamp descending
          return updated.sort((a, b) => b.ts - a.ts);
        });
      } catch (err) {
        console.warn("Failed to parse chat summary message:", err);
      }
    };

    ws.onclose = () => console.log("❌ Chat-summary WebSocket closed");

    return () => {
      isMounted = false;
      ws.close();
    };
  }, [baseUrl]);

  return chats;
}
