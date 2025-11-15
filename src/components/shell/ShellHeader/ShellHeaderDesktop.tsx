import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../../ui/Container";
import { useSocketContext } from "../../../context/SocketProvider";
import type { Location } from "react-router-dom";
import { KtulhuLogo } from "../../KtulhuLogo";
import { Sun, Moon } from "lucide-react";

type ShellHeaderProps = {
  location: Location;
  navLinks: { path: string; label: string }[];
  endpoint: string;
  onSwap: () => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";   // ← 🔥 REQUIRED NOW
};

export const ShellHeaderDesktop: React.FC<ShellHeaderProps> = ({
  location,
  navLinks,
  endpoint,
  onSwap,
  onToggleTheme,
  theme,
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
          {/* Left side — logo + title */}
          <div className="flex items-center gap-3">
            <KtulhuLogo size={30} />

            <Link
              to="/"
              className="
                text-xl font-bold tracking-tight 
                text-header-title dark:text-header-title-dark
              "
            >
              Ktulhu
            </Link>
          </div>

          {/* Right side — nav + controls */}
          <nav className="flex flex-wrap gap-3 text-sm items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-2 py-1 uppercase transition-colors duration-150
                    ${
                      isActive
                        ? "font-semibold text-black dark:text-white"
                        : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* WS Endpoint Button */}
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

            {/* Connection Status Dot */}
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

            {/* 🌙 Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="
                bg-transparent ml-1 px-2 py-1 rounded text-xs border transition 
                border-btn-outline-border 
                text-btn-outline-text dark:text-btn-outline-text-dark
              "
              title="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-yellow-400" />
              ) : (
                <Moon size={16} className="text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </nav>
        </div>
      </Container>
    </header>
  );
};
