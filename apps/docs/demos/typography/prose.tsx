import { H2, InlineCode, Lead, List, Mark, P } from "@pixel3d/ui";

export default function TypographyProse() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <H2>Before you demo</H2>
      <Lead>Three minutes on stage. Make every second land.</Lead>
      <P>
        Judges score what they see, so <Mark>show the working thing first</Mark> and explain it after. Keep the
        repo public and tag the commit with <InlineCode>v-demo</InlineCode>.
      </P>
      <List>
        <li>Open with the problem, in one sentence.</li>
        <li>Run the happy path live.</li>
        <li>End on what you would build next.</li>
      </List>
    </div>
  );
}
