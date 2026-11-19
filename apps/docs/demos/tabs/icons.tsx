import { Code, Image, Users } from "pixelarticons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@pixel3d/ui";

export default function TabsIcons() {
  return (
    <Tabs defaultValue="team" className="w-full max-w-xl">
      <TabsList aria-label="Project">
        <TabsTrigger value="team" index={0}>
          <Users aria-hidden /> Team
        </TabsTrigger>
        <TabsTrigger value="code" index={1}>
          <Code aria-hidden /> Code
        </TabsTrigger>
        <TabsTrigger value="media" index={2} disabled>
          <Image aria-hidden /> Media
        </TabsTrigger>
      </TabsList>
      <TabsContent value="team" className="text-lg font-medium">
        Four hackers, one shared laptop sticker collection.
      </TabsContent>
      <TabsContent value="code" className="text-lg font-medium">
        Public repo, MIT licensed, tagged for the demo.
      </TabsContent>
    </Tabs>
  );
}
