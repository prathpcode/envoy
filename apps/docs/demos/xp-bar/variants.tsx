import { XPBar } from "@pixel3d/ui";

export default function XPBarVariants() {
  return (
    <div className="flex flex-col items-center gap-8">
      <XPBar variant="health" value={82} label="Demo server" />
      <XPBar variant="health" value={38} label="Laptop battery" />
      <XPBar variant="health" value={12} label="Team energy" />
      <XPBar variant="mana" value={64} label="Coffee" />
    </div>
  );
}
