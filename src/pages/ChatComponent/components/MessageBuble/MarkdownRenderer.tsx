import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import type { Components } from "react-markdown";
import type { CodeProps } from "react-markdown/lib/ast-to-react";

interface MarkdownRendererProps {
  content: string;
}

const components = {
  code: ((props: CodeProps) => {
    const { inline, className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    return (
      <CodeBlock
        language={language}
        value={String(children).replace(/\n$/, "")}
        inline={!!inline}
        {...rest}
      />
    );
  }) as Components["code"],
} satisfies Components;

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => (
  <React.Suspense fallback={<div>Loading…</div>}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content || "…"}
    </ReactMarkdown>
  </React.Suspense>
);
