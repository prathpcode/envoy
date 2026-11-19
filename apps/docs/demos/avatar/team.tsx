import { Avatar, AvatarFallback, AvatarImage } from "@pixel3d/ui";

// a tiny pixel portrait, inlined so the demo needs no network
const portrait =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges">
      <rect width="8" height="8" fill="#36b8ff"/>
      <rect x="2" y="1" width="4" height="4" fill="#ffd2b0"/>
      <rect x="2" y="1" width="4" height="1" fill="#141414"/>
      <rect x="3" y="3" width="1" height="1" fill="#141414"/>
      <rect x="5" y="3" width="1" height="1" fill="#141414"/>
      <rect x="1" y="6" width="6" height="2" fill="#ff3d8b"/>
      <rect x="3" y="5" width="2" height="1" fill="#ffd2b0"/>
    </svg>`
  );

export default function AvatarTeam() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar size="lg">
        <AvatarImage src={portrait} alt="Ada Byron" className="[image-rendering:pixelated]" />
        <AvatarFallback>Ada Byron</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>Null Pointers</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>Off By One</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>Lambda Llamas</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>Segfault Society</AvatarFallback>
      </Avatar>
    </div>
  );
}
