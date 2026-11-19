import type { ComponentDoc } from "@/lib/types";
import DemoVideo from "@/demos/aspect-ratio/demo-video";
import Square from "@/demos/aspect-ratio/square";

export const doc: ComponentDoc = {
  slug: "aspect-ratio",
  name: "Aspect Ratio",
  category: "Layout",
  summary: "Holds media to a fixed shape inside its sticker.",
  files: ["components/aspect-ratio.tsx"],
  dependencies: ["radix-ui"],
  registryDependencies: ["button"],
  demos: [
    { id: "demo-video", title: "16:9 demo video", Component: DemoVideo, height: 420 },
    { id: "square", title: "Square", Component: Square, height: 320 },
  ],
  usage: `
import { AspectRatio } from "@/components/ui/aspect-ratio";

<div className="sticker sticker-lg face-paper p-3">
  <AspectRatio ratio={16 / 9} className="overflow-hidden">
    <img src="/demo.png" alt="Voxel Pets demo" className="size-full object-cover" />
  </AspectRatio>
</div>
`,
  props: [
    {
      component: "AspectRatio",
      rows: [{ name: "ratio", type: "number", default: "1", description: "Width divided by height, e.g. 16 / 9." }],
    },
  ],
  a11y: ["Purely visual: give the image inside real alt text."],
  do: ["Wrap it in a sticker and clip on the AspectRatio, never on the sticker."],
  dont: ["Don't add a caption under the media."],
};
