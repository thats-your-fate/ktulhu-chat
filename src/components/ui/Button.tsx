import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const base =
    "text-sm font-medium rounded-lg px-5 py-2.5 focus:outline-none focus:ring-4 transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    // 🟩 Default = "Dark" button style (second button in your example)
    default: `
      text-white bg-gray-800 
      focus:ring-gray-300 
      dark:bg-gray-800 
      dark:focus:ring-gray-700 dark:border-gray-700
    `,

    // 🟦 Ghost = "Alternative" button style (first button in your example)
    ghost: `
      text-gray-900 bg-white border border-gray-200 
      focus:z-10 focus:ring-gray-100 
      dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600
      dark:focus:ring-gray-700
    `,

    // ✍️ Outline = optional, similar to ghost but transparent background
    outline: `
      text-gray-900 border border-gray-400 bg-transparent
      focus:ring-gray-300
      dark:text-gray-100 dark:border-gray-500
    `,
  } as const;

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
