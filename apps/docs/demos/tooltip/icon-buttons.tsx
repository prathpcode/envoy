import { Github, Heart, Share } from "pixelarticons/react";
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@pixel3d/ui";

const actions = [
  { icon: Github, label: "Open repo" },
  { icon: Heart, label: "Upvote Pixel Pets" },
  { icon: Share, label: "Copy demo link" },
];

export default function TooltipIconButtons() {
  return (
    <TooltipProvider>
      {actions.map(({ icon: Icon, label }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" aria-label={label}>
              <Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
}
