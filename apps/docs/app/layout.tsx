import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import "./globals.css";

// No font flash: next/font preloads Bricolage and generates a metric-matched fallback,
// so the swap neither flashes nor shifts layout. globals.css points --font-p3d at it.
const bricolage = localFont({
  src: "../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "pixel3d-ui: sticker UI for hackathons", template: "%s · pixel3d-ui" },
  description: "Die-cut sticker components with pixel-art edges and real 3D. Built on shadcn/ui + Radix.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-lid text-on-lid antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
