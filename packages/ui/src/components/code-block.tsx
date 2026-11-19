"use client";
import * as React from "react";
import { Check, Copy } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * CodeBlock — a straight paper sticker holding code (the one place monospace is allowed), with a
 * copy-button sticker and an optional filename tab-sticker. Highlighting is ink-only on purpose:
 * comments go soft, keywords go bold, so contrast never drops on the white face.
 *
 *   <CodeBlock filename="submit.ts" code={`await ship(project)`} />
 */
export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  code: string;
  filename?: string;
  /** Light ink-only highlighting for JS/TS-like code. Default true. */
  highlight?: boolean;
  showLineNumbers?: boolean;
}

const KEYWORDS = new Set(
  "import export from default const let var function return if else for while do switch case break continue new class extends await async try catch finally throw typeof instanceof in of interface type enum as true false null undefined this yield void".split(
    " "
  )
);
const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|(?:^|(?<=\s))#[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\b([A-Za-z_$][\w$]*)\b/gm;

function highlightLine(line: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const [text, comment, str, word] = m;
    const k = `${keyBase}-${m.index}`;
    if (comment) out.push(<span key={k} className="text-ink-soft">{text}</span>);
    else if (str) out.push(<span key={k} className="text-ink">{text}</span>);
    else if (word && KEYWORDS.has(word)) out.push(<span key={k} className="font-bold">{text}</span>);
    else out.push(text);
    last = m.index + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ code, filename, highlight = true, showLineNumbers = false, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const lines = React.useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);

    React.useEffect(() => {
      if (!copied) return;
      const t = window.setTimeout(() => setCopied(false), 1600);
      return () => window.clearTimeout(t);
    }, [copied]);

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    };

    return (
      <div
        ref={ref}
        data-slot="code-block"
        className={cn("relative w-full", filename ? "pt-6" : "", className)}
        {...props}
      >
        {filename && (
          <span
            data-slot="code-block-filename"
            className="sticker face-ink crooked absolute top-0 left-6 z-10 inline-flex h-9 items-center px-3 font-mono text-sm font-bold"
            style={{ ["--p3d-tilt" as string]: "-1.5deg" }}
          >
            {filename}
          </span>
        )}
        <div className="sticker sticker-lg face-paper">
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy code"}
            className={cn(
              "sticker focus-cut peel absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center",
              copied ? "face-lime" : "face-paper"
            )}
            style={{ ["--p3d-tilt" as string]: "2deg" }}
          >
            {copied ? (
              <Check aria-hidden className="pixel-icon animate-land size-5" />
            ) : (
              <Copy aria-hidden className="pixel-icon size-5" />
            )}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? "Copied to clipboard" : ""}
          </span>
          <div className="overflow-x-auto px-6 pt-6 pb-5 pr-16">
            <pre className="font-mono text-[15px] leading-relaxed text-ink">
              <code>
                {lines.map((line, i) => (
                  <span key={i} className="block min-h-[1lh]">
                    {showLineNumbers && (
                      <span aria-hidden className="mr-5 inline-block w-6 text-right text-ink-soft select-none tabular-nums">
                        {i + 1}
                      </span>
                    )}
                    {highlight ? highlightLine(line, String(i)) : line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";
