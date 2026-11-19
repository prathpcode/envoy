import { Display, H1, H2, H3, H4 } from "@pixel3d/ui";

export default function TypographyHeadings() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <Display>Pixel Jam</Display>
      <H1>48 hours</H1>
      <H2>Hardware track</H2>
      <H3>Judging criteria</H3>
      <H4>Submit by Sunday 11am</H4>
    </div>
  );
}
