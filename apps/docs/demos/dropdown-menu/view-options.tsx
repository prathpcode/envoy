"use client";
import * as React from "react";
import { SlidersHorizontal } from "pixelarticons/react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@pixel3d/ui";

export default function DropdownMenuViewOptions() {
  const [mine, setMine] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [sort, setSort] = React.useState("votes");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <SlidersHorizontal /> View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Show</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={mine} onCheckedChange={setMine}>
          My track only
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={submitted} onCheckedChange={setSubmitted}>
          Submitted projects
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="votes">Most votes</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="new">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="az">A to Z</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
