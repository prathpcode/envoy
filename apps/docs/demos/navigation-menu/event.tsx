"use client";
import { Calendar, Clock, Coffee, MapPin, Trophy, Zap } from "pixelarticons/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@pixel3d/ui";

const schedule = [
  { icon: Zap, title: "Kickoff", line: "Friday 6pm, main stage" },
  { icon: Coffee, title: "Midnight pizza", line: "Saturday 12am, kitchen" },
  { icon: Clock, title: "Code freeze", line: "Sunday 11am, everywhere" },
  { icon: Trophy, title: "Demos & prizes", line: "Sunday 2pm, main stage" },
];

const tracks = ["AI agents", "Hardware", "Games", "Climate"];

export default function NavigationMenuEvent() {
  return (
    <div className="flex w-full justify-center self-start">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger index={0}>
              <Calendar aria-hidden className="size-5" /> Schedule
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[min(520px,80vw)] gap-1 md:grid-cols-2">
                {schedule.map(({ icon: Icon, title, line }) => (
                  <li key={title}>
                    <NavigationMenuLink href="#">
                      <span className="flex items-center gap-2 text-lg font-extrabold">
                        <Icon aria-hidden /> {title}
                      </span>
                      <span className="text-base font-medium text-ink-soft">{line}</span>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger index={1}>Tracks</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex w-60 flex-col gap-1">
                {tracks.map((t, i) => (
                  <li key={t}>
                    <NavigationMenuLink href="#" active={i === 0} className="text-lg">
                      {t}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className={navigationMenuTriggerStyle()}
              style={{ ["--p3d-tilt" as string]: "-0.8deg" }}
            >
              <MapPin aria-hidden className="size-5" /> Venue
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
