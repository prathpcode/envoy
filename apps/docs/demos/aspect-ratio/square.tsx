import { AspectRatio } from "@pixel3d/ui";

// an 8×8 pixel heart, drawn as a grid of blocks
const heart = ["01100110", "11111111", "11111111", "11111111", "01111110", "00111100", "00011000", "00000000"];

export default function AspectRatioSquare() {
  return (
    <div className="sticker sticker-lg face-paper crooked w-56 p-3 [--p3d-tilt:2deg]">
      <AspectRatio ratio={1} className="grid grid-cols-8 grid-rows-8 bg-lid-deep/45 p-4">
        {heart.flatMap((row, y) =>
          row.split("").map((on, x) => <span key={`${x}-${y}`} className={on === "1" ? "bg-tomato" : undefined} />)
        )}
      </AspectRatio>
    </div>
  );
}
