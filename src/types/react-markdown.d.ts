declare module "react-markdown/lib/ast-to-react" {
  import * as React from "react";

  export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
    node?: unknown;
  }
}
