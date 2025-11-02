import React, { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container } from "../../components/ui/Container";
import { Pannel, PannelBody } from "../../components/ui/Pannel";
import { useInferSocket } from "../../hooks/useInferSocket";
import { useChatStore } from "../../store/useChatStore";
import { useSession } from "../../context/SessionContext";
import { getSocketEndpoint } from "../../components/lib/getSocketEndpoint";
import { MessageList } from "./components/MessageList";
import { InputArea } from "../../components/ui/input";

const DEFAULT_MODEL = "mistral-7b-lora";

export default function ChatComponent() {
  const { chatId } = useSession();
  const { history, add, patch, clear } = useChatStore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endpoint = getSocketEndpoint();
  const [model] = useState(DEFAULT_MODEL);
  const { sendPrompt, cancel, addHandlers } = useInferSocket(endpoint);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* 🧩 Utility to unwrap and clean content safely */
  const safeNormalize = useCallback((content: any): string => {
    if (typeof content !== "string") return String(content ?? "");
    let result = content;

    // Unwrap JSON strings like "{\"text\":\"Hi\"}"
    if (result.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(result);
        if (parsed?.text) result = parsed.text;
      } catch {
        /* ignore parse errors */
      }
    }

    // Remove hidden Vision Context hints
    result = result.replace(/\[Vision Context\]:.*$/s, "").trim();
    return result;
  }, []);

  // 🧠 Load existing messages for this chat
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:8080/chat-thread/${chatId}`);
        if (!res.ok) {
          console.warn(`⚠️ No thread found for ${chatId}`);
          clear();
          return;
        }

        const text = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch {
          console.warn("⚠️ Invalid backend JSON:", text);
          data = {};
        }

        const msgs = Array.isArray(data.messages)
          ? data.messages.map((m: any, i: number) => ({
              id: `${chatId}-${i}`,
              role: m.role || "assistant",
              content: safeNormalize(m.text || m.summary || ""),
              ts: m.ts || Date.now(),
            }))
          : [];

        clear();
        msgs.forEach(add);
        console.log(`📥 Reloaded ${msgs.length} messages for chat ${chatId}`);
      } catch (err) {
        console.error("❌ Failed to reload messages:", err);
      }
    };

    fetchMessages();
  }, [chatId, clear, add, safeNormalize]);

  // Auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history.length, history.at(-1)?.content]);



useEffect(() => {
  let currentAssistantId: string | null = null;

  const remove = addHandlers({
    onAny: (msg: { token?: string }) => {
      if (!currentAssistantId && msg?.token) {
        currentAssistantId = uuidv4();
        add({
          id: currentAssistantId,
          role: "assistant",
          content: "",
        });
      }
    },
    onToken: (t: string) => {
      if (currentAssistantId) {
        patch(currentAssistantId, t);
      }
    },
    onDone: () => {
      setIsSending(false);
      currentAssistantId = null;
    },
  });

  // 🧹 Proper cleanup when component unmounts
  return () => {
    remove?.();
  };
}, [addHandlers, add, patch, setIsSending]);

  // 🧩 Send message
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userId = uuidv4();
    const cleanInput = safeNormalize(trimmed);

    add({ id: userId, role: "user", content: cleanInput });
    setInput("");
    setIsSending(true);

    try {
      const summaries = history
        .filter((m) => m.role === "summary" && m.content?.trim())
        .map((m) => m.content.trim());

      const messagePayload = {
        role: "user",
        chat_id: chatId,
        model,
        text: cleanInput,
        summaries,
        ts: Date.now(),
      };

      console.log("📤 Sending JSON payload:", messagePayload);
      sendPrompt(JSON.stringify(messagePayload));
    } catch (e) {
      setIsSending(false);
      patch(
        userId,
        ` ${e instanceof Error ? e.message : "Failed to send message"}`
      );
    }
  }, [input, isSending, model, add, patch, sendPrompt, history, chatId, safeNormalize]);

  return (
    <Container className="h-[calc(100vh-6rem)] flex justify-center">
      <Pannel className="flex flex-col w-full  h-full relative  overflow-hidden">
        <PannelBody
          ref={scrollRef as any}
          className="flex-1 overflow-y-auto pb-[120px] transition-all"
        >
          <MessageList history={history} />
        </PannelBody>

        <div className="absolute bottom-0 left-0 right-0  backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 py-3">
<InputArea
  value={input}
  onChange={setInput}
  onSend={() => handleSend()} // optional
  placeholder="Send a message..."
  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
/>

          <div className="text-xs text-gray-500 mt-2">
            Chat: {chatId} • Model: {model}
          </div>
        </div>
      </Pannel>
    </Container>
  );
}
