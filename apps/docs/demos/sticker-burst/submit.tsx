"use client";
import * as React from "react";
import { ArrowRight, Check } from "pixelarticons/react";
import { Button } from "@pixel3d/ui";
import { StickerBurstHost, useStickerBurst } from "@pixel3d/ui/three";

export default function StickerBurstSubmit() {
  const burst = useStickerBurst();
  const [sent, setSent] = React.useState(false);
  return (
    <>
      <StickerBurstHost />
      <Button
        size="lg"
        variant={sent ? "success" : "primary"}
        onClick={(e) => {
          burst(e.currentTarget);
          setSent(true);
        }}
      >
        {sent ? (
          <>
            <Check className="animate-land" /> Project submitted
          </>
        ) : (
          <>
            Submit project <ArrowRight />
          </>
        )}
      </Button>
    </>
  );
}
