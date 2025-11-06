import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "../ui/Container";
import { ShellHeaderDesktop } from "./ShellHeader";
import { getSocketEndpoint } from "../lib/getSocketEndpoint";
import { useIsMobile } from "../../hooks/useIsMobile";
import { ChatSidebar } from "../chatSIdebar";
import { ChatSidebarMobile } from "../chatSIdebar/ChatSidebarMobile";

export const Shell: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const location = useLocation();
  const [endpoint, setEndpoint] = useState(getSocketEndpoint());
  const isMobile = useIsMobile(768);

  /* --------------------------------------------------------
    Stable theme toggle
  -------------------------------------------------------- */
  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  /* --------------------------------------------------------
    Endpoint switcher
  -------------------------------------------------------- */
  const handleSwap = useCallback(() => {
    const current =
      sessionStorage.getItem("ws_endpoint") ||
      localStorage.getItem("ws_endpoint") ||
      endpoint;

    const next = prompt("Enter WebSocket endpoint:", current || endpoint);
    if (!next) return;

    try {
      sessionStorage.setItem("ws_endpoint", next);
    } catch {
      localStorage.setItem("ws_endpoint", next);
    }
    setEndpoint(next);
    window.location.reload();
  }, [endpoint]);

  /* --------------------------------------------------------
    Static navigation (memoized once)
  -------------------------------------------------------- */
  const navLinks = useMemo(
    () => [
      { path: "/", label: "Chat" },
      { path: "/settings", label: "Settings" },
      { path: "/about", label: "About" },
      { path: "/logs", label: "Logs" },
    ],
    []
  );

  /* --------------------------------------------------------
    Memoized sidebar (prevents re-mounts)
  -------------------------------------------------------- */
  const MemoizedSidebar = useMemo(
    () => <ChatSidebar onSelectChat={(id) => console.log("Open chat:", id)} />,
    []
  );

  /* --------------------------------------------------------
   🧩 Layout
  -------------------------------------------------------- */
  return (
    <div
      className={`
        flex flex-col min-h-screen
        bg-app-bg text-app-text
        dark:bg-app-bg-dark dark:text-app-text-dark
      `}
    >
      {/* Header */}
      {isMobile ? (
        <div className="flex items-center justify-between border-b border-header-border dark:border-header-border-dark bg-header-bg dark:bg-header-bg-dark px-2 py-2">
          {/* 🟢 Mobile sidebar burger */}
          <ChatSidebarMobile onSelectChat={(id) => console.log("Open chat:", id)} />
        </div>
      ) : (
        <ShellHeaderDesktop
          location={location}
          navLinks={navLinks}
          endpoint={endpoint}
          onSwap={handleSwap}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop sidebar */}
        {!isMobile && (
          <div className="hidden md:flex md:w-2/12 lg:w-2/12 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            {MemoizedSidebar}
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Container>{children}</Container>
        </main>
      </div>

      {/* Footer */}
      <footer
        className={`
          flex-none py-4 text-center text-xs border-t 
          border-header-border bg-header-bg/70 text-footer-text 
          dark:border-header-border-dark dark:bg-header-bg-dark/70 dark:text-footer-text-dark
        `}
      >
        © {new Date().getFullYear()} Ktulhu-Project
      </footer>
    </div>
  );
});
