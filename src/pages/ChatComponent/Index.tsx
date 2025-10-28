import React, { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container } from "../../components/ui/Container";
import { Pannel, PannelBody } from "../../components/ui/Pannel";
import { useInferSocket } from "../../hooks/useInferSocket";
import { useChatStore } from "../../store/useChatStore";
import { useSession } from "../../context/SessionContext";
import { getSocketEndpoint } from "../../components/lib/getSocketEndpoint";

import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";

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

        const data = await res.json().catch(() => ({}));
        const msgs = Array.isArray(data.messages)
          ? data.messages.map((m: any, i: number) => ({
              id: `${chatId}-${i}`,
              role: m.role || "assistant",
              content: m.text || m.summary || "",
              ts: m.ts || Date.now(),
            }))
          : [];

        clear();
        for (const msg of msgs) add(msg);
        console.log(`📥 Reloaded ${msgs.length} messages for chat ${chatId}`);
      } catch (err) {
        console.error("❌ Failed to reload messages:", err);
      }
    };

    fetchMessages();
  }, [chatId, clear, add]);

  // Auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history.length, history.at(-1)?.content]);

  // WebSocket streaming for assistant messages
  useEffect(() => {
    let currentAssistantId: string | null = null;

    const remove = addHandlers({
      onAny: (msg) => {
        if (!currentAssistantId && msg?.token) {
          currentAssistantId = uuidv4();
          add({ id: currentAssistantId, role: "assistant", content: "" });
        }
      },
      onToken: (t) => currentAssistantId && patch(currentAssistantId, t),
      onDone: () => {
        setIsSending(false);
        currentAssistantId = null;
      },
    });

    return () => remove();
  }, [add, patch, addHandlers]);

  // 🧩 Send message (JSON payload instead of text)
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userId = uuidv4();
    add({ id: userId, role: "user", content: trimmed });
    setInput("");
    setIsSending(true);

    try {
      // 🧠 Collect summaries belonging to the current chat
      const summaries = history
        .filter((m) => m.role === "summary" && m.content?.trim())
        .map((m) => m.content.trim());

      // 🧩 Build clean JSON payload
      const messagePayload = {
        role: "user",
        chat_id: chatId,
        model,
        text: trimmed,
        summaries, // ✅ structured summaries array
        ts: Date.now(),
      };

      console.log("📤 Sending JSON payload:", messagePayload);

      // ✅ Send JSON directly through WebSocket
      sendPrompt(JSON.stringify(messagePayload));
    } catch (e) {
      setIsSending(false);
      patch(
        userId,
        ` ${e instanceof Error ? e.message : "Failed to send message"}`
      );
    }
  }, [input, isSending, model, add, patch, sendPrompt, history, chatId]);

  return (
    <Container className="h-[calc(100vh-6rem)] flex justify-center">
      <Pannel className="flex flex-col w-full max-w-4xl h-full relative rounded-2xl overflow-hidden">
        <PannelBody
          ref={scrollRef as any}
          className="flex-1 overflow-y-auto pb-[120px] transition-all"
        >
          <MessageList history={history} />
        </PannelBody>

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isSending={isSending}
            cancel={cancel}
            clear={clear}
          />
          <div className="text-xs text-gray-500 mt-2">
            Chat: {chatId} • Model: {model}
          </div>
        </div>
      </Pannel>
    </Container>
  );
}
