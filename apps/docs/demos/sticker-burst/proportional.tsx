"use client";
import { Button } from "@pixel3d/ui";
import { StickerBurstHost, useStickerBurst } from "@pixel3d/ui/three";

// Match the burst to the moment: a fixed bug is a pop, a win is a party.
export default function StickerBurstProportional() {
  const burst = useStickerBurst();
  return (
    <>
      <StickerBurstHost />
      <Button variant="secondary" onClick={(e) => burst(e.currentTarget, { count: 6 })}>
        Bug squashed
      </Button>
      <Button variant="success" onClick={(e) => burst(e.currentTarget, { count: 18 })}>
        Demo shipped
      </Button>
      <Button variant="ink" onClick={(e) => burst(e.currentTarget, { count: 48, size: 36 })}>
        We won
      </Button>
    </>
  );
}
