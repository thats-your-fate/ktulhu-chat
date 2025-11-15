// ChatStoreContext.tsx
import { createContext, useContext } from "react";
import { useChatStore } from "../hooks/useChatStore";
const ChatStoreContext = createContext<ReturnType<typeof useChatStore> | null>(
  null
);

export const ChatStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const store = useChatStore(); // ONE shared instance

  return (
    <ChatStoreContext.Provider value={store}>
      {children}
    </ChatStoreContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatStoreContext);
  if (!ctx) throw new Error("useChat must be used inside ChatStoreProvider");
  return ctx;
};
