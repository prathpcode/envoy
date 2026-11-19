"use client";
import * as React from "react";
import { Button, Progress } from "@pixel3d/ui";

export default function ProgressUpload() {
  const [value, setValue] = React.useState(36);
  const done = value >= 100;

  React.useEffect(() => {
    if (done) return;
    const t = setInterval(() => setValue((v) => Math.min(100, v + 7)), 700);
    return () => clearInterval(t);
  }, [done]);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4 text-on-lid">
        <span id="upload-label" className="text-lg font-extrabold">
          {done ? "Demo video uploaded" : "Uploading demo video"}
        </span>
        <span className="text-base font-bold tabular-nums">{value}%</span>
      </div>
      <Progress value={value} aria-labelledby="upload-label" />
      {done && (
        <Button variant="secondary" size="sm" className="self-start" onClick={() => setValue(0)}>
          Upload again
        </Button>
      )}
    </div>
  );
}
