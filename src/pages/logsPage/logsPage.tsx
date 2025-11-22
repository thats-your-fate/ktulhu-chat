// src/pages/LogsPage.tsx
import React, { useEffect, useState } from "react";
import { useSession } from "../../context/SessionContext";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

type RawMessage = {
  id: string;
  device_hash?: string | null;
  ts: number;
  role: string;
  text?: string | null;   // backend field
  summary?: string | null;
};

type Message = {
  id: string;
  ts: number;
  role: string;
  content: string;
};

type ApiResponse = {
  device_hash: string;
  messages: RawMessage[];
  source?: string;
  error?: string;
};

// Decode text (sometimes it's JSON embedded as string)
function decodeContent(m: RawMessage): string {
  if (!m.text) return "";

  try {
    const obj = JSON.parse(m.text);
    if (typeof obj === "object" && obj.text) return obj.text;
  } catch (_) {
    // not JSON → ignore
  }

  return m.text;
}

export const LogsPage: React.FC = () => {
  const { deviceHash } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${baseUrl}messages/by-device/${deviceHash}`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: ApiResponse = await res.json();
        if (data.error) {
          setError(data.error);
          return;
        }

        // Convert + decode
        let decoded = data.messages.map((m) => ({
          id: m.id,
          ts: m.ts,
          role: m.role,
          content: decodeContent(m),
        }));

        // 🔥 Limit to last 200 on client
        if (decoded.length > 200) {
          decoded = decoded.slice(decoded.length - 200);
        }

        setMessages(decoded);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [deviceHash]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Logs for this Device</h1>

      <p className="text-sm text-gray-500">
        device_hash:{" "}
        <span className="font-mono font-semibold">{deviceHash}</span>
      </p>

      {loading && <div className="text-gray-400">Loading...</div>}

      {error && (
        <div className="text-red-500 border border-red-700 p-2 rounded">
          Error: {error}
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div className="text-gray-400">No messages found for this device.</div>
      )}

      <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900 h-[70vh] overflow-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className="border-b border-gray-200 dark:border-gray-700 py-2"
          >
            <div className="text-xs text-gray-500 mb-1">
              {new Date(m.ts).toLocaleString()}
            </div>

            <div className="text-sm whitespace-pre-wrap">
              <span className="font-semibold">{m.role}:</span>{" "}
              {m.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

