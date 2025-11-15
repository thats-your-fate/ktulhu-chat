import { useCallback, useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "summary";
  content: string;
  ts: number;
}

export function useChatStore() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL 
  const { chatId } = useSession();
  const [history, setHistory] = useState<ChatMessage[]>([]);

  /* ------- fetch backend thread ------- */
useEffect(() => {
  if (!chatId) return;

  const fetchThread = async () => {
    setHistory([]);

    try {
      const res = await fetch(baseUrl + `chat-thread/${chatId}`);
      if (!res.ok) return;

      const raw = await res.text();
      console.log("RAW RESPONSE:", raw);

      const parsed = JSON.parse(raw);

function decodeContent(str?: string): string {
  if (!str) return "";

  return str

}



      const msgs = (parsed.messages || [])
        .filter((m: any) => m.role !== "summary")
        .map((m: any, i: number) => ({
          id: m.id ?? `${chatId}-${i}`,
          role: m.role ?? "assistant",
          content: decodeContent(m.text || m.summary || ""),
          ts: Number(m.ts) || Date.now(),
        }));

        console.log(msgs)

      setHistory(msgs);
    } catch (err) {
      console.error("Failed to load thread:", err);
    }
  };

  fetchThread();
}, [chatId]);


  /* ------- add, patch, clear ------- */
  const add = useCallback((m: ChatMessage) => {
    setHistory((h) => [...h, m]);
  }, []);

  const patch = useCallback((id: string, chunk: string) => {
    setHistory((h) =>
      h.map((m) => (m.id === id ? { ...m, content: m.content + chunk } : m))
    );
  }, []);

  const clear = useCallback(() => setHistory([]), []);

  return { history, add, patch, clear };
}
