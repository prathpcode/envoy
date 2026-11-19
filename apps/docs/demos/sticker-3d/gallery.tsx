import { Sticker3D } from "@pixel3d/ui/three";

export default function Sticker3DGallery() {
  return (
    <>
      <Sticker3D pattern="heart" className="size-44" />
      <Sticker3D pattern="bolt" className="size-44" motion="spin" />
      <Sticker3D pattern="trophy" className="size-44" />
      <Sticker3D pattern="ghost" className="size-44" />
    </>
  );
}
