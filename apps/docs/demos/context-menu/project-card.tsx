"use client";
import * as React from "react";
import { Copy, ExternalLink, Trash } from "pixelarticons/react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@pixel3d/ui";

export default function ContextMenuProjectCard() {
  const [starred, setStarred] = React.useState(true);
  return (
    <ContextMenu>
      <ContextMenuTrigger className="sticker sticker-lg face-paper crooked flex h-44 w-full max-w-sm cursor-context-menu flex-col justify-center gap-2 p-7 [--p3d-tilt:-1deg]">
        <span className="text-2xl font-extrabold leading-tight">Pixel Pets</span>
        <span className="text-base text-ink-soft">Right-click (or long-press) the sticker.</span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <ExternalLink /> Open demo <ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy /> Copy repo link <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked={starred} onCheckedChange={setStarred}>
          Starred
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Move to track</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>AI agents</ContextMenuItem>
            <ContextMenuItem>Hardware hacks</ContextMenuItem>
            <ContextMenuItem>Climate tech</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash /> Withdraw project
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
