import { Progress } from "@pixel3d/ui";

export default function ProgressIndeterminate() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <span id="build-label" className="text-lg font-extrabold text-on-lid">
        Building preview
      </span>
      <Progress value={null} aria-labelledby="build-label" />
    </div>
  );
}
