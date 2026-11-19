import { Gamepad, Leaf, Cpu, Terminal, Users } from "pixelarticons/react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@pixel3d/ui";

const tracks = [
  { icon: Leaf, title: "Greenest Build", line: "Ship the app that burns the fewest watts." },
  { icon: Cpu, title: "Weird Hardware", line: "Anything with a soldering iron and a story." },
  { icon: Terminal, title: "Best Dev Tool", line: "Make tomorrow’s hackathon faster." },
  { icon: Users, title: "Most Accessible", line: "Built so everyone can use it on day one." },
  { icon: Gamepad, title: "Best Use of Voxels", line: "Cubes, all the way down." },
];

export default function CarouselTracks() {
  return (
    <div className="w-full max-w-2xl px-16">
      <Carousel opts={{ loop: true }} aria-label="Sponsor tracks">
        <CarouselContent>
          {tracks.map((t, i) => (
            <CarouselItem key={t.title} index={i} className="basis-3/4 sm:basis-1/2">
              <t.icon aria-hidden className="pixel-icon size-8" />
              <h3 className="text-2xl font-extrabold leading-tight tracking-[-0.02em]">{t.title}</h3>
              <p className="text-base leading-relaxed text-ink-soft">{t.line}</p>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
