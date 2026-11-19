import { Search, Link } from "pixelarticons/react";
import { Input } from "@pixel3d/ui";

export default function InputAdornments() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Input aria-label="Search projects" placeholder="Search projects" leading={<Search />} />
      <Input label="Demo link" placeholder="https://" leading={<Link />} />
    </div>
  );
}
