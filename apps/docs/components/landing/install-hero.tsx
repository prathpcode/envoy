"use client";
import Link from "next/link";
import { Button, cn } from "@pixel3d/ui";
import { CopyButton } from "../copy-button";

const RUN = "npx shadcn@latest add";
const PKG = "@pixel3d/button";

/**
 * The Persuade action: one dominant pink sticker, then the real install command as a
 * lighter paper sticker. The command wraps before the package name on phones so the
 * part that matters never clips.
 */
export function InstallHero({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-start gap-5", className)}>
      <Button asChild className="h-16 px-9 text-2xl">
        <Link href="/docs/components/button">Browse 70 components</Link>
      </Button>
      <div className="sticker face-paper flex max-w-full min-w-0 items-center gap-4 py-2 pr-2 pl-5">
        <code className="min-w-0 font-mono text-[16px] leading-snug text-ink">
          <span className="whitespace-nowrap">{RUN}</span> <span className="font-bold whitespace-nowrap">{PKG}</span>
        </code>
        <CopyButton value={`${RUN} ${PKG}`} />
      </div>
    </div>
  );
}
