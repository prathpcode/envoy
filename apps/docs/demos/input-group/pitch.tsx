"use client";
import * as React from "react";
import { ArrowRight } from "pixelarticons/react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@pixel3d/ui";

const MAX = 140;

export default function InputGroupPitch() {
  const [pitch, setPitch] = React.useState("");
  return (
    <div className="w-full max-w-md">
      <InputGroup label="One-line pitch">
        <InputGroupTextarea
          value={pitch}
          maxLength={MAX}
          onChange={(e) => setPitch(e.target.value)}
          placeholder="Uber for rubber ducks"
        />
        <InputGroupAddon align="block-end">
          <span className="text-base tabular-nums">{MAX - pitch.length} left</span>
          <InputGroupButton variant="primary" disabled={!pitch.trim()}>
            Post <ArrowRight />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
