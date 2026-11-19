import { Toggle } from "@pixel3d/ui";

export default function ToggleVariants() {
  return (
    <>
      <Toggle size="sm">Small</Toggle>
      <Toggle>Default</Toggle>
      <Toggle size="lg">Large</Toggle>
      <Toggle variant="outline">Outline</Toggle>
      <Toggle variant="outline" defaultPressed tilt={false}>
        Pressed
      </Toggle>
    </>
  );
}
