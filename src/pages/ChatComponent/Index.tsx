import { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container } from "../../components/ui/Container";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { useInferSocket } from "../../hooks/useInferSocket";
import { useChatStore } from "../../store/useChatStore";
import { getSocketEndpoint } from "../../components/lib/getSocketEndpoint";

import { ChatHeader } from "./components/ChatHeader";
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

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [history.length, history[history.length - 1]?.content]);

  // WebSocket handlers
useEffect(() => {
  let currentAssistantId: string | null = null;
 const remove = addHandlers({
   onAny: (msg) => {
     if (!currentAssistantId && msg?.token) {
      currentAssistantId = uuidv4();
      add({ id: currentAssistantId, role: "assistant", content: "" });     }
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
    <Container>
      {/* 👇 Convert null → undefined for TS safety */}
     {/* <ChatHeader status={status} lastError={lastError ?? undefined} />*/}

      <Card>
       {/* <CardHeader title="Chat" subtitle="Enter to send • Shift+Enter for newline" />*/}

        <CardBody className="h-[80vh] overflow-y-auto" ref={scrollRef as any}>
          <MessageList history={history} />
        </CardBody>

        <CardBody className="border-t border-gray-100">
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
        </CardBody>
      </Card>
    </Container>
  );
}
