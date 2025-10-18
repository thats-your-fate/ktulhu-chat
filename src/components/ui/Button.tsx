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
  const base = "px-3 py-2 rounded-xl text-sm transition shadow-sm";
  const variants = {
    default: "bg-black text-white hover:opacity-90",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    outline: "border border-gray-300 hover:bg-gray-50",
  } as const;

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${
        props.disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};
