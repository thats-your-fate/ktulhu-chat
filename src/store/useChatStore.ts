import { useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

const LS_KEY = "ktulhu.chat.history";

export function useChatStore() {
  const [history, setHistory] = useLocalStorage<ChatMessage[]>(LS_KEY, []);
  const add = useCallback((m: ChatMessage) => setHistory(h => [...h, m]), [setHistory]);
  const patch = useCallback((id: string, chunk: string) => setHistory(h => h.map(m => (m.id === id ? { ...m, content: m.content + chunk } : m))), [setHistory]);
  const clear = useCallback(() => setHistory([]), [setHistory]);
  return { history, add, patch, clear } as const;
}
