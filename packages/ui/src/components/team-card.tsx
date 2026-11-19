import * as React from "react";
import { cn, type Tilt } from "../lib/utils";
import { Card, CardTitle } from "./card";
import { Badge, type BadgeProps } from "./badge";
import { PixelAvatar } from "./pixel-avatar";

/**
 * TeamCard — a hackathon team on one card sticker: the crew's pixel avatars, the team name,
 * its track badge and one action. No meta rows, no stats strip (Few Voices).
 *
 *   <TeamCard name="Null Pointers" track="AI tools" members={["Ada", "Linus", "Grace"]}
 *     action={<Button size="sm">Join team</Button>} />
 */
export interface TeamCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  name: string;
  /** Member names; each becomes a PixelAvatar. */
  members: string[];
  track?: React.ReactNode;
  trackTone?: BadgeProps["tone"];
  /** The one action (a Button). */
  action?: React.ReactNode;
  /** Avatars shown before the rest collapse into "+N". */
  maxAvatars?: number;
  tilt?: Tilt;
}

export const TeamCard = React.forwardRef<HTMLDivElement, TeamCardProps>(
  ({ name, members, track, trackTone = "sky", action, maxAvatars = 4, tilt = "auto", className, ...props }, ref) => {
    const shown = members.slice(0, maxAvatars);
    const rest = members.length - shown.length;
    return (
      <Card ref={ref} data-slot="team-card" tilt={tilt} className={cn("w-full max-w-sm gap-6", className)} {...props}>
        <ul aria-label={`${name} members`} className="flex flex-wrap items-center gap-3">
          {shown.map((m) => (
            <li key={m} className="flex">
              <PixelAvatar name={m} size="md" />
            </li>
          ))}
          {rest > 0 && (
            <li
              className="sticker face-lid crooked flex size-14 items-center justify-center text-lg font-extrabold tabular-nums"
              style={{ ["--p3d-tilt" as string]: "1.5deg" }}
            >
              <span aria-hidden>+{rest}</span>
              <span className="sr-only">and {rest} more</span>
            </li>
          )}
        </ul>
        <div className="flex flex-col items-start gap-3">
          <CardTitle>{name}</CardTitle>
          {track && <Badge tone={trackTone}>{track}</Badge>}
        </div>
        {action && <div className="flex">{action}</div>}
      </Card>
    );
  }
);
TeamCard.displayName = "TeamCard";
