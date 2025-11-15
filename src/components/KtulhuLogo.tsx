// src/components/KtulhuLogo.tsx
import React from "react";

interface KtulhuLogoProps {
  size?: number;
  className?: string;
}

export const KtulhuLogo: React.FC<KtulhuLogoProps> = ({
  size = 32,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Light mode logo */}
      <img
        src="/ktulhu.png"
        alt="Ktulhu Logo"
        className="absolute inset-0 object-contain dark:hidden"
        style={{ width: size, height: size }}
      />

      {/* Dark mode logo */}
      <img
        src="/ktulhuWhite.png"
        alt="Ktulhu Logo (Dark)"
        className="absolute inset-0 object-contain hidden dark:block"
        style={{ width: size, height: size }}
      />
    </div>
  );
};
