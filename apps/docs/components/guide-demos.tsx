"use client";
import * as React from "react";
import { Button, Checkbox, Label, Switch } from "@pixel3d/ui";

/** Small interactive bits used inside guide MDX pages. */
export function IntroToggles() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Label>
        <Checkbox defaultChecked />
        Find me a team
      </Label>
      <Label>
        <Switch defaultChecked aria-label="Notifications" />
        Pings
      </Label>
    </div>
  );
}

export function PeelPlayground() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-6">
      <Button size="lg" onClick={() => setCount((c) => c + 1)}>
        Press me
      </Button>
      <p className="text-lg font-semibold tabular-nums">Slapped {count} times</p>
    </div>
  );
}

export function TiltRow() {
  return (
    <>
      <Button variant="secondary">auto</Button>
      <Button variant="secondary">auto</Button>
      <Button variant="secondary" tilt={false}>
        tilt=false
      </Button>
      <Button variant="secondary" tilt={-6}>
        tilt=-6
      </Button>
    </>
  );
}

/** Few Voices: the over-labelled version, on purpose (used only as a "don't"). */
export function TooManyVoices() {
  return (
    <div className="sticker sticker-lg face-paper flex max-w-xs flex-col gap-1.5 p-6">
      <span className="text-sm font-bold text-ink-soft">NEW · FEATURED</span>
      <span className="text-xl font-extrabold">Team Voxel</span>
      <span className="text-sm text-ink-soft">AI track · 4 members · Table 12</span>
      <span className="text-sm text-ink-soft">Last updated 3 min ago</span>
      <span className="text-sm text-ink-soft">Click below to view the project</span>
      <Button size="sm" tilt={false} className="mt-2 self-start">View</Button>
    </div>
  );
}

export function FewVoices() {
  return (
    <div className="sticker sticker-lg face-paper flex max-w-xs flex-col gap-4 p-6">
      <span className="text-2xl font-extrabold">Team Voxel</span>
      <span className="text-base">Turns your sketches into playable levels.</span>
      <Button size="sm" className="self-start">View project</Button>
    </div>
  );
}
