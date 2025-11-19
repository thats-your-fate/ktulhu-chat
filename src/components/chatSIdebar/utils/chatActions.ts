import type { ChatSummary } from "../../../hooks/useChatSummaries";


/* ------------------------------
   DELETE CHAT
--------------------------------*/
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export interface DeleteChatDeps {
  remove: (id: string) => void;
}

export const deleteChatThread = async (
  id: string,
  { remove }: DeleteChatDeps
) => {
  remove(id); // instant UI update

  try {
    await fetch(baseUrl+`chat-thread/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error("Delete failed", err);
  }
};


/* ------------------------------
   CREATE CHAT
--------------------------------*/
export interface CreateChatDeps {
  upsert: (msg: ChatSummary) => void;
}

export const createNewChat = ({ upsert }: CreateChatDeps): string => {
  const id = crypto.randomUUID();

  upsert({
    chat_id: id,
    summary: "New chat",
    ts: Date.now(),
  });

  return id;
};
