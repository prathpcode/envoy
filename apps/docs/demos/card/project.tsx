import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@pixel3d/ui";

export default function CardProject() {
  return (
    <Card tilt={-1.2} className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Voxel Pets</CardTitle>
        <CardDescription>A desk pet made of cubes that reacts to your commits.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>Vote</Button>
      </CardFooter>
    </Card>
  );
}
