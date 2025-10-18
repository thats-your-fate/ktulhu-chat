import React, {useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "./ui/Container";

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

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

// on load
useEffect(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
}, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* --- Header --- */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-gray-200">
        <Container>
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="text-xl font-bold tracking-tight">
              Ktulhu
            </Link>

            <nav className="flex gap-4 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`hover:underline ${
                    location.pathname === link.path
                      ? "font-semibold text-black"
                      : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </header>

      {/* --- Main content --- */}
      <main className="flex-1">{children}</main>

      {/* --- Footer --- */}
      <footer className="py-6 text-center text-xs text-gray-500 border-t border-gray-200 bg-white/70">
        © {new Date().getFullYear()} Ktulhu-Project 
      </footer>
    </div>
  );
};
