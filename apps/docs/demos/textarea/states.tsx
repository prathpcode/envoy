import { Textarea } from "@pixel3d/ui";

export default function TextareaStates() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-8">
      <Textarea label="What did you build?" defaultValue="Stuff" error="Too short: add one line on what it does" rows={2} />
      <Textarea label="Judges' notes" defaultValue="Submissions are locked." rows={2} disabled />
    </div>
  );
}
