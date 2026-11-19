import { Textarea } from "@pixel3d/ui";

export default function TextareaProjectDescription() {
  return (
    <div className="w-full max-w-lg">
      <Textarea
        label="Project description"
        autoGrow
        rows={3}
        placeholder="A bot that books your demo slot before the judges get hungry."
      />
    </div>
  );
}
