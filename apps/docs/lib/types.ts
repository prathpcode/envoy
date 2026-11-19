import type * as React from "react";

export const CATEGORIES = [
  "Actions",
  "Forms",
  "Overlays",
  "Navigation",
  "Data display",
  "Feedback",
  "Layout",
  "3D",
  "Hackathon kit",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface DemoDef {
  /** file name in demos/<slug>/<id>.tsx — its source is shown in the Code tab */
  id: string;
  title: string;
  Component: React.ComponentType;
  /** "lid" (default) = aluminium stage; "paper" = white sheet; "dark" = forces dark lid */
  stage?: "lid" | "paper" | "dark";
  /** min stage height in px (default 280) */
  height?: number;
}

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  category: Category;
  /** one sentence. The Few Voices Rule applies to docs too. */
  summary: string;
  /** files under packages/ui/src that make up this component (registry + Source tab) */
  files: string[];
  /** npm deps the registry item installs */
  dependencies?: string[];
  /** other @pixel3d registry items it needs */
  registryDependencies?: string[];
  demos: DemoDef[];
  /** minimal import + usage snippet */
  usage: string;
  props?: { component: string; rows: PropDef[] }[];
  /** keyboard + screen-reader behaviour, one line each */
  a11y?: string[];
  do?: string[];
  dont?: string[];
  /** true when this component draws on the shared three.js canvas */
  three?: boolean;
}

export interface DocMeta {
  slug: string;
  name: string;
  category: Category;
}
