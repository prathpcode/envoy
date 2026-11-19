import { Badge } from "@pixel3d/ui";

export default function BadgeTones() {
  return (
    <>
      <Badge>Draft</Badge>
      <Badge tone="lime" tilt={2}>Submitted</Badge>
      <Badge tone="sky" tilt={-1}>Live</Badge>
      <Badge tone="butter" tilt={1.5}>Due in 2h</Badge>
      <Badge tone="tomato" tilt={-2.5}>Disqualified</Badge>
      <Badge tone="ink" tilt={1}>Sponsor</Badge>
    </>
  );
}
