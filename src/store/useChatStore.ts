import { useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSession } from "../context/SessionContext";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Store message history per chat ID.
 * Data key pattern: "ktulhu.chat.history::<chat_id>"
 */
export function useChatStore() {
  const { chatId } = useSession();

  // ✅ Compute per-chat storage key
  const key = useMemo(() => `ktulhu.chat.history::${chatId}`, [chatId]);

  // ✅ LocalStorage-backed message array for this chat
  const [history, setHistory] = useLocalStorage<ChatMessage[]>(key, []);

  // ✅ Add a message
  const add = useCallback(
    (m: ChatMessage) => setHistory((h) => [...h, m]),
    [setHistory]
  );

  // ✅ Append a streaming chunk to an existing message
  const patch = useCallback(
    (id: string, chunk: string) =>
      setHistory((h) =>
        h.map((m) =>
          m.id === id ? { ...m, content: m.content + chunk } : m
        )
      ),
    [setHistory]
  );

  // ✅ Clear only current chat’s messages
  const clear = useCallback(() => setHistory([]), [setHistory]);

  return { history, add, patch, clear } as const;
}
