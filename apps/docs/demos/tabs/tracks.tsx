import { Tabs, TabsContent, TabsList, TabsTrigger } from "@pixel3d/ui";

const tracks = [
  { value: "ai", label: "AI agents", line: "Build an agent that does one boring job really well." },
  { value: "hw", label: "Hardware", line: "Anything with a wire. The lab opens Saturday at 3pm." },
  { value: "games", label: "Games", line: "Playable in under a minute, fun in under ten seconds." },
];

export default function TabsTracks() {
  return (
    <Tabs defaultValue="ai" className="w-full max-w-xl">
      <TabsList aria-label="Tracks">
        {tracks.map((t, i) => (
          <TabsTrigger key={t.value} value={t.value} index={i}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tracks.map((t) => (
        <TabsContent key={t.value} value={t.value} className="text-lg font-medium">
          {t.line}
        </TabsContent>
      ))}
    </Tabs>
  );
}
