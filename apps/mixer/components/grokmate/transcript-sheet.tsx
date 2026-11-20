"use client";
import * as React from "react";
import { Lock } from "pixelarticons/react";
import { Badge, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@pixel3d/ui";
import { TOPIC_LABEL, anon, type Ask, type Conv } from "@/lib/grokmate/store";

/** One bot-to-bot conversation, live. What a bot declined to share shows as a grey line, never as text. */
export function TranscriptSheet({ conv, ask, onClose }: { conv?: Conv; ask?: Ask; onClose: () => void }) {
  const end = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [conv?.lines.length, conv?.verdict]);
  const who = (from: string) => (from === "Asker" ? (ask?.mine ? "Your bot" : "Asker") : conv?.you ? "Your bot" : anon(from));

  return (
    <Sheet open={!!conv} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="max-w-lg" bodyClassName="flex flex-col gap-5">
        <SheetHeader>
          <SheetTitle>{conv ? `Asker and ${conv.you ? "your bot" : anon(conv.alias)}` : "Conversation"}</SheetTitle>
          <SheetDescription>Neither bot names its owner. Each one follows its owner&apos;s sharing rules.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3" aria-live="polite">
          {conv && conv.lines.length === 0 && <span className="text-base font-medium text-on-lid-soft">The bots are just sitting down.</span>}
          {conv?.lines.map((l, i) => {
            const asker = l.from === "Asker";
            if (l.withheld) {
              return (
                <div key={i} className={`flex items-center gap-3 bg-on-lid/10 px-3 py-2 ${asker ? "" : "flex-row-reverse text-right"}`}>
                  <Lock className="pixel-icon size-5 shrink-0 text-on-lid-soft" />
                  <span className="text-base font-bold text-on-lid-soft">
                    {who(l.from)} withheld this · {TOPIC_LABEL[l.withheld] ?? l.withheld}
                  </span>
                </div>
              );
            }
            return (
              <div key={i} className={`sticker sticker-flat face-paper flex gap-3 px-3 py-3 ${asker ? "mr-8" : "ml-8 flex-row-reverse text-right"}`}>
                <span className={`h-fit shrink-0 px-2 py-1 text-sm font-extrabold ${asker ? "bg-ink text-paper" : "bg-sky text-ink"}`}>{who(l.from)}</span>
                <span className="text-base font-medium text-ink">{l.text}</span>
              </div>
            );
          })}
          <div ref={end} />
        </div>

        {conv?.verdict && (
          <div className="flex flex-col gap-3 border-t-4 border-dotted border-on-lid/30 pt-4">
            <div className="flex items-start gap-3">
              <Badge tone={conv.verdict.fit >= 7 ? "lime" : "paper"} tilt={-2} className="shrink-0 tabular-nums">Fit {conv.verdict.fit}/10</Badge>
              <span className="text-base font-medium text-on-lid">{conv.verdict.fitReason}</span>
            </div>
            <div className="flex items-start gap-3">
              <Badge tone={conv.verdict.willing ? "lime" : "paper"} tilt={2} className="shrink-0">{conv.verdict.willing ? "Willing" : "Not willing"}</Badge>
              <span className="text-base font-medium text-on-lid">{conv.verdict.willingReason}</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
