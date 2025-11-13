import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSocketContext } from "../../../context/SocketProvider";
import type { Location } from "react-router-dom";

type ShellHeaderMobileProps = {
  location: Location;
  navLinks: { path: string; label: string }[];
  endpoint: string;
  onSwap: () => void;
  onToggleTheme: () => void;
};

export const ShellHeaderMobile: React.FC<ShellHeaderMobileProps> = ({
  location,
  navLinks,
  endpoint,
  onSwap,
  onToggleTheme,
}) => {
  const { status } = useSocketContext();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`
        sticky top-0 z-20 flex items-center justify-between
        px-4 py-3 backdrop-blur bg-header-bg/90 border-b border-header-border
        dark:bg-header-bg-dark/80 dark:border-header-border-dark
      `}
    >
      {/* Left side — app name */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">Ktulhu</span>
      </div>

      {/* Right side — status dot + burger */}
      <div className="flex items-center gap-3">
        {/* 🔵 Small WebSocket status indicator */}
        <div
          className={`
            w-3 h-3 rounded-full border border-gray-400 transition-colors duration-300
            ${status === "open" ? "bg-green-500" : ""}
            ${status === "connecting" ? "bg-yellow-400 animate-pulse" : ""}
            ${status === "error" ? "bg-red-500" : ""}
            ${status === "closed" || status === "idle" ? "bg-gray-400" : ""}
          `}
          title={`WebSocket: ${status}`}
        />

        {/* ☰ Menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xl"
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 shadow-lg">
          <nav className="flex flex-col p-3 space-y-2 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block py-1 ${
                  location.pathname === link.path
                    ? "font-semibold text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200"
                }`}   
              >
                {link.label}
              </Link>
            ))} 

            {/* WebSocket switcher */}
            <button onClick={onSwap} className="text-xs text-gray-500 mt-2">
              WS: {endpoint.replace(/^wss?:\/\//, "").slice(0, 16)}…
            </button>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="text-xs text-gray-500 mt-2"
            >
              🌓 Toggle Theme
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
