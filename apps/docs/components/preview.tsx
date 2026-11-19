"use client";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, cn } from "@pixel3d/ui";

/** Live demo on a lid stage, with a Code tab holding the demo's real source. */
export function Preview({
  title,
  stage = "lid",
  height = 280,
  codeHtml,
  children,
}: {
  title: string;
  stage?: "lid" | "paper" | "dark";
  height?: number;
  codeHtml: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <Tabs defaultValue="preview">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-[-0.01em]">{title}</h2>
          <TabsList aria-label={`${title} view`}>
            <TabsTrigger value="preview" index={0}>Preview</TabsTrigger>
            <TabsTrigger value="code" index={1}>Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="mt-4">
          <div
            className={cn(
              "relative flex w-full flex-wrap items-center justify-center gap-8 overflow-visible p-10",
              stage === "lid" && "bg-lid-deep/55",
              stage === "paper" && "sticker sticker-lg face-paper",
              stage === "dark" && "dark bg-lid text-on-lid"
            )}
            style={{ minHeight: height }}
          >
            {children}
          </div>
        </TabsContent>
        <TabsContent value="code" className="mt-4">
          {codeHtml}
        </TabsContent>
      </Tabs>
    </section>
  );
}
