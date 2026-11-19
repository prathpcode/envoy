import { Spinner } from "@pixel3d/ui";

export default function SpinnerWithText() {
  return (
    <>
      <Spinner className="text-on-lid">Judges are scoring</Spinner>
      <div className="sticker face-pink inline-flex h-12 items-center px-5">
        <Spinner size="sm">Deploying</Spinner>
      </div>
    </>
  );
}
