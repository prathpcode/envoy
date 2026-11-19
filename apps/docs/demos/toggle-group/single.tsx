import { Grid3x3, ListBox } from "pixelarticons/react";
import { ToggleGroup, ToggleGroupItem } from "@pixel3d/ui";

export default function ToggleGroupSingle() {
  return (
    <>
      <ToggleGroup type="single" defaultValue="grid" size="sm" aria-label="Project view">
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <Grid3x3 />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <ListBox />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="48" variant="outline" aria-label="Hackathon length">
        <ToggleGroupItem value="24">24 hours</ToggleGroupItem>
        <ToggleGroupItem value="48">48 hours</ToggleGroupItem>
        <ToggleGroupItem value="week">A week</ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
