"use client";
import * as React from "react";
import { Button, Countdown } from "@pixel3d/ui";

export default function CountdownEnded() {
  const [to, setTo] = React.useState(() => Date.now() + 10_000);
  const [over, setOver] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-8">
      <Countdown to={to} hideDays ended="Pens down" onComplete={() => setOver(true)} />
      <Button
        variant="secondary"
        disabled={!over}
        onClick={() => {
          setOver(false);
          setTo(Date.now() + 10_000);
        }}
      >
        Run it again
      </Button>
    </div>
  );
}
