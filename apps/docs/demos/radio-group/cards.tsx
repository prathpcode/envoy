import { Cpu, Gamepad, Leaf, Robot } from "pixelarticons/react";
import { RadioGroup, RadioGroupItem } from "@pixel3d/ui";

const tracks = [
  { value: "ai", icon: Robot, title: "AI agents", line: "Bots that do real work." },
  { value: "climate", icon: Leaf, title: "Climate", line: "Cut a ton of carbon." },
  { value: "games", icon: Gamepad, title: "Games", line: "Fun in 48 hours." },
  { value: "hardware", icon: Cpu, title: "Hardware", line: "Solder something." },
];

export default function RadioGroupCards() {
  return (
    <RadioGroup variant="cards" defaultValue="ai" aria-label="Pick your track" className="w-full max-w-xl sm:grid-cols-2">
      {tracks.map(({ value, icon: Icon, title, line }) => (
        <RadioGroupItem key={value} value={value}>
          <Icon className="size-8" aria-hidden />
          <span className="mt-2 text-xl font-extrabold">{title}</span>
          <span className="text-base font-medium">{line}</span>
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
