import { VoxelText } from "@pixel3d/ui/three";

export default function VoxelTextOneInk() {
  return (
    <>
      <VoxelText text="SHIP IT!" colors={["#b6f23a"]} className="max-w-md" />
      <VoxelText text="24H" colors={["#36b8ff", "#ffd23f"]} motion="still" className="max-w-56" />
    </>
  );
}
