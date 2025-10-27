import { useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSession } from "../context/SessionContext";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "summary";
  content: string;
  ts?: number;
}

/**
 * 🧠 Hook: Per-chat message store + backend sync
 * LocalStorage key pattern: "ktulhu.chat.history::<chat_id>"
 */
export function useChatStore() {
  const { chatId } = useSession();

  // Per-chat LocalStorage key
  const key = useMemo(() => `ktulhu.chat.history::${chatId}`, [chatId]);

  // Messages for this chat (persisted locally)
  const [history, setHistory] = useLocalStorage<ChatMessage[]>(key, []);

  /**
   * 🔄 Fetch full message list for this chat from backend
   * Endpoint: /chat-thread/:chat_id
   */
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/chat-thread/${chatId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Transform backend JSON → ChatMessage[]
        const msgs: ChatMessage[] = (data.messages || []).map(
          (m: any, i: number) => ({
            id: `${chatId}-${i}`,
            role: m.role || "assistant",
            content: m.text || m.summary || "",
            ts: m.ts || Date.now(),
          })
        );

        // Replace local history
        setHistory(msgs);
        console.log(`📥 Loaded ${msgs.length} messages for chat ${chatId}`);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [chatId, setHistory]);

  /** ➕ Add a message locally */
  const add = useCallback(
    (m: ChatMessage) => setHistory((h) => [...h, m]),
    [setHistory]
  );

  /** ✏️ Append a streaming chunk to existing message */
  const patch = useCallback(
    (id: string, chunk: string) =>
      setHistory((h) =>
        h.map((m) =>
          m.id === id ? { ...m, content: m.content + chunk } : m
        )
      ),
    [setHistory]
  );

  /** 🧹 Clear current chat’s history */
  const clear = useCallback(() => setHistory([]), [setHistory]);

  return { history, add, patch, clear } as const;
}
