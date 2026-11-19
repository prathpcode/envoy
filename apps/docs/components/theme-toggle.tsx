"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "pixelarticons/react";
import { Switch } from "@pixel3d/ui";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <label className="flex items-center gap-3">
      <Sun className="pixel-icon hidden size-6 sm:block" aria-hidden />
      <Switch checked={dark} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} aria-label="Dark lid" />
      <Moon className="pixel-icon size-6" aria-hidden />
    </label>
  );
}
