"use client";
import * as React from "react";
import { Button, Stepper } from "@pixel3d/ui";

const steps = ["Team", "Project", "Demo video", "Submit"];

export default function StepperRegistration() {
  const [current, setCurrent] = React.useState(1);
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-10">
      <Stepper steps={steps} current={current} aria-label="Registration" />
      <div className="flex gap-4">
        <Button variant="secondary" disabled={current === 0} onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
          Back
        </Button>
        <Button disabled={current === steps.length} onClick={() => setCurrent((c) => Math.min(steps.length, c + 1))}>
          {current >= steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
