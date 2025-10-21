import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "./ui/Container";
import { getSocketEndpoint } from "./lib/getSocketEndpoint";

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [endpoint, setEndpoint] = useState(getSocketEndpoint());

  /**
   * Allow runtime swap of WebSocket endpoint
   * - Stores new value in sessionStorage (preferred)
   * - Falls back to localStorage if sessionStorage fails
   * - Forces a reload so hooks reconnect using the new endpoint
   */
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
        // fallback if sessionStorage is unavailable (rare)
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
        min-h-screen flex flex-col
        bg-app-bg text-app-text
        dark:bg-app-bg-dark dark:text-app-text-dark
      `}
    >
      {/* Header */}
      <header
        className={`
          sticky top-0 z-10 backdrop-blur 
          bg-header-bg/80 border-b border-header-border
          dark:bg-header-bg-dark/80 dark:border-header-border-dark
        `}
      >
        <Container>
          <div className="flex items-center justify-between py-3">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-header-title dark:text-header-title-dark"
            >
              Ktulhu
            </Link>

            <nav className="flex gap-4 text-sm items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition hover:underline ${
                    location.pathname === link.path
                      ? "font-semibold text-nav-active dark:text-nav-active-dark"
                      : "text-nav-inactive hover:text-nav-active dark:text-nav-inactive-dark dark:hover:text-nav-active-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* WebSocket switcher button */}
<button
  onClick={handleSwap}
  className={`
    ml-4 px-2 py-1 rounded text-xs border font-mono transition 
    border-btn-outline-border 
    text-gray-800 bg-white hover:bg-gray-100
    dark:text-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700
  `}
  title={endpoint}
>
  WS: {endpoint.replace(/^wss?:\/\//, "").slice(0, 22)}…
</button>


              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className={`
                  ml-2 px-2 py-1 rounded text-xs border transition 
                  border-btn-outline-border text-btn-outline-text 
                  hover:bg-btn-outline-bg-hover 
                  dark:border-btn-outline-border-dark dark:text-btn-outline-text-dark dark:hover:bg-btn-outline-bg-hover-dark
                `}
              >
                🌓
              </button>
            </nav>
          </div>
        </Container>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className={`
          py-6 text-center text-xs border-t 
          border-header-border bg-header-bg/70 text-footer-text 
          dark:border-header-border-dark dark:bg-header-bg-dark/70 dark:text-footer-text-dark
        `}
      >
        © {new Date().getFullYear()} Ktulhu-Project
      </footer>
    </div>
  );
};
