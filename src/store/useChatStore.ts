import { useCallback, useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "summary";
  content: string;
  ts?: number;
}

/**
 * 🧠 Chat store that stays in sync with backend
 * ✅ Fetches on mount
 * ✅ Deduplicates automatically
 * ✅ Keeps chronological order
 */
export function useChatStore() {
  const { chatId } = useSession();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  /** Helper: safely unwrap nested JSON */
  const safeParse = (input: any): any => {
    if (typeof input !== "string") return input;
    try {
      const parsed = JSON.parse(input);
      return typeof parsed === "string" ? safeParse(parsed) : parsed;
    } catch {
      return input;
    }
  };

  /** Helper: normalize text */
  const normalizeContent = (raw: any): string => {
    let content = raw?.text || raw?.summary || "";
    if (typeof content === "string" && content.trim().startsWith("{")) {
      const parsed = safeParse(content);
      if (parsed && parsed.text) content = parsed.text;
    }
    if (typeof content === "string") {
      content = content.replace(/\[Vision Context\]:.*$/s, "").trim();
    }
    return content;
  };

  /** 🔄 Fetch backend messages (with dedup + sort) */
  useEffect(() => {
    if (!chatId) return;
    let cancelled = false;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/chat-thread/${chatId}`);
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

        let data: any = {};
        try {
          data = text ? JSON.parse(text) : { messages: [] };
        } catch {
          console.warn("⚠️ Invalid JSON:", text);
        }

        const msgs: ChatMessage[] = (Array.isArray(data?.messages) ? data.messages : [])
// inside map()
.map((m: any, i: number) => {
  const safeMsg = safeParse(m);
  const tsNum = Number(safeMsg.ts);
  return {
    id:
      safeMsg.id ??
      `${chatId}-${safeMsg.role ?? "assistant"}-${i}-${Date.now()}`,
    role: safeMsg.role ?? "assistant",
    content: normalizeContent(safeMsg),
    ts: Number.isFinite(tsNum) ? tsNum : Date.now(),
  };
})
// ✅ sort chronologically (always numeric)
.sort((a: ChatMessage, b: ChatMessage) => {
  const ta = Number(a.ts) || 0;
  const tb = Number(b.ts) || 0;
  return ta - tb;
});



        if (!cancelled) {
          setHistory((prev) => dedupe([...prev, ...msgs]));
          console.log(`📥 Loaded ${msgs.length} (deduped) for chat ${chatId}`);
        }
      } catch (err) {
        if (!cancelled) console.error("❌ Failed to fetch messages:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMessages();
    return () => {
      cancelled = true;
    };
  }, [chatId]);

  /** ➕ Add message safely (no duplicates) */
  const add = useCallback(
    (m: ChatMessage) =>
      setHistory((h) => dedupe([...h, m]).sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0))),
    []
  );

  /** ✏️ Patch message by ID */
  const patch = useCallback(
    (id: string, chunk: string) =>
      setHistory((h) =>
        h.map((m) =>
          m.id === id ? { ...m, content: m.content + chunk } : m
        )
      ),
    []
  );

  const clear = useCallback(() => setHistory([]), []);

  return { history, add, patch, clear, loading } as const;
}

/** 🧩 Helper: remove duplicates by ID */
function dedupe(list: ChatMessage[]): ChatMessage[] {
  const map = new Map<string, ChatMessage>();
  for (const msg of list) {
    map.set(msg.id, msg);
  }
  return Array.from(map.values());
}
