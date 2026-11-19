import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pixel3d/ui";

export default function SelectStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Select>
        <SelectTrigger label="T-shirt size" error="Pick a size so we print yours">
          <SelectValue placeholder="Pick a size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="s">Small</SelectItem>
          <SelectItem value="m">Medium</SelectItem>
          <SelectItem value="l">Large</SelectItem>
        </SelectContent>
      </Select>
      <Select disabled defaultValue="b">
        <SelectTrigger label="Table">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="b">Table B12</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
