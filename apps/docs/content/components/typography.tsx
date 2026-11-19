import type { ComponentDoc } from "@/lib/types";
import Headings from "@/demos/typography/headings";
import Prose from "@/demos/typography/prose";
import Quote from "@/demos/typography/blockquote";

export const doc: ComponentDoc = {
  slug: "typography",
  name: "Typography",
  category: "Layout",
  summary: "The type scale as components: chunky Bricolage headings, 18px body, nothing under 14px.",
  files: ["components/typography.tsx", "styles/navigation.css", "lib/utils.ts"],
  demos: [
    { id: "headings", title: "Headings", Component: Headings, height: 560 },
    { id: "prose", title: "Body, list, mark and code", Component: Prose, height: 440 },
    { id: "blockquote", title: "Blockquote", Component: Quote },
  ],
  usage: `
import { H1, P, Mark, Blockquote } from "@/components/ui/typography";

<H1>48 hours</H1>
<P>Show <Mark>the working thing</Mark> first.</P>
`,
  props: [
    {
      component: "Display / H1 / H2 / H3 / H4",
      rows: [
        { name: "Display", type: "h1", description: "800 weight, 96px max, line-height 0.95. Hero moments only." },
        { name: "H1 / H2", type: "h1 / h2", description: "800 weight, 64px / 44px on desktop." },
        { name: "H3 / H4", type: "h3 / h4", description: "700 weight, 32px / 24px." },
      ],
    },
    {
      component: "Lead / P / List",
      rows: [
        { name: "Lead", type: "p", description: "22px intro line in the soft lid colour." },
        { name: "P / List", type: "p / ul", description: "Body: 500 weight, 18px, 1.55 line-height, about 68ch wide. Lists use square pixel bullets." },
      ],
    },
    {
      component: "Blockquote / InlineCode / Mark",
      rows: [
        { name: "Blockquote", type: "blockquote", description: "A straight paper sticker with an ink pixel quote mark. Put a <cite> inside for the source." },
        { name: "InlineCode", type: "code", description: "Monospace on a white chip; the only place mono appears." },
        { name: "Mark", type: "mark", description: "A pink highlighter sticker behind a few words." },
      ],
    },
  ],
  a11y: [
    "Each heading renders its real element, so the outline stays correct; pick the level by structure, not size.",
    "Mark renders a <mark>, which screen readers can announce as highlighted.",
    "Body text is never below 16px and nothing is below 14px.",
  ],
  do: [
    "Use one Mark per section at most.",
    "Leave more space above a heading than below it.",
  ],
  dont: [
    "Don't add an eyebrow label above a heading.",
    "Don't set body text in a pixel or mono font.",
    "Don't use a border-left callout for quotes.",
  ],
};
