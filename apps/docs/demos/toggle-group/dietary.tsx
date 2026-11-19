"use client";
import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@pixel3d/ui";

const needs = ["Vegetarian", "Vegan", "Gluten free", "Nut free", "Halal", "Kosher"];

export default function ToggleGroupDietary() {
  const [picked, setPicked] = React.useState<string[]>(["Vegetarian"]);
  return (
    <ToggleGroup
      type="multiple"
      value={picked}
      onValueChange={setPicked}
      aria-label="Dietary needs"
      className="max-w-xl justify-center"
    >
      {needs.map((n) => (
        <ToggleGroupItem key={n} value={n}>
          {n}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
