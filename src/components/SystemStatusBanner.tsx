import { useEffect, useState } from "react";

export function SystemStatusBanner({ text }: { text: string | null }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplay("");
      return;
    }

    // typing speed depending on text length (400ms total)
    const duration = 650;
    const steps = text.length;
    const interval = duration / steps;

    let i = 0;
    setDisplay("");

    const timer = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [text]);

  if (!text) return null;

  return (
    <div
      className="
        px-3 py-2 my-2 text-md text-gray-600 dark:text-gray-400
        bg-gray-50 dark:bg-gray-800 border-t border-gray-200 
        dark:border-gray-700 animate-fade-in
      "
    >
      {display}
    </div>
  );
}
