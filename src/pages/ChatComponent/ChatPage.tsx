import { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { Container } from "../../components/ui/Container";
import { Pannel, PannelBody } from "../../components/ui/Pannel";

import { MessageList } from "./components/MessageList";
import { InputArea } from "../../components/ui/input";

import { useChatStore } from "../../hooks/useChatStore";
import { useSocketContext } from "../../context/SocketProvider";
import { useSession } from "../../context/SessionContext";

import { SystemStatusBanner } from "../../components/SystemStatusBanner";


const DEFAULT_MODEL = "mistral-7b-lora";

export default function ChatComponent() {
  const { chatId } = useSession();
  const { history, add, patch } = useChatStore();

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

const [liveStatus, setLiveStatus] = useState(null);  
  const { sendPrompt, addHandlers } = useSocketContext();

  /* ---------------------- Auto-Scroll on new msg ---------------------- */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history.length]);

  /* ---------------------- WS streaming → store ---------------------- */
  useEffect(() => {
    let assistantId: string | null = null;

const remove = addHandlers({
  onAny: (msg) => {
    // Ignore done messages entirely (prevents "Done." ghost)
    if (msg.done) return;

    // Token bootstrap (JSON only)
    if (msg.type === "token" && !assistantId) {
      assistantId = uuidv4();
      add({ id: assistantId, role: "assistant", content: "", ts: Date.now() });
    }
  },

  onSystem: (msg) => {
    console.log("SYSTEM MSG:", msg);
    setLiveStatus(msg.system || msg.message); // supports both fields
  },

  onToken: (token) => {
    // ALWAYS clear status when tokens start (raw or JSON)
    setLiveStatus(null);

    if (!assistantId) {
      assistantId = uuidv4();
      add({ id: assistantId, role: "assistant", content: "", ts: Date.now() });
    }

    patch(assistantId, token);
  },

  onDone: () => {
    setIsSending(false);
    setLiveStatus(null);
    assistantId = null;
  },
});



    return () => remove?.();
  }, [add, patch, addHandlers]);

  /* ---------------------- Send user message ---------------------- */
  const handleSend = useCallback(() => {
    const clean = input.trim();
    if (!clean || isSending) return;

    setIsSending(true);

    const id = uuidv4();
    const ts = Date.now();

    // Add user message immediately
    add({ id, role: "user", content: clean, ts });

    // Send upstream
    const payload = {
      role: "user",
      chat_id: chatId,
      text: clean,
      model: DEFAULT_MODEL,
      ts,
    };

    sendPrompt(JSON.stringify(payload));
    setInput("");
  }, [input, isSending, chatId, sendPrompt, add]);

  /* ---------------------- UI ---------------------- */
  return (
    <Container className="h-[calc(100vh-6rem)] flex justify-center">
      <Pannel className="flex flex-col w-full h-full relative overflow-hidden">
<PannelBody
  ref={scrollRef as any}
  className="flex-1 overflow-y-auto pb-[120px] relative"
>
  {(!history || history.length === 0) ? (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none px-6">

      <p className="text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-5">
        What’s on your mind?
      </p>

      <p className="text-2xl text-gray-500 dark:text-gray-400 opacity-80">
        Ask Ktulhu AI Chat.
      </p>

    </div>
  ) : (
    <>
      <MessageList history={history} />
    </>
  )}

  <SystemStatusBanner text={liveStatus} />
</PannelBody>


        {/* Input footer */}
        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <InputArea
            value={input}
            onChange={setInput}
            onSend={handleSend}
            placeholder="Send a message..."
            className="bg-white/90 dark:bg-gray-900/90"
          />

          <div className="text-xs text-gray-500 mt-2">
            Chat ID: {chatId} • Model: {DEFAULT_MODEL}
          </div>
        </div>
      </Pannel>
    </Container>
  );
}
