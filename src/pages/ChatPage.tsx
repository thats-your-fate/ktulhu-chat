import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container } from "../components/ui/Container";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Badge } from "../components/ui/Badge";
import { useInferSocket } from "../hooks/useInferSocket";
import { useChatStore } from "../store/useChatStore";

const DEFAULT_ENDPOINT = "wss://chat.ktulhu.com";
const DEFAULT_MODEL = "mistral-7b-lora";

export default function ChatPage() {
  const { history, add, patch, clear } = useChatStore();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [endpoint] = useState(DEFAULT_ENDPOINT);
  const [model] = useState(DEFAULT_MODEL);
  const { status, lastError, sendPrompt, cancel, setHandlers } = useInferSocket(endpoint);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [history.length, history[history.length - 1]?.content]);

  // Handle streaming tokens from WS
  useEffect(() => {
    let currentAssistantId: string | null = null;
    setHandlers({
      onToken: (t) => {
        if (currentAssistantId) patch(currentAssistantId, t);
      },
      onDone: () => {
        setIsSending(false);
        currentAssistantId = null;
      },
      onAny: (msg) => {
        if (msg?.type === "assistant_start") {
          currentAssistantId = msg?.id ?? uuidv4();
          add({ id: currentAssistantId, role: "assistant", content: "" });
        }
      },
    });
    return () => setHandlers({});
  }, [add, patch, setHandlers]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userId = uuidv4();
    add({ id: userId, role: "user", content: trimmed });
    setInput("");
    setIsSending(true);

    // Create placeholder assistant message
    const assistantId = uuidv4();
    add({ id: assistantId, role: "assistant", content: "" });

    try {
      sendPrompt(trimmed, { model });
    } catch (e) {
      setIsSending(false);
      const errText = e instanceof Error ? e.message : "Failed to send";
      patch(assistantId, `❌ ${errText}`);
    }
  }, [add, input, isSending, model, patch, sendPrompt]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const statusBadge = useMemo(() => {
    const map: Record<string, string> = {
      idle: "bg-gray-100",
      connecting: "bg-yellow-100",
      open: "bg-green-100",
      closed: "bg-gray-200",
      error: "bg-red-100",
    };
    return <Badge className={`${map[status]} ml-2`}>{status}</Badge>;
  }, [status]);

  return (
    <Container>
      <div className="mt-4 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Ktulhu Chat</h1>
          {statusBadge}
          {lastError && <span className="text-xs text-red-600 ml-2">{lastError}</span>}
        </div>
      </div>

      <Card>
        <CardHeader title="Chat" subtitle="Enter to send • Shift+Enter for newline" />
        <CardBody className="h-[65vh] overflow-y-auto" ref={scrollRef as any}>
          {history.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              Start a conversation. Your messages stay in this browser only.
            </div>
          )}
          <div className="space-y-3">
            {history.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap leading-relaxed rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-black text-white" : "bg-gray-100"
                  }`}
                >
                  {m.content || (m.role === "assistant" ? <span className="opacity-50">…</span> : null)}
                </div>
              </div>
            ))}
          </div>
        </CardBody>

        <CardBody className="border-t border-gray-100">
          <div className="flex items-end gap-2">
            <Textarea
              rows={2}
              placeholder="Ask anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <div className="flex flex-col gap-2 w-28">
              <Button onClick={handleSend} disabled={isSending || !input.trim()}>
                Send
              </Button>
              <Button variant="outline" onClick={() => cancel()} disabled={!isSending}>
                Stop
              </Button>
              <Button variant="ghost" onClick={() => clear()}>
                Clear
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Endpoint: {endpoint} • Model: {model}
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}
