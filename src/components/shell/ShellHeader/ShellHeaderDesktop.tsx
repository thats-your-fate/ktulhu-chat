import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../../ui/Container";
import { useSocketContext } from "../../../context/SocketContext";
import type { Location } from "react-router-dom";

type ShellHeaderProps = {
  location: Location;
  navLinks: { path: string; label: string }[];
  endpoint: string;
  onSwap: () => void;
  onToggleTheme: () => void;
};

export const ShellHeaderDesktop: React.FC<ShellHeaderProps> = ({
  location,
  navLinks,
  endpoint,
  onSwap,
  onToggleTheme,
}) => {
  const { status, lastError } = useSocketContext();

  return (
    <header
      className={`
        sticky top-0 z-10 backdrop-blur 
        bg-header-bg/80 border-b border-header-border
        dark:bg-header-bg-dark/80 dark:border-header-border-dark
      `}
    >
      <Container>
        <div className="flex flex-wrap items-center justify-between py-3 gap-2">
          {/* Left side — title + status */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-header-title dark:text-header-title-dark"
            >
              Ktulhu
            </Link>


          </div>

          {/* Right side — nav + controls */}
          <nav className="flex flex-wrap gap-3 text-sm items-center">
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

            <button
              onClick={onSwap}
              className={`
                ml-2 px-2 py-1 rounded text-xs border font-mono transition 
                border-btn-outline-border 
                text-gray-800 bg-white hover:bg-gray-100
                dark:text-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700
              `}
              title={endpoint}
            >
              WS: {endpoint.replace(/^wss?:\/\//, "").slice(0, 22)}…
            </button>
            <div
              className={`
                w-3 h-3 rounded-full border border-gray-400 transition-colors duration-300
                ${status === "open" ? "bg-green-500" : ""}
                ${status === "connecting" ? "bg-yellow-400 animate-pulse" : ""}
                ${status === "error" ? "bg-red-500" : ""}
                ${status === "closed" || status === "idle" ? "bg-gray-400" : ""}
              `}
              title={`WebSocket: ${status}${lastError ? ` (${lastError})` : ""}`}
            />

            {lastError && (
              <span className="text-xs text-red-600 ml-1">{lastError}</span>
            )}
            <button
              onClick={onToggleTheme}
              className={`
                bg-transparent ml-1 px-2 py-1 rounded text-xs border transition 
                text-btn-outline-text dark:text-btn-outline-text-dark
              `}
              title="Toggle dark mode"
            >
              🌓
            </button>
          </nav>
        </div>
      </Container>
    </header>
  );
};
