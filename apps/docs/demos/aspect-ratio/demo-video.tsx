import { Play } from "pixelarticons/react";
import { AspectRatio, Button } from "@pixel3d/ui";

export default function AspectRatioDemoVideo() {
  return (
    <div className="sticker sticker-lg face-paper w-full max-w-xl p-3">
      <AspectRatio ratio={16 / 9} className="grid place-items-center overflow-hidden bg-ink">
        <Button size="lg">
          <Play /> Watch demo
        </Button>
      </AspectRatio>
    </div>
  );
}
