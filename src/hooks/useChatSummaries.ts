import { useEffect, useRef, useState, useCallback } from "react";

export interface ChatSummary {
  chat_id: string;
  summary: string;
  text?: string | null;
  ts: number;
}

interface UseChatSummariesOptions {
  baseUrl?: string;
  persist?: boolean;
}

/* ---------------------------------------------------
  Shared global reactive store
--------------------------------------------------- */
let globalChats: ChatSummary[] = [];
const subscribers = new Set<React.Dispatch<React.SetStateAction<ChatSummary[]>>>();

function notifyAll() {
  for (const set of subscribers) set([...globalChats]);
}

/* ---------------------------------------------------
   Utility: sanitize API + WS URLs
--------------------------------------------------- */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, ""); // remove trailing slashes
}

function makeWsUrl(baseUrl: string): string {
  const clean = normalizeBaseUrl(baseUrl);
  if (clean.startsWith("https://")) return clean.replace(/^https:\/\//, "wss://") + "/chat-summary/ws";
  if (clean.startsWith("http://")) return clean.replace(/^http:\/\//, "ws://") + "/chat-summary/ws";
  return "wss://" + clean + "/chat-summary/ws";
}

/* ---------------------------------------------------
   Hook: useChatSummaries
--------------------------------------------------- */
export function useChatSummaries({
  baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  persist = false,
}: UseChatSummariesOptions = {}) {
  const [chats, setChats] = useState<ChatSummary[]>(globalChats);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------------------------------------------
    Subscription management
  --------------------------------------------------- */
  useEffect(() => {
    subscribers.add(setChats);
    return () => {
      subscribers.delete(setChats);
    };
  }, []);

  /* ---------------------------------------------------
    State helpers
  --------------------------------------------------- */
  const upsert = useCallback((msg: ChatSummary) => {
    globalChats = [msg, ...globalChats.filter((c) => c.chat_id !== msg.chat_id)].sort(
      (a, b) => b.ts - a.ts
    );
    notifyAll();
  }, []);

  const remove = useCallback((chatId: string) => {
    globalChats = globalChats.filter((c) => c.chat_id !== chatId);
    notifyAll();
  }, []);

  const clear = useCallback(() => {
    globalChats = [];
    notifyAll();
  }, []);

  /* ---------------------------------------------------
     Optional persistence
  --------------------------------------------------- */
  useEffect(() => {
    if (!persist) return;

    try {
      const saved = localStorage.getItem("ktulhu.chatSummaries");
      if (saved) {
        const parsed: ChatSummary[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          globalChats = parsed.sort((a, b) => b.ts - a.ts);
          notifyAll();
          console.log("💾 Restored chat summaries from localStorage");
        }
      }
    } catch (err) {
      console.warn("Failed to restore chat summaries:", err);
    }

    const save = () => {
      try {
        localStorage.setItem("ktulhu.chatSummaries", JSON.stringify(globalChats));
      } catch (err) {
        console.warn("Failed to persist chat summaries:", err);
      }
    };

    window.addEventListener("beforeunload", save);
    return () => window.removeEventListener("beforeunload", save);
  }, [persist]);

  /* ---------------------------------------------------
    🧠 Initial load via REST
  --------------------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    const safeParse = (input: string): any => {
      try {
        const first = JSON.parse(input);
        if (typeof first === "string") {
          try {
            return JSON.parse(first);
          } catch {
            return first;
          }
        }
        return first;
      } catch {
        return input;
      }
    };

    (async () => {
      try {
        const api = normalizeBaseUrl(baseUrl);
        const res = await fetch(`${api}/chat-summary/last`, {
          headers: { "Accept": "application/json" },
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

        let data = safeParse(text);
        if (typeof data === "string") data = safeParse(data);

        const list: ChatSummary[] = Array.isArray(data?.chats) ? data.chats : [];

        if (isMounted) {
          globalChats = list.sort((a, b) => b.ts - a.ts);
          notifyAll();
          console.log(`✅ Loaded ${list.length} chats from snapshot`);
        }
      } catch (err) {
        console.error("❌ Failed to load chat summaries:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [baseUrl]);

  /* ---------------------------------------------------
     WebSocket (auto-reconnect)
  --------------------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    const safeParse = (input: string): any => {
      try {
        const first = JSON.parse(input);
        if (typeof first === "string") {
          try {
            return JSON.parse(first);
          } catch {
            return first;
          }
        }
        return first;
      } catch {
        return input;
      }
    };

    function connectWS() {
      const wsUrl = makeWsUrl(baseUrl);
      console.log("🌐 Connecting WebSocket:", wsUrl);

      let ws: WebSocket;
      try {
        ws = new WebSocket(wsUrl);
      } catch (e) {
        console.error("❌ Invalid WebSocket URL:", wsUrl, e);
        return;
      }

      wsRef.current = ws;

      ws.onopen = () => console.log("📡 Connected to /chat-summary/ws");

      ws.onmessage = (event) => {
        try {
          const data = typeof event.data === "string" ? safeParse(event.data) : event.data;
          if (!data?.chat_id) return;
          upsert(data);
        } catch (err) {
          console.error("Invalid WS message:", err, event.data);
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        console.log("⚠️ WS closed, retrying in 5s...");
        reconnectTimer.current = setTimeout(connectWS, 5000);
      };

      ws.onerror = (err) => {
        console.warn("❌ WS error:", err);
        ws.close();
      };
    }

    connectWS();

    return () => {
      isMounted = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [baseUrl]);

  return { chats, upsert, remove, clear };
}
