/**
 * Returns the WebSocket endpoint for all front-end connections.
 * Always prefers Cloudflare tunnel, with localStorage override for testing.
 */

export function getSocketEndpoint(): string {
  // 1️⃣ Manual override (for debugging different tunnels)
  if (typeof window !== "undefined") {
   // const manual = window.localStorage.getItem("ws_endpoint");
   // if (manual && manual.trim()) return manual;
  }

  //  Always prefer configured Cloudflare tunnel
  const tunnel = (import.meta as any)?.env?.VITE_TUNNEL_URL as string | undefined;
  if (tunnel && tunnel.trim()) return normalizeToWs(tunnel);

  // 3️⃣ Safe default if no tunnel injected
  return "wss://copyrights-double-plugin-cow.trycloudflare.com";
}

/** Convert http/https → ws/wss */
function normalizeToWs(url: string): string {
  if (url.startsWith("http://")) return url.replace("http://", "ws://");
  if (url.startsWith("https://")) return url.replace("https://", "wss://");
  return url.startsWith("ws") ? url : `wss://${url}`;
}
