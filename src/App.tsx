import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatComponent/Index";
import { Shell } from "./components/shell";
import { SocketProvider } from "./context/SocketContext";
import { SessionProvider } from "./context/SessionContext";

export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ SessionProvider MUST wrap SocketProvider */}
      <SessionProvider>
        <SocketProvider>
          <Shell>
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route
                path="/settings"
                element={<div className="p-8">Settings (coming soon)</div>}
              />
              <Route path="/about" element={<div className="p-8">About page</div>} />
              <Route path="/logs" element={<div className="p-8">Logs view</div>} />
            </Routes>
          </Shell>
        </SocketProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
