"use client";
import { DataTable, createDataTableColumnHelper } from "@pixel3d/ui";

type Project = {
  id: string;
  team: string;
  project: string;
  track: string;
  commits: number;
  demo: string;
};

const projects: Project[] = [
  { id: "p1", team: "Null Pointers", project: "Lidar Lunchbox", track: "Weird Hardware", commits: 212, demo: "10:05" },
  { id: "p2", team: "Off By One", project: "Queue Tips", track: "Best Dev Tool", commits: 188, demo: "10:12" },
  { id: "p3", team: "Cache Me Outside", project: "Greenhouse.exe", track: "Greenest Build", commits: 154, demo: "10:19" },
  { id: "p4", team: "Lambda Llamas", project: "Signbridge", track: "Most Accessible", commits: 131, demo: "10:26" },
  { id: "p5", team: "Tab Hoarders", project: "Voxelvote", track: "Best Use of Voxels", commits: 97, demo: "10:33" },
  { id: "p6", team: "Segfault Society", project: "Crashpad", track: "Best Dev Tool", commits: 243, demo: "10:40" },
  { id: "p7", team: "Merge Conflict", project: "Two Truths", track: "Most Accessible", commits: 76, demo: "10:47" },
  { id: "p8", team: "Byte Me", project: "Snack Oracle", track: "Weird Hardware", commits: 119, demo: "10:54" },
  { id: "p9", team: "404 Found", project: "Lost & Hound", track: "Greenest Build", commits: 168, demo: "11:01" },
  { id: "p10", team: "Race Condition", project: "Pit Stop", track: "Best Dev Tool", commits: 201, demo: "11:08" },
  { id: "p11", team: "Pixel Pushers", project: "Sprite Club", track: "Best Use of Voxels", commits: 142, demo: "11:15" },
  { id: "p12", team: "Stack Smashers", project: "Heap of Help", track: "Most Accessible", commits: 88, demo: "11:22" },
];

const col = createDataTableColumnHelper<Project>();
const columns = col.columns([
  col.accessor("team", { header: "Team", cell: (info) => <span className="font-extrabold">{info.getValue()}</span> }),
  col.accessor("project", { header: "Project" }),
  col.accessor("track", { header: "Track" }),
  col.accessor("commits", { header: "Commits", sortDescFirst: true }),
  col.accessor("demo", { header: "Demo slot", enableGlobalFilter: false }),
]);

export default function DataTableProjects() {
  return (
    <div className="w-full max-w-4xl">
      <DataTable columns={columns} data={projects} getRowId={(p) => p.id} pageSize={6} searchLabel="Search teams" />
    </div>
  );
}
