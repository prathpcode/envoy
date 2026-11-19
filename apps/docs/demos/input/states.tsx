import { Input } from "@pixel3d/ui";

export default function InputStates() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Input label="Repo URL" defaultValue="github.com/null-pointers" error="That repo is private: make it public" />
      <Input label="Table number" defaultValue="42" disabled />
    </div>
  );
}
