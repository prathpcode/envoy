import { Search } from "pixelarticons/react";
import { Input, Kbd } from "@pixel3d/ui";

export default function KbdInInput() {
  return (
    <div className="w-full max-w-md">
      <Input aria-label="Jump to a team" placeholder="Jump to a team" leading={<Search />} trailing={<Kbd>/</Kbd>} />
    </div>
  );
}
