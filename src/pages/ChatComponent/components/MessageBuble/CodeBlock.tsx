import React, { Suspense } from "react";
import type { Prism as SyntaxHighlighterType } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


const LazySyntaxHighlighter = React.lazy(async () => {
  const mod = await import("react-syntax-highlighter");
  return { default: (mod as { Prism: typeof SyntaxHighlighterType }).Prism };
});

export interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  language?: string;
  value?: string;
  inline?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = "",
  value = "",
  inline = false,
  className,
  ...props
}) => {
  const codeText = value.trim();
  const isInline = inline || (!language && !codeText.includes("\n"));

  if (isInline) {
    return (
      <code
        className="
          px-0 py-[3px] rounded-md font-mono text-[0.85em]
          bg-slate-100/70 text-slate-800
          dark:bg-slate-800/70 dark:text-slate-100
        "
        {...props}
      >
        {codeText}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText).catch(() => {
      console.warn("Clipboard copy failed");
    });
  };

  return (
    <div className="relative group mt-3">
      {language && (
        <div className="absolute top-2 right-2 text-xs text-gray-400 font-mono select-none">
          {language}
        </div>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className="
          absolute top-6 right-2 opacity-0 group-hover:opacity-100
          transition text-xs bg-slate-700 text-white px-2 py-1 rounded
        "
      >
        Copy
      </button>

      <Suspense
        fallback={
          <pre
            className="
              bg-slate-900 text-slate-100 rounded-lg p-4 mt-2
              font-mono text-sm overflow-x-auto
            "
          >
            {codeText}
          </pre>
        }
      >
        <LazySyntaxHighlighter
          language={language || "plaintext"}
          style={oneDark}
          customStyle={{
            borderRadius: "0.5rem",
            padding: "1rem",
            fontSize: "0.875rem",
            marginTop: "0.5rem",
          }}
          PreTag="div"
          {...props}
        >
          {codeText}
        </LazySyntaxHighlighter>
      </Suspense>
    </div>
  );
};
