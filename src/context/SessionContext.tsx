import React, {
  createContext,
  useRef,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";

type SessionContextType = {
  deviceHash: string;
  sessionId: string;
  chatId: string;
  setChatId: (id: string) => void;
};

function generateDeviceHash(): string {
  try {
    const info = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency ?? "cpu?",
      (navigator as any).deviceMemory ?? "ram?",
    ].join("|");

    let hash = 0;
    for (let i = 0; i < info.length; i++) {
      hash = (hash << 5) - hash + info.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  } catch {
    return "unknown";
  }
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceHash = useMemo(() => generateDeviceHash(), []);
  const sessionIdRef = useRef(uuidv4());

  const navigate = useNavigate();
  const location = useLocation();

  const [chatId, setChatIdState] = useState<string | null>(null);

  // Derive chatId from URL: /chat/:chatId
  useEffect(() => {
    const match = location.pathname.match(/^\/chat\/([^/]+)/);
    const urlChatId = match ? match[1] : undefined;

    // If URL has an id, always sync state to it
    if (urlChatId) {
      if (chatId !== urlChatId) {
        setChatIdState(urlChatId);
      }
      return;
    }

    // No id in URL (e.g. "/") → create one once and navigate
    if (!chatId) {
      const newId = uuidv4();
      setChatIdState(newId);
      navigate(`/chat/${newId}`, { replace: true });
    }
  }, [location.pathname, chatId, navigate]);

  const setChatId = (id: string) => {
    setChatIdState(id);
    const targetPath = `/chat/${id}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  // Still deciding chatId → avoid rendering children that depend on it
  if (chatId === null) return null;

  return (
    <SessionContext.Provider
      value={{
        deviceHash,
        sessionId: sessionIdRef.current,
        chatId,
        setChatId,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
};
