import { Card, CardDescription, CardHeader, CardTitle } from "@pixel3d/ui";

export default function CardInteractive() {
  return (
    <>
      <Card interactive tilt={1.5} className="w-64">
        <CardHeader>
          <CardTitle>Hardware</CardTitle>
          <CardDescription>Wires, solder, blinking lights.</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive tilt={-1} face="sky" className="w-64">
        <CardHeader>
          <CardTitle>AI agents</CardTitle>
          <CardDescription>One boring job, done well.</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
