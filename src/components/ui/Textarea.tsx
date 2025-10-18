import React from "react";

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (
  props
) => {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-xl border border-gray-300 p-3 outline-none focus:ring focus:ring-gray-200 ${
        props.className ?? ""
      }`}
    />
  );
};
