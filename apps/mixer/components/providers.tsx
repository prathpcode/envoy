"use client";
import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@pixel3d/ui";
import { StickerCanvas, StickerBurstHost } from "@pixel3d/ui/three";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <StickerCanvas>
        {children}
        <StickerBurstHost />
        <Toaster position="bottom-center" />
      </StickerCanvas>
    </ThemeProvider>
  );
}
