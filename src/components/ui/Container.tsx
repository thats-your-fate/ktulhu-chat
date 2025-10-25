import React from "react";

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};
