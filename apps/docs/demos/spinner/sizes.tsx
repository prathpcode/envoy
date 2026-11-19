import { Spinner } from "@pixel3d/ui";

export default function SpinnerSizes() {
  return (
    <>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" label="Loading the leaderboard" />
    </>
  );
}
