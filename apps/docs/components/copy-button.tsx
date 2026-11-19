"use client";
import * as React from "react";
import { Copy, Check } from "pixelarticons/react";
import { cn } from "@pixel3d/ui";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : "Copy code"}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className={cn(
        "sticker focus-cut peel grid size-10 cursor-pointer place-items-center",
        done ? "face-lime animate-slap" : "face-paper",
        className
      )}
    >
      {done ? <Check className="pixel-icon size-5" aria-hidden /> : <Copy className="pixel-icon size-5" aria-hidden />}
    </button>
  );
}
