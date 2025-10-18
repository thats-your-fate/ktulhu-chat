import React from "react";

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="mx-auto w-full max-w-5xl md:max-w-6xl lg:max-w-7xl 3xl:max-w-8xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};
