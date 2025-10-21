/**
 * Returns the WebSocket endpoint for all front-end connections.
 * Priority:
 * 1️⃣ sessionStorage override (highest, for temporary testing)
 * 2️⃣ localStorage override (optional, for manual dev)
 * 3️⃣ Cloudflare tunnel (preferred default)
 * 4️⃣ Hardcoded fallback URL
 */

export function getSocketEndpoint(): string {
  if (typeof window !== "undefined") {
    // Session storage wins if set
    const session = window.sessionStorage.getItem("ws_endpoint");
    if (session && session.trim()) return normalizeToWs(session);

    // Optional: localStorage override (if still needed)
    //const manual = window.localStorage.getItem("ws_endpoint");
    //if (manual && manual.trim()) return normalizeToWs(manual);
  }

  // nvironment variable tunnel
  const tunnel = (import.meta as any)?.env?.VITE_TUNNEL_URL as string | undefined;
  if (tunnel && tunnel.trim()) return normalizeToWs(tunnel);

  // 4´Final fallback
  return "wss://temp-v558fr.ktulhu.com";
}

/** Convert http/https → ws/wss */
function normalizeToWs(url: string): string {
  if (url.startsWith("http://")) return url.replace("http://", "ws://");
  if (url.startsWith("https://")) return url.replace("https://", "wss://");
  return url.startsWith("ws") ? url : `wss://${url}`;
}
