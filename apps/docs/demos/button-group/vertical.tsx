import { Minus, Plus } from "pixelarticons/react";
import { Button, ButtonGroup } from "@pixel3d/ui";

export default function ButtonGroupVertical() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Team size">
      <Button variant="secondary" size="icon" aria-label="Add a seat">
        <Plus />
      </Button>
      <Button variant="secondary" size="icon" aria-label="Remove a seat">
        <Minus />
      </Button>
    </ButtonGroup>
  );
}
