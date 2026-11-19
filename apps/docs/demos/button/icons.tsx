import { ArrowRight, Github, Heart, Trash } from "pixelarticons/react";
import { Button } from "@pixel3d/ui";

export default function ButtonIcons() {
  return (
    <>
      <Button>
        Submit project <ArrowRight />
      </Button>
      <Button variant="ink">
        <Github /> Sign in with GitHub
      </Button>
      <Button variant="secondary" size="icon" aria-label="Like">
        <Heart />
      </Button>
      <Button variant="destructive" size="icon" aria-label="Delete">
        <Trash />
      </Button>
    </>
  );
}
