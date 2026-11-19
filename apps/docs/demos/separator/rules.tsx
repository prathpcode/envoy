import { Separator } from "@pixel3d/ui";

export default function SeparatorRules() {
  return (
    <div className="sticker sticker-lg face-paper flex w-full max-w-md flex-col gap-5 p-7">
      <h4 className="text-2xl font-extrabold">Pixel Jam 2026</h4>
      <Separator />
      <div className="flex h-8 items-center gap-5 text-lg font-semibold">
        <span>48 hours</span>
        <Separator orientation="vertical" />
        <span>212 hackers</span>
        <Separator orientation="vertical" />
        <span>4 tracks</span>
      </div>
    </div>
  );
}
