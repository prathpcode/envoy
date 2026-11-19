import { Marquee, PixelAvatar } from "@pixel3d/ui";

const hackers = ["Ada", "Linus", "Grace", "Kai", "Noor", "Mateo", "Yuki", "Ines", "Tariq", "Zola", "Priya", "Oskar"];

export default function MarqueeCrew() {
  return (
    <Marquee speed={28} direction="right" gap={20}>
      {hackers.map((name) => (
        <PixelAvatar key={name} name={name} size="lg" />
      ))}
    </Marquee>
  );
}
