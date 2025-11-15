/**
 * Returns the WebSocket endpoint for all front-end connections.
 */

export function getSocketEndpoint(): string {
  if (typeof window !== "undefined") {
    // 1️⃣ Session storage wins if set
    const session = window.sessionStorage.getItem("ws_endpoint");
    if (session && session.trim()) return normalizeToWs(session);

    // 2️⃣ Optional: localStorage override (if still needed)
    // const manual = window.localStorage.getItem("ws_endpoint");
    // if (manual && manual.trim()) return normalizeToWs(manual);
  }

  // 3️⃣ Environment variables (Cloudflare tunnel or direct WS base URL)
  const env = (import.meta as any)?.env || {};
  const tunnel = env.VITE_TUNNEL_URL as string | undefined;
  const webSockBase = env.VITE_WEB_SOCK_BASE_URL as string | undefined;

  if (webSockBase && webSockBase.trim()) return normalizeToWs(webSockBase);
  if (tunnel && tunnel.trim()) return normalizeToWs(tunnel);

  // 4️⃣ Final fallback (default)
  return "wss://inference.ktulhu.com";
}

/** Convert http/https → ws/wss */
function normalizeToWs(url: string): string {
  if (url.startsWith("http://")) return url.replace("http://", "ws://");
  if (url.startsWith("https://")) return url.replace("https://", "wss://");
  return url.startsWith("ws") ? url : `wss://${url}`;
}
