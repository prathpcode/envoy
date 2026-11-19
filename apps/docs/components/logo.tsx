import { PatternSVG } from "@pixel3d/ui/three";

const mark = ["pps", "plb", "sbt"];

/** pixel3d-ui wordmark: a 3×3 ink-sticker mark + the name. */
export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span className="sticker face-paper crooked grid size-11 place-items-center [--p3d-tilt:-4deg]">
        <PatternSVG pattern={mark} className="size-7" />
      </span>
      <span className="text-[22px] font-extrabold tracking-[-0.03em]">pixel3d-ui</span>
    </span>
  );
}
