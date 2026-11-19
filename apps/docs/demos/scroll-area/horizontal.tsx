import { ScrollArea, ScrollBar } from "@pixel3d/ui";

const teams = ["Voxel Pets", "Byte Club", "Null Island", "Ship It", "Rubber Ducks", "Lag Free", "Hot Reload", "404 Squad"];

export default function ScrollAreaHorizontal() {
  return (
    <div className="sticker sticker-lg face-paper w-full max-w-lg p-2">
      <ScrollArea className="w-full">
        <div className="flex w-max gap-4 px-4 pb-6 pt-4">
          {teams.map((t) => (
            <div key={t} className="grid h-24 w-36 place-items-center bg-lid-deep/45 px-3 text-center text-lg font-extrabold">
              {t}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
