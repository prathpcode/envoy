"use client";
import * as React from "react";
import { Badge, Button, Intro, PixelAvatar } from "@pixel3d/ui";

export default function IntroDemo() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-10">
      <Intro key={run} tumble className="flex flex-wrap items-center justify-center gap-6">
        <PixelAvatar name="Null Pointers" />
        <Badge tone="sky" tilt={-2}>AI track</Badge>
        <Badge tone="lime" tilt={1.5}>Checked in</Badge>
        <PixelAvatar name="Byte Club" />
      </Intro>
      <Button variant="secondary" onClick={() => setRun(run + 1)}>
        Stick them on again
      </Button>
    </div>
  );
}
