import { Input } from "@pixel3d/ui";

export default function InputNameTag() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Input label="Team name" placeholder="Null Pointers" />
      <Input label="Email" type="email" placeholder="you@hack.dev" />
    </div>
  );
}
