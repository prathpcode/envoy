"use client";
import * as React from "react";
import {
  Button,
  Input,
  Checkbox,
  Label,
  Countdown,
  Leaderboard,
  TeamCard,
  XPBar,
  type LeaderboardEntry,
} from "@pixel3d/ui";
import { useStickerBurst } from "@pixel3d/ui/three";

const TEAMS: LeaderboardEntry[] = [
  { id: "a", name: "Null Pointers", score: 412 },
  { id: "b", name: "Byte Club", score: 388 },
  { id: "c", name: "Team Voxel", score: 371 },
  { id: "d", name: "Segfault Society", score: 340 },
  { id: "e", name: "404 Found", score: 322 },
];

/** Working stickers on bare lid: a sign-up that bursts, a live board, the clock. */
export function LiveCollage() {
  const burst = useStickerBurst();
  const [entries, setEntries] = React.useState(TEAMS);
  const [xp, setXp] = React.useState(64);
  const [deadline, setDeadline] = React.useState<number | null>(null);

  React.useEffect(() => {
    setDeadline(Date.now() + 1000 * 60 * 60 * 35 + 1000 * 60 * 17);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => {
      setEntries((prev) =>
        prev.map((e) => ({ ...e, score: e.score + Math.floor(Math.random() * 28) }))
      );
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-x-14 gap-y-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <form
        className="sticker sticker-lg face-paper flex flex-col gap-6 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          const btn = (e.currentTarget.querySelector("[data-submit]") as HTMLElement) ?? e.currentTarget;
          burst(btn, { count: 22 });
          setXp((v) => Math.min(100, v + 18));
        }}
      >
        <p className="text-3xl font-extrabold tracking-[-0.02em]">Register your team</p>
        <Input label="Team name" placeholder="Null Pointers" />
        <Label className="text-ink">
          <Checkbox defaultChecked />
          Find us a designer
        </Label>
        <XPBar value={xp} max={100} level={3} label="Hype" variant="xp" />
        <Button type="submit" size="lg" data-submit className="self-start">
          Lock it in
        </Button>
      </form>

      <div className="flex flex-col gap-14">
        <div className="flex flex-wrap items-end gap-8">
          {deadline && <Countdown to={deadline} hideDays />}
        </div>
        <Leaderboard entries={entries} className="max-w-xl" />
        <TeamCard
          name="Team Voxel"
          members={["Ada", "Linus", "Grace", "Margaret"]}
          track="AI track"
          trackTone="sky"
          tilt={1.5}
          className="max-w-md"
          action={<Button variant="secondary" size="sm">Say hi</Button>}
        />
      </div>
    </div>
  );
}
