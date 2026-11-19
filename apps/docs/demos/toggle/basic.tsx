import { Heart, Moon, Wifi } from "pixelarticons/react";
import { Toggle } from "@pixel3d/ui";

export default function ToggleBasic() {
  return (
    <>
      <Toggle aria-label="Star project">
        <Heart />
      </Toggle>
      <Toggle defaultPressed>
        <Wifi /> Remote friendly
      </Toggle>
      <Toggle>
        <Moon /> Overnight
      </Toggle>
      <Toggle disabled>Livestream</Toggle>
    </>
  );
}
