import { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container } from "../../components/ui/Container";
import { Pannel, PannelBody } from "../../components/ui/Pannel";
import { useInferSocket } from "../../hooks/useInferSocket";
import { useChatStore } from "../../store/useChatStore";
import { getSocketEndpoint } from "../../components/lib/getSocketEndpoint";

import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";

const DEFAULT_MODEL = "mistral-7b-lora";

export default function ChatComponent() {
  const { history, add, patch, clear } = useChatStore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endpoint = getSocketEndpoint();
  const [model] = useState(DEFAULT_MODEL);
  const { status, lastError, sendPrompt, cancel, addHandlers } = useInferSocket(endpoint);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history.length, history[history.length - 1]?.content]);

  // WebSocket handlers
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

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userId = uuidv4();
    add({ id: userId, role: "user", content: trimmed });
    setInput("");
    setIsSending(true);

    try {
      sendPrompt(trimmed, { model });
    } catch (e) {
      setIsSending(false);
      patch(uuidv4(), ` ${e instanceof Error ? e.message : "Failed to send"}`);
    }
  }, [input, isSending, model, add, patch, sendPrompt]);

  return (
    <Container className="h-[calc(100vh-6rem)] flex justify-center">
      <Pannel className="flex flex-col w-full max-w-4xl h-full relative  rounded-2xl overflow-hidden">
        {/* Message list (scrollable area) */}
        <PannelBody
          ref={scrollRef as any}
          className="flex-1 overflow-y-auto pb-[120px] transition-all"
        >
          <MessageList history={history} />
        </PannelBody>

        {/* Chat input (fixed inside card) */}
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
            Endpoint: {endpoint ?? "unknown"} • Model: {model}
          </div>
        </div>
      </Pannel>
    </Container>
  );
}
