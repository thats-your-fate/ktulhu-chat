import React, { forwardRef } from "react";
import clsx from "clsx"; // optional helper if you like cleaner className joining

// ---------- CARD CONTAINER ----------
export const Pannel = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => (
    <div
      ref={ref}
      className={clsx(
        
        "mx-auto dark:bg-card-bg-dark dark:border-card-border-dark",
        className
      )}
    >
      {children}
    </div>
  )
);
Pannel.displayName = "Card";

// ---------- CARD HEADER ----------
export const PannelHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div
    className={clsx(
      "mx auto px-4 py-3 border-b",
      "border-card-divider dark:border-card-divider-dark"
    )}
  >
    <h2
      className={clsx(
        "text-lg font-semibold text-card-title dark:text-card-title-dark"
      )}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={clsx(
          "text-sm mt-1 text-card-subtitle dark:text-card-subtitle-dark"
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// ---------- CARD BODY ----------
export const PannelBody = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className = "" }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "px-4 py-4 mb-[2.5rem] text-card-text dark:text-card-text-dark",
      className
    )}
  >
    {children}
  </div>
));
PannelBody.displayName = "CardBody";
