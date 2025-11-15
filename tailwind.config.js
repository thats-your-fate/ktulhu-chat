/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // extend tailwind's default theme
    extend: {


      colors: {
                'badge-bg': '#f3f4f6', // light gray for light mode
        'badge-text': '#1f2937', // dark text for light mode

        'badge-bg-dark': '#374151', // darker gray for dark mode
        'badge-text-dark': '#f9fafb', // light text for dark mode
        // brand palette — tweak these freely
// DEFAULT variant — always dark bg + white text
"btn-default-bg": "#111827",         // dark slate background
"btn-default-text": "#ffffff",       // high-contrast white text
"btn-default-bg-hover": "#111827",   // same (no hover color)
"btn-default-bg-dark": "#f9fafb",    // light background in dark mode
"btn-default-text-dark": "#111827",  // dark text on light bg
"btn-default-bg-hover-dark": "#f9fafb", // same (no hover color)

// GHOST variant — transparent but text stays visible
"btn-ghost-text": "#111827",         // darker text for better contrast (was too light)
"btn-ghost-bg-hover": "transparent", // keep transparent, no hover effect
"btn-ghost-text-dark": "#f9fafb",    // white text in dark mode
"btn-ghost-bg-hover-dark": "transparent",

// OUTLINE variant — readable border and text
"btn-outline-border": "#4b5563",     // slightly darker border for visibility
"btn-outline-text": "#111827",       // high contrast text
"btn-outline-bg-hover": "transparent", // no hover background
"btn-outline-border-dark": "#9ca3af", // lighter border in dark mode
"btn-outline-text-dark": "#f9fafb",  // white text
"btn-outline-bg-hover-dark": "transparent",

// Card backgrounds (unchanged)
"card-bg": "#ffffff",
"card-bg-dark": "#1f2937",


        // Borders and dividers
        "card-border": "#e5e7eb",
        "card-border-dark": "#374151",
        "card-divider": "#f3f4f6",
        "card-divider-dark": "#2d3748",

        // Typography
        "card-title": "#111827",
        "card-title-dark": "#f9fafb",
        "card-subtitle": "#6b7280",
        "card-subtitle-dark": "#d1d5db",
        "card-text": "#374151",
        "card-text-dark": "#e5e7eb",

                // Background & text
        "textarea-bg": "#ffffff",
        "textarea-bg-dark": "#111827",
        "textarea-text": "#1f2937",
        "textarea-text-dark": "#f9fafb",

        // Placeholder
        "textarea-placeholder": "#9ca3af",
        "textarea-placeholder-dark": "#6b7280",

        // Borders
        "textarea-border": "#d1d5db",
        "textarea-border-hover": "#9ca3af",
        "textarea-border-dark": "#374151",
        "textarea-border-hover-dark": "#4b5563",

        // Focus ring
        "textarea-ring": "#d1d5db",
        "textarea-ring-dark": "#4b5563",

                "message-user-bg": "#4c515aff",            // brand primary (blue-600)
        "message-user-text": "#ffffff",
        "message-user-bg-dark": "#4c515aff",          // lighter blue for dark mode
        "message-user-text-dark": "#ffffff",

        "chat-item-bg": "#4c515aff",            // brand primary (blue-600)
        "chat-item-text": "#ffffff",
        "chat-item-bg-dark": "#4c515aff",          // lighter blue for dark mode
        "chat-item-text-dark": "#ffffff",

        // 🤖 Assistant message bubble (neutral but branded)
        "message-assistant-bg": "#f3f4f6",        // light gray background
        "message-assistant-text": "#1f2937",      // dark text
        "message-assistant-bg-dark": "#374151",   // dark gray for dark mode
        "message-assistant-text-dark": "#f9fafb", // light text 
            // App background / text (reuse card + text tokens)
    "app-bg": "#f9fafb",
    "app-bg-dark": "#1f2937",
    "app-text": "#1f2937",
    "app-text-dark": "#f3f4f6",

    // Header and footer (reuse card borders / background)
    "header-bg": "#ffffff",
    "header-bg-dark": "#1e293b",
    "header-border": "#e5e7eb",
    "header-border-dark": "#334155",
    "header-title": "#111827",
    "header-title-dark": "#f9fafb",

    // Nav links
    "nav-active": "#2563eb",
    "nav-active-dark": "#3b82f6",
    "nav-inactive": "#6b7280",
    "nav-inactive-dark": "#94a3b8",

    // Footer
    "footer-text": "#6b7280",
    "footer-text-dark": "#94a3b8",
      },

      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },

      maxWidth: {
        "7xl": "90rem",
        "8xl": "100rem",
      },

      screens: {
        "3xl": "1920px",
      },

      // rounded corners and shadow depth
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
  darkMode: "class", // we'll use this later for dark theme toggle
};
