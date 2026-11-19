"use client";
import { Badge, Checkbox, Label, Switch, XPBar } from "@pixel3d/ui";

/** Real, working stickers stuck on the lid among the 3D voxels (the hero's proof). */
export function HeroStickers() {
  return (
    // z-35: real controls sit above the shared 3D canvas (z-30), below the sticky header (z-40)
    <div className="intro-stagger intro-tumble relative z-[35] flex flex-col items-center gap-7 [--p3d-intro-base:120ms]">
      <Badge tone="sky" tilt={-2.5} className="h-10 px-4 text-base">
        AI track
      </Badge>
      <Label className="sticker face-paper crooked px-5 py-3 text-ink [--p3d-tilt:2.5deg]">
        <Checkbox defaultChecked />
        Find me a team
      </Label>
      <XPBar value={72} max={100} level={4} label="Hype" blocks={16} className="crooked [--p3d-tilt:-1.5deg]" />
      <Label className="sticker face-paper crooked px-5 py-3 text-ink [--p3d-tilt:-2deg]">
        <Switch defaultChecked aria-label="Demo-day mode" />
        Demo mode
      </Label>
    </div>
  );
}
