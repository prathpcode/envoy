import { Search } from "pixelarticons/react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, Kbd, KbdGroup } from "@pixel3d/ui";

export default function InputGroupSearch() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search projects" aria-label="Search projects" />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup label="Prize pool">
        <InputGroupAddon>
          <InputGroupText className="font-bold text-ink">$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput inputMode="numeric" defaultValue="5000" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
