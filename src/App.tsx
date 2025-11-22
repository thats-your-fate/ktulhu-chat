import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatComponent/ChatPage";
import { Shell } from "./components/shell";
import { SocketProvider } from "./context/SocketProvider";
import { SessionProvider } from "./context/SessionContext";
import { Seo } from "./components/Seo";
import { ChatStoreProvider } from "./context/ChatStoreContext";
import { LogsPage } from "./pages/logsPage/logsPage";


export default function App() {
  return (
    <BrowserRouter>
      <Seo />

      <SessionProvider>
        <ChatStoreProvider>
          <SocketProvider>
            <Routes>
              <Route element={<Shell />}>

                {/* Default home — NEW CHAT */}
                <Route
                  path="/"
                  element={
                    <>
                      <Seo path="/" title="Ktulhu Chat" />
                      <ChatPage />
                    </>
                  }
                />

                {/* EXISTING CHAT THREAD */}
                <Route
                  path="/chat/:chatId"
                  element={
                    <>
                      <Seo
                        path="/chat"
                        title="Chat Thread"
                        description="Continue your Ktulhu chat conversation."
                      />
                      <ChatPage />
                    </>
                  }
                />

                {/* SETTINGS */}
                <Route
                  path="/settings"
                  element={
                    <>
                      <Seo
                        path="/settings"
                        title="Ktulhu Settings"
                      />
                      <div>Settings</div>
                    </>
                  }
                />

                {/* ABOUT */}
                <Route
                  path="/about"
                  element={
                    <>
                      <Seo
                        path="/about"
                        title="About Ktulhu"
                      />
                      <div>About</div>
                    </>
                  }
                />

                {/* LOGS */}
                <Route
                  path="/logs"
                  element={
                    <>
                      <Seo
                        path="/logs"
                        title="Inference Logs"
                      />
                      <LogsPage/>
                    </>
                  }
                />

              </Route>
            </Routes>
          </SocketProvider>
        </ChatStoreProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
