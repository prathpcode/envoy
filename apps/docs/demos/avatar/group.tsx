import { Avatar, AvatarFallback, AvatarGroup } from "@pixel3d/ui";

const crew = ["Grace Hopper", "Linus Byte", "Margo Stack", "Dev Null", "Ivy Commit", "Ray Tracer"];

export default function AvatarGroupDemo() {
  return (
    <div className="flex flex-col items-start gap-10">
      <AvatarGroup aria-label="Team Null Pointers">
        {crew.slice(0, 4).map((name) => (
          <Avatar key={name}>
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <AvatarGroup max={3} size="lg" aria-label="Judges">
        {crew.map((name) => (
          <Avatar key={name}>
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  );
}
