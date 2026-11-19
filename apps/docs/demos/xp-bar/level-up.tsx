"use client";
import * as React from "react";
import { Zap } from "pixelarticons/react";
import { Button, XPBar } from "@pixel3d/ui";

const PER_LEVEL = 500;

export default function XPBarLevelUp() {
  const [xp, setXp] = React.useState(220);
  const [level, setLevel] = React.useState(7);
  const gain = () => {
    const next = xp + 120;
    if (next >= PER_LEVEL) {
      setLevel((l) => l + 1);
      setXp(next - PER_LEVEL);
    } else setXp(next);
  };
  return (
    <div className="flex flex-col items-center gap-8">
      <XPBar value={xp} max={PER_LEVEL} level={level} label="Ada" />
      <Button variant="success" onClick={gain}>
        <Zap /> Merge a PR
      </Button>
    </div>
  );
}
