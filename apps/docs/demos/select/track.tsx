import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pixel3d/ui";

export default function SelectTrack() {
  return (
    <div className="w-full max-w-sm">
      <Select defaultValue="ai">
        <SelectTrigger label="Track">
          <SelectValue placeholder="Pick a track" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ai">AI agents</SelectItem>
          <SelectItem value="climate">Climate tech</SelectItem>
          <SelectItem value="games">Games</SelectItem>
          <SelectItem value="hardware">Hardware</SelectItem>
          <SelectItem value="open">Open track</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
