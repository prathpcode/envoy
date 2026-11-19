import { PixelAvatar } from "@pixel3d/ui";

const crew = ["Ada", "Linus", "Grace", "Kai", "Noor", "Mateo"];

export default function PixelAvatarNames() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {crew.map((name) => (
          <PixelAvatar key={name} name={name} />
        ))}
      </div>
      <div className="flex items-end gap-5">
        <PixelAvatar name="Ada" size="sm" />
        <PixelAvatar name="Ada" size="md" />
        <PixelAvatar name="Ada" size="lg" />
      </div>
    </div>
  );
}
