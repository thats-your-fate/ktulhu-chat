import React, { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ✅ Lazy-load SyntaxHighlighter to avoid loading it on first paint
const LazySyntaxHighlighter = React.lazy(() =>
  import("react-syntax-highlighter").then(mod => ({ default: mod.Prism }))
);
// ✅ correct ESM import
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


interface MessageBubbleProps {
  role: string;
  content: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({ role, content }) => {
    // ✅ Skip markdown overhead if there's no code at all
    const containsCode = content.includes("`");

    if (role === "user") {
      return (
        <div className="flex justify-end">
          <div
            className={`
              max-w-[85%] whitespace-pre-wrap leading-relaxed rounded-2xl px-3 py-2 text-sm 
              bg-message-user-bg text-message-user-text
              dark:bg-message-user-bg-dark dark:text-message-user-text-dark
            `}
          >
            {content}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`
          w-full text-base leading-relaxed px-2 md:px-4 py-3
          prose prose-sm max-w-none dark:prose-invert
          text-message-assistant-text dark:text-message-assistant-text-dark
        `}
      >
        {containsCode ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const language = className?.replace("language-", "") || "";
                const codeText = String(children).trim();
                const isInline =
                  inline || (!language && !codeText.includes("\n"));

                if (isInline) {
                  return (
                    <code
                      className={`
                        px-2 py-[4px] rounded-md font-mono text-[0.85em] 
                        bg-slate-100/70 text-slate-800 
                        dark:bg-slate-800/70 dark:text-slate-100
                      `}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="relative group mt-2">
                    {/* language label */}
                    {language && (
                      <div className="absolute top-2 right-2 text-xs text-gray-400 font-mono">
                        {language}
                      </div>
                    )}

                    {/* copy button */}
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(codeText)
                      }
                      className="absolute top-6 right-2 opacity-0 group-hover:opacity-100 transition text-xs bg-slate-700 text-white px-2 py-1 rounded"
                    >
                      Copy
                    </button>

                    {/* ✅ Lazy load the syntax highlighter */}
                    <Suspense
                      fallback={
                        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 mt-2 font-mono text-sm overflow-x-auto">
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
              },
            }}
          >
            {content || "…"}
          </ReactMarkdown>
        ) : (
          // ✅ Render as plain text if no markdown/code present
          <p className="whitespace-pre-wrap">{content}</p>
        )}
      </div>
    );
  }
);
