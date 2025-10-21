import React from "react";

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`
        rounded-2xl shadow-sm border 
        bg-card-bg border-card-border 
        dark:bg-card-bg-dark dark:border-card-border-dark 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <div
      className={`
        px-4 py-3 border-b 
        border-card-divider 
        dark:border-card-divider-dark
      `}
    >
      <h2
        className={`
          text-lg font-semibold text-card-title 
          dark:text-card-title-dark
        `}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`
            text-sm mt-1 text-card-subtitle 
            dark:text-card-subtitle-dark
          `}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`px-4 py-3 text-card-text dark:text-card-text-dark ${className}`}>
      {children}
    </div>
  );
};
