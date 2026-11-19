"use client";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@pixel3d/ui";
import { CopyButton } from "./copy-button";

function Line({ cmd }: { cmd: string }) {
  return (
    <div className="sticker sticker-lg face-ink flex items-center justify-between gap-4 py-3 pr-3 pl-6">
      <code className="min-w-0 font-mono text-[16px] leading-snug text-paper">{cmd.split(" @").map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && " "}
            <span className="whitespace-nowrap">{i ? "@" + part : part}</span>
          </React.Fragment>
        ))}</code>
      <CopyButton value={cmd} />
    </div>
  );
}

export function InstallBlock({ slug }: { slug: string }) {
  return (
    <Tabs defaultValue="cli">
      <TabsList aria-label="Install method">
        <TabsTrigger value="cli" index={2}>shadcn CLI</TabsTrigger>
        <TabsTrigger value="npm" index={3}>npm</TabsTrigger>
      </TabsList>
      <TabsContent value="cli" className="mt-4">
        <Line cmd={`npx shadcn@latest add @pixel3d/${slug}`} />
      </TabsContent>
      <TabsContent value="npm" className="mt-4">
        <Line cmd="npm i @pixel3d/ui" />
      </TabsContent>
    </Tabs>
  );
}
