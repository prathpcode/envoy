import { Sticker3D } from "@pixel3d/ui/three";

// Draw your own: one string per row, "." is empty, letters map to colours.
const laptop = [
  ".kkkkkkk.",
  ".kssssk..",
  ".kssssk..",
  ".kkkkkkk.",
  "wwwwwwwww",
];

export default function Sticker3DCustom() {
  return <Sticker3D pattern={laptop} colors={{ s: "#b6f23a" }} className="size-56" label="Laptop sticker" />;
}
