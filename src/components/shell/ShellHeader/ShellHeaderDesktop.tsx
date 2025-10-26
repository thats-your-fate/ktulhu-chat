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
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
    <clipPath id="r">
      <rect x="0" y="0" width="64" height="64" rx="12"/>
    </clipPath>
  </defs>

  <rect width="64" height="64" fill="none" clip-path="url(#r)"/>

  <path d="M32 12c-9 0-15 6-15 14 0 6 3 10 7 13 2 2 3 4 4 6l1 3a3 3 0 0 0 6 0l1-3c1-2 2-4 4-6 4-3 7-7 7-13 0-8-6-14-15-14z" fill="url(#g)"/>
  <path d="M18 40c-5 1-8 5-8 9 0 4 4 6 7 5 3-1 5-4 3-7-2-3-5-3-7-1" stroke="url(#g)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M46 40c5 1 8 5 8 9 0 4-4 6-7 5-3-1-5-4-3-7 2-3 5-3 7-1" stroke="url(#g)" stroke-width="2" fill="none" stroke-linecap="round"/>

  <circle cx="26" cy="28" r="1.8" fill="#111"/>
  <circle cx="38" cy="28" r="1.8" fill="#111"/>
</svg>


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
