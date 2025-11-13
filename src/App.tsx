import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatComponent/Index";
import { Shell } from "./components/shell";
import { SocketProvider } from "./context/SocketProvider";
import { SessionProvider } from "./context/SessionContext";
import { Seo } from "./components/Seo";

export default function App() {
  return (
    <BrowserRouter>
      {/* GLOBAL DEFAULT SEO */}
      <Seo />

      <SessionProvider>
        <SocketProvider>
          <Routes>
            <Route element={<Shell />}>
              <Route
                path="/"
                element={
                  <>
                    <Seo path="/" title="Ktulhu Chat" />
                    <ChatPage />
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <>
                    <Seo
                      path="/settings"
                      title="Ktulhu Settings"
                      description="Configure your Ktulhu AI chat experience, websocket endpoint, and preferences."
                    />
                    <div>Settings</div>
                  </>
                }
              />
              <Route
                path="/about"
                element={
                  <>
                    <Seo
                      path="/about"
                      title="About Ktulhu"
                      description="Learn more about Ktulhu — the private, independent AI assistant built for freedom, speed, and control."
                    />
                    <div>About</div>
                  </>
                }
              />
              <Route
                path="/logs"
                element={
                  <>
                    <Seo
                      path="/logs"
                      title="Inference Logs"
                      description="Inspect your inference logs, system events, and WebSocket activity inside Ktulhu."
                    />
                    <div>Logs</div>
                  </>
                }
              />
            </Route>
          </Routes>
        </SocketProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
