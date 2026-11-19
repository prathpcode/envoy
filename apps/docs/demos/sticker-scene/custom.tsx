import { StickerScene } from "@pixel3d/ui/three";

// A floppy disk, drawn row by row: k = ink, w = white, s = sky.
const floppy = ["kkkkkk.", "kwwwwkk", "kwwwwkk", "kkkkkkk", "kssssk.", "ksskssk", "kkkkkkk"];

export default function StickerSceneCustom() {
  return (
    <StickerScene
      className="h-[360px]"
      density={9}
      label="Floating stickers: hearts, bolts, coffee and floppy disks"
      stickers={["heart", { pattern: "bolt", colors: { s: "#b6f23a" } }, floppy, "coffee"]}
    />
  );
}
