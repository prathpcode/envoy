import { Badge, Marquee } from "@pixel3d/ui";

const tracks = [
  { label: "AI tools", tone: "sky", tilt: -2 },
  { label: "Climate", tone: "lime", tilt: 1.5 },
  { label: "Hardware", tone: "butter", tilt: -1 },
  { label: "Games", tone: "paper", tilt: 2.5 },
  { label: "Health", tone: "lime", tilt: -2.5 },
  { label: "Open source", tone: "ink", tilt: 1 },
  { label: "Fintech", tone: "sky", tilt: -1.5 },
  { label: "Education", tone: "butter", tilt: 2 },
] as const;

export default function MarqueeTracks() {
  return (
    <Marquee speed={45}>
      {tracks.map((t) => (
        <Badge key={t.label} tone={t.tone} tilt={t.tilt} className="h-10 px-4 text-base">
          {t.label}
        </Badge>
      ))}
    </Marquee>
  );
}
