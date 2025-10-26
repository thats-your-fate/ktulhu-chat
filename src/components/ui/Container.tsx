import React from "react";
import clsx from "clsx";

export const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={clsx("mx-auto w-full px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
};
