import { ChevronDown, Github, Upload } from "pixelarticons/react";
import { Button, ButtonGroup } from "@pixel3d/ui";

export default function ButtonGroupActions() {
  return (
    <>
      <ButtonGroup aria-label="Submit">
        <Button>
          <Upload /> Submit project
        </Button>
        <Button size="icon" aria-label="More submit options">
          <ChevronDown />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Repository">
        <Button variant="ink">
          <Github /> Repo
        </Button>
        <Button variant="secondary">Fork</Button>
        <Button variant="secondary">Star</Button>
      </ButtonGroup>
    </>
  );
}
