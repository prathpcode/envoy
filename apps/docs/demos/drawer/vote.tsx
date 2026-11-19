"use client";
import * as React from "react";
import { Heart } from "pixelarticons/react";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  cn,
} from "@pixel3d/ui";

const projects = ["Pixel Pets", "Bus Buddy", "Compost Cam"];

export default function DrawerVote() {
  const [pick, setPick] = React.useState<string | null>(null);
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          <Heart /> Vote people's choice
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>People's choice</DrawerTitle>
          <DrawerDescription>One vote. Pick the demo you'd actually use.</DrawerDescription>
        </DrawerHeader>
        <div role="radiogroup" aria-label="Projects" className="flex flex-wrap gap-4">
          {projects.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={pick === p}
              onClick={() => setPick(p)}
              className={cn(
                "sticker focus-cut peel h-12 cursor-pointer px-5 text-lg font-extrabold",
                pick === p ? "face-lime sticker-flat" : "face-paper"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Later</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button disabled={!pick}>Cast vote</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
