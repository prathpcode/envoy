import { Gamepad, Robot, Zap } from "pixelarticons/react";
import { Button, Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@pixel3d/ui";

const teams = [
  { icon: Robot, name: "Byte Club", line: "An agent that files your expense reports." },
  { icon: Gamepad, name: "Lag Free", line: "Couch co-op over a single phone hotspot." },
  { icon: Zap, name: "Hot Reload", line: "Live-patches firmware on a moving robot." },
];

export default function ItemTeams() {
  return (
    <ItemGroup className="w-full max-w-xl">
      {teams.map(({ icon: Icon, name, line }) => (
        <Item key={name} role="listitem">
          <ItemMedia variant="icon">
            <Icon aria-hidden />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{name}</ItemTitle>
            <ItemDescription>{line}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="secondary" size="sm" tilt={false}>
              Judge
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
