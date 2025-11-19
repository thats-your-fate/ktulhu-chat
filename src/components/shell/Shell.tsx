import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "../ui/Container";
import { ShellHeaderDesktop } from "./ShellHeader";
import { getSocketEndpoint } from "../../utils/getSocketEndpoint";
import { useIsMobile } from "../../hooks/useIsMobile";
import { ChatSidebar } from "../chatSIdebar";
import { ChatSidebarMobile } from "../chatSIdebar/ChatSidebarMobile";

export const Shell: React.FC = React.memo(() => {
  const location = useLocation();
  const [endpoint, setEndpoint] = useState(getSocketEndpoint());
  const isMobile = useIsMobile(768);

  /* --------------------------------------------------------
      THEME (reactive + persistent)
  -------------------------------------------------------- */

  // Read initial theme safely
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  // Apply theme on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
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
     🚦 Navigation links
  -------------------------------------------------------- */
  const navLinks = useMemo(
    () => [
      { path: "/", label: "Chat" },
      { path: "/settings", label: "Settings" },
      { path: "https://about.ktulhu.com", label: "About" },
      { path: "/logs", label: "Logs" },
    ],
    []
  );

  /* --------------------------------------------------------
      Sidebar (memoized to avoid remounts)
  -------------------------------------------------------- */
  const MemoizedSidebar = useMemo(
    () => <ChatSidebar onSelectChat={(id) => console.log("Open chat:", id)} />,
    []
  );

  /* --------------------------------------------------------
      Layout
  -------------------------------------------------------- */
  return (
    <div
      className={`
        flex flex-col h-screen overflow-hidden
        bg-app-bg text-app-text
        dark:bg-app-bg-dark dark:text-app-text-dark
      `}
    >
      {/* Header */}
      {isMobile ? (
        <div className="flex items-center justify-between border-b border-header-border dark:border-header-border-dark bg-header-bg dark:bg-header-bg-dark px-2 py-2">
          <ChatSidebarMobile onSelectChat={(id) => console.log("Open chat:", id)} />
        </div>
      ) : (
        <ShellHeaderDesktop
          location={location}
          navLinks={navLinks}
          endpoint={endpoint}
          onSwap={handleSwap}
          onToggleTheme={toggleTheme}
          theme={theme}
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
        <main className="flex-1 overflow-hidden flex flex-col">
          <Container>
            <Outlet /> {/* Routes render here */}
          </Container>
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
