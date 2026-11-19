import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@pixel3d/ui";

const sides = [
  { side: "top", label: "Top", title: "Announcements" },
  { side: "right", label: "Right", title: "Team chat" },
  { side: "bottom", label: "Bottom", title: "Now playing" },
  { side: "left", label: "Left", title: "Schedule" },
] as const;

export default function SheetSides() {
  return (
    <>
      {sides.map((s) => (
        <Sheet key={s.side}>
          <SheetTrigger asChild>
            <Button variant="secondary">{s.label}</Button>
          </SheetTrigger>
          <SheetContent side={s.side}>
            <SheetHeader>
              <SheetTitle>{s.title}</SheetTitle>
              <SheetDescription>Slides in from the {s.side} edge.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </>
  );
}
