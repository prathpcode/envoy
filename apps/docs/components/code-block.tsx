import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";
import { cn } from "@pixel3d/ui";

/** Server-rendered, highlighted code on a straight paper sticker. */
export async function CodeBlock({ code, lang = "tsx", className }: { code: string; lang?: string; className?: string }) {
  // high-contrast theme: every token clears AA (4.5:1) on the paper sticker
  const html = await codeToHtml(code, { lang, theme: "github-light-high-contrast" });
  return (
    <div className={cn("sticker sticker-lg face-paper relative my-6 max-w-full", className)}>
      <div className="absolute top-3 right-3 z-10">
        <CopyButton value={code} />
      </div>
      <div className="overflow-x-auto px-6 py-5 pr-16" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
