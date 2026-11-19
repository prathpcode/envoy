import { ArrowRight } from "pixelarticons/react";
import { Button } from "@pixel3d/ui";
import { StickerScene } from "@pixel3d/ui/three";

export default function StickerSceneHero() {
  return (
    <StickerScene className="h-[520px]" density={16}>
      <div className="flex flex-col items-center gap-8 px-4 text-center">
        <h2 className="max-w-[12ch] text-5xl leading-[0.95] font-extrabold tracking-[-0.03em] md:text-7xl">
          Hack the pixel
        </h2>
        <Button size="lg">
          Register your team <ArrowRight />
        </Button>
      </div>
    </StickerScene>
  );
}
