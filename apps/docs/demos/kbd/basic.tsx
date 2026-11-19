import { Kbd, KbdGroup } from "@pixel3d/ui";

export default function KbdBasic() {
  return (
    <div className="flex flex-col items-center gap-6 text-lg font-medium text-on-lid">
      <p className="flex items-center gap-3">
        Open the command menu
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </p>
      <p className="flex items-center gap-3">
        Ship it
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
        </KbdGroup>
      </p>
    </div>
  );
}
