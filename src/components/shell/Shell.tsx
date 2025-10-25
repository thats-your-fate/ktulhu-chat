import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "../ui/Container";
import { ShellHeaderDesktop, ShellHeaderMobile } from "./ShellHeader";
import { getSocketEndpoint } from "../lib/getSocketEndpoint";
import { useIsMobile } from "../../hooks/useIsMobile";
import { ChatSidebar } from "../chatSIdebar";
export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [endpoint, setEndpoint] = useState(getSocketEndpoint());
  const isMobile = useIsMobile(768); // Tailwind's `md` breakpoint
  
  const handleSwap = () => {
    const current =
      sessionStorage.getItem("ws_endpoint") ||
      localStorage.getItem("ws_endpoint") ||
      endpoint;

    const next = prompt("Enter WebSocket endpoint:", current || endpoint);

    if (next) {
      try {
        sessionStorage.setItem("ws_endpoint", next);
      } catch {
        localStorage.setItem("ws_endpoint", next);
      } 
      setEndpoint(next);
      window.location.reload();
    }
  };

  const navLinks = [
    { path: "/", label: "Chat" },
    { path: "/settings", label: "Settings" },
    { path: "/about", label: "About" },
    { path: "/logs", label: "Logs" },
  ];

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div
      className={`
         flex flex-col
        bg-app-bg text-app-text
        dark:bg-app-bg-dark dark:text-app-text-dark
      `}
    >
      {isMobile ? (
        <ShellHeaderMobile
          location={location}
          navLinks={navLinks}
          endpoint={endpoint}
          onSwap={handleSwap}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <ShellHeaderDesktop
          location={location}
          navLinks={navLinks}
          endpoint={endpoint}
          onSwap={handleSwap}
          onToggleTheme={toggleTheme}
        />
      )}


  {/* Chat content fills available space */}
  <div className="flex flex-1 overflow-hidden">
    <aside className="hidden md:flex md:w-2/12 lg:w-2/12   bg-white ">
      <ChatSidebar onSelectChat={(id) => console.log('Open chat:', id)} />
    </aside>

    <main className="overflow-hidden flex-1 md:w-10/12 lg:w-10/12 overflow-y-auto ">
      <Container className="overflow-hidden flex flex-col">
        {children}
      </Container>
    </main>
  </div>

  {/* Fixed footer */}
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
};
