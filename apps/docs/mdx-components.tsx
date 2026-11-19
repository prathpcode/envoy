import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/code-block";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: ({ children }) => {
      // MDX gives <pre><code className="language-x">…</code></pre>
      const child = children as React.ReactElement<{ className?: string; children?: string }>;
      const lang = child?.props?.className?.replace("language-", "") ?? "tsx";
      return <CodeBlock code={String(child?.props?.children ?? "").trimEnd()} lang={lang} />;
    },
    ...components,
  };
}
