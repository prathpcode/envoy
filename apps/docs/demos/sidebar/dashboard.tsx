"use client";
import * as React from "react";
import { Calendar, Chart, Code, Gear, Home, Logout, Trophy, Users } from "pixelarticons/react";
import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@pixel3d/ui";

const event = [
  { icon: Home, label: "Overview" },
  { icon: Calendar, label: "Schedule" },
  { icon: Users, label: "Teams" },
  { icon: Code, label: "Projects" },
];
const judging = [
  { icon: Chart, label: "Scores" },
  { icon: Trophy, label: "Prizes" },
];

export default function SidebarDashboard() {
  const [active, setActive] = React.useState("Projects");
  const menu = (items: typeof event) => (
    <SidebarMenu>
      {items.map(({ icon: Icon, label }) => (
        <SidebarMenuItem key={label}>
          <SidebarMenuButton isActive={active === label} onClick={() => setActive(label)}>
            <Icon aria-hidden />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <div className="relative h-[520px] w-full max-w-4xl overflow-hidden bg-lid ring-4 ring-paper">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar>
          <SidebarHeader>
            <div className="flex h-11 items-center gap-3 px-3 text-xl font-extrabold group-data-[state=collapsed]/sidebar:px-0 [&>span]:truncate group-data-[state=collapsed]/sidebar:[&>span]:sr-only">
              <Code aria-hidden className="pixel-icon size-6 shrink-0" />
              <span>Pixel Jam</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Event</SidebarGroupLabel>
              {menu(event)}
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Judging</SidebarGroupLabel>
              {menu(judging)}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Gear aria-hidden />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Logout aria-hidden />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="overflow-y-auto">
          <header className="flex items-center gap-4 p-5">
            <SidebarTrigger />
            <h3 className="text-2xl font-extrabold tracking-[-0.01em]">{active}</h3>
          </header>
          <div className="flex flex-1 flex-col items-start justify-center gap-6 px-8 pb-10">
            <p className="text-4xl font-extrabold tracking-[-0.02em]">Submissions close in 6h</p>
            <Button size="lg">Submit project</Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
