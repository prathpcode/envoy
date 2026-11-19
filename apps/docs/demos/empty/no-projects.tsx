import { Plus } from "pixelarticons/react";
import { Button, Empty, EmptyActions, EmptyDescription, EmptyMedia, EmptyTitle } from "@pixel3d/ui";
import { Sticker3D } from "@pixel3d/ui/three";

export default function EmptyNoProjects() {
  return (
    <Empty>
      <EmptyMedia>
        <Sticker3D pattern="ghost" label="A lime ghost sticker" />
      </EmptyMedia>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>Start one and your team’s build lands here.</EmptyDescription>
      <EmptyActions>
        <Button>
          <Plus /> New project
        </Button>
      </EmptyActions>
    </Empty>
  );
}
