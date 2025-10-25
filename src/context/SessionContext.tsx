import React, { createContext, useContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

type SessionContextType = {
  deviceHash: string;
  sessionId: string;
    chatId: string;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * Create a short, deterministic hash from basic browser/device characteristics.
 * This is intentionally *not* a full fingerprint — only stable enough to identify device class.
 */
function generateDeviceHash(): string {
  try {
    const info = [
      navigator.userAgent, // browser + OS
      navigator.language, // locale
      screen.width,
      screen.height,
      screen.colorDepth,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency ?? "cpu?",
(navigator as any).deviceMemory ?? "ram?",
    ].join("|");

    let hash = 0;
    for (let i = 0; i < info.length; i++) {
      const chr = info.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // force 32-bit
    }

    // convert to base36 (short human-friendly hash)
    return Math.abs(hash).toString(36);
  } catch (e) {
    console.warn("Device hash generation failed:", e);
    return "unknown";
  }
}

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceHash = useMemo(() => generateDeviceHash(), []);
  const sessionId = useMemo(() => uuidv4(), []);

  // ⚡️ generate a chat ID per chat session — can be replaced later when user selects/creates chat
  const chatId = useMemo(() => uuidv4(), []);

  return (
    <SessionContext.Provider value={{ deviceHash, sessionId, chatId }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
};
