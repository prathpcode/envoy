import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@pixel3d/ui";

export default function SelectBare() {
  return (
    <Select>
      <SelectTrigger aria-label="Sort projects">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Popular</SelectLabel>
          <SelectItem value="votes">Most votes</SelectItem>
          <SelectItem value="comments">Most comments</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Time</SelectLabel>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
