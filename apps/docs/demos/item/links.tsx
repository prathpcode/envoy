import { ChevronRight, Github } from "pixelarticons/react";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@pixel3d/ui";

export default function ItemLinks() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Item asChild size="sm">
        <a href="#">
          <ItemMedia variant="icon">
            <Github aria-hidden />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>voxel-pets/main</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRight aria-hidden className="pixel-icon size-6" />
          </ItemActions>
        </a>
      </Item>
      <Item asChild size="sm" variant="lid">
        <a href="#">
          <ItemContent>
            <ItemTitle>Judging rubric</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRight aria-hidden className="pixel-icon size-6" />
          </ItemActions>
        </a>
      </Item>
    </div>
  );
}
