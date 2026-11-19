import { Card, CardTitle } from "@pixel3d/ui";

const faces = [
  { face: "paper", title: "Registered", tilt: -1.5 },
  { face: "lime", title: "Checked in", tilt: 1 },
  { face: "butter", title: "Unsaved draft", tilt: -0.6 },
  { face: "ink", title: "Sponsor", tilt: 1.4 },
] as const;

export default function CardFaces() {
  return (
    <>
      {faces.map((f) => (
        <Card key={f.face} face={f.face} tilt={f.tilt} className="w-48 p-6">
          <CardTitle className="text-xl">{f.title}</CardTitle>
        </Card>
      ))}
    </>
  );
}
