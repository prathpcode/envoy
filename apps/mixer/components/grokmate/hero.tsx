"use client";
import * as React from "react";
import { Badge, Button, Card, Display } from "@pixel3d/ui";
import { BOTS, type Bot } from "@/lib/sample";
import { CharAvatar } from "@/components/char-avatar";

const first = (n: string) => n.split(" ")[0];
const tilt = (deg: number) => ({ ["--p3d-tilt" as string]: `${deg}deg` }) as React.CSSProperties;

// every line a talking bot is saying right now, in speaking order
const LIVE = BOTS.flatMap((b) =>
  (b.lines ?? []).map((text) => ({ from: b, to: BOTS.find((x) => x.id === b.talkWith)!, text })),
);

/** The live conversation sticker: proof the bots are working the room, stuck to the hero's edge. */
function LiveLine() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % LIVE.length), 3600);
    return () => clearInterval(t);
  }, []);
  const line = LIVE[i];

  return (
    <div
      className="sticker sticker-lg face-paper crooked flex w-[320px] max-w-full items-center gap-4 p-5"
      style={tilt(2)}
      aria-live="polite"
    >
      <span className="flex shrink-0 items-end" aria-hidden>
        <CharAvatar name={line.from.name} cell={2} />
        <span className="-ml-3 inline-block crooked" style={tilt(-4)}>
          <CharAvatar name={line.to.name} cell={2} />
        </span>
      </span>
      <div key={i} className="animate-slap flex min-w-0 flex-col gap-2">
        <Badge tone="sky" tilt={-3} className="self-start">Live · {line.from.where}</Badge>
        <p className="text-lg font-bold leading-snug text-ink">
          <span className="sr-only">{first(line.from.name)}&apos;s bot to {first(line.to.name)}&apos;s bot: </span>
          {line.text}
        </p>
      </div>
    </div>
  );
}

export function Hero({ bots, onJoin, onRoster }: { bots: Pick<Bot, "id" | "name">[]; onJoin: () => void; onRoster: () => void }) {
  const faces = bots.slice(0, 3);

  return (
    <section className="absolute left-4 top-8 flex w-[calc(100%-2rem)] max-w-[520px] flex-col md:left-8 md:top-10">
      {/* the wordmark is a label sticker slapped over the card's top edge */}
      <span
        className="sticker face-ink crooked relative z-10 -mb-5 ml-6 self-start px-5 py-2 text-xl font-extrabold tracking-tight"
        style={tilt(-2.5)}
      >
        Grokmate
      </span>

      <Card className="flex flex-col gap-5 px-6 pb-7 pt-10 md:px-8">
        <Display className="!text-5xl md:!text-[4rem] text-ink">
          Your personal AI networker{" "}
          <span className="inline-block crooked align-[-0.1em]" style={tilt(4)}>
            <CharAvatar name="Grokmate" cell={2} walk label="your wingman bot" />
          </span>{" "}
          is here.
        </Display>
        <p className="max-w-[40ch] text-lg font-medium leading-snug text-ink-soft">
          Connect your LinkedIn and your bot learns your vibe. It meets a bunch of cool people for you, so you can build your network without leaving your dorm.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-6 pt-2">
          <Button size="lg" tilt={-2} onClick={onJoin}>Try it now</Button>
          <Button size="lg" variant="secondary" tilt={1.5} onClick={onRoster} className="pl-3">
            <span className="-my-4 flex items-end" aria-hidden>
              {faces.map((b, n) => (
                <span key={b.id} className={`inline-block crooked ${n ? "-ml-3" : ""}`} style={tilt(n % 2 ? 4 : -4)}>
                  <CharAvatar name={b.name} cell={2} />
                </span>
              ))}
            </span>
            {bots.length} on campus
          </Button>
        </div>
      </Card>

      <div className="relative z-10 -mt-1 self-end lg:absolute lg:-right-[296px] lg:top-24 lg:mt-0">
        <LiveLine />
      </div>
    </section>
  );
}
