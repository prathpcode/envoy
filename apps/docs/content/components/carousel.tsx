import type { ComponentDoc } from "@/lib/types";
import Tracks from "@/demos/carousel/tracks";

export const doc: ComponentDoc = {
  slug: "carousel",
  name: "Carousel",
  category: "Data display",
  summary: "A cover-flow of stickers: the centre one straightens and lifts while its neighbours tilt away in 3D.",
  files: ["components/carousel.tsx", "styles/data.css", "lib/utils.ts"],
  dependencies: ["embla-carousel-react", "pixelarticons"],
  registryDependencies: ["button"],
  demos: [{ id: "tracks", title: "Sponsor tracks", Component: Tracks, height: 400 }],
  usage: `
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";

<Carousel opts={{ loop: true }} aria-label="Sponsor tracks">
  <CarouselContent>
    {tracks.map((t, i) => (
      <CarouselItem key={t.id} index={i} className="basis-1/2">{t.title}</CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
`,
  props: [
    {
      component: "Carousel",
      rows: [
        { name: "opts", type: "EmblaOptionsType", default: '{ align: "center", containScroll: false }', description: "Embla options, merged over the cover-flow defaults." },
        { name: "plugins", type: "EmblaPluginType[]", description: "Embla plugins, e.g. autoplay." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical tilts slides on the X axis instead." },
        { name: "setApi", type: "(api: CarouselApi) => void", description: "Get the embla API to drive it yourself." },
      ],
    },
    {
      component: "CarouselItem",
      rows: [
        { name: "index", type: "number", default: "0", description: "Position in the list; picks the off-centre tilt." },
        { name: "tilt", type: "number", description: "Off-centre tilt in degrees, overriding index." },
        { name: "stickerClassName", type: "string", description: "Classes for the sticker inside. className sizes the slide (basis-1/2)." },
      ],
    },
  ],
  a11y: [
    "A labelled region with aria-roledescription carousel; each slide is a group named slide.",
    "Left and right arrow keys move between slides when focus is inside.",
    "Prev and next are labelled and disable at the ends unless it loops.",
    "Under reduced motion the 3D tilt is dropped; slides just slide.",
  ],
  do: ["Show part of the neighbours (basis-1/2 or 2/3) so the tilt reads.", "Keep each slide to an icon, a heading and one line."],
  dont: ["Don't autoplay without a pause control.", "Don't use it for content people must compare side by side."],
};
