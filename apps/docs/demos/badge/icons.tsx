import { Check, Trophy, Zap } from "pixelarticons/react";
import { Badge } from "@pixel3d/ui";

export default function BadgeIcons() {
  return (
    <>
      <Badge tone="butter" tilt={-2}>
        <Trophy aria-hidden /> 1st place
      </Badge>
      <Badge tone="lime" tilt={1.5}>
        <Check aria-hidden /> Demo ready
      </Badge>
      <Badge tone="sky" tilt={-0.8}>
        <Zap aria-hidden /> Streaming
      </Badge>
    </>
  );
}
