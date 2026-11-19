import { Slider } from "@pixel3d/ui";

export default function SliderStates() {
  return (
    <div className="flex w-full max-w-md items-center gap-12">
      <Slider defaultValue={[60]} disabled aria-label="Prize pool (locked)" className="flex-1" />
      <Slider defaultValue={[40]} orientation="vertical" aria-label="Music volume" className="h-44" />
    </div>
  );
}
