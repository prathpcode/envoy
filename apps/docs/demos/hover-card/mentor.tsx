import { User } from "pixelarticons/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@pixel3d/ui";

export default function HoverCardMentor() {
  return (
    <p className="text-lg font-medium">
      Stuck on embeddings? Ask{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href="#mentors"
            className="font-extrabold underline decoration-pink decoration-[3px] underline-offset-4"
          >
            @ada-codes
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-center gap-4">
            <span className="sticker face-sky crooked grid size-12 shrink-0 place-items-center [--p3d-tilt:-2deg]">
              <User className="pixel-icon size-6" aria-hidden />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold leading-tight">Ada Okafor</span>
              <span className="text-base text-ink-soft">AI track mentor, table 4</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </p>
  );
}
