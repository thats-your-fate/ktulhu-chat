import { useEffect, useRef, useState } from "react";

export interface ChatSummary {
  chat_id: string;
  summary?: string | null;
  ts: number;
  session_id?: string | null;
  device_hash?: string | null;
  preview?: string | null;
}

interface UseChatSummariesOptions {
  baseUrl?: string;
}

export function useChatSummaries({ baseUrl = "" }: UseChatSummariesOptions = {}) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 🟢 Load last summaries from API with retry
    const loadInitial = async () => {
      let attempt = 0;
      let success = false;

      while (attempt < 5 && !success) {
        try {
          const res = await fetch(`${baseUrl}/chat-summary/last`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const data: { chats: ChatSummary[] } = await res.json();

          if (isMounted && Array.isArray(data?.chats) && data.chats.length > 0) {
            const deduped: ChatSummary[] = Array.from(
              new Map(data.chats.map((c) => [c.chat_id, c])).values()
            ).sort((a, b) => b.ts - a.ts);

            console.log(`✅ Loaded ${deduped.length} chat summaries`);
            setChats(deduped);
            success = true;
          } else {
            console.log("⏳ No summaries yet, retrying...");
            await new Promise((r) => setTimeout(r, 1000)); // wait 1s before retry
          }
        } catch (err) {
          console.error("Failed to load chat summaries:", err);
          await new Promise((r) => setTimeout(r, 1000)); // retry after delay
        }

        attempt++;
      }

      if (!success) {
        console.warn("⚠️ No chat summaries found after 5 attempts");
      }
    };

    loadInitial();

    // 🌐 WebSocket for live summary updates
    const wsUrl = `${baseUrl.replace(/^http/, "ws")}/chat-summary/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("📡 Connected to chat-summary WS");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("🧠 Live summary:", msg);

      if (!msg.chat_id || !msg.summary) return;

      setChats((prev) => {
        const existing = prev.find((c) => c.chat_id === msg.chat_id);
        const updated = existing ? { ...existing, ...msg } : msg;
        const next = [updated, ...prev.filter((c) => c.chat_id !== msg.chat_id)];
        return next.sort((a, b) => b.ts - a.ts);
      });
    };

    ws.onclose = () => console.log("❌ Chat-summary WS closed");

    return () => {
      isMounted = false;
      ws.close();
    };
  }, [baseUrl]);

  return chats;
}
