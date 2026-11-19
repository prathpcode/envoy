"use client";
import * as React from "react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { PageTransitions } from "@pixel3d/ui";
import { StickerCanvas, StickerBurstHost } from "@pixel3d/ui/three";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <StickerCanvas>
        <PageTransitions routeKey={pathname}>
          {children}
        </PageTransitions>
        <StickerBurstHost />
      </StickerCanvas>
    </ThemeProvider>
  );
}
